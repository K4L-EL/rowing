import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type WelfareWizardState = {
  step: number;
  riskModalAcknowledged: boolean;
};

const initialState: WelfareWizardState = {
  step: 0,
  riskModalAcknowledged: false,
};

const welfareWizardSlice = createSlice({
  name: "welfareWizard",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    nextStep(state) {
      state.step += 1;
    },
    prevStep(state) {
      state.step = Math.max(0, state.step - 1);
    },
    resetWizard(state) {
      state.step = 0;
      state.riskModalAcknowledged = false;
    },
    setRiskModalAcknowledged(state, action: PayloadAction<boolean>) {
      state.riskModalAcknowledged = action.payload;
    },
  },
});

export const { setStep, nextStep, prevStep, resetWizard, setRiskModalAcknowledged } =
  welfareWizardSlice.actions;
export const welfareWizardReducer = welfareWizardSlice.reducer;
