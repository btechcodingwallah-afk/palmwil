# PamWill Business Logic & State Machines

## 1. Commission Model
- Standard split: Customer pays ₹100 → Platform commission ₹20 (20%) → Therapist payout ₹80 (80%).
- Admin can override platform commission percentage globally or per individual service.
- Transparent fee ledger shown on the Therapist App earnings screen and Admin Console payments log.

## 2. Booking Life-Cycle State Machine
```
[Pending]
   │
   ├─► Therapist Accepts ────────► [Accepted]
   │                                  │
   │                                  ▼
   │                            [On the Way]
   │                                  │
   │                                  ▼
   │                              [Arrived]
   │                                  │
   │                                  ▼
   │                          [Service Started]
   │                                  │
   │                                  ▼
   │                         [Service Completed] ──► Review & Rating
   │
   └─► Declined or Timeout / User Cancels ──► [Cancelled]
```

### Cancellation Policy & Refunds:
- Cancellation before Therapist accepts: 100% full refund.
- Cancellation while Therapist is "On the Way": 80% refund (₹200 travel compensation to therapist).
- Cancellation after Therapist "Arrived": 50% refund.
- Cancellation once "Service Started": 0% refund.

## 3. Membership Credit Economy
- **Silver Plan**: ₹999/mo → 1 Complimentary 60m session + 10% off all add-ons.
- **Gold Plan**: ₹2,499/mo → 2 Complimentary 60m sessions + 15% off all add-ons + priority matching.
- **Platinum Plan**: ₹4,999/mo → 4 Complimentary 60m sessions + 20% off all add-ons + dedicated concierge + complimentary aromatherapy add-on on all sessions.
- Credits are deducted directly before the payment gateway is called.

## 4. Safety Center & SOS Dispatch
- Fixed high-contrast terracotta SOS button (`#8C3A2B`) on the Live Booking screen.
- Instantly transmits GPS live coordinates to platform dispatch, emergency contact phone, and flags the booking on the Admin Console in real time with high-priority audio-visual alert.

## 5. Medical & Compliance Guardrails
- **Prenatal / Postnatal Massage**: Must strictly display contraindications in red/terracotta before booking. Only therapists with certified obstetrics/prenatal massage credentials can accept prenatal jobs.
