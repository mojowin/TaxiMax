import Link from "next/link";

export default function PaymentSuccess() {
  return <main className="page-main"><section className="page-hero"><p className="eyebrow">Payment return</p><h1>Thank you</h1><p>Your payment result is being confirmed securely.</p><Link className="button primary" href="/contract">View contract</Link></section></main>;
}
