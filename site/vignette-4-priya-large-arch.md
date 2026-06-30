# The New Way (Large Architecture)

## Priya's Journey: User Metadata Service Refactor

**Character:** Priya Sharma, Senior Backend Engineer  
**Experience:** 10 years, systems thinker, coordinating large refactor  
**Timeline:** 8 weeks, delivered in 8 merge-able chunks  
**Outcome:** Major architectural improvement with zero production incidents

---

## The Problem

Priya has been noticing a pattern. Every time the team wants to add a new "user attribute" (like badges, preferences, settings, or profile customization), they have to:
- Touch 3 different microservices
- Update 4 different database tables
- Coordinate deploys across teams
- Write complex join queries that are getting slower as the user base grows

**Current architecture:**

<div data-animation="priya-architecture-before"></div>

Each service has its own database. To render a complete user profile page, the frontend makes 4 API calls.

**The pain:**
- Query performance is degrading (N+1 queries across services)
- Adding new attributes requires coordinating changes across multiple teams
- No single source of truth for "user metadata"

Priya proposes a solution: **User Metadata Service** - a new service that consolidates all non-core user attributes into one place.

<div data-animation="priya-architecture-after"></div>

---

## Week 1: The Temptation (And Why It's Wrong)

Priya's first instinct is to:
1. Create a long-lived feature branch: `feature/user-metadata-service`
2. Build the entire new service
3. Migrate all data
4. Deploy everything at once

**This is the old way.** It would take 6-8 weeks of isolated work, then a massive, risky merge and deploy.

**The problems with this approach:**
- Merge conflicts will be inevitable when Priya's branch finally merges, and she'll be fighting 4 sprints of new stuff
- If something breaks, the rollback is huge and disruptive
- Priya carries enormous context in her head; if she's out sick, the project stalls

**Priya (to herself):**
> "This feels too big. How do I break this into smaller pieces that can ship independently?"

She opens her AI assistant for help.

---

## Week 1, Day 1: Planning with AI

<div data-animation="priya-planning-chat"></div>

Priya uses the Strangler Fig pattern to break the work into phases. But before committing to this approach, she pressure tests it with a different AI model.

<div data-animation="priya-pressure-test-plan"></div>

Satisfied that the approach is sound, Priya creates JIRA tickets for each phase.

---

## Week 1, Day 2: Creating the Roadmap

<div class="jira-epic-container">
  <div class="jira-epic">
    <span class="jira-epic-badge">EPIC</span>
    <span class="jira-epic-key">ENG-3001</span>
    <span class="jira-epic-title">User Metadata Service Migration</span>
  </div>
  
  <div class="jira-tickets">
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3002</span>
      <span class="jira-ticket-title">Build User Metadata Service stub</span>
    </div>
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3003</span>
      <span class="jira-ticket-title">Migrate badges - shadow-write phase</span>
    </div>
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3004</span>
      <span class="jira-ticket-title">Migrate badges - flip read path</span>
    </div>
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3005</span>
      <span class="jira-ticket-title">Migrate badges - remove shadow-writes</span>
    </div>
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3006</span>
      <span class="jira-ticket-title">Migrate preferences - shadow-write phase</span>
    </div>
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3007</span>
      <span class="jira-ticket-title">Migrate preferences - flip read path</span>
    </div>
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3008</span>
      <span class="jira-ticket-title">Migrate preferences - remove shadow-writes</span>
    </div>
    <div class="jira-ticket">
      <span class="jira-ticket-key">ENG-3009</span>
      <span class="jira-ticket-title">Migrate profile data (same pattern)</span>
    </div>
  </div>
</div>

Each ticket is scoped to take less than 1 week. Each ticket results in a merge-able PR.

**Priya (in Slack, to the engineering team):**
> "Heads up: I'm starting a multi-week refactor to consolidate user metadata services. I'm breaking it into small chunks that will merge continuously. You might see new feature flags appearing (user_metadata_badges, user_metadata_preferences, etc). They won't affect prod until we're ready to flip them."

---

## Week 1, Day 3-4: ENG-3002 - Build the Stub

**JIRA Status:** In Progress

Priya uses AI to scaffold the new service.

<div data-animation="priya-scaffolding-chat"></div>

Priya reviews the scaffolding, adjusts it to match the team's conventions, and deploys it to staging.

**The service does nothing.** But it's live, reachable, and passing health checks.

Priya merges the PR. The new service is now in production (but no traffic is routed to it yet).

**Merge timeline: Week 1, Day 4**

---

## Week 2: ENG-3003 - Migrate Badges (Shadow-Write)

**JIRA Status:** In Progress

Now Priya starts migrating the first entity type: badges.

<div data-animation="priya-shadow-write-chat"></div>

Priya reviews the shadow-write logic. Before implementing, she validates it with a different AI model to check for issues.

