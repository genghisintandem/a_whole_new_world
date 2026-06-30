// Animation Components for Role Transition Guide

// JIRA Board Animation
function createJiraBoard(columns, cardText, flowPath) {
    const board = document.createElement('div');
    board.className = 'jira-board';

    // Create all columns
    const columnElements = {};
    columns.forEach((columnName) => {
        const column = document.createElement('div');
        column.className = 'jira-column';
        column.dataset.column = columnName;

        const header = document.createElement('div');
        header.className = 'jira-column-header';
        header.textContent = columnName;
        column.appendChild(header);

        board.appendChild(column);
        columnElements[columnName] = column;
    });

    // Create the card
    const card = document.createElement('div');
    card.className = 'jira-card jira-card-animated';
    card.textContent = cardText;

    // Animate card through the flow path
    let currentStep = 0;

    function moveCard() {
        if (currentStep < flowPath.length) {
            const targetColumn = flowPath[currentStep];
            const column = columnElements[targetColumn];

            // Remove card from previous location
            if (card.parentElement) {
                card.parentElement.removeChild(card);
            }

            // Add to new column with animation
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            column.appendChild(card);

            // Trigger animation
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 50);

            currentStep++;

            // Continue to next step after delay
            if (currentStep < flowPath.length) {
                setTimeout(moveCard, 2000);
            } else {
                // Final state - add active pulse
                card.classList.add('active');
            }
        }
    }

    // Start animation after a short delay
    setTimeout(moveCard, 500);

    return board;
}

