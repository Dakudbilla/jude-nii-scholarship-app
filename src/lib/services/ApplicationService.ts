import { adminDb } from "@/lib/firebase/admin";
import { applicationRepository } from "../repositories/ApplicationRepository";
import { draftRepository } from "../repositories/DraftRepository";
import { Application, ApplicationDraft } from "../interfaces/core";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as crypto from "crypto";

export class ApplicationService {
  /**
   * Idempotent submission: Upgrades a Draft to a Final Application using a transaction.
   * If an application already exists for this yearId + studentId, it aborts.
   */
  static async submit(yearId: string, studentId: string, payload: any): Promise<Application> {
    const draftId = `${yearId}_${studentId}`;
    const draftRef = adminDb.collection("applicationDrafts").doc(draftId);
    
    // We query the applications to check if one already exists
    // Since we don't have a rigid unique constraint, we must use a Transaction
    
    return adminDb.runTransaction(async (transaction) => {
      // 1. Check if application already exists
      const existingAppsQuery = await transaction.get(
        applicationRepository.getCollectionRef()
          .where("yearId", "==", yearId)
          .where("studentId", "==", studentId)
          .limit(1)
      );
      
      if (!existingAppsQuery.empty) {
        throw new Error("Application already submitted for this academic year.");
      }
      
      // 2. Fetch the draft to verify it exists
      const draftDoc = await transaction.get(draftRef);
      if (!draftDoc.exists) {
        throw new Error("No draft found to submit.");
      }
      
      const draft = draftDoc.data() as ApplicationDraft;
      
      // 3. Generate Endorsement Token & Anonymized Blind ID
      // Token lives for 72 hours
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 72);
      
      const blindId = crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g. "A3F81D"
      
      // 4. Create the new Application Document
      const newAppRef = applicationRepository.getCollectionRef().doc();
      const now = FieldValue.serverTimestamp();
      
      const newApp: Omit<Application, "id"> = {
        yearId,
        studentId,
        email: draft.email || payload.email,
        status: "PENDING_ENDORSEMENT",
        
        personalInfo: payload.personalInfo || draft.personalInfo,
        academicInfo: payload.academicInfo || draft.academicInfo,
        financialInfo: payload.financialInfo || draft.financialInfo,
        wingId: payload.wingId || draft.wingSelection,
        
        endorsementToken: token, // Note: For production, we should hash this in DB and send raw via email
        endorsementTokenExpiresAt: Timestamp.fromDate(expiresAt),
        
        blindId,
        
        createdAt: now,
        updatedAt: now,
      };
      
      transaction.set(newAppRef, newApp);
      
      // 5. Delete the draft now that it's submitted
      transaction.delete(draftRef);
      
      return { id: newAppRef.id, ...newApp, createdAt: new Date(), updatedAt: new Date() } as Application;
    });
  }
}
