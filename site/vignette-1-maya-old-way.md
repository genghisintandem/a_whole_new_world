# The Old Way (Excellence)

## Maya's Journey: User Profile Badges

**Character:** Maya Chen, Senior iOS Engineer  
**Experience:** 8 years, meticulous, takes pride in polish  
**Timeline:** 3ish weeks from spec to production  
**Outcome:** Pixel-perfect feature, zero production bugs

---

## Week 1: Planning & Specification

**JIRA Status:** Backlog → In Progress

Maya comes out of sprint planning with a new ticket assigned to her: **ENG-2847: Display User Profile Badges on iOS**

The ticket is thorough. Product has attached:
- High-fidelity Figma designs showing three badge types (Verified, Pro Member, Early Adopter)
- Interaction specs for badge tooltips
- An API contract from the backend team showing the new `/users/{id}` response structure
- Acceptance criteria covering 8 different scenarios

Maya reads through everything carefully. She spots a potential issue.

**Maya (in Slack):**
> "Hey @backend-team - the API contract shows badges as an array of strings, but the designs show badges with icons. Should the backend return icon identifiers too, or do we maintain a client-side mapping?"

**Backend team response (30 minutes later):**
> "Good catch. Let us update the contract. We'll add an `iconName` field to each badge object. ETA tomorrow."

Maya updates the ticket with her findings and moves it back to "Blocked" with a comment about how she's waiting on backend.

---

## Week 1, Day 3: Development Begins

**JIRA Status:** In Progress

The backend team delivers the updated API contract. Maya reviews it, confirms it matches the designs, and starts coding.

She creates a new branch: `feature/ENG-2847-profile-badges`

Over the next two days, Maya writes:
- A `BadgeView` SwiftUI component with proper SF Symbols icon mapping
- Accessibility labels for VoiceOver users
- Dynamic Type support for badge text
- A `BadgeViewModel` that handles the API response transformation
- Unit tests for the view model (12 test cases covering edge cases like empty badge arrays, unknown badge types, and localization)

She references the design system for spacing, colors, and typography. Everything is pixel-perfect against the Figma mockups.

**Maya (to herself, reviewing her code):**
> "Let's make sure this handles the edge case where a user has no badges gracefully. And we should log an Segment event when a badge is tapped."

She adds both. The code is clean, well-commented, and follows the team's Swift style guide.

---

## Week 2: Code Review & Backend Integration

**JIRA Status:** PR Review

Maya opens a pull request: **[ENG-2847] Add user profile badges to iOS app**

The PR description is comprehensive:
- Links to the JIRA ticket and Figma designs
- Notes on what she tested locally
- Notes on any gotchas she that will look like bugs but are working as intended

**First review (Sarah, iOS Tech Lead):**
> "Nice work Maya. A few thoughts:
> - Line 47: We should use the new `AsyncImage` API instead of our custom image loader here
> - Line 103: Can we extract this mapping logic into a separate extension for testability?
> - Accessibility: Have you tested this with Dynamic Type set to the largest size?"

**Maya's response:**
> "Great feedback. I'll refactor the image loading and extract the mapping. I tested Dynamic Type at the default sizes but not the accessibility sizes - will do that now."

Maya pushes updates. Sarah approves the next day.

**Second review (Maxim, Android Engineer, cross-platform review):**
> "Looks solid. One question: we're showing a max of 3 badges on Android when a user has more than that. Should iOS match that behavior?"

**Maya:**
> "Good question. Let me check with product."

Maya messages the product manager, who confirms: yes, max 3 badges, show the most recent ones.

Maya updates the code. Both reviewers approve.

---

## Week 2, Day 4: Backend Coordination

**JIRA Status:** PR Review → In QA

The backend team deploys their changes to the staging environment. Maya pulls the latest code, updates her API endpoint configuration, and tests against real staging data.

She discovers an issue: one of the backend badge types returns `"early_adopter"` (snake_case) but her icon mapping expects `"earlyAdopter"` (camelCase).

**Maya (in Slack):**
> "@backend-team - heads up, we have a casing mismatch on the badge type strings. Can we align on camelCase to match our Swift conventions?"

