# Key Principles: The New Paradigm

## What We're Asking You to Do (And Why)

Your role is evolving. Not because the old way was wrong, but because our needs have changed.

**The old paradigm optimized for:** Minimizing production risk through thorough pre-ship review.

**The new paradigm optimizes for:** Maximizing learning speed through safe, iterative delivery.

Both are valid. Both require craft and care. They just measure success differently.

---

## The Five Core Principles

### 1. Ship Dark, Iterate in Trunk

**Old way:** Build the complete feature on a branch, review exhaustively, then merge and deploy.

**New way:** Get working code into `main` (or `develop` or whatever your Trunk is) quickly behind a feature flag, then iterate based on real feedback.

**Why:**
- Feature flags let you deploy code without exposing it to users
- Merging frequently avoids painful merge conflicts
- You can iterate on live code without blocking others

**How:**
- Every user-facing change should be behind a feature flag
- Merge to trunk as soon as the code works (even if it's not polished)
- Use gradual rollout (5% → 50% → 100%) to validate before full deploy

**Example:** Patrick shipped badge support in 5 days behind a flag, then iterated based on user feedback (tooltips, i18n). Maya spent 3 weeks perfecting the feature before shipping.

---

### 2. Full-Stack Ownership

**Old way:** iOS engineer builds the UI, hands off to backend team for API changes (or waits to start until backend is done), hands off to QA for testing.

**New way:** Engineer owns the feature end-to-end. If you need changes on another codebase, draft them (with AI help) and pair with the codebase's expert to review if needed.

**Why:**
- Handoffs are slow and error-prone
- Owning the full feature gives you faster feedback loops
- You learn new skills by stepping outside your comfort zone

**How:**
- Use AI to scaffold code in stacks you're less familiar with
- Pair with subject matter experts to review and refine, ESPECIALLY your approach
- Don't wait for another team to "pick up" your dependency

**Example:** Patrick (React engineer) drafted Java backend changes with AI, then paired with Priya (backend SME) for review. They shipped together in 2 days instead of waiting a week for backend team availability.

---

### 3. AI is Your Pairing Partner — Iterate on Prompts

**Old way:** Write all code manually, or Google for snippets.

**New way:** Use AI to generate code, catch edge cases, and refactor — but treat the first output as a draft, not the final version.

**Why:**
- AI can generate code faster than you can type it
- AI can catch edge cases you might miss
- Iteration is where the value comes from — the first prompt is rarely perfect

**How:**
- Start with a clear, specific prompt (include context: your tech stack, conventions, constraints)
- Interrogate your planning in multiple steps, often across multiple agents and harnesses
- Review the output critically — does it make sense? Does it fit your codebase? Ask the AI questions about it
- Refine the prompt when the output isn't right (don't give up and go manual)
- Use AI code review to catch issues before human review

**Example:** Patrick iterated on his prompts 3 times to get badge code that used the team's design system and included a feature flag. Genghis used one vague prompt, got bad output, and manually patched it (which caused a production bug).

---

### 4. QA Analysts Are Quality Strategists, Not Gates

**Old way:** Hand completed code to QA for full manual testing. Wait for QA to find bugs and report back.

**New way:** Consult with QA *before* and *during* development. Ask: "What should I test? What edge cases matter?" Then test it yourself.

**Why:**
- QA analysts have moved "left" — they're helping you plan for quality, not just testing after the fact
- Manual testing is slower than automated testing + AI-assisted review
- You're accountable for the quality of your work

**How:**
- When planning features, talk to QA about what test cases are Must Haves, Nice To Haves, etc. Talk about potential risks and what you need to do to get into various user states
- Use AI code review to catch common issues (edge cases, security, performance)
- Write automated tests where it makes sense (especially for complex logic)
- QA still does exploratory testing for high-risk features, but you own the basics

