# TapNation Social Hub - Strategic Roadmap

> How to scale this POC to support millions of casual gamers.

---

## Where We Are Today

This POC validates three core bets in a single codebase:

1. **Frictionless Web3 onboarding** via Sequence Embedded Wallets - no seed phrases, no downloads.
2. **AI-personalized offerwalls** streamed in real time, making every session feel fresh.
3. **A "juicy" gaming UI** that rewards players with haptics, animations, and progression - keeping them engaged beyond any single game.

The architecture is already layered (services → Zustand stores → hooks → UI), mock-safe, and ready to have real backends slotted in behind the same interfaces.

---

## Phase 1 - Production Hardening (Months 1–2)

**Goal:** Make the POC safe and reliable for a closed beta of ~10,000 users.

| Area                 | Action                                                                                                                                                                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claim Backend**    | Replace the 1.5s mock with a server-side claim service. Validate offer ownership, prevent replay attacks, execute the on-chain AVAX transfer via a custodial hot wallet or Sequence's Transactions API.                                       |
| **Smart Contracts**  | Deploy a minimal `RewardDistributor` contract on Avalanche Fuji → Mainnet. Emit events for on-chain auditability.                                                                                                                             |
| **Offer Generation** | Move the OpenAI prompt to a backend endpoint. Add caching (Redis, 5-min TTL) and content moderation so the same 10 offers aren't regenerated per user per second. Gate generation behind a user context object (game history, level, region). |
| **Auth Hardening**   | Add rate-limiting on OTP endpoints. Enable Sequence session expiry and device binding.                                                                                                                                                        |
| **Error Monitoring** | Integrate Sentry for crash reporting and Datadog for RPC / API latency tracking.                                                                                                                                                              |

---

## Phase 2 - Personalization Engine (Months 3–5)

**Goal:** Make offers feel tailored to each player. Target 30%+ claim rate.

- **Player Profile Service**: Persist XP, level, claimed offer history, and connected game IDs in a lightweight backend (Supabase or PlanetScale). Feed this context into the LLM prompt.
- **True SSE Streaming**: Switch the OpenAI call to `stream: true` with Server-Sent Events so the token-by-token JSON is parsed incrementally using a streaming JSON parser (e.g. `oboe.js`). Each offer card appears the instant its JSON object is complete.
- **Offer Ranking Model**: Fine-tune a small classifier on claimed vs. skipped offers per user segment. Use it to reorder the offerwall before streaming begins.
- **Dynamic Rewards**: Replace flat AVAX amounts with a formula based on task difficulty × user engagement score × current liquidity pool balance.

---

## Phase 3 - Platform Expansion (Months 6–9)

**Goal:** Extend the hub across TapNation's entire game portfolio.

- **Game SDK**: Publish a lightweight React Native library that any TapNation game can embed. It reports in-game events (level complete, purchase, daily login) to the Social Hub backend via a signed webhook.
- **Cross-Game Offers**: Generate offers that span multiple games ("Play 5 rounds in Galaxy Dash AND open a chest in Block Siege to earn 2 AVAX"). Requires a unified event ledger.
- **Social Layer**: Add friend leaderboards (top AVAX earners this week), shareable claim cards, and referral bonuses - all served from the Social Hub profile service.
- **Web Dashboard**: A Next.js companion app for players who prefer desktop, sharing the same Sequence wallet and store infrastructure.

---

## Phase 4 - Scale & Liquidity (Months 9–12)

**Goal:** Support 1M+ DAU without a linear cost increase.

| Challenge               | Solution                                                                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Reward Token Costs**  | Migrate from raw AVAX transfers to a TapNation ERC-20 reward token with a controlled emission schedule. AVAX bridging becomes an opt-in withdrawal.                                                                |
| **On-chain Throughput** | Batch claim settlements every N minutes using a relayer. Individual players see instant optimistic UI; on-chain settlement is asynchronous.                                                                        |
| **LLM Cost at Scale**   | Cache generated offer pools per player segment (age × region × game genre). Regenerate only when a segment's pool is exhausted or staleness TTL expires. Most users see cached offers - LLM only fires for misses. |
| **Fraud Prevention**    | On-device attestation (SafetyNet / DeviceCheck) + server-side anomaly detection on claim frequency. Flag and quarantine accounts claiming > 2σ above segment average.                                              |
| **Infrastructure**      | Edge-deployed claim validation (Cloudflare Workers) for < 100ms latency globally. RPC node cluster (Alchemy / Ankr) with automatic failover.                                                                       |

---

## Key Metrics to Track

| Metric                         | Target               |
| ------------------------------ | -------------------- |
| Offer Claim Rate               | ≥ 25% of impressions |
| D7 Retention (claimers)        | ≥ 40%                |
| Avg Session Length increase    | +20% vs. control     |
| Claim-to-on-chain confirmation | < 2s (optimistic UI) |
| Wallet creation → first claim  | < 3 minutes          |

---

## What This POC Already Gets Right

- The **service/store separation** means the mock backend can be swapped for a real one with zero UI changes.
- **Stale stream protection** (`currentStreamId`) scales directly to real SSE - the same guard prevents race conditions.
- **Demo mode** (`isDemoMode` flag) means QA and external demos never require live credentials, reducing operational risk.
- The **3-layer architecture** is already the right shape for a micro-service backend: one service file per integration point.
