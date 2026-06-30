# QA for Large Projects: Kenji & Priya's Migration

## Kenji Supporting Priya's 6-Week Architecture Refactor

**Characters:** Kenji Nakamura (QA) & Priya Sharma (Backend Engineer)  
**Project:** User metadata service consolidation (4 services → 1)  
**Timeline:** 6 weeks, 8 merges, continuous validation  
**Outcome:** Zero production incidents, high confidence at every phase  

---

## Previously: The Old Way (How This Would Have Gone)

In the old paradigm, Kenji would have approached this 6-week refactor like this:

### Week 0: Epic Intake
- Priya files an epic for the refactor
- Kenji receives the epic and writes a **comprehensive test plan**:
  - 50+ test cases covering all scenarios across all 4 services
  - Manual steps for each API endpoint
  - Data validation queries for database consistency
  - Cross-service integration tests
  - Rollback procedures

This test plan would sit in JIRA, mostly unused during development. It tries to predict everything that could go wrong before Priya even starts coding.

### Week 1-6: Development (Kenji waits)
- Priya works on a long-lived feature branch
- Kenji occasionally checks in: "How's it going? Let me know when you're ready for QA"
- Kenji can't really test anything because it's not merged yet
- The test plan becomes outdated as Priya changes her approach
- Kenji feels anxious because he can't validate anything for 6 weeks

### Week 7-8: QA Testing Phase
- Priya finally merges to main (massive merge conflicts)
- Kenji gets the ticket: "Ready for QA"
- Kenji spends 2 weeks executing the 50-case test plan on staging
- Finds bugs, files tickets, waits for fixes, re-tests
- The testing is exhaustive but also exhausting
- Finally signs off: "Ready to ship"

### Week 9: Big Bang Deploy
- Deploy all 4 services to production at once (everyone holds their breath)
- Kenji monitors for issues
- If something breaks, massive rollback (weeks of work lost)

**Total timeline:** 9 weeks, high risk, lots of waiting, testing happened after the fact.

**Kenji's anxiety level:** Very high. He's the last line of defense before a huge deploy, and if he misses something, it's a big incident.

---

## The New Way: Metrics + Targeted Regression Testing

Kenji approaches Priya's refactor differently. Instead of writing a comprehensive test plan upfront and waiting until the end, he's going to:
1. Define confidence metrics for each phase
2. Create **targeted regression test plans** at each phase (not comprehensive upfront)
3. Validate continuously with both metrics and selective testing

**Kenji (thinking):**

> "This is a high-risk migration. I can't just rely on metrics alone - I need to actually test critical flows at each phase. Let me work with Priya to understand the phases, then I'll write focused regression tests for each phase as we go."

---

## Week 0: Epic Intake (Planning Quality Strategy)

Priya creates the epic: **"Consolidate user metadata services (badges, preferences, profile)"**

Kenji schedules a call with Priya.

**Kenji (in Slack):**

> "Hey @priya - saw your metadata consolidation epic. This is a big one. Want to walk through your approach so I can figure out the right quality strategy? I'm thinking metrics + targeted regression testing at each phase, not a big test plan upfront."

**Priya:**

> "Yes! I'm planning to use the strangler fig pattern - migrate one entity at a time. Want to walk through the phases?"

They jump on a call.

---

## Week 0: The Quality Planning Session

**Priya (shares screen):**

> "Here's my approach:
> - Week 1: Build empty service stub
> - Week 2-3: Migrate badges (shadow-write → flip read → remove shadow)
> - Week 4-5: Migrate preferences  
> - Week 6: Migrate profile data
> 
> Each phase has a feature flag for instant rollback."

**Kenji:**

> "Okay so instead of one big migration, you're doing 3 smaller ones. That's way safer. What do you need from me?"

**Priya:**

> "Honestly, I'm not sure. In the old world, I'd hand this to you at the end and you'd test it. But I'm merging every week, so... what changes?"

**Kenji:**

> "Here's what I'm thinking. This is high-risk enough that I want to do regression testing at each phase - not wait until the end. But I don't want to write a a billion test cases upfront when I don't even know what the real edge cases or riskiest things are yet.
>
> Let's do this:
> 1. **Define confidence metrics per phase** - so we know what 'safe' looks like
> 2. **I'll write a focused regression test plan for each entity** - but only when we're about to migrate it, not upfront
> 3. **I'll run those regression tests at key rollout points** - like 5% and 50%
> 4. **Metrics give us continuous signal, tests give us high-confidence validation**
>
> Does that work?"

**Priya:**

> "Yeah, that makes sense. So you're not testing everything upfront, but you're also not skipping regression testing entirely."