**Example:** Patrick consulted with Alex (QA analyst) before enabling the badge feature: "What should I test?" Alex gave strategic guidance (null handling, UI overflow, feature flag toggle), and Patrick executed the tests himself.

---

### 5. Break Large Work Into Chunks, Ship Continuously

**Old way:** Large refactors or architectural changes happen on long-lived branches, then merge in one giant PR.

**New way:** Break the work into small, independently deployable chunks. Merge each chunk to Trunk within a week.

**Why:**
- Long-lived branches lead to merge conflicts and context overload
- Small chunks are easier to review, test, and roll back
- You can course-correct quickly if something goes wrong

**How:**
- Use AI to plan the phasing strategy (e.g., Strangler Fig pattern for migrations)
- Use feature flags to control which phases are active
- Each chunk should be merge-able and independently deployable
- Part of testing should be making running old work in parallel with new and comparing results
- Communicate your plan so others know what's changing

**Example:** Priya broke an 8-week refactor into 8 merge-able chunks (shadow-write, flip read path, remove old system). She merged to `main` every week. Zero production incidents.

---

## What Excellence Looks Like Now

### Scrappy Excellence (Week 1)
- Ship working code quickly behind a feature flag
- Prove the concept with real users
- Don't over-engineer before you have feedback

**Example:** Patrick's badge feature (Week 1) — mock data, basic UI, no i18n, but functional enough to learn from.

---

### Balanced Excellence (Week 3)
- Iterate based on real user feedback
- Add polish where it matters (i18n, tooltips, edge case handling)
- Use AI to maintain consistency with your design system

**Example:** Patrick's badge feature (Week 3) — added tooltips and i18n after users asked for them, not before.

---

### Architectural Excellence (8 Weeks, Shipped Continuously)
- Break large work into small, merge-able chunks
- Use feature flags to control phased rollout
- Monitor and validate each phase before moving to the next

**Example:** Priya's User Metadata Service refactor — 8 chunks, 8 merges, zero production incidents.

---

## What Anti-Patterns Look Like

❌ **Vibe Coding**
- Trust AI output blindly without reading or understanding it
- Push code without checking if it fits your codebase conventions
- Don't question the logic or edge cases

❌ **Giving Up on AI Too Quickly**
- AI gives you imperfect output → you switch to manual coding
- You fix the symptom (compilation error) but miss the root issue (bad logic)

❌ **Skipping Safety Nets to "Move Fast"**
- No feature flags ("it's low risk")
- No code review ("I'm confident")
- No testing ("I'll test in prod")

❌ **Confusing Speed with Recklessness**
- Optimize for "how fast can I deploy" instead of "how fast can I learn"
- Ship without thinking about rollback plans or monitoring

**Example:** Genghis shipped a bug in 2 hours, spent 2 more hours rolling back and writing a retro. Patrick shipped safely in 3 days and iterated smoothly.

---

## Common Questions

### "What if AI gives me insecure code?"

**Run AI code review.** It will flag common security issues (XSS, SQL injection, insecure dependencies). If you're unsure, ask a security-focused engineer to review. AI will actually be BETTER at finding these issues, even in its own solutions, than most humans. Claude Code specifically has an `/security-review` option for this.

### "What if I don't know enough about backend/frontend/mobile to own the full stack?"

**You don't need to be an expert.** Use AI to draft code, then pair with an SME to review. You'll learn by doing. Start with small changes (like adding a field to an API response) before tackling complex logic.

### "What if I ship a bug behind a feature flag and it breaks something? How will I even know?"

**Toggle the flag off.** That's the point of flags — instant rollback without redeploying. If the bug is severe, fix it before re-enabling. If it's minor, iterate and fix it in the next PR.

**Build observability in, starting now.** A benefit of AI tooling is onerous tasks like instrumenting telemetry and observability are much, much easier now. Part of thinking about quality is thinking about how you're going to know your code is healthy in prod.

### "What if my PR is too small to be worth reviewing?"

