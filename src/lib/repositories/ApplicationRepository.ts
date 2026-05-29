import { adminDb } from "@/lib/firebase/admin";
import { Application, ApplicationStatus, IApplicationRepository } from "../interfaces/core";
import { FieldValue } from "firebase-admin/firestore";

export class ApplicationRepository implements IApplicationRepository {
  private collection = adminDb.collection("applications");

  async getById(id: string): Promise<Application | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Application;
  }

  async getByYear(yearId: string): Promise<Application[]> {
    const snapshot = await this.collection
      .where("yearId", "==", yearId)
      .orderBy("createdAt", "desc")
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  }

  async getByStudent(yearId: string, studentId: string): Promise<Application[]> {
    const snapshot = await this.collection
      .where("yearId", "==", yearId)
      .where("studentId", "==", studentId)
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
  }

  async create(data: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application> {
    const docRef = this.collection.doc();
    const now = FieldValue.serverTimestamp();
    
    const appData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    await docRef.set(appData);
    
    return { 
      id: docRef.id, 
      ...data, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    } as Application;
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<void> {
    await this.collection.doc(id).update({
      status,
      updatedAt: FieldValue.serverTimestamp()
    });
  }

  async update(id: string, data: Partial<Omit<Application, "id" | "createdAt">>): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    });
  }

  // Custom method needed for transactions when upgrading draft to application
  getCollectionRef() {
    return this.collection;
  }
}

export const applicationRepository = new ApplicationRepository();
