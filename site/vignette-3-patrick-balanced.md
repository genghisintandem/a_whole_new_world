# The New Way (Balanced)

## Patrick's Journey: User Profile Badges, Week 3

**Character:** Patrick Diestler, Mid-level React Engineer  
**Experience:** 3 years, now iterating based on real feedback  
**Timeline:** 2 days and change to ship polished iteration  
**Outcome:** Production-ready feature with i18n, tooltips, and design polish

---

## Context: What Happened in Week 2

After shipping the scrappy version dark in Week 1, Patrick and the PM enabled the feature flag for 5%, and then up to 20% of production users. 

*Patrick spent this time developing the scrappy version of another feature and working with the PM to get that experiment started.*

**User feedback started rolling in:**

**Feedback #1 (via in-app survey):**
> "I see a 'Pro Member' badge on my profile but I don't know what it means. Is that good?"

**Feedback #2 (via customer support):**
> "The badge text is showing in English but the rest of my app is in Spanish. Looks unfinished."

**Feedback #3 (via internal Slack):**
> "One of our power users has 5 badges and they're overflowing off the screen on mobile."

The PM messages Patrick:

**PM (in Slack):**
> "Good news: users like badges! Bad news: we need tooltips, i18n, and better handling for users with many badges. Can you iterate on this?"

**Patrick:**
> "On it. I'll have an update by end of week."

Patrick creates a new ticket and moves it into "In Progress."

---

## Day 1: Planning the Iteration with AI

**JIRA Status:** In Progress

Patrick opens his AI assistant and starts planning the iteration.

<div data-animation="patrick-iteration-chat"></div>

Patrick reviews the updated code and adds the translation keys.

---

## Day 1, Afternoon: Adding Translations

Patrick creates translation files for English and Spanish (the two locales the app supports).

**public/locales/en/common.json:**
```json
{
  "badge": {
    "verified": {
      "label": "Verified",
      "description": "This user's identity has been verified by our team."
    },
    "pro": {
      "label": "Pro Member",
      "description": "This user has an active Pro subscription with premium features."
    },
    "earlyAdopter": {
      "label": "Early Adopter",
      "description": "This user joined during our beta period."
    },
    "more": "+{{count}} more"
  }
}
```

**public/locales/es/common.json:**
```json
{
  "badge": {
    "verified": {
      "label": "Verificado",
      "description": "La identidad de este usuario ha sido verificada por nuestro equipo."
    },
    "pro": {
      "label": "Miembro Pro",
      "description": "Este usuario tiene una suscripción Pro activa con funciones premium."
    },
    "earlyAdopter": {
      "label": "Adoptante Temprano",
      "description": "Este usuario se unió durante nuestro período beta."
    },
    "more": "+{{count}} más"
  }
}
```

Patrick tests the component locally, switching between English and Spanish. The badges and tooltips update correctly.

---

## Day 1, Late Afternoon: Backend Coordination

Patrick realizes the backend also returns badge labels (hardcoded in English). He needs to coordinate with Priya to either:
1. Remove labels from the backend (frontend handles i18n), or
2. Have backend return translation keys instead of hardcoded strings

He messages Priya:

**Patrick (in Slack):**
> "Hey @priya - I'm adding i18n to badges. Should the backend stop returning the `label` field and just return `variant` (verified, pro, etc), and let the frontend handle translation? Or do we want the backend to return translation keys?"

**Priya:**
> "Good question. Let's keep the backend simple - just return `variant`. Frontend can map variant → translated label. Remove the `label` field from the API response. If you get it to me quick I can still review the PR before I'm off for the day."

**Patrick:**
> "Perfect, thanks!"

Patrick updates the backend `BadgeService.java` to remove the `label` field and pushes the PR. While waiting for Priya's review, he notices **ENG-2756: Refactor UserCard component to use new design system tokens** has been in the backlog for a while.

**Patrick (thinking):**
> "This is a bigger refactor — probably 30+ instances across 5 files. Perfect job for an agent to handle while I work on the badge frontend changes."

He spawns a background agent with the task:

**Patrick's agent prompt:**
> "Refactor all instances of UserCard component across the codebase to use our new design system tokens instead of hardcoded Tailwind classes. The mapping is: bg-blue-500 → bg-primary, text-gray-700 → text-secondary, etc. Check the design-tokens.css file for the full list. Make sure all variants (default, compact, highlighted) are updated consistently. Run the linter and tests after changes."

The agent starts working in a separate worktree while Patrick continues with the badge frontend updates.

**30 minutes later:**

**Agent notification:**
> ✅ Refactor complete. Updated 34 instances across 5 files. All tests passing. PR ready for review: [ENG-2756] Refactor UserCard to use design system tokens.

Patrick quickly reviews the agent's work, approves it, and opens the PR. Two PRs shipped in parallel.

---

## Day 2: AI-Assisted Code Review & Edge Cases

**JIRA Status:** In Progress → PR Review

Patrick opens a PR: **[ENG-2901] Add tooltips and i18n to profile badges**

