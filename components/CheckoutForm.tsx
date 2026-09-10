"use client";

import { FormEvent, useMemo, useState } from "react";
import { devices, plans, type DeviceCode, type PlanCode } from "@/lib/plans";

export default function CheckoutForm() {
  const [plan, setPlan] = useState<PlanCode>("12-months");
  const [device, setDevice] = useState<DeviceCode>("normal");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const price = useMemo(() => plans[plan].basePrice + devices[device].adjustment, [plan, device]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setMessage("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"), firstName: data.get("firstName"), lastName: data.get("lastName"),
          phone: data.get("phone"), company: data.get("company"), address: data.get("address"),
          registration: data.get("registration"), license: data.get("license"),
          vehicleType: data.get("vehicleType"), city: data.get("city"), plan, device,
        }),
      });
      const result = await response.json() as { redirectUrl?: string; error?: string };
      if (!response.ok || !result.redirectUrl) throw new Error(result.error ?? "Payment could not be started");
      window.location.assign(result.redirectUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment could not be started");
      setLoading(false);
    }
  }

  return (
    <form className="signup-form" onSubmit={submit}>
      <section className="form-card device-selector">
        <div className="form-card-heading"><span className="card-icon">M2</span><div><h4>Choose meter</h4><p>The meter model adjusts the monthly price.</p></div></div>
        <div className="radio-list">
          {Object.entries(devices).map(([code, item]) => (
            <label className="radio-option" key={code}>
              <input type="radio" name="device" checked={device === code} onChange={() => setDevice(code as DeviceCode)} />
              <span><strong>{item.label}</strong><small>{item.adjustment === 0 ? "Normal contract price" : `${item.adjustment > 0 ? "+" : ""}${item.adjustment} € / month`}</small></span>
            </label>
          ))}
        </div>
      </section>

      <section className="form-card">
        <div className="form-card-heading"><span className="card-icon">03</span><div><h4>Choose contract period</h4><p>Payment is monthly; contract length is fixed.</p></div></div>
        <div className="plans compact-plans">
          {Object.entries(plans).map(([code, item]) => (
            <button className={`plan ${plan === code ? "active" : ""}`} type="button" key={code} aria-pressed={plan === code} onClick={() => setPlan(code as PlanCode)}>
              <span className="plan-topline"><span className="plan-icon">{item.months}</span></span>
              <span className="plan-period">{item.label}</span>
              <span className="plan-price">{item.basePrice + devices[device].adjustment} € <small>/ month</small></span>
            </button>
          ))}
        </div>
      </section>

      <section className="form-card" id="account">
        <div className="form-card-heading"><span className="card-icon">ID</span><div><h4>Account & vehicle details</h4><p>Customer and taxi information in one compact section.</p></div></div>
        <div className="form-grid account-compact-grid">
          <label>Email<input type="email" name="email" required /></label>
          <label>Phone<input type="tel" name="phone" /></label>
          <label>First name<input type="text" name="firstName" required /></label>
          <label>Last name<input type="text" name="lastName" required /></label>
          <label>Company<input type="text" name="company" /></label>
          <label>Address<input type="text" name="address" /></label>
          <label>Car register number<input type="text" name="registration" placeholder="ABC-123" required /></label>
          <label>Software license<input type="text" name="license" placeholder="MON-2026-0001" required /></label>
          <label>Vehicle type<input type="text" name="vehicleType" placeholder="Taxi sedan" /></label>
          <label>Operating city<input type="text" name="city" placeholder="Helsinki" /></label>
        </div>
      </section>

      <div className="review-card">
        <div><span>Selected contract</span><strong>{devices[device].label}, {plans[plan].label}</strong></div>
        <div><span>Monthly price</span><strong>{price} € / month</strong></div>
        <div><span>Payment</span><strong>Secure Paytrail checkout</strong></div>
      </div>
      <button className="button primary" type="submit" disabled={loading}>{loading ? "Opening Paytrail…" : "Continue to secure payment"}</button>
      <p className="form-message" role="alert">{message}</p>
    </form>
  );
}
