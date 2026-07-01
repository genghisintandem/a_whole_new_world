# The New Way (Scrappy)

## Patrick's Journey: User Profile Badges, Week 1

**Character:** Patrick Diestler, Mid-level React Engineer  
**Experience:** 3 years, eager to prove value, learning backend  
**Timeline:** 3 days from idea to dark-shipped code  
**Outcome:** Working feature behind a flag, ready for early feedback

---

## Day 1, Morning: Opportunity Spotted

**JIRA Status:** No ticket yet

Patrick is reviewing user feedback from the customer support Slack channel. A message catches his eye:

**User feedback (via support):**
> "I can't tell which users in my team are verified. Can we show some kind of badge or indicator on profiles?"

Patrick thinks: *This would be quick to mock up. Let me see if product wants this.*

He messages the product manager:

**Patrick (in Slack):**
> "Hey @pm - seeing some feedback about wanting badges on user profiles (verified, pro member, etc). Worth exploring? I could mock something up to see if users like it."

**PM response (15 minutes later):**
> "Interesting! Yeah, if you can get something visual in front of users quickly, let's try it. Don't spend more than a day or two on it."

Patrick doesn't write a formal spec. He doesn't wait for designs. He opens a lightweight JIRA ticket:

**ENG-2901: Experiment - User Profile Badges**
- **Description:** Show badges on user profiles to indicate verified status, membership tier, etc. Start with mock data to validate concept with users.
- **Scope:** React UI only, dark launch behind feature flag
- **Success:** Get qualitative feedback from 10 early users

He moves it to "In Progress."

---

## Day 1, Afternoon: Building with AI

**JIRA Status:** In Progress

Patrick opens his Claude Code and starts a conversation.

<div data-animation="patrick-chat"></div>

Patrick reviews the output and spots an issue: the component uses Tailwind color classes, but the team uses design system tokens. He refines his prompt.

The badges appear on the profile page. Patrick takes a screenshot and sends it to the PM.

**Patrick (in Slack):**
> "Here's a rough version of badges. Thoughts?"

**PM response:**
> "Oh nice! Yeah, let's try this. Can you get it in front of some users?"

---

## Day 2: Full-Stack Ownership (Backend Work)

**JIRA Status:** In Progress

Patrick knows the React component is only half the work. He needs the backend to actually return badge data.

He's not a Java expert, but he's not afraid to try.

**Patrick (to himself):**
> "I could wait for the backend team to pick this up, but then I'm going to add waiting time and blow up my context and theirs. Let me see if I can draft the changes and pair with Priya to review."

<div data-animation="patrick-backend-chat"></div>

Patrick reviews the code and interrogates Claude about why certain choices were made. Then he messages Priya.

**Patrick (in Slack):**
> "Hey @priya - I'm adding badge support to the User API. I drafted the changes but I'm not super confident in my Java. Can you spare 15 min to pair and review?"

**Priya (Senior Backend Engineer):**
> "Sure! Jump on a call."

They pair for 20 minutes. Priya spots a few issues:
- Patrick didn't realize he needed to add the `@JsonProperty` annotation for JSON serialization
- The badge logic should be in a separate `BadgeService` for testability
- Patrick's mock logic should be behind a feature flag (backend-side)

Priya helps Patrick prompt from a clean rebase, incorporating her feedback into the conversation with Claude. She walks Patrick through setting up a LaunchDarkly feature flag using the LD MCP Server so that the robot has the flag context built in. Patrick pushes his code. 

**Patrick (thinking):**
> "Okay, PRs are up. While waiting for review, let me knock out that quick bug from the backlog."

He grabs **ENG-2845: Login button disabled state not showing spinner** — a simple CSS fix that's been sitting in the backlog for two weeks. 15 minutes later, he opens a third PR and gets it merged the same day.

