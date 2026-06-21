import { describe, it, expect } from "vitest";
import {
  welfareWizardReducer,
  setStep,
  nextStep,
  prevStep,
  resetWizard,
  setRiskModalAcknowledged,
} from "@/lib/features/welfare-wizard-slice";

describe("welfareWizardSlice", () => {
  const initialState = { step: 0, riskModalAcknowledged: false };

  it("returns the initial state for unknown action", () => {
    expect(welfareWizardReducer(undefined, { type: "unknown" })).toEqual(
      initialState,
    );
  });

  it("setStep sets the step", () => {
    expect(welfareWizardReducer(initialState, setStep(3))).toEqual({
      step: 3,
      riskModalAcknowledged: false,
    });
  });

  it("nextStep increments the step", () => {
    expect(welfareWizardReducer(initialState, nextStep())).toEqual({
      step: 1,
      riskModalAcknowledged: false,
    });
  });

  it("prevStep clamps at 0", () => {
    expect(welfareWizardReducer(initialState, prevStep())).toEqual({
      step: 0,
      riskModalAcknowledged: false,
    });
  });

  it("prevStep decrements when above 0", () => {
    const state = { step: 3, riskModalAcknowledged: false };
    expect(welfareWizardReducer(state, prevStep())).toEqual({
      step: 2,
      riskModalAcknowledged: false,
    });
  });

  it("resetWizard resets to initial state", () => {
    const modified = { step: 8, riskModalAcknowledged: true };
    expect(welfareWizardReducer(modified, resetWizard())).toEqual(initialState);
  });

  it("setRiskModalAcknowledged sets the flag", () => {
    expect(
      welfareWizardReducer(initialState, setRiskModalAcknowledged(true)),
    ).toEqual({ step: 0, riskModalAcknowledged: true });
  });
});
