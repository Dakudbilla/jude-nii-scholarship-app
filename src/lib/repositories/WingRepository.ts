import { adminDb } from "@/lib/firebase/admin";
import { IWingRepository, Wing } from "../interfaces/core";

export class WingRepository implements IWingRepository {
  // Wings are stored as subcollections under the academic year document
  private getCollection(yearId: string) {
    return adminDb.collection(`academicYears/${yearId}/wings`);
  }

  async getByYearId(yearId: string): Promise<Wing[]> {
    const snapshot = await this.getCollection(yearId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wing));
  }

  async create(yearId: string, data: Omit<Wing, "id" | "yearId">): Promise<Wing> {
    const docRef = this.getCollection(yearId).doc();
    const wingData = { ...data, yearId };
    
    await docRef.set(wingData);
    return { id: docRef.id, ...wingData };
  }

  async update(id: string, yearId: string, data: Partial<Wing>): Promise<void> {
    await this.getCollection(yearId).doc(id).update(data);
  }

  async createBatch(yearId: string, wings: Omit<Wing, "id" | "yearId">[]): Promise<void> {
    const batch = adminDb.batch();
    const collection = this.getCollection(yearId);

    wings.forEach(wing => {
      const docRef = collection.doc();
      batch.set(docRef, { ...wing, yearId });
    });

    await batch.commit();
  }
}

export const wingRepository = new WingRepository();
