import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface ReviewScore {
  id: string;
  applicationId: string;
  adminId: string;
  adminName: string;
  criteriaScores: { [criterionName: string]: number }; // score out of 5 usually
  totalScore: number;
  comments?: string;
  createdAt: any;
  updatedAt: any;
}

export interface IReviewScoreRepository {
  getByApplication(applicationId: string): Promise<ReviewScore[]>;
  getByAdmin(applicationId: string, adminId: string): Promise<ReviewScore | null>;
  saveScore(applicationId: string, adminId: string, adminName: string, data: Partial<ReviewScore>): Promise<void>;
}

export class ReviewScoreRepository implements IReviewScoreRepository {
  private collection = adminDb.collection("reviewScores");

  async getByApplication(applicationId: string): Promise<ReviewScore[]> {
    const snapshot = await this.collection.where("applicationId", "==", applicationId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewScore));
  }

  async getByAdmin(applicationId: string, adminId: string): Promise<ReviewScore | null> {
    const snapshot = await this.collection
      .where("applicationId", "==", applicationId)
      .where("adminId", "==", adminId)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as ReviewScore;
  }

  async saveScore(applicationId: string, adminId: string, adminName: string, data: Partial<ReviewScore>): Promise<void> {
    // Generate deterministic ID so one admin = one score per app
    const id = `${applicationId}_${adminId}`;
    
    await this.collection.doc(id).set({
      applicationId,
      adminId,
      adminName,
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    
    // In a real implementation we would also update the Application's average total score here 
    // using a transaction, but for this constraint we keep it simple.
  }
}

export const reviewScoreRepository = new ReviewScoreRepository();
