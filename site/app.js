// Page navigation data
const pages = [
    { id: 'intro', file: null, title: 'Introduction' },
    { id: 'vignette-1-maya-old-way', file: 'vignette-1-maya-old-way.md', title: "The Old Way: Maya's Excellence" },
    { id: 'vignette-2-patrick-scrappy', file: 'vignette-2-patrick-scrappy.md', title: 'The New Way: Scrappy' },
    { id: 'vignette-3-patrick-balanced', file: 'vignette-3-patrick-balanced.md', title: 'The New Way: Balanced' },
    { id: 'vignette-4-priya-large-arch', file: 'vignette-4-priya-large-arch.md', title: 'The New Way: Large Architecture' },
    { id: 'vignette-5-genghis-antipattern', file: 'vignette-5-genghis-antipattern.md', title: "Don't Be Like Genghis" },
    { id: 'key-principles', file: 'key-principles.md', title: 'Key Principles' }
];

let currentPageIndex = 0;

// Introduction page content
const introContent = `
<div class="intro-hero">
    <h1>Engineering Role Transitions</h1>
    <p>Radical Ownership of Process and Flow</p>
</div>

## We're Choosing Greatness, Together

Your role is evolving. Not because the old way was wrong, but because In Tandem's needs, and our whole industry, have changed.

**The old paradigm optimized for:** Minimizing production risk through thorough pre-ship review.

**The new paradigm optimizes for:** Maximizing learning speed through safe, iterative delivery.

Both are valid. Both require craft and care to become great at. They just measure success differently.

---

## What You'll Find Here

Y'all, I know it's cheesy, but I figured some (admittedly idealized) walkthroughs of what these processes look like in action is the best way to communicate the change we're looking for. 
I encourage roasting Genghis for how dorky the presentation is, but also give the content and intent a good faith runthrough.

### The Stories

All these stories follow the same technical challenge: **User Profile Badges**

Mobile apps (iOS/Android/React) need to display badges (Verified, Pro Member, Early Adopter), but the backend doesn't currently return badge data. This requires cross-stack work and coordination. I specifically picked something that isn't Family-Domain specific so that we don't get hung up on the details of the feature, but focus on the process instead.

### The Characters

**Maya Chen** — *Senior iOS Engineer*

Demonstrates the old way: thorough, coordinated, polished before shipping. She did it excellently.

**Patrick Holstein** — *Mid-level React Engineer*

Demonstrates the new way: ship dark, iterate based on feedback, own features end-to-end.

**Priya Sharma** — *Senior Backend Engineer*

Shows how to handle large architectural changes through chunked delivery and continuous merging.

**Genghis** — *Engineering Manager*

Demonstrates what NOT to do. Obviously.

---

## How we intended this set of docs to be used

1. **Start with Maya's vignette** to see an example of using our old paradign in a way that screamed excellence
2. **Read Patrick's scrappy version** to understand the expectations around a new speed-to-learning approach
3. **Continue with Patrick's balanced version** to see how polish happens through iteration and how decisions on WHAT to polish are made
4. **Review Priya's large architecture** example if you work on large refactors
5. **Enjoy Genghis's anti-pattern**. He is not a role model, he is an object lesson
6. **Reference the Key Principles** as a quick guide

---

## Key Mindset Shift

**Old paradigm:** 

Minimize risk by perfecting code before shipping.

**New paradigm:** 

Minimize risk by shipping safely (flags, small chunks, gradual rollout) and learning fast.

**Both care about quality.** They just achieve it differently.

---

## Let's F[reaking] Go

Click through the vignettes on the left to begin. Each story is self-contained, but they build on each other to show the full picture of the transition.

**Remember:** We're redefining what being great at our jobs means. And we're doing it together, damn it.
`;

