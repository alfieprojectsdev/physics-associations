# Ground State - Product Roadmap

## Current Version: v1.0 (January 1, 2026)

**Status:** ✅ Launched as birthday gift for Bhazel (PSHS Physics Teacher)

### v1.0 Features:
- Abbreviated display mode with authentic physics notation (p, λ, F, τ)
- **Solitaire-style mechanics** (limited moves, locked foundations, dead board detection, finite stock)
- **Multi-domain vocabulary** (Physics, Chemistry, Computer Science - 18 categories, 300+ terms)
- Drag-and-drop with touch animations
- PWA support (offline-capable, installable, GitHub Pages deployment ready)
- Privacy-friendly analytics (GoatCounter)
- WCAG 2.1 AA accessible
- Performance optimized for budget Android devices (30+ FPS)

---

## v2.0: Icon + Label Mode (Planned: Late January 2026)

**Goal:** Visual learning mode with physics icons + notation labels

### Implementation Plan

**Phase 1: Icon Research & Curation (4 hours)**
- Survey PSHS students on preferred icon styles
- Curate 110 physics icons from:
  - Option A: Purchase professional physics icon pack ($20-50)
  - Option B: Mix of Noto Emoji + custom SVGs
  - Option C: Commission custom icon set
- Test icon recognition with target age group (15-17 years)

**Phase 2: Icon Dictionary (2 hours)**
- Map all 110 physics terms to icon file paths
- Implement `getWordIcon()` function
- Add icon fallback mechanism (default icon if missing)

**Phase 3: Card Rendering (2 hours)**
- Update `renderTableau()` to handle icon+label objects
- Update `renderWaste()` for icon display
- Update `renderFoundations()` for category icons
- Conditional rendering: abbreviated vs icon mode

**Phase 4: CSS Styling (2 hours)**
- Icon + label card layout
- Responsive icon sizing (mobile vs desktop)
- Animation support (icon pulse, bounce)
- Dark mode icon variants (if needed)

**Phase 5: Settings Integration (1 hour)**
- Enable icon mode radio button in settings
- Test mode switching preserves game state
- LocalStorage persistence for user preference

**Phase 6: Service Worker Update (1 hour)**
- Cache icon assets for offline mode
- Version bump cache name
- Test offline icon rendering

**Estimated Total:** 12-14 hours
**Target Launch:** January 20-27, 2026

---

## v3.0: Classroom Features (Planned: February-March 2026)

**Goal:** Tools for teachers to use Ground State in PSHS classrooms

### Features

**1. Vocabulary Export Tools**
- Export to Anki flashcards format (.apkg)
- Generate printable study guides (PDF)
- Kahoot quiz generator
- Quizlet set creator

**2. Classroom Mode**
- Teacher creates room code
- Students join session
- Live leaderboard
- Progress tracking per student
- Export class statistics

**3. Custom Decks**
- Teachers can create custom physics term sets
- Import from CSV/spreadsheet
- Share decks with other teachers
- Category customization

**4. Difficulty Levels**
- Easy: 5 categories, 15 words
- Medium: 7 categories, 21 words (current)
- Hard: 10 categories, 30 words
- Expert: 12 categories, 36 words

**Estimated Total:** 40-60 hours
**Target Launch:** March 2026

---

## v4.0: Educational Expansion (Partially Complete)

**Status:** ✅ Chemistry & Computer Science vocabularies integrated (December 2025)
**Remaining:** Biology and Mathematics (Planned: Q2 2026)

### Completed Ahead of Schedule

1. **Chemistry Associations** ✅ (Completed December 2025)
   - 6 categories: Elements, Organic Chemistry, Reactions, Bonding, States of Matter, Acids & Bases
   - 100+ chemistry terms with difficulty progression (basic → advanced)
   - Symbol disambiguation system (H, O, C, N, pH, etc.)
   - Full integration with solitaire mechanics

2. **Computer Science Associations** ✅ (Completed December 2025)
   - 6 categories: Data Structures, Algorithms, Programming, Networks, Databases, Security
   - 90+ CS terms covering fundamentals to advanced concepts
   - Acronym support (API, SQL, JSON, etc.)
   - Full integration with game engine

### Still Planned

3. **Biology Associations** (Q2 2026)
   - Cell structures, systems
   - Taxonomy categories
   - Genetics terminology

4. **Mathematics Associations** (Q2 2026)
   - Algebra, geometry, calculus terms
   - Theorem categories
   - Mathematical symbols

### Technical Requirements

- ✅ Multi-subject architecture (DomainData system implemented)
- ⏳ Subject selection UI (infrastructure exists, UI pending)
- ✅ Separate dictionaries per subject (vocabulary-dictionary.js)
- ✅ Unified game engine (domain-agnostic game logic)
- ⏳ Cross-subject achievements (planned for v3.0)

**Completed Work:** 40-50 hours (Chemistry + CS integration)
**Remaining Estimate:** 40-50 hours (Biology + Math)
**Target Launch for Remaining:** June 2026

---

## Future Considerations (2026+)

### Gamification
- Achievement system (badges)
- Streak tracking
- Daily challenges
- Multiplayer mode

### Accessibility
- Text-to-speech for terms
- Dyslexia-friendly font option
- High contrast mode
- Customizable card colors

### Performance
- Implement level progression system
- Add hint system improvements
- Undo move functionality
- Time-based challenges

### Monetization (Optional)
- Keep core game free
- Premium teacher tools ($5/month)
- Custom icon packs ($1-2)
- Ad-free guarantee maintained

---

## Community Feedback Priority

**Post-v1.0 Launch:** Gather feedback from:
1. Bhazel's PSHS students (primary users)
2. Other PSHS teachers
3. GitHub community
4. Educational forums

**Decision Criteria:**
- Student learning outcomes (most important)
- Teacher classroom usability
- Technical feasibility
- Open source sustainability

---

## Development Principles

1. **Students First:** All features serve educational goals
2. **Zero Cost:** Core game remains free forever
3. **Privacy:** No tracking, no ads, no data collection
4. **Open Source:** MIT license, community contributions welcome
5. **Performance:** Works on 2-3 year old Android phones
6. **Accessibility:** WCAG 2.1 AA minimum standard

---

## How to Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Bug reports
- Feature requests
- Icon contributions
- Translation support
- Code contributions

---

## Changelog

### v1.0.0 (January 1, 2026)
- Initial release
- Solitaire-style mechanics (Phases 1-3: limited moves, locked foundations, dead board detection)
- Multi-domain vocabulary system (Physics, Chemistry, Computer Science)
- 18 categories with 300+ terms across 3 domains
- Abbreviated display mode with authentic notation
- PWA support (offline-capable, installable, GitHub Pages ready)
- Drag-and-drop gameplay with touch animations
- WCAG 2.1 AA accessible
- Privacy-friendly analytics (GoatCounter)

---

**Maintained by:** Alfie
**For:** PSHS Physics Students & Teachers
**License:** MIT
**Repository:** https://github.com/alfieprojectsdev/physics-associations
