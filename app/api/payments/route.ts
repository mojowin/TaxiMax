import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";
import { devices, monthlyPriceCents, plans, type DeviceCode, type PlanCode } from "@/lib/plans";

type RequestBody = { email?: string; firstName?: string; lastName?: string; phone?: string; company?: string; address?: string; registration?: string; license?: string; vehicleType?: string; city?: string; plan?: string; device?: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    if (!body.email || !body.firstName || !body.lastName || !body.registration || !body.license || !(body.plan && body.plan in plans) || !(body.device && body.device in devices)) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    const plan = body.plan as PlanCode;
    const device = body.device as DeviceCode;
    const customer = await query<{ id: string }>(
      "INSERT INTO customers (email, first_name, last_name, phone, company_name, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [body.email, body.firstName, body.lastName, body.phone || null, body.company || null, body.address || null],
    );
    const provider = getPaymentProvider();
    await query(
      "INSERT INTO vehicles (customer_id, registration_number, software_license, vehicle_type, operating_city) VALUES ($1, $2, $3, $4, $5)",
      [customer.rows[0].id, body.registration, body.license, body.vehicleType || null, body.city || null],
    );
    const order = await query<{ id: string }>(
      "INSERT INTO orders (customer_id, plan_code, device_code, amount_cents, payment_provider) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [customer.rows[0].id, plan, device, monthlyPriceCents(plan, device), provider.name],
    );
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const payment = await provider.createPayment({
      orderId: order.rows[0].id,
      amountCents: monthlyPriceCents(plan, device),
      currency: "EUR",
      description: `${devices[device].label} – ${plans[plan].label}`,
      customer: { email: body.email, firstName: body.firstName, lastName: body.lastName, phone: body.phone },
      successUrl: `${baseUrl}/payment/success`, cancelUrl: `${baseUrl}/payment/cancel`, callbackUrl: `${baseUrl}/api/payments/callback`,
    });
    await query("UPDATE orders SET provider_transaction_id = $1, status = 'pending', updated_at = now() WHERE id = $2", [payment.transactionId, order.rows[0].id]);
    return NextResponse.json({ redirectUrl: payment.redirectUrl });
  } catch (error) {
    console.error("Payment creation failed", error);
    return NextResponse.json({ error: "Payment service is temporarily unavailable." }, { status: 500 });
  }
}
