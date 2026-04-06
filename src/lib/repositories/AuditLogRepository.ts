import { adminDb } from "@/lib/firebase/admin";
import { AuditLog, IAuditLogRepository } from "../interfaces/core";
import { FieldValue } from "firebase-admin/firestore";

export class AuditLogRepository implements IAuditLogRepository {
  private collection = adminDb.collection("auditLogs");

  async createAdminLog(data: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
    const docRef = this.collection.doc();
    
    // Convert undefined to null for Firestore support (if passing partial objects)
    const processedData = JSON.parse(JSON.stringify(data));
    
    await docRef.set({
      ...processedData,
      timestamp: FieldValue.serverTimestamp()
    });
  }

  async getLogsByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    const snapshot = await this.collection
      .where("entityType", "==", entityType)
      .where("entityId", "==", entityId)
      .orderBy("timestamp", "desc")
      .get();
      
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
  }
}

export const auditLogRepository = new AuditLogRepository();
