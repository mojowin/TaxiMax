import Link from "next/link";

export default function ContractPage() {
  return <main className="page-main"><section className="page-hero"><p className="eyebrow">Step 4</p><h1>Contract</h1><p>Review the fixed service period before activation.</p></section><section className="section"><div className="terms-list"><article className="term-card"><span>01</span><h4>Monthly payment</h4><p>Payments are processed by the configured payment provider.</p></article><article className="term-card"><span>02</span><h4>Fixed period</h4><p>Choose 12, 24, or 48 months.</p></article><article className="term-card"><span>03</span><h4>Provider independent</h4><p>The payment integration can be replaced without changing this page.</p></article></div><Link className="button ghost" href="/payment">Back to payment</Link></section></main>;
}
