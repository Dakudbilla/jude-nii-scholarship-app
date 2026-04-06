import { adminDb } from "@/lib/firebase/admin";
import { Application, IEndorsementRepository } from "../interfaces/core";
import { FieldValue } from "firebase-admin/firestore";

export class EndorsementRepository implements IEndorsementRepository {
  private collection = adminDb.collection("applications");

  async getApplicationByToken(token: string): Promise<Application | null> {
    const snapshot = await this.collection
      .where("endorsementToken", "==", token)
      .where("status", "==", "PENDING_ENDORSEMENT")
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as Application;
  }

  async endorseApplication(id: string, decision: "ENDORSED" | "REJECTED_BY_WING", comments?: string): Promise<void> {
    // Clear out the token so it can't be used again
    await this.collection.doc(id).update({
      status: decision,
      endorsementToken: FieldValue.delete(),
      wingHeadComments: comments || null, // Keeping comments here for simplicity
      updatedAt: FieldValue.serverTimestamp()
    });
  }
}

export const endorsementRepository = new EndorsementRepository();
