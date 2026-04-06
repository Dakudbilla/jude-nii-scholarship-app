import { adminDb } from "@/lib/firebase/admin";
import { AcademicYear, IYearRepository } from "../interfaces/core";
import { FieldValue } from "firebase-admin/firestore";

export class YearRepository implements IYearRepository {
  private collection = adminDb.collection("academicYears");

  async getById(id: string): Promise<AcademicYear | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as AcademicYear;
  }

  async getActiveYear(): Promise<AcademicYear | null> {
    const snapshot = await this.collection
      .where("status", "in", ["SETUP", "OPEN", "REVIEW"])
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    if (!doc) return null;
    return { id: doc.id, ...doc.data() } as AcademicYear;
  }

  async getAll(): Promise<AcademicYear[]> {
    const snapshot = await this.collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AcademicYear));
  }

  async create(data: Omit<AcademicYear, "id" | "createdAt" | "updatedAt">): Promise<AcademicYear> {
    const docRef = this.collection.doc(); // Auto-generate ID
    const now = FieldValue.serverTimestamp();
    
    const yearData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(yearData);
    
    return { 
      id: docRef.id, 
      ...data, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as AcademicYear;
  }

  async update(id: string, data: Partial<AcademicYear>): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }
}

// Export singleton instance
export const yearRepository = new YearRepository();