The AI Code Review agent runs automatically.

### AI Review Output

```
✅ No security issues
✅ i18n keys follow team conventions
⚠️  Potential issue: Tooltip content is not accessible to screen readers 
   when the tooltip is hidden. Consider adding an `aria-label` to the 
   badge itself.
💡 Suggestion: Add aria-label={t(`badge.${badge.variant}.description`)} 
   to the <span> element.
```

**Patrick:**
> "Good catch. Our Tooltip component might handle this already, but let me add it to be safe."

He updates the code:
```typescript
<span 
  className={`badge badge--${badge.variant}`}
  aria-label={t(`badge.${badge.variant}.description`)}
>
  {t(`badge.${badge.variant}.label`)}
</span>
```

### AI Review Output (Second Pass)

```
✅ Accessibility improved
⚠️  Edge case: What happens if a translation key is missing (e.g., new 
   badge type added but translations not updated yet)?
💡 Suggestion: Add fallback logic:
   {t(`badge.${badge.variant}.label`, { defaultValue: badge.variant })}
```

**Patrick:**
> "Smart. Let me add that fallback."

He updates the code to include fallbacks for missing translations.

---

## Day 2, Afternoon: Human Review & Merge

Patrick requests review from Sarah (frontend lead).

**Sarah's review:**
> "Nice iteration Patrick. This looks solid. One question: have you tested this with a screen reader to make sure the tooltips are actually accessible? This kind of thing can be really finnicky."

**Patrick:**
> "I added `aria-label` but I haven't tested with VoiceOver. Let me do that now."

Patrick tests on his Mac with VoiceOver enabled. The badge descriptions are read correctly. He reports back to Sarah.

**Sarah:**
> "Great. Approved!"

Patrick merges the PR to `main`. He missed the last Trunk deploy of the day AGAIN, but the release manage assures him it'll go first thing in the morning.

---

## Day 3: Release

The feature flag is still controlling the rollout, so the new code goes live for the existing 20% of users when the next batch of trunk tickets goes out.

Patrick monitors the logrocket channel for any new spikes in issues. No new errors. 

**Patrick (in Slack):**
> "Updated badge feature is live for 20% of users. Tooltips and i18n are working. Ready to roll out wider?"

**PM (in Slack):**
> "Let's bump to 50% tomorrow if the metrics look good."

---

## Day 4: Wider Rollout
The PM increases the rollout to 50%. No issues. User feedback is positive.

**User feedback (via in-app survey):**
> "Love the new badges! The tooltips are super helpful."

## Day 5: The feature is rolled out to 100% of users.

---

## Reflection: What Makes This Balanced Excellence

Patrick's iteration demonstrates how the new paradigm handles polish:

1. **User feedback drives iteration** — Patrick didn't build tooltips and i18n in Week 1 because he didn't know if users would care about badges at all. Once he had signal from real users, he added the polish where it mattered.

2. **Iterating with AI** — Patrick used AI to refactor the component, catch edge cases (missing translations, accessibility), and maintain consistency with the design system. When AI used deprecated APIs, Patrick corrected the prompt instead of giving up.

3. **Speed + polish balance** — The iteration took 2 days, not 2 weeks. Patrick didn't rewrite the component from scratch - he refactored incrementally, keeping the feature live behind a flag the whole time.

4. **Continuous coordination** — Patrick kept collaborating with Priya (backend) and Sarah (frontend lead) to align on API changes and review standards. Full-stack ownership doesn't mean working in isolation. In the future, he can move these interactions further left to reduce friction even more.

5. **Gradual rollout** — Patrick didn't flip the flag to 100% immediately. He rolled out 5% → 20% → 50% → 100%, monitoring metrics at each stage. Feature flags enable this kind of safe, data-driven rollout.

---

**Timeline Summary:**
- Week 1: Scrappy version shipped dark (3 days)
- Week 2: Feature flag enabled for 5%, user feedback collected, Patrick works on a different scrappy feature
- Week 3, Day 1: Planned iteration with AI, added i18n and tooltips
- Week 3, Day 2: AI code review, human review, merged to main
- Week 3, Day 3-5: Gradual rollout to 50%, then 100%

**JIRA Board Flow:**
```
Merged to Trunk → Done → [New Ticket] In Progress (Iteration) → PR Review → Merged To Trunk → Done → 50% Release → 100% Release 
```

---

## What's Different from Maya's Approach?

<div data-animation="comparison-balanced"></div>

**The key difference:** Patrick didn't have to guess what "done" looked like. He learned what "done" should be by putting something real in front of users and listening.

---

**This is balanced excellence.** Patrick shipped fast enough to learn, then polished based on evidence. The result is a feature that users actually wanted, not just a feature that met a spec. While feedback was being gathered, Patrick was able to start in on a different feature and get its scrappy version ready to deploy as well.


---

**Next:** See how Priya handles a large architectural refactor using the same principles (chunked delivery, continuous merging, AI-assisted planning).
