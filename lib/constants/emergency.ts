export type EmergencyContact = {
  label: string;
  phone: string;
  detail?: string;
};

/** Edit for your club / region — shown when immediate risk is indicated */
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    label: "Emergency (UK)",
    phone: "999",
    detail: "Police, ambulance, or fire when someone is in immediate danger",
  },
  {
    label: "NSPCC",
    phone: "0808 800 5000",
    detail: "Child protection helpline",
  },
  {
    label: "Childline",
    phone: "0800 1111",
  },
  {
    label: "Samaritans",
    phone: "116 123",
  },
];