**Backend team:**
> "Sure, we can update the API to use camelCase. Give us an hour."

They deploy the fix. Maya re-tests. Everything works.

She merges her PR to the `develop` branch and moves the ticket to "QA Review."

---

## Week 3: QA & Iteration

**JIRA Status:** In QA → In Regression

Alex, the QA analyst, picks up the ticket. He tests on multiple iOS devices:
- iPhone 14 Pro (iOS 17)
- iPhone SE (iOS 16)
- iPad Air (iOS 17, landscape and portrait)

He creates a test report document:
- ✅ Badges display correctly for users with 1, 2, and 3 badges
- ✅ Badges are hidden when user has no badges
- ✅ Accessibility labels are correct
- ✅ Analytics events fire correctly
- ❌ **Issue found:** When a badge label is localized to German, the text overflows on iPhone SE in landscape mode

Alex attaches screenshots and moves the ticket back to "In Progress" with a comment:

> "One issue with long localized text on small screens. Otherwise looks great!"

**Maya's response:**
> "Ah, good catch. I'll adjust the text truncation logic."

Maya creates a small follow-up PR to fix the text overflow issue. She tests in German, Spanish, and French to make sure it works across languages.

Alex re-tests the next day. Everything passes.

---

## Week 3, Day 5: Ship to App Store

**JIRA Status:** In Regression → Done

The iOS release includes Maya's badge feature. It doesn't cause any issues in regression testing and the release goes out for review Friday afternoon.

---

## Week 4: Feature is Live

Maya checks for issues in the live app and keeps an eye on the Segment events (as well as the support defect triage channel). No crashes. No unexpected behavior. Badge tap events are coming through cleanly.

**Maya (in Slack):**
> "Badges are live in production. Looks healthy so far. Thanks everyone for the thorough reviews!"

**Product Manager (in Slack):**
> "Looks beautiful Maya! Great work."

---

## Reflection: What Made This An Example of Excellence

This was **exactly what we asked Maya to do**, and she did it exceptionally well:

1. **Attention to detail** — Maya carefully reviewed the spec, caught the API contract issue early, and proactively thought about edge cases (no badges, unknown badge types, localization).

2. **Coordination and communication** — Maya worked closely with the backend team, asked clarifying questions, and aligned with product on behavior (max 3 badges).

3. **Craft and polish** — The code was clean, well-tested, and accessible. Maya took the time to make sure everything was pixel-perfect and handled Dynamic Type correctly.

4. **Thoughtful handoffs** — Maya wrote comprehensive PR descriptions and worked respectfully with reviewers and QA. The QA handoff was smooth, and when a bug was found, Maya fixed it quickly.

5. **Quality assurance** — The feature shipped with zero production bugs. The multi-stage review process (peer review, QA testing, localization testing) caught issues before they reached users. The timing of this feature also perfectly coincided with getting it into Trunk right before regression and submission.

**This approach built trust, ensured quality, and demonstrated mastery of craft. It was the right way to work — and Maya exemplified it.**

---

**Timeline Summary:**
- Week 1: Specification review, planning, development start (blocked 2 days for backend API update)
- Week 2: PR review (2 rounds), backend integration, QA handoff
- Week 3: QA testing, bug fix, submission
- Week 4: Released!

**JIRA Board Flow:**
```
Backlog → In Progress → Blocked → In Progress → PR Review → In QA → In Progress (bug fix) → In QA → Ready for Regression → In Regression → Done
```

---

## What's Changing (And Why)

Maya's approach was excellent for the paradigm we were in. But our needs are evolving:

- **Faster feedback loops** — We want to learn from users earlier, not after 3 weeks and change of development and review.
- **Flow and throughput** — We're optimizing for the speed at which value reaches users, not the thoroughness of pre-ship review.
- **Full-stack ownership** — We want engineers to own features end-to-end, not hand off between iOS, backend, and QA as separate swim lanes.

**None of this means Maya's approach was wrong.** It means the domain and discipline is changing, and we're asking you to level up In Tandem as an organization. We want you to help us evolve quality and craft to encompass the whole SDLC. This means you are taking on more problem solving ownership, and we want to help make that feel empowering, not overwhelming.

Let's see what that new version looks like.
