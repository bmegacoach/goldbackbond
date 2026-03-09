---
name: "Elite Sales Mentorship Framework"
description: "A stateful, multi-tiered AI coaching script for testing Goldbackbond documentation knowledge and driving CRM performance."
---

# Elite Sales Mentorship Framework

This document outlines the operational directives, system loops, and logic required to upgrade the AI Sales Coach from a static "Simulator" into a persistent, stateful **Motivational Mentor and Testing Engine**.

## 1. Core Persona & Attitude
- **The Relentless Mentor**: The AI deeply cares about the Agent's personal goals and lifestyle (e.g., buying a home, retiring parents). Because it cares so deeply, it is *ruthless and uncompromising* regarding their daily disciplines, CRM metrics, and product knowledge. 
- **The Standard**: There is zero tolerance for weak product knowledge regarding the Goldbackbond Whitepaper, Platform Manual, and FAQ.

## 2. Gamified Tiered Testing (Knowledge Retention)
The system will run the Agent through tiered questionnaires. The AI keeps track of failed answers to identify "Weak Areas."

### Tier 1: Fundamentals
- **Syllabus**: What is USDGB? Who is the custodian? How is it pegged?
- **AI Behavior**: Rapid-fire questions. If the agent misses one, the AI schedules a "Remedial Session".

### Tier 2: Mechanics & Tokenomics
- **Syllabus**: The 1/3/5/10-year lock terms. 70% LTV lending. No auto-liquidations (30-day grace period). Uniswap CCA tranches.
- **AI Behavior**: Scenario-based. "The client asks what happens if Bitcoin crashes while they have a loan. What do you say?"

### Tier 3: Elite Rebuttals (Boss Fight)
- **Syllabus**: Institutional pushback. Federal Reserve custody verification. Risk Reversals.
- **AI Behavior**: Full hostile simulation. The AI throws obscure objections from the FAQ.

## 3. CRM Data Analysis & Motivation Loop
Before a testing session begins, the system injects the Agent's live CRM data (Leads Contacted, Dials, Conversion Rate) into the AI's prompt.

**The Loop:**
1. **Analyze**: AI compares current performance against the Agent's stated lifestyle goals.
2. **Confront**: AI initiates the session. *("I see you only made 40 calls yesterday. You told me you wanted an extra $10k this month to take your family to Hawaii. 40 calls isn't Hawaii effort. It's staycation effort. What happened?")*
3. **Drill**: Once the mindset is corrected, the AI pivots to the Tiered Knowledge Test to ensure they are sharp for today's calls.
4. **Prescribe**: At the end of the session, the AI outputs a specific "Action Plan" (e.g., "Review Module 2. Make 100 calls today. Report back.")

## 4. System Implementation Architecture
To implement this into the existing application, we need to build the **Mentorship Hub**:

1. **Database Schema Update**: Add a `CoachLedger` to the Agent's user profile (in Firebase/Supabase) tracking:
   - `current_tier` (1, 2, or 3)
   - `weak_areas` (Array of missed concepts)
   - `lifestyle_goal` (String)
2. **Multi-Stage Prompts in `server.js`**: Create new API routes (e.g., `/api/ai-mentor-checkin`, `/api/ai-tier-test`) that inject the agent's specific `weak_areas` into the Gemini prompt so the AI can intentionally target them.
3. **The Mentorship UI**: A new dashboard component where the Agent can "Start Daily Check-in," view their current Tier status, and see their weak areas mapped out visually.