**Kenji:**

> "Exactly. For badges specifically, what would make you confident at each phase?"

**Priya:**

> "For badges:
> 1. Shadow-writes working: old and new systems have the same data
> 2. Read path flip: new system returns same data as old
> 3. Shadow-write removal: old system can be deleted without breaking anything"

**Kenji:**

> "Perfect. Let's define the **confidence metrics** for each phase, and then I'll write a **targeted regression test plan** specifically for badges once you're ready to flip the read path. That's the highest-risk moment."

---

## Week 0: Defining Per-Phase Metrics

Kenji creates a shared doc: **Quality Strategy: Metadata Migration**

### Phase 1: Shadow-Write Badges (Week 2)
**Goal:** Dual-write to old and new systems, read from old

**Confidence metrics:**
- **Data consistency:** 99.9%+ of writes succeed in both systems
- **Latency impact:** Write latency increases by <50ms (acceptable)
- **Error rate:** No increase in badge write failures
- **Data validation:** Daily comparison query shows <0.1% drift

**How to measure:**
- Add `shadow_write_success` and `shadow_write_failure` Segmetn events
- Add `data_drift_detected` event for mismatches
- Databricks dashboard showing dual-write metrics
- Daily Splunk query comparing old vs. new badge counts

**Rollback plan:** Feature flag `metadata.shadow_write.badges` → disable instantly

---

### Phase 2: Flip Read Path (Week 3)
**Goal:** Read from new system, still writing to both

**Confidence metrics:**
- **Read success rate:** 99.95%+ of badge reads succeed from new system
- **Response time:** Badge fetch <100ms (same as old system)
- **Data correctness:** Manual spot-checks show correct badges
- **Error rate:** No increase in badge rendering failures on frontend

**How to measure:**
- Gradual rollout: 5% → 20% → 50% → 100%
- Monitor `badge_fetch_duration` and `badge_fetch_error` Segment events
- Compare badge data returned from old vs. new at 5%
- Kenji does manual exploratory testing at 5% and 50%

**Rollback plan:** Feature flag `metadata.read_from_new.badges` → instant rollback to old system

---

### Phase 3: Remove Shadow-Writes (Week 4)
**Goal:** Stop writing to old system, only write to new

**Confidence metrics:**
- **Old system idle:** Zero writes to old badge tables
- **New system stable:** No degradation in write performance
- **No dependencies:** Old system can be shut down without errors

**How to measure:**
- Monitor old system write count (should drop to zero)
- Check for any code still calling old badge endpoints
- Run for 1 week with old system idle before deleting

**Rollback plan:** Re-enable shadow-writes if issues found

---

**Kenji:**

> "So at each phase, we're not asking 'did I test everything?' We're asking 'what does the data tell us?' If the metrics look good at 5%, we roll out to 20%. If they look bad, we roll back instantly."

**Priya:**

> "Am I really creating a bunch of Segment events just for the release plan?"

**Kenji:**

> "Yeah. I'm open to other options if Segment's heavy or hard to manage, but I think we have to get used to building stuff to track changes and then tearing those instruments out when they're not useful anymore. Let's repeat this pattern for preferences and profile data."

They define the same metrics for the other two entities (preferences, profile).

---

## Week 1: Scaffold Phase (Kenji Reviews Stub Service)

Priya builds the empty service stub and opens a PR.

**Kenji (PR review comment):**

> **Observability check:** I see you've added health check endpoints. Can you also add:
> - `/metrics` endpoint exposing shadow-write success/failure counts
> - Something for latency tracking
> - Logging for data drift detection
> 
> This will make it easier to validate each phase.

**Priya:**

> "Fiiiiiiine. Adding now."

Kenji doesn't test the empty stub (nothing to test yet). He's focused on ensuring the **instrumentation** is in place for future phases.

---

## Week 2: Shadow-Write Phase (Kenji Validates Metrics)

Priya merges the shadow-write logic for badges. The feature flag `metadata.shadow_write.badges` is enabled at 5%.

**Kenji (monitoring Databricks):**

Kenji opens the dashboard Priya set up:
- **Shadow-write success rate:** 99.92% ✅
- **Shadow-write latency:** +35ms (target: <50ms) ✅
- **Error rate:** No change ✅

**Kenji (runs validation query in Splunk):**

```sql
SELECT 
  old_system.user_id,
  old_system.badge_count,
  new_system.badge_count
FROM old_badges AS old_system
LEFT JOIN new_badges AS new_system ON old_system.user_id = new_system.user_id
WHERE old_system.badge_count != new_system.badge_count;
```

**Result:** 12 mismatches out of 10,000 users (0.12% drift)

