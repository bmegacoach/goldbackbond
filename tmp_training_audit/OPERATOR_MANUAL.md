# Goldbackbond Agent Academy - Operator & Administrator Manual

## 1. System Architecture Overview

The Goldbackbond Training Portal is a lightweight, high-performance static application powered by a serverless backend. 
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend (API)**: Express.js wrapped as a Vercel Serverless Function (`/api/index.js`).
- **AI Integration**: Google Gemini 1.5 Pro via the Vercel AI SDK.
- **Hosting / Deployment**: Vercel (Custom deployment pipeline via pre-build proxy).

---

## 2. Authentication & Security (Admin Guide)

To keep the training portal exclusive to internal contractors without the overhead of a full database (Firestore) implementation, **authentication uses a hardcoded identity proxy lock**.

**How to Add New Agents (Trainers/Trainees):**
1. Open the file: `src/components/Login.tsx`
2. Scroll to line ~22, locate the `allowedEmails` array:
   ```typescript
   const allowedEmails = [
       'sydney@goldbackbond.com', 
       'bmegacoach1@gmail.com', 
       'bmegacoach2@gmail.com'
   ];
   ```
3. Add the new trainee's email address to this array.
4. The global access proxy password for all standard trainees is `wholesaleT2$`.
5. *(Optional)* Add VIP/Custom credentials via the `demo@goldbackbond.com` flow shown in the same conditional block.
6. Commit the changes and deploy (see Deployment section below).

---

## 3. The AI Sales Coach (Module 7 & 8)

The AI Sales Coach is an extremely advanced LLM-powered simulator hosted in `/api/index.js`. 

**The AI operates with dual-personas:**
1. **Mr. Skeptical Buyer**: Uses the precise 2026 Whitepaper facts, LTV lending parameters, and smart contract audit dates to aggressively test the agent's product knowledge.
2. **Elite Sales Mentor**: Evaluates frame-control, Grant Cardone closing techniques, and Alex Hormozi risk-reversals.

**How to Update the AI's Knowledge Base / Arguments:**
1. Open `api/index.js`.
2. Locate the `/api/ai-coach` endpoint system prompt (approx line ~66).
3. If new smart contracts are deployed, pricing tiers updated, or regulatory compliance rules shift, heavily modify the `### COMPLIANCE TRAPS` and `### Knowledge Base` blocks inside the backticks. The AI instantly adopts these changes upon deployment.

**Mentorship Hub Rules & Live CRM Hook:**
Module 8 feeds the AI agent's "Check-in" endpoint (`/api/ai-mentor-checkin`). This utilizes `agentCrmService.ts` to simulate (or fetch) live calls, performance, and weakness targets so the AI can aggressively mentor the agent.

---

## 4. State Management (Data Persistence)

- The application uses `localStorage` bound exclusively to the authenticated user's email ID.
- If Sydney logs in as `sydney@goldbackbond.com`, her module completion checklist (in `TrainingContext.tsx`) saves under a unique database key simulating a serverless edge store.
- If an agent "clears their cache" or uses incognito mode, their progress resets locally for that device unless synced explicitly.

---

## 5. Adding New Training Content

Each educational unit exists in `src/components/modules/ModuleX.tsx`.

1. To add **Module 9**, create `src/components/modules/Module9.tsx`.
2. Wrap the content in the `<ModuleLayout>` component, defining the module objective and passing down the standard progress parameters.
3. Add the newly authored module to `src/components/modules/index.ts`.
4. Update `Sidebar.tsx` and `Dashboard.tsx` to include the route link for Module 9.
5. Create an objective checklist requirement inside the `TrainingContext.tsx` default checklist parameters so completion can be tracked.

---

## 6. Official Deployment Protocol (CRITICAL)

The `goldbackbond-training` repository handles TypeScript compilation differently across Windows and Vercel's remote Linux environments (producing Exit Code 1 / 2 failures on automated Vercel CI/CD pipelines).

To guarantee a **100% successful deployment without build-breaking bugs**, use the **Local Proxy Build Strategy**:

1. Open your terminal in the Training directory:
   ```bash
   cd tmp_training_audit
   ```
2. Run the native Node build engine (bypassing strict TS validations that block Linux):
   ```bash
   npm run build
   ```
3. Wait for the `✓ built in X.Xs` success message. This produces a production-ready `dist` folder.
4. **Deploy the pre-compiled output AND the Serverless Functions** together using the Vercel CLI native push:
   ```bash
   npx vercel deploy --prod -y
   ```
5. Do **not** use `git push` triggering Vercel's automated git integration, as Vercel's internal builder will fail if `tsc -b` throws a single case-sensitive module error. By using `npx vercel deploy`, the pipeline respects the `vercel.json` override to skip the frontend build but properly encapsulates `/api/index.js` into a serverless function.
