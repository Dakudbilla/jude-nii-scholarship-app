import { adminDb } from "@/lib/firebase/admin";
import { ApplicationDraft, IDraftRepository } from "../interfaces/core";
import { FieldValue } from "firebase-admin/firestore";

export class DraftRepository implements IDraftRepository {
  private collection = adminDb.collection("applicationDrafts");

  private getDraftId(yearId: string, studentId: string): string {
    return `${yearId}_${studentId}`;
  }

  async getDraft(yearId: string, studentId: string): Promise<ApplicationDraft | null> {
    const id = this.getDraftId(yearId, studentId);
    const doc = await this.collection.doc(id).get();
    
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as ApplicationDraft;
  }

  async saveDraft(yearId: string, studentId: string, email: string, data: Partial<ApplicationDraft>): Promise<void> {
    const id = this.getDraftId(yearId, studentId);
    const docRef = this.collection.doc(id);
    
    const draftData = {
      yearId,
      studentId,
      email,
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    };
    
    await docRef.set(draftData, { merge: true });
  }

  async deleteDraft(yearId: string, studentId: string): Promise<void> {
    const id = this.getDraftId(yearId, studentId);
    await this.collection.doc(id).delete();
  }
}

export const draftRepository = new DraftRepository();
