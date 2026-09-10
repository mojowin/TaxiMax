import CheckoutForm from "@/components/CheckoutForm";

export default function PaymentPage() {
  return (
    <main className="page-main">
      <section className="page-hero"><p className="eyebrow">Step 3</p><h1>Payment</h1><p>Choose a contract and continue to Paytrail&apos;s secure hosted checkout.</p></section>
      <section className="section app-shell page-shell">
        <aside className="account-sidebar"><p className="eyebrow">Registration</p><h2>Billing setup</h2><p>MeterOn does not collect or store card numbers.</p></aside>
        <div className="registration-panel"><div className="panel-header"><div><p className="eyebrow">Payment page</p><h3>Monthly subscription</h3></div><span className="status-pill">Paytrail</span></div><CheckoutForm /></div>
      </section>
    </main>
  );
}
