import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import type {
  CreatePaymentInput,
  CreatedPayment,
  PaymentCallback,
  PaymentProvider,
} from "./types";

const API_URL = "https://services.paytrail.com/payments";

type PaytrailResponse = {
  transactionId: string;
  href: string;
};

function signature(headers: Record<string, string>, body: string, secret: string) {
  const payload = Object.entries(headers)
    .filter(([key]) => key.startsWith("checkout-"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}\n`)
    .join("");

  return createHmac("sha256", secret).update(payload + body).digest("hex");
}

function credentials() {
  const merchantId = process.env.PAYTRAIL_MERCHANT_ID;
  const secretKey = process.env.PAYTRAIL_SECRET_KEY;
  if (!merchantId || !secretKey) {
    throw new Error("Paytrail credentials are not configured");
  }
  return { merchantId, secretKey };
}

export class PaytrailProvider implements PaymentProvider {
  readonly name = "paytrail";

  async createPayment(input: CreatePaymentInput): Promise<CreatedPayment> {
    const { merchantId, secretKey } = credentials();
    const body = JSON.stringify({
      stamp: input.orderId,
      reference: input.orderId.replaceAll("-", ""),
      amount: input.amountCents,
      currency: input.currency,
      language: "EN",
      items: [{
        unitPrice: input.amountCents,
        units: 1,
        vatPercentage: 25.5,
        productCode: input.description,
        description: input.description,
      }],
      customer: input.customer,
      redirectUrls: { success: input.successUrl, cancel: input.cancelUrl },
      callbackUrls: { success: input.callbackUrl, cancel: input.callbackUrl },
    });
    const headers: Record<string, string> = {
      "checkout-account": merchantId,
      "checkout-algorithm": "sha256",
      "checkout-method": "POST",
      "checkout-nonce": randomUUID(),
      "checkout-timestamp": new Date().toISOString(),
      "platform-name": "MeterOn",
    };
    headers.signature = signature(headers, body, secretKey);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { ...headers, "content-type": "application/json; charset=utf-8" },
      body,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Paytrail payment creation failed (${response.status})`);
    }
    const responseBody = await response.text();
    const responseHeaders = Object.fromEntries(
      [...response.headers.entries()].filter(([key]) => key.startsWith("checkout-")),
    );
    const responseSignature = response.headers.get("signature") ?? "";
    const expectedSignature = signature(responseHeaders, responseBody, secretKey);
    const validResponse = responseSignature.length === expectedSignature.length &&
      timingSafeEqual(Buffer.from(responseSignature), Buffer.from(expectedSignature));
    if (!validResponse) throw new Error("Invalid Paytrail response signature");

    const payment = JSON.parse(responseBody) as PaytrailResponse;
    return { provider: this.name, transactionId: payment.transactionId, redirectUrl: payment.href };
  }

  verifyCallback(parameters: Record<string, string>): PaymentCallback {
    const { secretKey } = credentials();
    const provided = parameters.signature ?? "";
    const expected = signature(parameters, "", secretKey);
    const valid = provided.length === expected.length && timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
    if (!valid) throw new Error("Invalid Paytrail callback signature");

    const status = parameters["checkout-status"];
    return {
      transactionId: parameters["checkout-transaction-id"],
      status: status === "ok" ? "paid" : status === "pending" || status === "delayed" ? "pending" : "failed",
    };
  }
}
