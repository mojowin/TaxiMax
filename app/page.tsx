import Image from "next/image";
import Link from "next/link";
import CheckoutForm from "@/components/CheckoutForm";

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <Image className="hero-image" src="/assets/taxi-hero.png" alt="Yellow taxi car in a modern city street" fill priority />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Taxi business software</p>
          <h1>MeterOn</h1>
          <p className="hero-copy">A clear monthly subscription for taxi drivers and fleet owners, powered by a secure hosted payment flow.</p>
          <div className="hero-actions"><Link className="button primary" href="#payment">Choose your plan</Link></div>
        </div>
      </section>

      <section className="section ui-section" id="payment">
        <div className="section-heading">
          <p className="eyebrow">Step 1</p>
          <h2>Choose your plan</h2>
          <p>Start by choosing the right M2 meter and contract period, then continue securely through Paytrail.</p>
        </div>
        <CheckoutForm />
      </section>

      <section className="section contact-section" id="contact">
        <div className="section-heading">
          <p className="eyebrow">Need help?</p>
          <h2>Contact MeterOn</h2>
          <p>Our team can help with choosing a meter, moving an existing license, or setting up payment.</p>
        </div>
        <div className="contact-grid">
          <a className="mini-card" href="mailto:sales@meteron.fi"><span>Email</span><strong>sales@meteron.fi</strong></a>
          <a className="mini-card" href="tel:+358401234567"><span>Phone</span><strong>+358 40 123 4567</strong></a>
          <div className="mini-card"><span>Service area</span><strong>Finland</strong></div>
        </div>
      </section>
    </main>
  );
}