**Kenji (in Slack):**

> "@priya - shadow-write metrics look good at 5%. One thing: I'm seeing 0.12% data drift (12 users out of 10k). Is that expected?"

**Priya:**

> "Ah, yeah - there's a known issue with users who have >10 badges. The old system caps at 10, the new one doesn't. Let me add a note to the migration doc that this is expected."

**Kenji:**

> "Got it. So not a bug, just a known difference. I'll note that in on the epic. Ready to go to 20%?"

**Priya:**

> "Yep, bumping now."

**No comprehensive test plan. No manual testing. Just metrics and a quick conversation about data drift.**

---

## Week 2-3: Before Read Path Flip (Kenji Writes Regression Test Plan)

Metrics show shadow-writes are working at 20%. Before Priya flips the read path, Kenji writes a **targeted regression test plan** specifically for badges.

**Kenji (opens Claude):**

> "I'm a QA analyst. We're about to flip the read path for a badge migration - users will start reading badge data from a new service instead of the old one. This is a high-risk change.
>
> Help me write a focused regression test plan. I don't need every edge case - I need the critical flows that would cause a user-facing incident if broken. What should I test?"

**Claude's response:**

> Here's a focused regression test plan for badge read path migration:
>
> **Critical User Flows (Must Test)**
> 1. Badge display on profile page (web, iOS, Android)
> 2. Badge tooltips show correct descriptions
> 3. Multiple badges render correctly (test user with 1, 3, 5+ badges)
> 4. Users with no badges don't see errors
> 5. Badge icons load correctly
>
> **Data Integrity (Must Validate)**
> 6. Verified users show "Verified" badge
> 7. Pro users show "Pro Member" badge
> 8. Early adopters show "Early Adopter" badge
> 9. Badge counts match between old and new system
>
> **Error Handling (Must Not Break)**
> 10. Profile page still loads if badge service is slow
> 11. Profile page still loads if badge service returns error
> 12. Graceful degradation: missing badge data doesn't crash page
>
> **Rollback Validation**
> 13. Feature flag can instantly switch back to old system

**Kenji:**

> "Perfect. 13 test cases - I'm going to trust the process and not add more for now. I'll run these at 5% and 50% rollout."

Kenji documents this in a shared doc: **Badge Migration - Regression Test Plan**

---

## Week 3: Read Path Flip at 5% (Kenji Runs Regression Tests)

Priya flips the read path at 5%. Users are now reading from the new system, but still writing to both.

**Kenji (checking metrics first):**
- **Read success rate:** 99.95% ✅
- **Read latency:** 92ms ✅
- **Frontend badge rendering errors:** No increase ✅

**Kenji (thinking):**

> "Metrics look good. Now let me run the regression test plan to validate the critical flows."

**Kenji (enables flag for his own account and starts testing):**

### Test Results (5% Rollout)

1. ✅ Badge display on profile page (web) - PASS
2. ✅ Badge tooltips show correct descriptions - PASS
3. ✅ Multiple badges render correctly - PASS
4. ✅ Users with no badges don't see errors - PASS
5. ✅ Badge icons load correctly - PASS
6. ✅ Verified users show "Verified" badge - PASS
7. ✅ Pro users show "Pro Member" badge - PASS
8. ✅ Early adopters show "Early Adopter" badge - PASS
9. ⚠️ **Badge counts match** - FAIL (12 users have mismatches)
10. ✅ Profile page loads if badge service slow - PASS
11. ✅ Profile page loads if badge service errors - PASS
12. ⚠️ **Graceful degradation** - ISSUE FOUND: One test user has "null" badge

**Kenji (in Slack):**

