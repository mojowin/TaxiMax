import Link from "next/link";

export default function PaymentCancelled() {
  return <main className="page-main"><section className="page-hero"><p className="eyebrow">Payment cancelled</p><h1>No charge was made</h1><p>You can return to payment and try again.</p><Link className="button primary" href="/payment">Return to payment</Link></section></main>;
}
