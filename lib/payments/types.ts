export type PaymentCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export type CreatePaymentInput = {
  orderId: string;
  amountCents: number;
  currency: "EUR";
  description: string;
  customer: PaymentCustomer;
  successUrl: string;
  cancelUrl: string;
  callbackUrl: string;
};

export type CreatedPayment = {
  provider: string;
  transactionId: string;
  redirectUrl: string;
};

export type PaymentCallback = {
  transactionId: string;
  status: "paid" | "pending" | "failed";
};

export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatedPayment>;
  verifyCallback(parameters: Record<string, string>): PaymentCallback;
}