> "@priya - ran the regression test plan at 5%. Found two issues:
> 1. Badge count mismatch for 12 users (test case #9)
> 2. Test user 'qa_test_user_3' has a null badge showing up (test case #12)
> 
> Metrics look good, but these edge cases need attention before we go to 20%."

**Priya:**

> "Issue #1 is expected - that's the thing we talked about earlier with the old system capping at 10.
> 
> Issue #2 is a real bug. Let me add a filter for null badges in the migration script."

**20 minutes later:**

**Priya:**

> "Fixed the null badge bug. Can you re-test?"

**Kenji:**

> "Re-tested test case #12 - null badge is gone. Updating test case #9 to document the expected mismatch. All tests passing now. Ready for 20%."

**Key difference:** Kenji used a **targeted 13-case regression test plan** to find real issues, not a comprehensive 50-case plan written before development started.

---

## Week 3: Rollout to 20% → 50%

Metrics at 20% look good. Priya bumps to 50%.

**Kenji (checking metrics):**
- **Read success rate:** 99.96% ✅
- **Read latency:** 87ms (target: <100ms) ✅
- **Frontend badge rendering errors:** No increase ✅

**Kenji (thinking):**

> "Metrics look good. Let me spot-check a few regression tests at 50% to make sure nothing regressed with the larger rollout. I don't need to run all 13 - just the critical ones."

**Kenji (runs spot-check regression tests):**

1. ✅ Badge display on profile page (web, iOS) - PASS
2. ✅ Multiple badges render correctly - PASS
3. ✅ Graceful degradation: profile loads even if badge service slow - PASS
4. ✅ Rollback validation: flag can instantly switch back - PASS

**Kenji (in Slack):**

> "50% looks clean. Metrics good, spot-check regression tests passing. Ready for 100%?"

**Priya:**

> "Let's give it 24 hours at 50%, then go to 100%."

**Next day:**

**Kenji (checking metrics one more time):**

> "24 hours at 50%, no issues. Metrics stable, no new errors. Let's go to 100%."

Priya flips to 100%. Badges are now fully migrated.

**Kenji (final regression validation):**

Kenji runs a quick smoke test on production with 100% rollout:
- ✅ Badge display working
- ✅ No errors in monitoring
- ✅ Data validation query shows <0.1% drift (expected)

**Kenji marks the phase complete:** "Badge migration validated. Read path at 100%, ready to remove shadow-writes."

---

## Week 4-5: Repeat for Preferences (New Regression Test Plan)

Priya is ready to migrate preferences (notification settings, theme preferences, language preferences).

**Kenji (thinking):**

> "Preferences are different from badges. The critical flows are different. I need a new targeted regression test plan."

**Kenji (uses Claude again):**

> "We're migrating user preference data (notifications, theme, language) from old service to new service. What critical flows should I test in the regression plan?"

**Claude generates a focused 12-case test plan for preferences:**

1. User can view their notification preferences
2. User can update notification preferences (save works)
3. Notification emails respect user preferences
4. Theme preference (light/dark) persists correctly
5. Language preference loads correct translations
6. Default preferences assigned to new users
7. Empty preferences don't crash settings page
8. Bulk preference updates don't lose data
9. Old preference values migrated correctly
10. Preferences sync across devices (web + mobile)
11. Profile loads even if preference service slow
12. Feature flag can rollback instantly

**Kenji:**

> "Perfect. 12 tests specific to preferences. Not just copy-pasting the badge test plan."

**Timeline:**
- Week 4: Shadow-write at 5% → validate metrics → Kenji runs regression tests at 5%
- Week 5: Flip read path at 5% → 20% → 50% → 100%, Kenji spot-checks at 50%
- Result: Zero incidents, all regression tests passing

---

## Week 6: Final Entity (Profile Data)

Same pattern, same metrics, same gradual rollout.

**Kenji (final validation):**

> "All three entities migrated. Old system is now idle. Monitoring for 1 week before we delete the old service."

**1 week later:**

**Kenji:**

> "Old system has been idle for a week. Zero writes, zero reads. Safe to delete."

Priya deletes the old service. Migration complete.

---

## Reflection: What Changed for QA?

Kenji sits down to reflect on how this project felt different from the old way.

### Old Way: Comprehensive Test Plan Upfront
- **Effort:** 2 days upfront to write 50-case test plan covering all 4 services
- **Timing:** Written as a big batch before or after development. Not really integrated as part of the dev process
- **Validation:** 2 weeks at the end, executing test plan on Test
- **When tests ran:** Once, at the very end, on Test
- **Test plan accuracy:** Outdated by the time testing happened (Priya changed approach 3 times)
- **Risk:** High - testing happened after all the work was done
- **Relationship:** QA as gatekeeper at the end

### New Way: Metrics + Targeted Regression Tests Per Phase
- **Effort:** 1 day upfront to define metrics, then ~2 hours per entity to write targeted regression test plan
- **Timing:** Metrics defined upfront, regression tests written right before each risky phase
- **Validation:** Ongoing - metrics monitored continuously, regression tests run at 5% and 50% rollouts
- **When tests ran:** Multiple times throughout the project (at each entity migration)
- **Test plan accuracy:** High - tests written when Kenji understood the actual edge cases
- **Risk:** Low - each phase validated before moving forward, instant rollback available
- **Relationship:** QA as strategic partner throughout

---

## Key Insight: Regression Testing Still Matters

**Kenji (reflecting):**

> "This seems like it went pretty well. It's still hard to let test cases I COULD have run go undone, but I think the way I did it was a good start at the new way we're being asked to do:
>
> **Targeted regression tests written at the right time.**
>
> For badges, I wrote a 13-case regression test plan right before the read path flip - the highest-risk moment. I didn't write it 6 weeks earlier when I would have been guessing at edge cases and I didn't wait until the very end to test everything. I was able to keep context small and built-in for each plan.
>
> For preferences, I wrote a different 12-case regression test plan specific to that entity.
>
> Total: 25 test cases across the whole project, written when I had context, run multiple times at key rollout points.
>
> Old way: 50 test cases written upfront, many irrelevant, run once at the end.
>
> New way: 25 test cases written just-in-time, highly relevant, run at 5%, 50%, and 100%.
>
> **Metrics told me 'is it working?' Regression tests told me 'did I miss anything critical?'**
>
> Both matter. They're complementary."


---

**Old way blocked:**
- "Not ready to ship - 5 test cases still failing on staging"

**New way leads:**
- "Metrics look good at 50%, regression tests passing. Ready for 100%?"
- "Found null badge bug in test case #12 - needs fix before we go to 20%"
- "Badge count mismatch is expected (old system caps at 10). Documenting in test plan."

---

## The Old QA Artifacts (Updated)

Looking back at the old QA methodology, here's how it maps to the new way:

### Stage 1: Epic Intake
**Old artifact:** Comprehensive test plan (50+ test cases covering all scenarios)  
**New artifact:** 
1. Confidence metrics per phase (what does "safe" look like?)
2. Plan to write targeted regression test plans just-in-time (not upfront)

**Old question:** "What are all the things I need to test before we ship?"  
**New question:** "What signals tell us each phase is working? What critical flows need regression testing at risky moments?"

---

### Stage 2: Development & Testing
**Old activity:** Wait until "Ready for QA," then execute 50-case test plan on staging
**New activity:** 
1. Monitor metrics continuously (shadow-write success, read latency, error rates)
2. Write targeted regression test plan before each risky phase
3. Run regression tests at 5% and 50% rollouts on production

**Old artifact:** Test execution log (45/50 passed)  
**New artifact:** 
1. Metrics dashboard (99.92% shadow-write success, 99.96% read success)
2. Targeted regression test results (13/13 passed at 5%, spot-check at 50%)
3. Data validation queries (badge count drift analysis)

---

### Stage 3: Sign-off
**Old artifact:** Feature signoff document ("I tested everything, ready to ship")  
**New artifact:** Per-phase validation summary:
- "Shadow-writes validated at 20%, metrics good, ready to flip read path"
- "Read path at 50%, metrics good + regression tests passing, ready for 100%"
- "Read path at 100%, final smoke test passing, ready to remove shadow-writes"

**Old question:** "Is this ready to ship?"  
**New question:** "What do the metrics + regression tests tell us at this rollout stage? Ready for next phase?"

---

## Kenji's Advice for Large Projects

> "For big refactors or migrations, the old 'write a comprehensive test plan as the final gate' approach doesn't work well. The plan becomes outdated even as the dev fixes issues we find, you can't test until the end, and the risk is massive.
> 
> The new way is lets us build confidence together the whole time:
> 
> 1. **Define success metrics per phase** (not comprehensive test cases upfront)
> 2. **Write targeted regression test plans just-in-time** (right before risky phases, not 6 weeks early)
> 3. **Run regression tests multiple times** (at 5%, 50%, 100% - not once at the end)
> 4. **Combine metrics + testing** (metrics for continuous signal, tests for high-confidence validation)
> 5. **Test on production with flags** (real data, gradual rollout, instant rollback)
> 6. **Partner with engineers throughout** (don't wait until the end)
> 
> This doesn't mean 'less testing.' It actually means **more testing** - I ran 25 tests across the project (vs. 50 in the old way), but I ran them multiple times at key moments, on production, with real data. And they were accurate because I wrote them when I understood the actual edge cases.
> 
> **Regression testing still matters. Just do it at the right time, with the right scope.**"

---

## Timeline Comparison

**Old way:**
- Week 0: Write test plan (2 days)
- Week 1-6: Wait for development
- Week 7-8: Execute test plan on staging (2 weeks)
- Week 9: Big-bang deploy, hold your breath

**Total: 9 weeks, high risk**

---

**New way:**
- Week 0: Define confidence metrics (1 day)
- Week 1: Validate instrumentation (stub service)
- Week 2: Validate shadow-write metrics at 5% → 20%
- Week 3: Validate read path at 5% → 20% → 50% → 100%
- Week 4: Remove shadow-writes, validate idle old system
- Week 5-6: Repeat for other entities

**Total: 6 weeks, low risk, continuous validation**

---

**Next:** Review the key principles that tie all these stories together.
