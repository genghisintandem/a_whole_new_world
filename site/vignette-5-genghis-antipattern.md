# Don't Be Like Genghis

## Genghis's Journey: How NOT to Do the New Way

**Character:** Genghis, Engineering Leader  
**Experience:** Should know better  
**Timeline:** 2 hours from idea to production disaster  
**Outcome:** Rollback, incident retro, public self-roast  

---

## Monday, 2:00 PM: The Slack Request

Genghis is in back-to-back meetings. Between calls, he checks Slack and sees a message from the PM:

**PM (in Slack):**
> "Hey @genghis - quick question: can we add a 'New User' badge for accounts less than 30 days old? Sales team wants to identify new customers at a glance. Low priority, no rush."

**Genghis (thinking):**
> "Oh this is easy. I can bang this out in 20 minutes. Let me show the team how fast we can move now."

He opens his AI assistant between meetings.

---

## Monday, 2:15 PM: The First (And Only) Prompt

<div data-animation="genghis-bad-prompt"></div>

Genghis smashes the approve button and writes the code directly into `BadgeService.java`.

---

## Monday, 2:20 PM: Mistake #1 - Trusting AI Blindly

Genghis didn't notice several issues with the AI-generated code:

❌ **Issue 1:** The 30-day threshold is hardcoded. It should be configurable (what if sales wants to change it to 14 days or 60 days later?).

❌ **Issue 2:** The AI used `LocalDate` but the existing codebase uses `Instant` for timestamps. Type mismatch incoming.

❌ **Issue 3:** The badge is being added to the in-memory list *every time* `getBadges()` is called, not persisted to the database. This will cause the "New User" badge to appear even if the user already has it (duplicate badges).

❌ **Issue 4:** No feature flag. The change will go straight to production when deployed.

---

## Monday, 2:25 PM: Mistake #2 - Skipping Code Review

Genghis compiles the code. It doesn't compile.

**Compiler error:**
```
Incompatible types: cannot convert LocalDate to Instant
```

**Genghis (frustrated):**
> "Ugh, this AI stuff is too slow. I'll just fix it myself."

He manually changes `LocalDate` to `Instant` by Googling the conversion:
```java
Instant createdDate = user.getCreatedDate();
Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);

if (createdDate.isAfter(thirtyDaysAgo)) {
    badges.add(new Badge("new_user", "New User", "newUser"));
}
```

**Mistake:** Instead of going back to the AI and saying "The code doesn't compile - we use Instant, not LocalDate. Please update," Genghis switched to manual coding.

**Why this is wrong:** The AI could have also caught the other issues (hardcoded threshold, no feature flag, duplicate badge logic) if Genghis had iterated on the prompt. By going manual, he only fixed the compilation error, not the logical bugs.

---

## Monday, 2:30 PM: Mistake #3 - Bypassing AI Code Review

Genghis is in a hurry. He has another meeting in 5 minutes. Meetings mean you're important. He commits the code:

```
git add BadgeService.java
git commit -m "Add new user badge"
git push
```

