import type { PaymentProvider } from "./types";
import { PaytrailProvider } from "./paytrail";

export function getPaymentProvider(): PaymentProvider {
  switch (process.env.PAYMENT_PROVIDER ?? "paytrail") {
    case "paytrail":
      return new PaytrailProvider();
    default:
      throw new Error(`Unsupported payment provider: ${process.env.PAYMENT_PROVIDER}`);
  }
}

export type { CreatePaymentInput, CreatedPayment, PaymentCallback, PaymentProvider } from "./types";
