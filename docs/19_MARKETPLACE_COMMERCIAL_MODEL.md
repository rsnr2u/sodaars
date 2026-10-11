# 19 Marketplace Commercial Model Specification
**Project**: SODAARS  
**Document**: Pricing Architecture, Markup Framework & Financial Settlements  
**Status**: Source of Truth  
**Version**: 1.0.0

---

## 1. Core Dual-Price Principle

For every advertising resource opted into the public Marketplace, the provider registers two distinct price figures:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DUAL-PRICE PREREQUISITE                         │
├───────────────────────────────┬────────────────────────────────────────┤
│ 1. REGULAR CUSTOMER PRICE     │ Standard rate card displayed to public │
│    (Retail Benchmark)         │ or direct buyers.                      │
├───────────────────────────────┼────────────────────────────────────────┤
│ 2. SODAARS PRICE              │ Contracted net settlement amount the   │
│    (Provider Net Baseline)    │ provider receives upon completed proof.│
└───────────────────────────────┴────────────────────────────────────────┘
```

---

## 2. Configurable Markup & Commercial Calculation

The Marketplace listing price is dynamically computed by applying an **agreed marketplace markup** to the provider's net SODAARS Price.

$$\text{Marketplace Price} = \text{SODAARS Price} + \text{Agreed Markup}$$

> [!CAUTION]
> **DO NOT HARD-CODE 30% OR ANY FIXED RATE**.  
> The 30% rate cited in requirements discussions was strictly an illustrative example. SODAARS must support variable, configurable markup percentages defined within each provider's bilateral **Marketplace Agreement** (or overridden at the individual resource level).

### 2.1 Complete Commercial Reconciliation Flow

```
Step 1: Provider Regular Customer Price (Retail)          ₹1,00,000
Step 2: Provider SODAARS Price (Net Settlement Basis)       ₹75,000
Step 3: Agreed Marketplace Markup (Agreement-Driven)      + ₹22,500  (Configurable)
────────────────────────────────────────────────────────────────────
Step 4: Initial Listed Marketplace Price                    ₹97,500
Step 5: Customer Commercial Adjustment (Discount)         -  ₹5,000  (SODAARS Concession)
────────────────────────────────────────────────────────────────────
Step 6: Final Customer Invoiced Amount                      ₹92,500
Step 7: Provider Net Settlement (SODAARS Price)             ₹75,000  (Guaranteed Net)
────────────────────────────────────────────────────────────────────
Step 8: SODAARS Gross Margin (Pre-tax / Pre-finance)        ₹17,500
```

---

## 3. Financial Settlement Rules

1. **Provider Settlement Guarantee**: The provider's payout is anchored strictly to their submitted **SODAARS Price** (`₹75,000` in the example above). Customer-side adjustments or platform promotions do **not** diminish the provider's net entitlement.
2. **Gross Margin Realization**: SODAARS' gross margin is the exact difference between the final buyer collected sum (net of buyer adjustments) and the provider's net settlement price:
   $$\text{Gross Margin} = \text{Customer Paid Amount} - \text{SODAARS Net Price}$$
3. **No Invented Platform Deductions**: SODAARS does not assess listing fees, payment processing penalties, or administrative subtractions from the provider's agreed SODAARS Price.
4. **Settlement Trigger**: Payout to the provider is unlocked only after the Campaign Execution module receives verified, timestamped **Mounting Photo Proof** and passes manual inspection.
