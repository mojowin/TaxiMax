export const plans = {
  "12-months": { label: "1 year", months: 12, basePrice: 89 },
  "24-months": { label: "2 years", months: 24, basePrice: 79 },
  "48-months": { label: "48 months", months: 48, basePrice: 69 },
} as const;

export const devices = {
  mini: { label: "M2 Mini", adjustment: -10 },
  normal: { label: "M2 Normal", adjustment: 0 },
  premium: { label: "M2 Premium", adjustment: 20 },
} as const;

export type PlanCode = keyof typeof plans;
export type DeviceCode = keyof typeof devices;

export function monthlyPriceCents(plan: PlanCode, device: DeviceCode) {
  return (plans[plan].basePrice + devices[device].adjustment) * 100;
}
