# Codex Prompts

This file records the requests given to Codex for the MeterOn project and the resulting work.

## 2026-09-04

### Prompt 1

> run meterIOn project

Result: Started the static website locally at `http://127.0.0.1:8000/` and opened it in the in-app browser.

### Prompt 2

> write every prompt to file CodexPrompts so i can know later what have been created

Result: Created this prompt ledger. Future project prompts and their outcomes will be appended here.

### Prompt 3

> i want this project Technology to be used now and in the future: Next.js + PostgreSQL + Paytrail
> Make payment functionality in own module and file. So it can be easily changed to another payment system if paytrail is not good enough

Result: Migrated the project to Next.js, added a PostgreSQL schema and server-side persistence, and isolated payments behind a provider interface with a Paytrail adapter.

### Prompt 4

> Change the name TaxiMax to MeterOn everywhere in the webshop. change the letter C in meter names to letter M

Result: Rebranded the webshop from TaxiMax to MeterOn and renamed the C/C2 meter branding to M/M2.

### Prompt 5

> Build Error: Expected ',', got 'numeric literal' in `lib/plans.ts` (`adjustment:7 0`).

Result: Confirmed the malformed value was corrected to `adjustment: 0` and verified that the full Next.js production build succeeds.

### Prompt 6

> change that account, vehicle, payment and contact are visible right on the front page http://127.0.0.1:8000/

Result: Converted the homepage into a one-page webshop with visible Account, Vehicle, Payment, and Contact sections and anchor-based header navigation.

### Prompt 7

> make page more compact so it is easier to see all fields. bottom of the page Need help / Contact MeterOn is not rendered well, it should have margins and round corners

Result: Reduced homepage hero, section, form, field, meter, and plan spacing; rebuilt the Contact area as a contained card with outer margins, padding, rounded corners, corrected heading contrast, and a shadow.

### Prompt 8

> move payment section to be before account section so user can focus first choosing right plan

Result: Moved plan and payment selection to the first homepage step, ahead of Account and Vehicle, and updated navigation and the hero action to prioritize plan selection.

### Prompt 9

> merge customer and accout sections to be just 1 compact section

Result: Removed the duplicate standalone Account section and merged all customer and account fields into one compact three-column Account details card inside checkout, with responsive mobile stacking and PostgreSQL persistence for company and address.

### Prompt 10

> merge vehicle section account section

Result: Merged vehicle fields into the compact Account & vehicle checkout card, removed the standalone Vehicle homepage section, and added PostgreSQL vehicle persistence.