// Load markdown file and render
async function loadPage(pageId) {
    const pageIndex = pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;

    currentPageIndex = pageIndex;
    const page = pages[pageIndex];
    const contentEl = document.getElementById('content');

    // Add loading class
    contentEl.classList.add('loading');

    try {
        let htmlContent;

        if (page.file) {
            // Load markdown file
            const response = await fetch(page.file);
            const markdown = await response.text();
            htmlContent = marked.parse(markdown);
        } else {
            // Use intro content
            htmlContent = marked.parse(introContent);
        }

        // Small delay to show smooth transition
        await new Promise(resolve => setTimeout(resolve, 150));

        contentEl.innerHTML = htmlContent;
        contentEl.classList.remove('loading');
        contentEl.scrollTop = 0;
        window.scrollTo(0, 0);

        // Style Slack conversations
        styleSlackMessages();

        // Style feedback stickers
        styleFeedbackStickers();

        // Initialize animations after content is loaded
        if (typeof watchForAnimations === 'function') {
            setTimeout(watchForAnimations, 100);
        }

        // Update navigation
        updateNavigation();
        updateNavigationButtons();

    } catch (error) {
        contentEl.classList.remove('loading');
        contentEl.innerHTML = `
            <h1>Error Loading Content</h1>
            <p>Sorry, we couldn't load this page. Please try again.</p>
            <p style="color: var(--color-text-muted); font-size: 0.875rem;">Error: ${error.message}</p>
        `;
    }
}

