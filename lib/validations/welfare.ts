import { z } from "zod";

export const concernTypeSchema = z.enum([
  "SAFEGUARDING",
  "BULLYING_HARASSMENT",
  "POOR_COACHING",
  "HEALTH_SAFETY",
  "OTHER_WELFARE",
]);

export const section1Schema = z.object({
  anonymousReporter: z.boolean(),
  reporterName: z.string().optional(),
  reporterRole: z.string().optional(),
  reporterSquad: z.string().optional(),
  reporterPhone: z.string().optional(),
  reporterEmail: z.string().email("Valid email is required"),
  subjectName: z.string().min(1, "Who the concern is about is required"),
  subjectAge: z.string().min(1, "Age is required (especially if under 18)"),
  subjectRole: z.string().min(1, "Their role in the club is required"),
});

export const section2Schema = z.object({
  factualDescription: z.string().min(10, "Please describe what happened"),
  concernType: concernTypeSchema,
  concernTypeOther: z.string().optional(),
});

export const section3Schema = z.object({
  whenDescription: z.string().min(1, "When did it happen?"),
  whereDescription: z.string().min(1, "Where did it happen?"),
  ongoingOrOneOff: z.enum(["ONE_OFF", "ONGOING"]),
});

export const section4Schema = z.object({
  allegedPersons: z.string().optional(),
  witnesses: z.string().optional(),
  relationshipsToClub: z.string().optional(),
});

export const section5Schema = z.object({
  impactDescription: z.string().min(1, "Please describe impact or risk"),
  immediateRisk: z.boolean(),
});

export const section6Schema = z.object({
  reportedElsewhere: z.string().optional(),
  actionsSoFar: z.string().optional(),
});

export const section7Schema = z.object({
  evidenceDescription: z.string().optional(),
  previousConcernsSamePerson: z.string().optional(),
});

export const section8Schema = z.object({
  consentToShare: z.boolean(),
});

export const section9Schema = z.object({
  immediateSupportNeeds: z.string().optional(),
  needsMedicalAttention: z.boolean(),
  needsSafeguardingAction: z.boolean(),
  needsEmotionalSupport: z.boolean(),
});

export const welfarePayloadSchema = section1Schema
  .merge(section2Schema)
  .merge(section3Schema)
  .merge(section4Schema)
  .merge(section5Schema)
  .merge(section6Schema)
  .merge(section7Schema)
  .merge(section8Schema)
  .merge(section9Schema);

export type WelfarePayload = z.infer<typeof welfarePayloadSchema>;

export const welfareStepSchemas = [
  section1Schema,
  section2Schema,
  section3Schema,
  section4Schema,
  section5Schema,
  section6Schema,
  section7Schema,
  section8Schema,
  section9Schema,
] as const;

export const WELFARE_STEP_TITLES = [
  "Basic details",
  "Nature of the concern",
  "Time and location",
  "People involved",
  "Impact / risk",
  "Actions already taken",
  "Supporting information",
  "Consent & confidentiality",
  "Immediate needs",
] as const;
