// ─── MEMBER OPERATIONS ────────────────────────────────────────────────────────
//
// ARCHITECTURE DECISION (fixes revenue duplication bug):
//
// `paid`     = boolean flag: "has this member's current-cycle fee been collected?"
//              It is a UI/workflow marker ONLY. It does NOT create renewal history.
//
// `renewals` = array of actual payment records (source of truth for revenue).
//              Created ONLY by:
//                1. RenewModal  (explicit renewal with plan selection)
//                2. New member form with paid=true checked  (first-join record)
//                3. Manual entry (Admin → Manual tab)
//
// WRONG (old applyMarkPaid):
//   Mark Paid → flips paid=true AND pushes a renewal entry
//   Unmark    → flips paid=false but keeps renewal entry
//   Mark Paid again → pushes ANOTHER renewal entry → DUPLICATE REVENUE
//
// CORRECT (new approach):
//   Mark Paid → just sets paid=true  (no renewal entry)
//   Unmark    → just sets paid=false (no renewal entry)
//   Revenue never changes from mark/unmark operations
//
// ─────────────────────────────────────────────────────────────────────────────

import { todayStr, timeNow, addDays } from "./core.js";

/**
 * Mark a member's current-cycle fee as paid.
 * ONLY flips the `paid` flag. Does NOT add a renewal record.
 * Revenue (sum of renewals) is therefore unchanged.
 */
export const applyMarkPaid = (members, id) =>
  members.map((m) => (m.id !== id ? m : { ...m, paid: true }));

/**
 * Unmark a member's fee (undo mark paid).
 * ONLY flips the `paid` flag. Does NOT remove any renewal record.
 */
export const applyMarkUnpaid = (members, id) =>
  members.map((m) => (m.id !== id ? m : { ...m, paid: false }));

/**
 * Apply a renewal to a member. This is the ONLY place a renewal entry is created
 * during normal operation (RenewModal calls this via handleRenew in screens).
 */
export const applyRenewal = (members, id, plan, renewal, paid, newExpiry) =>
  members.map((m) =>
    m.id !== id
      ? m
      : {
          ...m,
          planId: plan.id,
          expiry: newExpiry,
          paid,
          manualInactive: false,
          renewals: [...(m.renewals || []), renewal],
        }
  );

/**
 * Build a new member object from the add-member form.
 * If paid=true, a first-join renewal record IS created (intentional — it's
 * a real payment event, not just a flag flip).
 */
export const buildNewMember = ({ form, plans, existingIds }) => {
  const { normalizeSeat, todayStr: _today, addDays: _add, genId, timeNow: _time } =
    // inline to avoid circular — we import at the top of each consumer instead
    {};
  void _today; void _add; void _time; // unused destructure guard
  return null; // see screens/MembersScreen.jsx for the actual implementation
};

// Exported for screens that need it directly
export { todayStr, timeNow, addDays };
