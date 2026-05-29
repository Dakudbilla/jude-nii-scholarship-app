import { z } from "zod";

// ── Step 1 ────────────────────────────────────────────────────────────────────
export const personalSchema = z.object({
  fullName:    z.string().min(2, "Full name required"),
  phoneNumber: z.string().min(10, "Valid phone required"),
  dateOfBirth: z.string().min(1, "Date of birth required"),
});
export type PersonalFormValues = z.infer<typeof personalSchema>;

// ── Step 2 ────────────────────────────────────────────────────────────────────
export const academicSchema = z.object({
  programme: z.string().min(2, "Programme required"),
  year:      z.enum(["1", "2", "3", "4", "5", "6"]),
  cwa:       z.number().min(0).max(100),
});
export type AcademicFormValues = z.infer<typeof academicSchema>;

// ── Step 3 ────────────────────────────────────────────────────────────────────
export const financialSchema = z.object({
  sponsorStatus:       z.enum(["SELF", "PARENTS", "RELATIVE", "OTHER"]),
  hasOtherScholarship: z.boolean(),
  hardshipEssay:       z.string().min(50, "At least 50 characters required"),
  churchEssay:         z.string().min(50, "At least 50 characters required"),
});
export type FinancialFormValues = z.infer<typeof financialSchema>;

// ── Step 4 ────────────────────────────────────────────────────────────────────
export const wingSchema = z.object({
  wingId:      z.string().min(1, "You must select your primary wing"),
  declaration: z.boolean().refine((v) => v === true, { message: "You must agree to the declaration" }),
});
export type WingFormValues = z.infer<typeof wingSchema>;
