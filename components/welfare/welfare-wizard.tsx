"use client";

/* eslint-disable react-hooks/incompatible-library -- react-hook-form watch/setValue patterns */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ClayCard } from "@/components/clay-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AiAssistButton } from "@/components/welfare/ai-assist-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EMERGENCY_CONTACTS } from "@/lib/constants/emergency";
import {
  welfarePayloadSchema,
  welfareStepSchemas,
  WELFARE_STEP_TITLES,
  type WelfarePayload,
} from "@/lib/validations/welfare";
import {
  nextStep,
  prevStep,
  resetWizard,
  setRiskModalAcknowledged,
} from "@/lib/features/welfare-wizard-slice";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { submitWelfareReportAction } from "@/app/actions/welfare";
import { toast } from "sonner";

function pick<T extends Record<string, unknown>>(obj: T, keys: (keyof T)[]): Partial<T> {
  const out: Partial<T> = {};
  for (const k of keys) {
    out[k] = obj[k];
  }
  return out;
}

const STEP_KEYS: (keyof WelfarePayload)[][] = [
  [
    "anonymousReporter",
    "reporterName",
    "reporterRole",
    "reporterSquad",
    "reporterPhone",
    "reporterEmail",
    "subjectName",
    "subjectAge",
    "subjectRole",
  ],
  ["factualDescription", "concernType", "concernTypeOther"],
  ["whenDescription", "whereDescription", "ongoingOrOneOff"],
  ["allegedPersons", "witnesses", "relationshipsToClub"],
  ["impactDescription", "immediateRisk"],
  ["reportedElsewhere", "actionsSoFar"],
  ["evidenceDescription", "previousConcernsSamePerson"],
  ["consentToShare"],
  [
    "immediateSupportNeeds",
    "needsMedicalAttention",
    "needsSafeguardingAction",
    "needsEmotionalSupport",
  ],
];

const defaultValues: WelfarePayload = {
  anonymousReporter: false,
  reporterName: "",
  reporterRole: "",
  reporterSquad: "",
  reporterPhone: "",
  reporterEmail: "",
  subjectName: "",
  subjectAge: "",
  subjectRole: "",
  factualDescription: "",
  concernType: "SAFEGUARDING",
  concernTypeOther: "",
  whenDescription: "",
  whereDescription: "",
  ongoingOrOneOff: "ONE_OFF",
  allegedPersons: "",
  witnesses: "",
  relationshipsToClub: "",
  impactDescription: "",
  immediateRisk: false,
  reportedElsewhere: "",
  actionsSoFar: "",
  evidenceDescription: "",
  previousConcernsSamePerson: "",
  consentToShare: false,
  immediateSupportNeeds: "",
  needsMedicalAttention: false,
  needsSafeguardingAction: false,
  needsEmotionalSupport: false,
};