// Chat Interface Animation
function createChatInterface(messages) {
    const chat = document.createElement('div');
    chat.className = 'chat-interface';

    messages.forEach((msg, index) => {
        // Check if this is a narrative note
        if (msg.type === 'note') {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'chat-note';
            noteDiv.style.animationDelay = `${index * 0.2}s`;
            noteDiv.textContent = msg.content;
            chat.appendChild(noteDiv);
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${msg.type}`;
        messageDiv.style.animationDelay = `${index * 0.2}s`;

        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        if (msg.type === 'user') {
            avatar.textContent = msg.avatar || 'P';
        } else if (msg.type === 'ai-validator') {
            avatar.textContent = 'GPT';
        } else {
            avatar.textContent = 'AI';
        }

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        if (msg.iteration) {
            const label = document.createElement('div');
            label.className = 'chat-iteration-label';
            label.textContent = msg.iteration;
            bubble.appendChild(label);
        }

        if (msg.code) {
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.textContent = msg.content;
            pre.appendChild(code);
            bubble.appendChild(pre);
        } else {
            const text = document.createElement('p');
            text.textContent = msg.content;
            text.style.margin = '0';
            bubble.appendChild(text);
        }

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
        chat.appendChild(messageDiv);
    });

    return chat;
}

// Timeline Animation
function createTimeline(events) {
    const timeline = document.createElement('div');
    timeline.className = 'timeline';

    events.forEach((event, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.style.animationDelay = `${index * 0.15}s`;

        const content = document.createElement('div');
        content.className = 'timeline-content';

        const week = document.createElement('div');
        week.className = 'timeline-week';
        week.textContent = event.week;

        const title = document.createElement('div');
        title.className = 'timeline-title';
        title.textContent = event.title;

        const description = document.createElement('div');
        description.className = 'timeline-description';
        description.textContent = event.description;

        content.appendChild(week);
        content.appendChild(title);
        content.appendChild(description);

        const marker = document.createElement('div');
        marker.className = 'timeline-marker';

        item.appendChild(content);
        item.appendChild(marker);
        timeline.appendChild(item);
    });

    return timeline;
}

// Comparison Flow Animation
function createComparisonFlow(oldWay, newWay) {
    const container = document.createElement('div');
    container.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin: 2rem 0;';

    const oldCard = createFlowCard('Old Way', oldWay, 'badge-old-way');
    const newCard = createFlowCard('New Way', newWay, 'badge-new-way');

    container.appendChild(oldCard);
    container.appendChild(newCard);

    return container;
}

function createFlowCard(title, steps, badgeClass) {
    const card = document.createElement('div');
    card.style.cssText = 'background: white; border: 1px solid var(--color-border); border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05);';

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;';

    const badge = document.createElement('span');
    badge.className = `badge ${badgeClass}`;
    badge.textContent = title;

    header.appendChild(badge);
    card.appendChild(header);

    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.style.cssText = 'display: flex; gap: 1rem; margin-bottom: 1rem; animation: messageSlideIn 0.4s ease-out; animation-delay: ' + (index * 0.1) + 's; opacity: 0; animation-fill-mode: forwards;';

        const number = document.createElement('div');
        number.style.cssText = 'width: 24px; height: 24px; border-radius: 50%; background: var(--color-surface); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; flex-shrink: 0; color: var(--color-text-muted);';
        number.textContent = index + 1;

        const text = document.createElement('div');
        text.style.cssText = 'flex: 1; font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5;';
        text.textContent = step;

        stepDiv.appendChild(number);
        stepDiv.appendChild(text);
        card.appendChild(stepDiv);
    });

    return card;
}

// Setup Intersection Observer for scroll-triggered animations
let animationObserverInstance = null;

function setupScrollAnimations() {
    // Disconnect existing observer
    if (animationObserverInstance) {
        animationObserverInstance.disconnect();
    }

    // Create new observer
    animationObserverInstance = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // For chat messages, stagger their appearance
                if (entry.target.classList.contains('chat-interface')) {
                    const messages = entry.target.querySelectorAll('.chat-message, .chat-note');
                    messages.forEach((msg, index) => {
                        setTimeout(() => {
                            msg.style.opacity = '1';
                            msg.style.animation = `messageSlideIn 0.4s ease-out forwards`;
                        }, index * 200);
                    });
                }
                // For timeline items
                if (entry.target.classList.contains('timeline')) {
                    const items = entry.target.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.animation = `timelineSlideIn 0.6s ease-out forwards`;
                        }, index * 150);
                    });
                }
                // For comparison cards
                if (entry.target.querySelector('.badge-old-way, .badge-new-way')) {
                    const steps = entry.target.querySelectorAll('[style*="animation-delay"]');
                    steps.forEach(step => {
                        step.style.opacity = '1';
                        step.style.animationPlayState = 'running';
                    });
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Observe all animation containers
    const animatedElements = document.querySelectorAll('.chat-interface, .timeline, [data-animation]');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        animationObserverInstance.observe(el);
    });
}

// Auto-inject animations based on special markers in content
function initializeAnimations() {
    const content = document.getElementById('content');
    if (!content) return;

    // Look for special comment markers in the HTML
    // Example: <!-- JIRA_BOARD: maya-old-way -->

    // Maya's JIRA Board (Old Way)
    const mayaJiraMarker = content.querySelector('[data-animation="maya-jira"]');
    if (mayaJiraMarker) {
        const board = createJiraBoard(
            ['Backlog', 'In Progress', 'Blocked', 'PR Review', 'In QA', 'In Regression', 'Done'],
            'ENG-2847: Display Badges on iOS',
            ['Backlog', 'In Progress', 'Blocked', 'In Progress', 'PR Review', 'In QA', 'In Regression', 'Done']
        );
        mayaJiraMarker.replaceWith(board);
    }

    // Patrick's JIRA Board (New Way)
    const patrickJiraMarker = content.querySelector('[data-animation="patrick-jira"]');
    if (patrickJiraMarker) {
        const board = createJiraBoard(
            ['Backlog', 'In Progress', 'PR Review', 'Merged to Trunk', 'Done'],
            'ENG-2901: Badges (Flag: OFF)',
            ['Backlog', 'In Progress', 'PR Review', 'Merged to Trunk', 'Done']
        );
        patrickJiraMarker.replaceWith(board);
    }

    // Patrick's Chat Interface (React/Frontend)
    const patrickChatMarker = content.querySelector('[data-animation="patrick-chat"]');
    if (patrickChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 1',
                content: 'Help me add badge support to our user profiles. Start with a React component and mock data. We use React 18 and TypeScript.'
            },
            {
                type: 'ai',
                content: '// ProfileBadge.tsx\nexport function ProfileBadge({ badges }: ProfileBadgeProps) {\n  const variantStyles = {\n    verified: \'bg-blue-100 text-blue-800\',\n    ...\n  };\n  return <div>...</div>;\n}',
                code: true
            },
            {
                type: 'note',
                content: '💡 Patrick spots an issue: component uses Tailwind colors, but team uses design system tokens'
            },
            {
                type: 'user',
                iteration: 'Prompt 2 (Refinement)',
                content: 'Make it work with our existing design system tokens. We use CSS variables like --color-badge-verified-bg. Also, wrap this in a feature flag so we can ship it dark.'
            },
            {
                type: 'ai',
                content: '// ProfileBadge.tsx (updated)\nimport { useFeatureFlag } from \'@/hooks/useFeatureFlag\';\n\nexport function ProfileBadge({ badges }) {\n  const isBadgesEnabled = useFeatureFlag(\'profile-badges\');\n  if (!isBadgesEnabled) return null;\n  ...\n}',
                code: true
            },
            {
                type: 'user',
                content: '✓ Perfect! This uses our design system and has the feature flag built in.'
            }
        ]);
        patrickChatMarker.replaceWith(chat);
    }

    // Patrick's Backend Chat Interface
    const patrickBackendChatMarker = content.querySelector('[data-animation="patrick-backend-chat"]');
    if (patrickBackendChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 3 (Backend Help)',
                content: 'I need to add badge data to our Java backend API. We have a User service at GET /users/{id}. Can you look in the backend-services repo for how to add a "badges" array to the User model and API response?'
            },
            {
                type: 'ai',
                content: '// User.java (Model)\npublic class User {\n  private String id;\n  private String name;\n  private String email;\n  private List<Badge> badges; // NEW\n}\n\n// Badge.java (New Model)\npublic class Badge {\n  private String id;\n  private String label;\n  private String variant;\n}\n\n// UserService.java\npublic User getUserById(String userId) {\n  // Mock badge data for now\n  ...\n}',
                code: true
            },
            {
                type: 'user',
                content: '✓ Makes sense. Why did you use a separate Badge class instead of just strings?'
            },
            {
                type: 'ai',
                content: 'A Badge class gives you flexibility for future fields (like icons, descriptions, colors) without breaking the API. It\'s also more type-safe than strings.'
            },
            {
                type: 'user',
                content: 'Got it. I\'ll pair with Priya to review before merging.'
            }
        ]);
        patrickBackendChatMarker.replaceWith(chat);
    }

    // Patrick's Iteration Chat Interface (Vignette 3)
    const patrickIterationChatMarker = content.querySelector('[data-animation="patrick-iteration-chat"]');
    if (patrickIterationChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 1 (Planning)',
                content: 'I need to iterate on our badge feature based on user feedback. Users want tooltips, i18n, and a "+N more" indicator. What\'s the right order to tackle these?'
            },
            {
                type: 'ai',
                content: 'Suggested order:\n1. i18n - foundational\n2. Tooltips - explains badges\n3. "+N more" indicator - polish\n\nWhat i18n library do you use?'
            },
            {
                type: 'user',
                content: 'We use react-i18next. Keys in public/locales/{lang}/common.json. Also, we have a Tooltip component at @/components/Tooltip.'
            },
            {
                type: 'ai',
                iteration: 'Prompt 2 (Refactoring)',
                content: '// ProfileBadge.tsx\nimport { useTranslation } from \'react-i18next\';\nimport { Tooltip } from \'@/components/Tooltip\';\n\nexport function ProfileBadge({ badges }) {\n  const { t } = useTranslation();\n  return (\n    <Tooltip content={t(`badge.${variant}.description`)}>\n      <span>{t(`badge.${variant}.label`)}</span>\n    </Tooltip>\n  );\n}',
                code: true
            },
            {
                type: 'note',
                content: '💡 Patrick notices: we\'re using the old Tooltip API - it was updated last month'
            },
            {
                type: 'user',
                iteration: 'Prompt 3 (Correction)',
                content: 'Actually, our Tooltip was updated. New API uses <Tooltip.Trigger> and <Tooltip.Content>. Can you update?'
            },
            {
                type: 'ai',
                content: '// ProfileBadge.tsx (corrected)\n<Tooltip>\n  <Tooltip.Trigger>\n    <span>{t(`badge.${variant}.label`)}</span>\n  </Tooltip.Trigger>\n  <Tooltip.Content>\n    {t(`badge.${variant}.description`)}\n  </Tooltip.Content>\n</Tooltip>',
                code: true
            },
            {
                type: 'user',
                content: '✓ Perfect! Now let me add the translation keys.'
            }
        ]);
        patrickIterationChatMarker.replaceWith(chat);
    }

    // Priya's Timeline
    const priyaTimelineMarker = content.querySelector('[data-animation="priya-timeline"]');
    if (priyaTimelineMarker) {
        const timeline = createTimeline([
            {
                week: 'Week 1',
                title: 'Plan & Scaffold',
                description: 'AI-assisted planning, created Epic, built service stub (4 days)'
            },
            {
                week: 'Week 2',
                title: 'Shadow-Write Badges',
                description: 'Dual-write to old and new systems, add metrics'
            },
            {
                week: 'Week 3',
                title: 'Flip Read Path',
                description: 'Gradual rollout: 5% → 50% → 100%'
            },
            {
                week: 'Week 4',
                title: 'Remove Shadow-Writes',
                description: 'Badges fully migrated to new system'
            },
            {
                week: 'Week 5',
                title: 'Migrate Preferences',
                description: 'Shadow-write → flip read → remove shadow'
            },
            {
                week: 'Week 6',
                title: 'Migrate Profile Data',
                description: 'Final entity migration complete'
            }
        ]);
        priyaTimelineMarker.replaceWith(timeline);
    }

    // Comparison flows (Vignette 2)
    const comparisonMarker = content.querySelector('[data-animation="comparison"]');
    if (comparisonMarker) {
        const comparison = createComparisonFlow(
            [
                'Sprint planning: receive detailed spec, designs, API contract',
                'Wait for backend team to deliver API changes (2 days blocked)',
                'Build pixel-perfect implementation with all edge cases',
                '2 rounds of PR review (architecture, accessibility, edge cases)',
                'Full QA testing cycle across devices',
                'Fix QA bug, re-test',
                'Ship to 100% in app release (3 weeks total)'
            ],
            [
                'See user feedback, create lightweight ticket',
                'Build React component with AI (uses design system, feature flag)',
                'Draft backend changes with AI, pair with backend engineer to review',
                'AI code review + 1 round human review',
                'Merge to main behind flag (5 days total)',
                'Consult QA on what to test, test it yourself',
                'Enable for test users, iterate based on feedback'
            ]
        );
        comparisonMarker.replaceWith(comparison);
    }

    // Comparison flows (Vignette 3 - Balanced)
    const comparisonBalancedMarker = content.querySelector('[data-animation="comparison-balanced"]');
    if (comparisonBalancedMarker) {
        const comparison = createComparisonFlow(
            [
                'Build complete feature with all polish upfront',
                'i18n, tooltips, edge cases all included from day 1',
                'Multiple rounds of review',
                'Full QA test cycle',
                'Single deploy to 100% of users',
                'Hope users like what you built'
            ],
            [
                'Ship scrappy version behind flag (5 days)',
                'Get real user feedback (tooltips needed, i18n missing)',
                'Iterate based on actual user requests (2 days)',
                'AI review + human review',
                'Gradual rollout: 5% → 20% → 50% → 100%',
                'Polish based on evidence, not guesswork'
            ]
        );
        comparisonBalancedMarker.replaceWith(comparison);
    }

    // Comparison flow (Vignette 4 - Large Architecture)
    const comparisonLargeArchMarker = content.querySelector('[data-animation="comparison-large-arch"]');
    if (comparisonLargeArchMarker) {
        const comparison = createComparisonFlow(
            [
                'Create long-lived feature branch (6-8 weeks)',
                'Build entire new service in isolation',
                'Migrate all data at once',
                'Big-bang deploy after 2 months',
                'Massive merge conflicts inevitable',
                'Extremely high rollback risk',
                'Other engineers blocked during refactor'
            ],
            [
                'Break into 8 merge-able chunks',
                'Build stub service first (Week 1)',
                'Shadow-write → flip reads → remove shadow (per entity)',
                'Merge to main every week',
                'Feature flags enable instant rollback',
                'Zero production incidents during migration',
                'Team keeps working, coordinates as needed'
            ]
        );
        comparisonLargeArchMarker.replaceWith(comparison);
    }

    // Kenji's QA Comparison (Vignette 6)
    const comparisonKenjiMarker = content.querySelector('[data-animation="comparison-kenji"]');
    if (comparisonKenjiMarker) {
        const comparison = createComparisonFlow(
            [
                'QA receives "done" features',
                'Testing happens in lower environments (staging, QA)',
                'QA writes and executes test plans',
                'QA says "yes ship" or "no bugs found"',
                'QA is the bottleneck and gatekeeper',
                'Manual testing is the source of confidence',
                'Value: catching bugs before production'
            ],
            [
                'QA involved from planning stage',
                'Testing happens in production (behind flags)',
                'QA defines success metrics and observability',
                'QA asks "what signals give us confidence?"',
                'QA is a consultant and guide',
                'Data + gradual rollout is the source of confidence',
                'Value: enabling fast, confident iteration'
            ]
        );
        comparisonKenjiMarker.replaceWith(comparison);
    }

    // Priya's Architecture Diagrams
    const priyaBeforeMarker = content.querySelector('[data-animation="priya-architecture-before"]');
    if (priyaBeforeMarker) {
        const diagram = createArchitectureDiagram('before');
        priyaBeforeMarker.replaceWith(diagram);
    }

    const priyaAfterMarker = content.querySelector('[data-animation="priya-architecture-after"]');
    if (priyaAfterMarker) {
        const diagram = createArchitectureDiagram('after');
        priyaAfterMarker.replaceWith(diagram);
    }

    // Priya's Chat Interfaces
    const priyaPlanningChatMarker = content.querySelector('[data-animation="priya-planning-chat"]');
    if (priyaPlanningChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 1 (Strategy)',
                content: 'I\'m refactoring scattered user metadata across 4 microservices into one. This feels too big to do in one PR. How do I plan a chunked delivery strategy that keeps main stable and allows rollbacks?'
            },
            {
                type: 'ai',
                content: 'Use the "Strangler Fig" pattern:\n\nPhase 1: Build new service (empty)\nPhase 2: Migrate one entity at a time\n  - Shadow-write to both systems\n  - Read from old (rollback-safe)\nPhase 3: Flip read path to new\nPhase 4: Remove shadow-writes\n\nEach phase = separate PR. Use feature flags for control.',
                code: true
            },
            {
                type: 'user',
                content: '✓ Perfect. Let me break this into JIRA tickets.'
            }
        ]);
        priyaPlanningChatMarker.replaceWith(chat);
    }

    const priyaScaffoldingChatMarker = content.querySelector('[data-animation="priya-scaffolding-chat"]');
    if (priyaScaffoldingChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 2 (Scaffolding)',
                content: 'Generate a Spring Boot service stub for "User Metadata Service". REST API with endpoints for badges, preferences, profile. PostgreSQL database with JPA/Hibernate. Docker setup. Health check endpoint. LaunchDarkly feature flags.'
            },
            {
                type: 'ai',
                content: 'Before I generate this, a few questions:\n\n1. Do you have existing services I should match for consistency?\n2. What\'s your observability setup? (Datadog, New Relic, etc.)\n3. Should I include database migration scripts (Flyway/Liquibase)?'
            },
            {
                type: 'user',
                content: 'Good questions. Yes - look at BadgeService for our standard structure. We use Datadog for metrics. Include Flyway migrations with a baseline schema.'
            },
            {
                type: 'ai',
                content: '// UserMetadataController.java\n@RestController\n@RequestMapping("/api/user-metadata")\npublic class UserMetadataController {\n  @GetMapping("/{userId}/badges")\n  public ResponseEntity<BadgeResponse> getBadges(...) {\n    return ResponseEntity.ok(new BadgeResponse());\n  }\n}\n\n// DatadogMetrics.java\n// Flyway migration: V1__baseline_schema.sql\n// Docker-compose with Postgres...',
                code: true
            },
            {
                type: 'user',
                content: '✓ Perfect. This matches our conventions and includes everything I need.'
            }
        ]);
        priyaScaffoldingChatMarker.replaceWith(chat);
    }

    const priyaShadowWriteChatMarker = content.querySelector('[data-animation="priya-shadow-write-chat"]');
    if (priyaShadowWriteChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 3 (Shadow-Write)',
                content: 'Add shadow-write logic for badges. BadgeService should write to old `badges` table AND new `user_badges` table. Control with feature flag. Reads still from old table.'
            },
            {
                type: 'ai',
                content: '// BadgeService.java\npublic void createBadge(String userId, Badge badge) {\n  // Primary write (old system)\n  badgeRepository.save(badge);\n  \n  // Shadow write (new system)\n  if (featureFlags.isEnabled("shadow_write")) {\n    try {\n      userMetadataClient.createBadge(userId, badge);\n    } catch (Exception e) {\n      log.error("Shadow write failed", e);\n    }\n  }\n}',
                code: true
            },
            {
                type: 'user',
                content: 'Good. I\'ll add metrics to monitor shadow-write success rate.'
            }
        ]);
        priyaShadowWriteChatMarker.replaceWith(chat);
    }

    // Priya's Pressure Testing (Different AI Model)
    const priyaPressureTestPlanMarker = content.querySelector('[data-animation="priya-pressure-test-plan"]');
    if (priyaPressureTestPlanMarker) {
        const chat = createChatInterface([
            {
                type: 'note',
                content: '🔄 Priya switches to GPT-4 to validate the approach'
            },
            {
                type: 'user',
                content: 'I\'m planning to use the Strangler Fig pattern to migrate 4 microservices into one. Shadow-write, flip reads, remove shadow-writes, repeat. What could go wrong with this approach?'
            },
            {
                type: 'ai-validator',
                content: 'Key risks:\n\n1. Data consistency during shadow-write phase - what if writes partially fail?\n2. Performance impact of dual-writes under load\n3. Schema drift between old and new systems\n4. How long will shadow-write phase run? Data storage costs double.\n\nMitigation: Add reconciliation jobs, load test shadow-writes, set a deadline for each phase.'
            },
            {
                type: 'user',
                content: 'Good catches. I\'ll add: reconciliation cron job, load testing before prod rollout, and 2-week max per shadow-write phase.'
            }
        ]);
        priyaPressureTestPlanMarker.replaceWith(chat);
    }

    const priyaPressureTestCodeMarker = content.querySelector('[data-animation="priya-pressure-test-code"]');
    if (priyaPressureTestCodeMarker) {
        const chat = createChatInterface([
            {
                type: 'note',
                content: '🔄 Priya switches to GPT-4 to review the shadow-write code'
            },
            {
                type: 'user',
                content: 'Review this shadow-write logic for production readiness. What edge cases am I missing?'
            },
            {
                type: 'ai-validator',
                content: 'Concerns:\n\n1. Exception swallowing - you log but don\'t alert on failures\n2. No circuit breaker - if new service is down, you\'ll hammer it\n3. No retry logic for transient failures\n4. Race condition: what if old system write succeeds but shadow-write fails, then user immediately reads?\n\nAdd: alerting thresholds, circuit breaker pattern, exponential backoff retries.'
            },
            {
                type: 'user',
                content: '✓ Excellent points. Adding circuit breaker, PagerDuty alerts on >5% failure rate, and 3 retries with backoff.'
            }
        ]);
        priyaPressureTestCodeMarker.replaceWith(chat);
    }

    const priyaReadPathChatMarker = content.querySelector('[data-animation="priya-read-path-chat"]');
    if (priyaReadPathChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 4 (Read Path Toggle)',
                content: 'Now I want to flip the read path. When user_metadata_badges_read flag is enabled, BadgeService should:\n1. Read from UserMetadataService (new system)\n2. Fall back to old `badges` table if the new system fails\n\nGenerate the read path logic with fallback.'
            },
            {
                type: 'ai',
                content: '// BadgeService.java (updated)\npublic List<Badge> getBadges(String userId) {\n  if (featureFlags.isEnabled("user_metadata_badges_read")) {\n    try {\n      return userMetadataClient.getBadges(userId);\n    } catch (Exception e) {\n      log.error("Read from UserMetadataService failed, falling back to old system", e);\n      return badgeRepository.findByUserId(userId);\n    }\n  } else {\n    return badgeRepository.findByUserId(userId);\n  }\n}',
                code: true
            }
        ]);
        priyaReadPathChatMarker.replaceWith(chat);
    }

    // Genghis's Bad Prompting
    const genghisChatMarker = content.querySelector('[data-animation="genghis-bad-prompt"]');
    if (genghisChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                iteration: 'Prompt 1 (Vague and Rushed)',
                content: 'Add a new user badge to the backend'
            },
            {
                type: 'ai',
                content: '// BadgeService.java\npublic List<Badge> getBadges(String userId) {\n    User user = userRepository.findById(userId);\n    List<Badge> badges = badgeRepository.findByUserId(userId);\n    \n    // Add "New User" badge for accounts less than 30 days old\n    LocalDate createdDate = user.getCreatedDate();\n    LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);\n    \n    if (createdDate.isAfter(thirtyDaysAgo)) {\n        badges.add(new Badge("new_user", "New User", "newUser"));\n    }\n    \n    return badges;\n}',
                code: true
            },
            {
                type: 'note',
                content: '💥 Genghis barely reads the output and immediately approves it'
            }
        ]);
        genghisChatMarker.replaceWith(chat);
    }

    // Kenji's Edge Cases Chat Interface
    const kenjiEdgeCasesChatMarker = content.querySelector('[data-animation="kenji-edge-cases-chat"]');
    if (kenjiEdgeCasesChatMarker) {
        const chat = createChatInterface([
            {
                type: 'user',
                avatar: 'K',
                iteration: 'Prompt 1',
                content: 'I\'m a QA analyst. We\'re building a user badge feature that displays badges on profile pages. The backend returns a list of badge objects (type, label, icon). The frontend renders them. What edge cases should I test?'
            },
            {
                type: 'ai',
                content: 'Here are edge cases to consider:\n\n1. Empty badge list - User has no badges\n2. Missing fields - Backend returns badge with missing icon or label\n3. Invalid badge type - Backend returns a badge type the frontend doesn\'t recognize\n4. Large badge list - User has 10+ badges (does UI overflow?)\n5. Slow backend response - Badge service takes >2s to respond\n6. Backend error - Badge service returns 500 error\n7. Partial failure - Some badges load, others fail\n8. Race condition - User navigates away before badges load\n9. Accessibility - Screen reader can announce badge labels\n10. Internationalization - Badge labels work in non-English locales'
            },
            {
                type: 'note',
                content: '💡 Kenji reviews: "I would have thought of most of these, but #7 (partial failure) and #8 (race condition) are ones I might have missed"'
            },
            {
                type: 'user',
                avatar: 'K',
                iteration: 'Prompt 2 (Generate Tests)',
                content: 'Can you generate Playwright test cases for edge cases #2, #5, and #6? We use TypeScript and our test setup intercepts network requests with page.route().'
            },
            {
                type: 'ai',
                content: 'test(\'handles missing badge icon\', async ({ page }) => {\n  await page.route(\'**/api/badges\', route => {\n    route.fulfill({\n      json: [{ type: \'verified\', label: \'Verified\' }] // missing icon\n    });\n  });\n  await page.goto(\'/profile/123\');\n  await expect(page.locator(\'.badge\')).toContainText(\'Verified\');\n});\n\ntest(\'handles slow badge service\', async ({ page }) => {\n  await page.route(\'**/api/badges\', async route => {\n    await new Promise(resolve => setTimeout(resolve, 3000));\n    route.fulfill({ json: [] });\n  });\n  await page.goto(\'/profile/123\');\n  await expect(page.locator(\'.profile-header\')).toBeVisible();\n});\n\ntest(\'handles badge service error\', async ({ page }) => {\n  await page.route(\'**/api/badges\', route => {\n    route.fulfill({ status: 500 });\n  });\n  await page.goto(\'/profile/123\');\n  await expect(page.locator(\'.profile-header\')).toBeVisible();\n  await expect(page.locator(\'.badge\')).toHaveCount(0);\n});',
                code: true
            },
            {
                type: 'user',
                avatar: 'K',
                content: '✓ This is really good! I need to tweak the selectors (we use data-testid, not class names), but the structure is solid. This would have taken me 30 minutes to write from scratch.'
            }
        ]);
        kenjiEdgeCasesChatMarker.replaceWith(chat);
    }
}

// Architecture Diagram
function createArchitectureDiagram(type) {
    const container = document.createElement('div');
    container.className = 'architecture-diagram';

    if (type === 'before') {
        container.innerHTML = `
            <div class="arch-title">Current Architecture (Before)</div>
            <div class="arch-content">
                <div class="arch-client">
                    <div class="arch-box arch-frontend">
                        <div class="arch-box-title">Frontend</div>
                        <div class="arch-box-subtitle">User Profile Page</div>
                    </div>
                </div>
                <div class="arch-arrows-down">
                    <div class="arch-arrow">GET /users/:id</div>
                    <div class="arch-arrow">GET /badges/:id</div>
                    <div class="arch-arrow">GET /preferences/:id</div>
                    <div class="arch-arrow">GET /profile/:id</div>
                </div>
                <div class="arch-services">
                    <div class="arch-service-group">
                        <div class="arch-box arch-service">
                            <div class="arch-box-title">UserService</div>
                            <div class="arch-box-content">id, name, email</div>
                        </div>
                        <div class="arch-db">DB</div>
                    </div>
                    <div class="arch-service-group">
                        <div class="arch-box arch-service">
                            <div class="arch-box-title">BadgeService</div>
                            <div class="arch-box-content">user badges</div>
                        </div>
                        <div class="arch-db">DB</div>
                    </div>
                    <div class="arch-service-group">
                        <div class="arch-box arch-service">
                            <div class="arch-box-title">PreferencesService</div>
                            <div class="arch-box-content">notifications, theme</div>
                        </div>
                        <div class="arch-db">DB</div>
                    </div>
                    <div class="arch-service-group">
                        <div class="arch-box arch-service">
                            <div class="arch-box-title">ProfileService</div>
                            <div class="arch-box-content">avatar, bio</div>
                        </div>
                        <div class="arch-db">DB</div>
                    </div>
                </div>
                <div class="arch-pain-point">⚠️ 4 separate API calls, N+1 queries, coordination overhead</div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="arch-title">New Architecture (After)</div>
            <div class="arch-content">
                <div class="arch-client">
                    <div class="arch-box arch-frontend">
                        <div class="arch-box-title">Frontend</div>
                        <div class="arch-box-subtitle">User Profile Page</div>
                    </div>
                </div>
                <div class="arch-arrows-down arch-arrows-consolidated">
                    <div class="arch-arrow arch-arrow-single">GET /users/:id</div>
                    <div class="arch-arrow arch-arrow-single">GET /metadata/:id</div>
                </div>
                <div class="arch-services arch-services-consolidated">
                    <div class="arch-service-group">
                        <div class="arch-box arch-service">
                            <div class="arch-box-title">UserService</div>
                            <div class="arch-box-content">id, name, email</div>
                        </div>
                        <div class="arch-db">DB</div>
                    </div>
                    <div class="arch-service-group arch-service-new">
                        <div class="arch-box arch-service arch-service-highlight">
                            <div class="arch-box-title">UserMetadataService ✨</div>
                            <div class="arch-box-content">badges, preferences, profile</div>
                        </div>
                        <div class="arch-db">DB</div>
                    </div>
                </div>
                <div class="arch-benefit">✓ 2 API calls, single source of truth, 60% faster queries</div>
            </div>
        `;
    }

    return container;
}

// Initialize animations when content changes
let mutationObserverInstance;
function watchForAnimations() {
    if (mutationObserverInstance) {
        mutationObserverInstance.disconnect();
    }

    const content = document.getElementById('content');
    if (!content) return;

    // Run once on load
    initializeAnimations();

    // Setup scroll-triggered animations
    setTimeout(() => {
        setupScrollAnimations();
    }, 100);

    // Watch for changes
    mutationObserverInstance = new MutationObserver(() => {
        initializeAnimations();
        setTimeout(() => {
            setupScrollAnimations();
        }, 100);
    });

    mutationObserverInstance.observe(content, {
        childList: true,
        subtree: false
    });
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createJiraBoard,
        createChatInterface,
        createTimeline,
        createComparisonFlow,
        watchForAnimations
    };
}