**Small PRs are easier to review.** A 50-line PR gets better feedback than a 500-line PR. Reviewers can focus on the logic instead of getting overwhelmed by the size.

### "What if I spend too much time iterating with AI and don't ship anything?"

**Set a timebox.** If you've iterated 5 times and the AI still isn't giving you what you need, that's a signal to either:
1. Refine your prompt with more context (show the AI existing code patterns)
2. Ask a human for help
3. Write the code manually (but only after trying iteration)
4. Have the AI review so you can continue to iterate by prompting

### "What if I'm more comfortable with the old way?"

**That's okay.** The old way built valuable instincts (attention to detail, thorough testing, clear communication). Those instincts still matter. We're asking you to apply them in a new context:
- Attention to detail → Iterate on AI prompts until the output is right. 
- Thorough testing → Test behind a feature flag before rolling out and iterate on the quality gates we put in place
- Clear communication → Collaborate early, and share your plan when doing large work

**You're not starting from zero. You're adapting what you are already world class at.**

---

## The Mindset Shift

**Old paradigm:** Minimize risk by perfecting code before shipping.

**New paradigm:** Minimize risk by shipping safely (flags, small chunks, gradual rollout) and learning fast.

**Both care about quality.** They just achieve it differently.

**The old way asks:** "Is this ready for users?"

**The new way asks:** "Is this safe to deploy (behind a flag) so we can find out what 'ready' means?"

---

## What Hasn't Changed

Even though the process is shifting, some things remain constant:

✅ **Craft still matters** — Writing clean, maintainable code is still the goal. AI helps you get there faster, but you're still accountable for the quality.

✅ **Communication still matters** — You still need to coordinate with your team, especially when working on shared systems or large refactors. It's still fun to design kick-ass systems with really smart people.

✅ **Testing still matters** — Automated tests, manual testing, and AI-assisted review are all part of the toolkit. Use the right tool for the job. Iterate on those tools.

✅ **Users still matter most** — The goal is still to build features that users love. The new paradigm just gets you feedback from users faster.

---

## Final Thought

**The old way was excellent. And you were excellent at it.**

We're not changing because you did something wrong. We're changing because the world is moving faster, and we want to keep up.

**The new way is also excellent — just different.**

It requires the same care, the same craft, the same attention to detail. It just applies those values in a new context: iterating with AI, shipping behind flags, owning features end-to-end.

**We trust you. We want you to trust you too.**

You've already proven you can do excellent work. Now we're asking you to apply that excellence in a new game.

And if you mess up along the way? That's okay. Mistakes are the cost of doing business in a culture of learning. We will genuinely CELEBRATE mistakes, made in good faith, that teach us something. 

**If it's going to be a brave new world out there anyway, let's make it ours.**

---

## Quick Reference: Old vs. New

| Aspect | Old Paradigm | New Paradigm |
|--------|--------------|--------------|
| **Starting point** | Detailed spec, designs, API contract | User feedback, lightweight ticket, or opportunity spotted |
| **Branch strategy** | Feature branches, merge when done | Merge to `main` frequently, use feature flags |
| **Code generation** | Manual or small snippets from Google/SO | AI scaffolds, you refine via iteration |
| **Review process** | Multiple rounds of human review, full QA testing | AI review + human review, QA consultation |
| **Ship criteria** | Pixel-perfect, all edge cases handled, zero known bugs | Good enough to learn from, dark-launched behind flag |
| **Feedback loop** | After full launch (weeks later) | Before full launch (days later, early users) |
| **Handoffs** | Sequential (FE → BE → QA) | Parallel (engineer owns end-to-end, pairs as needed) |
| **Large architecture** | Long-lived branch, big-bang merge | Chunked delivery, continuous merging, phased rollout |
| **Quality ownership** | QA analysts find bugs after dev | Engineers own quality, QA consults on strategy |
| **What "done" means** | Matches spec perfectly | Solves user problem (learned from real usage) |
 