// Update active navigation link
function updateNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const currentPage = pages[currentPageIndex];

    links.forEach(link => {
        if (link.dataset.page === currentPage.id) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update prev/next buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Previous button
    if (currentPageIndex > 0) {
        prevBtn.style.display = 'flex';
        prevBtn.onclick = () => {
            const prevPage = pages[currentPageIndex - 1];
            window.location.hash = prevPage.id;
        };
    } else {
        prevBtn.style.display = 'none';
    }

    // Next button
    if (currentPageIndex < pages.length - 1) {
        nextBtn.style.display = 'flex';
        nextBtn.onclick = () => {
            const nextPage = pages[currentPageIndex + 1];
            window.location.hash = nextPage.id;
        };
    } else {
        nextBtn.style.display = 'none';
    }
}

// Style Slack-style messages
function styleSlackMessages() {
    const contentEl = document.getElementById('content');
    if (!contentEl) return;

    // Style blockquotes as chat bubbles
    const blockquotes = contentEl.querySelectorAll('blockquote');
    blockquotes.forEach(bq => {
        // Style as a chat bubble
        bq.style.borderLeft = 'none';
        bq.style.background = 'white';
        bq.style.border = '1px solid var(--color-border)';
        bq.style.borderRadius = '0.5rem';
        bq.style.padding = '0.75rem 1rem';
        bq.style.fontStyle = 'normal';
        bq.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        bq.style.margin = '0.5rem 0';
    });

    // Style speaker labels and group conversations
    const paragraphs = contentEl.querySelectorAll('p');
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        const nextSibling = p.nextElementSibling;

        // Check if this is a speaker label followed by a blockquote
        // OR if it's a paragraph ending with "comment:" followed by a blockquote
        const hasStrongTag = p.querySelector('strong');
        const endsWithComment = text.endsWith('comment:') || text.endsWith('with a comment:');
        const shouldGroup = (hasStrongTag || endsWithComment) && nextSibling && nextSibling.tagName === 'BLOCKQUOTE';

        if (shouldGroup) {
            // Determine conversation type
            const isSlack = text.includes('(in Slack') || text.includes('(to ');
            const isPR = text.includes('review') || text.includes('PR') || text.includes('response') ||
                         text.includes('comment') || text.includes('QA') || text.includes('feedback') ||
                         text.includes('Sarah') || text.includes('Approved');

            // Style the label
            p.style.fontSize = '0.875rem';
            p.style.fontWeight = '600';
            p.style.color = 'var(--color-text)';
            p.style.marginBottom = '0.25rem';
            p.style.marginTop = '1rem';

            // Group consecutive messages in a thread container
            let threadContainer = p.previousElementSibling;
            if (!threadContainer || !threadContainer.classList.contains('conversation-thread')) {
                // Create new thread container
                threadContainer = document.createElement('div');
                threadContainer.className = 'conversation-thread';

                // Apply background color based on type
                if (isSlack) {
                    threadContainer.style.background = 'rgba(59, 130, 246, 0.03)'; // Pale blue
                    threadContainer.style.borderLeft = '3px solid rgba(59, 130, 246, 0.2)';
                } else if (isPR) {
                    threadContainer.style.background = 'rgba(134, 168, 145, 0.08)'; // Pale sage
                    threadContainer.style.borderLeft = '3px solid rgba(134, 168, 145, 0.3)';
                }

                threadContainer.style.padding = '1rem';
                threadContainer.style.borderRadius = '0.5rem';
                threadContainer.style.marginBottom = '1.5rem';

                p.parentNode.insertBefore(threadContainer, p);
            }

            // Move label and blockquote into thread
            threadContainer.appendChild(p);
            threadContainer.appendChild(nextSibling);

            // Check for more consecutive messages
            let next = threadContainer.nextElementSibling;
            while (next && next.tagName === 'P') {
                const nextText = next.textContent.trim();
                const nextBlockquote = next.nextElementSibling;

                if (next.querySelector('strong') && nextBlockquote && nextBlockquote.tagName === 'BLOCKQUOTE') {
                    // Check if it's the same conversation type
                    const nextIsSlack = nextText.includes('(in Slack)') || nextText.includes('(to ');
                    const nextIsPR = nextText.includes('review') || nextText.includes('PR') || nextText.includes('response');

                    if ((isSlack && nextIsSlack) || (isPR && nextIsPR)) {
                        // Style the label
                        next.style.fontSize = '0.875rem';
                        next.style.fontWeight = '600';
                        next.style.color = 'var(--color-text)';
                        next.style.marginBottom = '0.25rem';
                        next.style.marginTop = '1rem';

                        // Add to thread
                        threadContainer.appendChild(next);
                        threadContainer.appendChild(nextBlockquote);
                        next = threadContainer.nextElementSibling;
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
    });
}

// Style feedback as stickers
function styleFeedbackStickers() {
    const contentEl = document.getElementById('content');
    if (!contentEl) return;

    // Find paragraphs that look like feedback labels
    const paragraphs = contentEl.querySelectorAll('p');
    paragraphs.forEach(p => {
        const text = p.textContent.trim();
        const nextSibling = p.nextElementSibling;

        // Check if this is a feedback label (starts with "Feedback #" or "User feedback")
        if ((text.startsWith('Feedback #') || text.startsWith('User feedback')) &&
            p.querySelector('strong') && nextSibling && nextSibling.tagName === 'BLOCKQUOTE') {

            // Create a sticker container if not already in one
            let stickerContainer = p.previousElementSibling;
            if (!stickerContainer || !stickerContainer.classList.contains('feedback-stickers')) {
                stickerContainer = document.createElement('div');
                stickerContainer.className = 'feedback-stickers';
                p.parentNode.insertBefore(stickerContainer, p);
            }

            // Create sticker wrapper
            const sticker = document.createElement('div');
            sticker.className = 'feedback-sticker';

            // Add slight rotation variation
            const rotations = ['-2deg', '1deg', '-1deg', '2deg', '-1.5deg'];
            const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
            sticker.style.transform = `rotate(${randomRotation})`;

            // Move label and blockquote into sticker
            sticker.appendChild(p);
            sticker.appendChild(nextSibling);

            stickerContainer.appendChild(sticker);

            // Style the label
            p.style.fontSize = '0.75rem';
            p.style.fontWeight = '700';
            p.style.textTransform = 'uppercase';
            p.style.letterSpacing = '0.05em';
            p.style.marginBottom = '0.5rem';
            p.style.color = 'var(--color-text-muted)';

            // Style the blockquote
            nextSibling.style.margin = '0';
            nextSibling.style.padding = '0';
            nextSibling.style.border = 'none';
            nextSibling.style.background = 'transparent';
            nextSibling.style.boxShadow = 'none';
            nextSibling.style.fontSize = '0.875rem';
            nextSibling.style.fontStyle = 'italic';
        }
    });
}

// Handle navigation clicks
document.addEventListener('DOMContentLoaded', () => {
    // Set up navigation links
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            window.location.hash = pageId;
        });
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.slice(1);
        const pageId = hash || 'intro';
        loadPage(pageId);
    });

    // Load initial page
    const initialHash = window.location.hash.slice(1) || 'intro';
    loadPage(initialHash);
});
