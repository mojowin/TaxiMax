import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";

async function handle(request: Request) {
  try {
    const parameters = Object.fromEntries(new URL(request.url).searchParams.entries());
    const callback = getPaymentProvider().verifyCallback(parameters);
    await query("UPDATE orders SET status = $1, updated_at = now() WHERE provider_transaction_id = $2", [callback.status, callback.transactionId]);
    return new NextResponse("OK");
  } catch {
    return new NextResponse("Invalid callback", { status: 400 });
  }
}

export const GET = handle;
export const POST = handle;
