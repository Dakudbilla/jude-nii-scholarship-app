import { applicationRepository } from "../repositories/ApplicationRepository";
import { NotificationService } from "./NotificationService";

export class AwardService {
  static async publishAwards(yearId: string, awardingAdminId: string) {
    console.log(`[AWARD SERVICE] Publishing awards for year ${yearId} by admin ${awardingAdminId}`);
    
    // In a real app we'd fetch all INTERVIEW or IN_REVIEW apps that meet the cut-off score
    // For this mockup, let's just abstract the logical flow
    const applications = await applicationRepository.getByYear(yearId);
    let count = 0;
    
    // We would wrap this in a batch operation usually
    for (const app of applications) {
      if (app.status === "INTERVIEW") { // Assuming interviewees were successful
        await applicationRepository.updateStatus(app.id, "AWARDED");
        await NotificationService.sendAwardNotification(app);
        count++;
      }
    }
    
    return { success: true, count, publishedAt: new Date().toISOString() };
  }
}