He opens a PR and immediately merges it (he's an admin) without even waiting for the AI PR Review.

**What Genghis should have done:**
- At the very least waited to get the AI review
- It would have flagged:
  - ⚠️ "Badge is being added to list every time method is called (duplicate badges)"
  - ⚠️ "Threshold is hardcoded (consider making it configurable)"
  - ⚠️ "No feature flag detected (risky for production deploy)"

---

## Monday, 2:35 PM: Mistake #4 - No Feature Flag

Genghis, while multitasking in his Very Important Meeting, moves his code to the merge queue and sends a note to the release manager.

The change goes live.

---

## Monday, 2:45 PM: Production Incident

The error tracking system starts lighting up:

**Error:**
```
java.lang.OutOfMemoryError: Java heap space
  at BadgeService.getBadges(BadgeService.java:47)
```

**What happened:**

Genghis's code has an off-by-one logic error. The condition:
```java
if (createdDate.isAfter(thirtyDaysAgo)) {
```

...should have been:
```java
if (createdDate.isAfter(thirtyDaysAgo) || createdDate.equals(thirtyDaysAgo)) {
```

But worse: the AI-generated code adds the badge to the `badges` list *every time* `getBadges()` is called. Since this method is called on every page load, and the badge list is cached in memory, the list keeps growing infinitely.

**Impact:**
- User profile pages are timing out
- The badge service is consuming 100% CPU
- The on-call engineer gets paged

---

## Monday, 3:00 PM: The Rollback

**On-call engineer (in Slack):**
> "@genghis - we're seeing a spike in errors from BadgeService. Did you just deploy something?"

**Genghis:**
> "Oh no. Yes. Let me roll it back."

Genghis reverts the commit and gets the release manager to redeploy. The errors stop.

**On-call engineer:**
> "Okay, back to normal. What happened?"

**Genghis (sheepishly):**
> "I added a new badge feature and didn't test it thoroughly. My bad. I'll write up a retro."

---

## Monday, 4:00 PM: The Retro (Public Self-Roast)

Genghis writes an incident retro and shares it with the team:

---

### Incident Retro: "Don't Be Like Genghis"

**What happened:**
I tried to quickly add a "New User" badge feature and shipped a bug that caused a production outage.

**Root causes:**

1. **Trusted AI output blindly** — I used the first output from the AI without reviewing it critically. I didn't ask the machine to help me plan the feature, I believed it was a 'trivial' enough feature that planning was a waste of time. The code had several issues (hardcoded threshold, wrong date type, duplicate badge logic), but I only noticed the compilation error because I was in a rush.

2. **Gave up on AI iteration** — When the code didn't compile, I manually patched it instead of refining the prompt. This meant I fixed the symptom (compilation error) but not the underlying issues (bad logic). It's fine to write code manually when it makes sense, but not when it's because I know I'm hacking around solving the actual problem.

3. **Skipped code review** — I was in a hurry and didn't run the AI code review tool or wait for human review. The AI review would have caught the duplicate badge bug.

4. **No feature flag** — I deployed straight to production without a way to safely roll back. A feature flag would have let me disable the feature instantly without redeploying.

5. **Didn't test edge cases** — I didn't think through: "What happens if this method is called multiple times? What if the threshold changes? What if the user's account is exactly 30 days old?"

**What I should have done:**

✅ **Iterate on the prompt:**
- First prompt: "Add a new user badge"
- Second prompt: "The code doesn't compile - we use Instant not LocalDate. Also make the threshold configurable."
- Third prompt: "What edge cases should I consider? What happens if getBadges() is called multiple times?"
- If I still have things I want done, manually doing them and making sure I use that new manual code as a guide for further prompting

✅ **Run AI code review:**
- The tool would have flagged the duplicate badge issue and the lack of a feature flag.

✅ **Add a feature flag:**
- Even if I was confident in the code, a flag would have given me a safe rollback path.

✅ **Test my changes:**
- I should have run it locally, and probably even deployed to a preprod environment, and tested: "Does the badge appear correctly? Does it disappear after 30 days? What happens if I refresh the page multiple times?"

✅ **Collaborated with my human peers:**
- Even a quick 5-minute review from Priya or Patrick would have caught these issues. Even a 2 slack message chat with the PM or QA would have given me enough guidance to prompt well for a plan.

**Action items:**

- [ ] Add linter rule to block PRs without feature flags for user-facing changes
- [ ] Create a "pre-merge checklist" and pin it in the #engineering channel
- [ ] Schedule a team workshop: "How to iterate effectively with AI coding tools"

**Lessons learned:**

- **Speed without thinking is not the goal** — The new paradigm is about speed *with thoughtful iteration*, not reckless shipping.
- **Don't trust the first swing** — AI is a tool, not magic. The first output is a draft, your judgment is there to tell us when it's production ready.
- **Iterate on prompts instead of going manual** — When AI gives you bad output, the solution is not to abandon AI — it's to refine your prompt and consider changing how you're talking, and thinking, about your approach.
- **Feature flags are not optional** — They're the safety net that lets us move fast without breaking things.

---

**Genghis (in Slack, sharing the retro):**
> "I screwed up today. Here's what I learned. Feel free to roast me. 😅"

**Team reactions:**

**Priya:**
> "Appreciate the transparency! This is a great reminder for all of us."

**Patrick:**
> "LOL, LMAO even. We've all been there. The 'iterate on prompts' lesson is key — I've definitely been guilty of going manual too quickly."

**Sarah (frontend lead):**
> "Can we turn this into a training doc? 'Common pitfalls when moving fast.'"

**PM:**
> "Thanks for the retro Genghis. No harm done — we caught it fast. Let's get the feature right next time. 👍"

---

## Reflection: What Went Wrong (And How to Avoid It)

Genghis's mistakes are common when teams first adopt AI-native development. Here's how to avoid them:

<div class="antipattern">

### Anti-Pattern #1: Mere Vibe Coding (Trusting AI Blindly)

**What it looks like:**
- Prompt DOING instead of PLANNING from the start
- YOLO approve code from AI without reading it
- Assume AI understands your codebase conventions
- Don't question the logic so long as it 'feels' right

**How to avoid it:**
- Treat AI output as a draft, not necessarily a final product
- Interrogate the code carefully. Read it, ask the AI questions, use other models and agents to find flaws and oversights
- Refine your prompt if the output isn't quite right
- Re-point your prompt at any manual changes you have made so it has an example
- Establish and share guardrails that work for you

</div>

<div class="antipattern">

### Anti-Pattern #2: Giving Up on AI When It's Not Perfect

**What it looks like:**
- AI gives you code that doesn't compile or doesn't fit your needs
- You think "this is too slow, I'll just do it myself"
- You patch the code manually and move on

**How to avoid it:**
- Prompt to see if the AI can give you input on how you're approaching the problem, not just how you're implementing a solution
- Iteration is the point — the first prompt is never perfect
- When AI output is wrong, refine your prompt: "This doesn't compile because we use Instant not LocalDate. Please update."
- Use AI's ability to catch edge cases: "What could go wrong with this logic?"

</div>

<div class="antipattern">

### Anti-Pattern #3: Skipping Review Steps to "Save Time"

**What it looks like:**
- Skip AI code review ("it's a small change")
- Skip human review ("I'm confident in this")
- Skip feature flags ("it's low risk")

**How to avoid it:**
- AI code review takes 30 seconds — always let it run and respond to it
- Feature flags are not optional for user-facing changes
- Small changes can still break things — collaborate during some (or multiple) phases of planning and building

</div>


---

## The Punchline

**Genghis thought he was embracing the new way:**
- "Let's move fast!"
- "AI will help me ship this in 20 minutes!"
- "No need for all the old bureaucracy!"

**But he was actually doing the *worst* version of both paradigms:**
- Skipped the old way's rigor (careful review, testing, handoffs)
- Skipped the new way's iteration (refining prompts, AI code review, feature flags)

**The new way is not "ship recklessly and hope it works."**

**The new way is: "Ship iteratively, with safety nets, so you can learn fast without breaking things."**

---

## Key Takeaways

✅ **Do this:**
- Iterate on AI prompts until the output is right
- Respond to AI code review, determine if you need human review too
- Use feature flags for all user-facing changes
- Test high risk edge cases before deploying
- Ask for help when you're not sure

❌ **Don't do this:**
- Trust the first AI output blindly ("vibe coding")
- Give up on AI when it's not perfect and go manual
- Skip review steps to "save time"
- Deploy without a flag or rollback plan
- Confuse "moving fast" with "shipping without thinking"

---

**Herein lies the lesson:**

*Speed without thoughtfulness is just chaos.*

The new paradigm is about combining speed (AI, feature flags, continuous merging) with thoughtfulness (iteration, review, monitoring).

Genghis forgot the thoughtfulness part. Don't be like Genghis.

---

**JIRA Board Flow (Genghis's Journey):**

No ticket → Pushed to main → Production → 🔥 INCIDENT 🔥 → ROLLED BACK → Retro → Back to drawing board

(Compare this to Patrick's flow: Backlog → In Progress → Merged (Dark) → Gradual Rollout → Done)

---

**Next:** Review the key principles that tie all these stories together.