**Patrick (in Slack, #engineering):**
> "Knocked out ENG-2845 while waiting on badge reviews. Small win."

---

## Day 2, Afternoon: AI-Assisted Code Review

**JIRA Status:** In Progress → PR Review

Patrick opens two PRs:
1. **[ENG-2901] Add profile badges UI (React)**
2. **[ENG-2901] Add badge data to User API (Java)**

Automatically upon opening these PRs, the AI Code Reviewer runs.

### AI Review Output (React PR)

```
✅ No security issues found
✅ Edge cases handled (empty badges array returns null)
⚠️  Potential issue: Badge label is not escaped. If badge data comes from user input, this could be an XSS vector.
💡 Suggestion: Use `textContent` or ensure backend sanitizes labels.
```

**Patrick (reviewing AI feedback):**
> "Good point. Badge labels come from our backend config, not user input, but let me add a comment to make that explicit."

He updates the code with a comment:
```typescript
// Badge labels are server-controlled config values, not user input.
// If this changes, sanitize labels to prevent XSS.
```

### AI Review Output (Java PR)

```
✅ No SQL injection risk
✅ Proper null handling
⚠️  Potential issue: Badge data is computed on every API call. 
   Consider caching if this endpoint is high-traffic.
💡 Suggestion: Add a TODO comment for future optimization.
```

Patrick adds the TODO comment.

---

## Day 3: Shipping Dark

**JIRA Status:** PR Review → Merged (Dark)

Patrick's PRs are reviewed by humans:
- **React PR:** Approved by Sarah (frontend lead) after one small tweak (accessibility label missing)
- **Java PR:** Approved by Priya (she already paired on it, so review is fast)

Patrick merges both PRs to `main`. 

---

## Day 4: Release and QA Consultation

The next batch of React Trunk tickets is released to prod. The code is live in production, but the `profile-badges` feature flag is set to `false` for all users.

During standup, Patrick consults with QA quickly.

**Patrick (to Alex the QA analyst):**
> "I just shipped badge support behind a flag. Before I enable it for a small group, what should I test to make sure it doesn't break anything?"

**Alex:**
> "Nice! Here's what I'd check:
> - Does the profile page still load if the backend returns null for badges?
> - What happens if a user has 10 badges (UI overflow)?
> - Does the feature flag toggle work correctly (on/off)?
> 
> Also, can you enable it for just our internal test accounts first?"

Patrick tests all three scenarios locally after standup. The null case works. The 10-badge case... does not. The UI overflows.

**Patrick (to himself):**
> "Ah, we need a max badges limit."

He makes a quick follow-up commit (still behind the flag):
```typescript
// Show max 3 badges
const displayBadges = badges.slice(0, 3);
```

---

## Day 5: Fix Release

Patrick just barely missed another batch on Day 4, so he has to wait until Day 5 to get the overflow fix out.

He enables the flag for a couple internal test accounts. The team tries it out. It works.

**Patrick (in Slack):**
> "Badge feature is live for internal test accounts. If it looks good, I'll roll to 5% of users tomorrow."

---

## Reflection: What Makes This The New Way

Patrick's approach demonstrates the new paradigm:

1. **Speed to prove the concept** — Patrick went from user feedback to working code in 5 days, not 3 weeks. He shipped something real quickly enough to learn from it, even when he needed to wait an extra day for a small fix to go out.

2. **Ship dark, iterate in Trunk** — Patrick didn't wait for perfection. He got the code into trunk behind a feature flag, where it can evolve safely without blocking other work.

3. **Full-stack ownership** — Patrick didn't hand off the backend work. He learned enough Java to draft the changes, then paired with Priya to make it production-ready. He owned the feature end-to-end.

4. **AI as a pairing partner** — Patrick used AI to scaffold code, refine it based on real constraints (design system, feature flags), and catch edge cases in review. When AI output wasn't perfect, he iterated on the prompt instead of giving up.

5. **QA as quality strategist** — Patrick didn't hand off to QA for manual testing. He consulted with Alex proactively: "What should I test before enabling this?" Alex gave strategic guidance, and Patrick executed the testing himself.

6. **Negotiating "good enough"** — Patrick didn't build tooltips, internationalization, or analytics tracking in the first version. He built the minimum to validate the concept. Those things will come in iteration (see Week 3).

---

**Timeline Summary:**
- Day 1: Spotted opportunity, got PM buy-in, built React component with AI, shipped screenshot
- Day 2: Drafted backend changes with AI, paired with Priya, opened PRs, ran AI code review
- Day 3: Human PR review, merged to trunk (dark)
- Day 4: Code released, QA consultation, fix missed use case
- Day 5: Code live to test users

**JIRA Board Flow:**

No ticket → Backlog → In Progress → PR Review → Merged to Trunk → Done

---

## What's Different from Maya's Approach?

<div data-animation="comparison"></div>

**Both are excellent.** Maya's approach minimized production risk. Patrick's approach minimized time-to-learning.

The new paradigm optimizes for learning speed, because we believe **fast feedback from real users beats slow perfection in a vacuum.**

<div class="note-position" data-position="2rem"></div>

> **Note:** Patrick, working in React, will necessarily have a faster get-to-prod timeline than Maya. The same PRINCIPLES apply to getting mobile work to trunk, out dark, and instrumented for testing and safe launch.

---

**Next:** See how Patrick iterates on this scrappy version in Week 3, once real user feedback arrives.