export function WelfareWizard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const step = useAppSelector((s) => s.welfareWizard.step);
  const riskAcknowledged = useAppSelector((s) => s.welfareWizard.riskModalAcknowledged);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const form = useForm<WelfarePayload>({
    resolver: zodResolver(welfarePayloadSchema),
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, watch, setValue, getValues, formState } = form;
  const immediateRisk = watch("immediateRisk");
  const anonymousReporter = watch("anonymousReporter");

  useEffect(() => {
    if (!immediateRisk) {
      dispatch(setRiskModalAcknowledged(false));
    }
  }, [immediateRisk, dispatch]);

  const totalSteps = WELFARE_STEP_TITLES.length;
  const progressPct = ((step + 1) / totalSteps) * 100;

  async function validateCurrentStep(): Promise<boolean> {
    const values = getValues();
    const keys = STEP_KEYS[step];
    const subset = pick(values, keys) as Record<string, unknown>;
    const schema = welfareStepSchemas[step];
    const result = schema.safeParse(subset);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages?.[0]) {
          form.setError(field as keyof WelfarePayload, { message: messages[0] });
        }
      }
      toast.error("Please fix the highlighted fields.");
      return false;
    }
    return true;
  }

  async function handleNext() {
    const ok = await validateCurrentStep();
    if (!ok) return;
    if (step === 4 && getValues("immediateRisk") && !riskAcknowledged) {
      setEmergencyOpen(true);
      return;
    }
    if (step < totalSteps - 1) {
      dispatch(nextStep());
    }
  }

  function acknowledgeEmergencyAndContinue() {
    dispatch(setRiskModalAcknowledged(true));
    setEmergencyOpen(false);
    if (step < totalSteps - 1) {
      dispatch(nextStep());
    }
  }

  async function onFinalSubmit(data: WelfarePayload) {
    const result = await submitWelfareReportAction(data);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Report submitted.");
    dispatch(resetWizard());
    router.push(`/dashboard/welfare/${result.reportId}`);
  }

  async function handleFinal() {
    const ok = await validateCurrentStep();
    if (!ok) return;
    const full = welfarePayloadSchema.safeParse(getValues());
    if (!full.success) {
      toast.error("Please review all steps.");
      return;
    }
    await handleSubmit(onFinalSubmit)();
  }

  return (
    <>
      <ClayCard className="p-6 md:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">
            Step {step + 1} of {totalSteps}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            {WELFARE_STEP_TITLES[step]}
          </h2>
          <Progress value={progressPct} className="mt-4 h-2" />
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="anon"
                checked={anonymousReporter}
                onCheckedChange={(c) => setValue("anonymousReporter", c === true)}
              />
              <Label htmlFor="anon">I wish to remain anonymous as the reporter</Label>
            </div>
            {!anonymousReporter && (
              <>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <Label htmlFor="reporterName">Your name</Label>
                    <Input id="reporterName" {...register("reporterName")} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="reporterRole">Your role</Label>
                    <Input id="reporterRole" {...register("reporterRole")} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reporterSquad">Squad (if member)</Label>
                  <Input id="reporterSquad" {...register("reporterSquad")} className="mt-1" />
                </div>
              </>
            )}
            <div>
              <Label htmlFor="reporterEmail">Email (for your account copy)</Label>
              <Input id="reporterEmail" type="email" {...register("reporterEmail")} className="mt-1" />
              {formState.errors.reporterEmail && (
                <p className="mt-1 text-sm text-destructive">{formState.errors.reporterEmail.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="reporterPhone">Telephone</Label>
              <Input id="reporterPhone" {...register("reporterPhone")} className="mt-1" />
            </div>
            <div className="border-t border-white/40 pt-4">
              <p className="mb-2 text-sm font-medium text-primary">Who is the concern about? (required)</p>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label htmlFor="subjectName">Name</Label>
                  <Input id="subjectName" {...register("subjectName")} className="mt-1" />
                  {formState.errors.subjectName && (
                    <p className="mt-1 text-sm text-destructive">{formState.errors.subjectName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="subjectAge">Age</Label>
                  <Input id="subjectAge" {...register("subjectAge")} className="mt-1" />
                  {formState.errors.subjectAge && (
                    <p className="mt-1 text-sm text-destructive">{formState.errors.subjectAge.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Label htmlFor="subjectRole">Role in club</Label>
                <Input id="subjectRole" {...register("subjectRole")} className="mt-1" />
                {formState.errors.subjectRole && (
                  <p className="mt-1 text-sm text-destructive">{formState.errors.subjectRole.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="factual">What exactly happened? (factual description)</Label>
                <AiAssistButton
                  fieldContext="factual description of what happened"
                  getText={() => getValues("factualDescription")}
                  onSuggestion={(t) => setValue("factualDescription", t)}
                />
              </div>
              <Textarea id="factual" rows={6} {...register("factualDescription")} className="mt-1" />
              {formState.errors.factualDescription && (
                <p className="mt-1 text-sm text-destructive">
                  {formState.errors.factualDescription.message}
                </p>
              )}
            </div>
            <div>
              <Label>Type of concern</Label>
              <Select
                value={watch("concernType")}
                onValueChange={(v) => setValue("concernType", v as WelfarePayload["concernType"])}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAFEGUARDING">Safeguarding (child / vulnerable adult)</SelectItem>
                  <SelectItem value="BULLYING_HARASSMENT">Bullying / harassment</SelectItem>
                  <SelectItem value="POOR_COACHING">Poor coaching practice</SelectItem>
                  <SelectItem value="HEALTH_SAFETY">Health &amp; safety</SelectItem>
                  <SelectItem value="OTHER_WELFARE">Other welfare issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {watch("concernType") === "OTHER_WELFARE" && (
              <div>
                <Label htmlFor="concernOther">Please specify</Label>
                <Input id="concernOther" {...register("concernTypeOther")} className="mt-1" />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="when">When did it happen?</Label>
              <Textarea id="when" rows={3} {...register("whenDescription")} className="mt-1" />
              {formState.errors.whenDescription && (
                <p className="mt-1 text-sm text-destructive">{formState.errors.whenDescription.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="where">Where did it happen?</Label>
              <Textarea id="where" rows={3} {...register("whereDescription")} className="mt-1" />
              {formState.errors.whereDescription && (
                <p className="mt-1 text-sm text-destructive">{formState.errors.whereDescription.message}</p>
              )}
            </div>
            <div>
              <Label>Ongoing or one-off?</Label>
              <Select
                value={watch("ongoingOrOneOff")}
                onValueChange={(v) => setValue("ongoingOrOneOff", v as "ONE_OFF" | "ONGOING")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_OFF">One-off</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="alleged">Alleged person(s) causing concern</Label>
              <Textarea id="alleged" rows={3} {...register("allegedPersons")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="witnesses">Witnesses</Label>
              <Textarea id="witnesses" rows={3} {...register("witnesses")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="rel">Relationship to the club</Label>
              <Textarea id="rel" rows={2} {...register("relationshipsToClub")} className="mt-1" />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="impact">What impact has this had?</Label>
                <AiAssistButton
                  fieldContext="impact and risk assessment"
                  getText={() => getValues("impactDescription")}
                  onSuggestion={(t) => setValue("impactDescription", t)}
                />
              </div>
              <Textarea id="impact" rows={4} {...register("impactDescription")} className="mt-1" />
              {formState.errors.impactDescription && (
                <p className="mt-1 text-sm text-destructive">
                  {formState.errors.impactDescription.message}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="risk"
                checked={immediateRisk}
                onCheckedChange={(c) => setValue("immediateRisk", c === true)}
              />
              <Label htmlFor="risk">Someone is at immediate risk of harm</Label>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="elsewhere">Reported to anyone else?</Label>
              <Textarea id="elsewhere" rows={3} {...register("reportedElsewhere")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="done">What has been done so far?</Label>
              <Textarea id="done" rows={3} {...register("actionsSoFar")} className="mt-1" />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="evidence">Evidence (messages, emails, photos, etc.)</Label>
              <Textarea id="evidence" rows={4} {...register("evidenceDescription")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="prev">Previous concerns about the same person?</Label>
              <Textarea id="prev" rows={3} {...register("previousConcernsSamePerson")} className="mt-1" />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Safeguarding concerns may still need escalation regardless of consent. Information is shared only
              on a need-to-know basis.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="consent"
                checked={watch("consentToShare")}
                onCheckedChange={(c) => setValue("consentToShare", c === true)}
              />
              <Label htmlFor="consent">I consent to this information being shared as appropriate</Label>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="support">Does anyone need support right now? Describe.</Label>
              <Textarea id="support" rows={3} {...register("immediateSupportNeeds")} className="mt-1" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="med"
                  checked={watch("needsMedicalAttention")}
                  onCheckedChange={(c) => setValue("needsMedicalAttention", c === true)}
                />
                <Label htmlFor="med">Medical attention may be needed</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sg"
                  checked={watch("needsSafeguardingAction")}
                  onCheckedChange={(c) => setValue("needsSafeguardingAction", c === true)}
                />
                <Label htmlFor="sg">Safeguarding action may be needed</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="emo"
                  checked={watch("needsEmotionalSupport")}
                  onCheckedChange={(c) => setValue("needsEmotionalSupport", c === true)}
                />
                <Label htmlFor="emo">Emotional support may be needed</Label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (step === 0) return;
              dispatch(prevStep());
            }}
            disabled={step === 0}
          >
            Back
          </Button>
          <div className="flex gap-2">
            {step < totalSteps - 1 ? (
              <Button type="button" onClick={() => void handleNext()}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={() => void handleFinal()} disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Submitting…" : "Submit report"}
              </Button>
            )}
          </div>
        </div>
      </ClayCard>

      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="clay rounded-3xl border-0 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Immediate risk</DialogTitle>
            <DialogDescription>
              If someone is in immediate danger, contact emergency services right away.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm">
            {EMERGENCY_CONTACTS.map((c) => (
              <li key={c.label}>
                <span className="font-semibold">{c.label}</span>:{" "}
                <a className="text-primary underline" href={`tel:${c.phone.replace(/\s/g, "")}`}>
                  {c.phone}
                </a>
                {c.detail ? <span className="block text-muted-foreground">{c.detail}</span> : null}
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEmergencyOpen(false)}>
              Close
            </Button>
            <Button type="button" onClick={acknowledgeEmergencyAndContinue}>
              I understand — continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
