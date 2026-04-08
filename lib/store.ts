import { configureStore } from "@reduxjs/toolkit";
import { welfareWizardReducer } from "@/lib/features/welfare-wizard-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      welfareWizard: welfareWizardReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
