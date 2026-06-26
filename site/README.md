# Role Transition Guide - Static Site

A beautiful, animated static site for the Engineering Role Transition Guide.

## 🚀 Quick Start

```bash
cd /Users/gphilip/newroles/site
python3 -m http.server 8000
```

Then open: **http://localhost:8000**

## ✨ Features

### Design & Polish
- **Gradient hero sections** with smooth animations
- **Smooth page transitions** with fade-in effects
- **Polished navigation** with active state indicators and hover effects
- **Custom scrollbars** for better aesthetics
- **Gradient buttons** with hover states and micro-interactions
- **Responsive design** that works on mobile, tablet, and desktop

### Interactive Animations
- **JIRA Board visualizations** showing workflow states
- **Chat interface** demonstrating AI prompt iteration
- **Timeline view** for Priya's chunked delivery
- **Side-by-side comparisons** of old vs. new approaches
- **Smooth card animations** with staggered delays

### Content
- **Markdown rendering** using marked.js
- **Hash-based routing** for bookmarkable pages
- **Previous/Next navigation** buttons
- **Syntax highlighting** for code blocks
- **Beautiful typography** optimized for reading

## 📁 File Structure

```
site/
├── index.html           # Main HTML structure
├── styles.css           # All styling and animations
├── app.js              # Navigation and page loading
├── animations.js       # Animation component library
├── animation-demo.md   # Demo page showing all animations
├── vignette-*.md       # Content files (copied from parent)
└── key-principles.md   # Summary page
```

## 🎨 Styling System

### Colors
- Primary: Blue gradient (`#2563eb` → `#1d4ed8`)
- Surface: Light gray (`#f8fafc`)
- Text: Slate shades for hierarchy
- Semantic colors: Success (green), Warning (orange), Danger (red)

### Spacing
- Consistent spacing scale: xs (0.5rem) → xl (2rem)
- Grid-based layout with CSS Grid and Flexbox

### Typography
- Sans-serif system font stack for body text
- Monospace for code (`SF Mono`, `Monaco`, etc.)
- Responsive font sizes

### Animations
- Fade in up for page transitions
- Slide in for timeline items and chat messages
- Pulse for active JIRA cards
- Smooth hover effects on all interactive elements

## 🔧 Customization

### Adding New Pages
1. Create a new `.md` file in the `site/` directory
2. Add an entry to the `pages` array in `app.js`
3. Add a navigation link in `index.html`

### Adding Animations
Use special `data-animation` attributes in your markdown:

```html
<div data-animation="maya-jira"></div>
<div data-animation="patrick-chat"></div>
<div data-animation="priya-timeline"></div>
<div data-animation="comparison"></div>
```

The `animations.js` file will automatically replace these with interactive components.

### Styling Tweaks
- Colors: Edit CSS variables in `:root` in `styles.css`
- Spacing: Adjust `--spacing-*` variables
- Animations: Modify `@keyframes` rules

## 📱 Responsive Breakpoints

- **Desktop:** Default layout (sidebar + main content)
- **Mobile (< 768px):** Stacked layout, sidebar becomes header

## 🎯 Performance

- Lightweight (~50KB total for HTML/CSS/JS)
- No external dependencies except `marked.js` (CDN)
- Fast page transitions with CSS animations
- Minimal JavaScript for routing and animations

## 🌐 Deployment Options

### GitHub Pages
```bash
# From parent directory
git add site/
git commit -m "Add static site"
git push

# Enable GitHub Pages in repo settings, select /site folder
```

### Netlify
```bash
# Drag and drop the /site folder to Netlify
# Or connect GitHub repo and set publish directory to "site"
```

### Internal Server
- Copy entire `site/` directory to your web server
- No build step required - works with any static file server

## 🎨 Animation Components

### JIRA Board
Shows workflow columns with draggable cards (visual only)

```javascript
createJiraBoard(columns, cardData, activeColumn)
```

### Chat Interface
Shows prompt-response iterations with user/AI avatars

```javascript
createChatInterface(messages)
```

### Timeline
Shows chronological events with markers and descriptions

```javascript
createTimeline(events)
```

### Comparison Flow
Side-by-side old vs. new way comparison

```javascript
createComparisonFlow(oldWaySteps, newWaySteps)
```

## 🔄 Updates

To update content:
1. Edit the `.md` files in `/site`
2. Refresh the browser - changes appear immediately
3. No build step required

## 💡 Tips

- Use the **animation-demo.md** page to see all animations in action
- Navigation is keyboard-accessible (Tab, Enter)
- All animations use CSS when possible for performance
- The site works offline once loaded (no external dependencies except marked.js)

---

Built with ❤️ for the In Tandem engineering team