<div data-animation="priya-pressure-test-code"></div>

Priya adds the monitoring metrics and failure handling improvements suggested by the validation. She adds Datadog metrics:
- `shadow_write.badges.success`
- `shadow_write.badges.failure`

Priya deploys the code with the feature flag set to `false`. She tests manually in staging:
1. Enables the flag in staging
2. Creates a badge via the old API
3. Verifies it's written to both the old and new databases

Everything works. She merges the PR.

**Merge timeline: Week 2, Day 4**

---

## Week 3: ENG-3004 - Migrate Badges (Flip Read Path)

**JIRA Status:** In Progress

Now that shadow-writes are running cleanly in production (Priya monitors the metrics for a week), she's ready to flip the read path.

<div data-animation="priya-read-path-chat"></div>

Priya tests in staging:
1. Enables the read flag
2. Fetches user badges via the API
3. Verifies the response comes from the new system (she adds a response header to distinguish)

She enables the flag for 5% of production traffic. Monitors error rates and latency. Everything looks good.

She gradually increases: 5% → 25% → 50% → 100%.

Priya merges the PR.

**Merge timeline: Week 3, Day 5**

---

## Week 4: ENG-3005 - Migrate Badges (Remove Shadow-Writes)

**JIRA Status:** In Progress

The new system has been handling 100% of reads for a week. No issues. Now Priya can remove the shadow-write logic and make the new system the sole writer.

She removes the shadow-write code from `BadgeService` and sets the old `badges` table to read-only (just in case they need to reference it later).

**Priya (in PR description):**
> "Badges are now fully migrated to UserMetadataService. Old `badges` table is no longer written to. We'll drop the table in 30 days after confirming no issues."

Priya merges the PR.

**Merge timeline: Week 4, Day 3**

---

## Week 5-6: Repeat for Preferences and Profile Data

Priya follows the same pattern for preferences and profile data:
- Week 5: Shadow-write preferences, flip read path
- Week 6: Remove shadow-writes, migrate profile data

Each migration is independent. Other engineers can keep working on user features during the refactor — they just coordinate with Priya when they need to touch badges, preferences, or profile code.

---

## The Result

**6 weeks later:**
- All user metadata is consolidated into `UserMetadataService`
- The frontend now makes 1 API call instead of 4 to render a user profile
- Query performance improved by 60% (no more cross-service joins)
- Zero production incidents during the migration
- No long-lived branches — Priya merged to `main` 8 times

---

## Reflection: What Makes This Large-Architecture Excellence

Priya's refactor demonstrates how the new paradigm handles big changes:

1. **Chunked delivery** — Priya broke an 8-week refactor into 8 merge-able chunks. Each chunk was independently deployable and rollback-safe.

2. **Strangler Fig pattern** — Instead of rewriting everything at once, Priya incrementally moved traffic from old to new systems. The old systems kept working until the new system proved itself.

3. **Feature flags for safety** — Every phase was gated behind a feature flag. If something broke, Priya could roll back instantly without redeploying code.

4. **Continuous merging** — Priya merged to `main` every week. No 8-week-old feature branch with hundreds of merge conflicts.

5. **AI-assisted planning** — Priya used AI to plan the migration strategy, generate scaffolding, and write shadow-write logic. She iterated on the prompts when the first output didn't match her needs. Instead of blindly trusting the robot, she also pressure tested it against different models using different harnesses.

6. **Monitoring and metrics** — Priya added metrics at every phase (shadow-write success rate, read latency, error rates) so she could confidently increase rollout percentages.

7. **Team coordination without blocking** — Priya communicated her plan upfront and kept merging small changes. Other engineers could keep working on user features without waiting for the refactor to "finish."

---

**Timeline Summary:**

<div data-animation="priya-timeline"></div>

**6 weeks total, 8 merges to main**

**JIRA Board Flow (per entity type):**

Epic → Ticket 1 (stub) → Merged → Ticket 2 (shadow-write) → Merged → Ticket 3 (flip read) → Merged → Ticket 4 (remove shadow) → Merged → Repeat for next entity type...

---

## What's Different from the Old Way?

<div data-animation="comparison-large-arch"></div>

---

## Key Lesson: Don't Defer Big Work — Decompose It

**The old paradigm taught us:** "This is too big to break into small PRs, so I'll do it on a branch."

**The new paradigm teaches:** "This is big, so I *must* break it into small PRs — or the risk becomes unmanageable."

Priya's refactor was genuinely large and complex. But by using:
- AI to plan the phasing strategy
- Feature flags to control rollout
- The Strangler Fig pattern to migrate incrementally
- Continuous merging to avoid branch drift

...she turned an 8-week refactor into 8 low-risk, independently-deployable changes.

**This is how we do large architecture work in the new paradigm.**

---

**Next:** See what happens when someone rushes and skips these principles (Genghis's cautionary tale).
