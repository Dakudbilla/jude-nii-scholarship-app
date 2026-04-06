import { Application } from "../interfaces/core";

/**
 * Mocks the integration with Resend and Africa's Talking.
 * In a real environment, this would initialize the respective SDKs using env vars.
 */
export class NotificationService {
  
  static async sendApplicantConfirmation(application: Application): Promise<void> {
    console.log(`[EMAIL SEND MOCK] -> ${application.email}`);
    console.log(`Subject: Application Received - Jude Nii Scholarship`);
    console.log(`Body: Dear ${application.personalInfo?.fullName}, we have received your application. Your Wing Head has been notified for endorsement.`);
  }

  static async sendWingHeadEndorsementRequest(wingHeadPhone: string, wingHeadName: string, applicantName: string, token: string): Promise<void> {
    const link = `https://yourdomain.com/endorse/${token}`;
    console.log(`[SMS SEND MOCK] -> ${wingHeadPhone}`);
    console.log(`Message: Hello ${wingHeadName}, ${applicantName} has applied for the Jude Nii Scholarship and selected your wing. Please endorse them here: ${link}`);
  }

  static async sendAwardNotification(application: Application): Promise<void> {
    console.log(`[EMAIL SEND MOCK] -> ${application.email}`);
    console.log(`Subject: Important: Jude Nii Scholarship Award`);
    console.log(`Body: Dear ${application.personalInfo?.fullName}, congratulations. You have been awarded. Please log in to accept.`);
  }
}
