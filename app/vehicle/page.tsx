import Link from "next/link";

export default function VehiclePage() {
  return <main className="page-main"><section className="page-hero"><p className="eyebrow">Step 2</p><h1>Vehicle</h1><p>Add taxi registration and software license details.</p></section><section className="section page-shell"><form className="form-card signup-form"><div className="form-grid"><label>Car register number<input required /></label><label>Software license number<input required /></label><label>Vehicle type<input /></label><label>Operating city<input /></label></div><Link className="button primary" href="/payment">Continue to payment</Link></form></section></main>;
}
