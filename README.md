# Ground State

A mobile-first category-sorting word game that combines classic solitaire mechanics with **multi-domain STEM terminology**. Sort terms from Physics, Chemistry, and Computer Science into their correct categories before running out of moves!

▶ Play here: https://alfieprojectsdev.github.io/physics-associations/

## 🎮 Game Overview

### Objective
Clear the board by sorting every word card into its corresponding category foundation within a **limited number of moves**.

### Core Mechanics (Based on Word Solitaire: Associations)

**Setup:**
- Cards are arranged in a solitaire-style tableau (columns with face-up and face-down cards)
- **18 categories across 3 domains:** Physics (6), Chemistry (6), Computer Science (6)
- Each level contains 3-6 active categories with 4-12 words per category
- 30% of cards reserved in stock pile for strategic drawing

**Gameplay Loop:**

1. **Place Category Cards** → You cannot sort words until you place a category card (e.g., "Mechanics" or "Thermodynamics") on a foundation slot

2. **Sort Word Cards** → Once categories are placed, move word cards from the tableau to their matching category foundation
   - "momentum" → Mechanics
   - "photon" → Quantum Physics
   - "voltage" → Electromagnetism

3. **Draw from Stock** → When stuck, draw a card from the stock pile to reveal new options

4. **Limited Moves** → Every action (place category, sort word, draw card) costs 1 move
   - Wrong category = -1 move penalty
   - Drawing without using previous card = -1 move

**Win Condition:** Sort all words before moves run out

**Loss Condition:** Moves = 0 or no valid moves remain

## 📱 Features

- **18 Categories Across 3 Domains** - Physics (6), Chemistry (6), Computer Science (6)
- **300+ Terms** with progressive difficulty (basic → intermediate → advanced)
- **Multi-Domain Support** - Play with Physics, Chemistry, or Computer Science vocabularies
- **Solitaire-Style Mechanics** - Limited moves, locked foundations, dead board detection
- **Progressive Difficulty** - Levels 1-3 (basic), 4-6 (intermediate), 7+ (advanced)
- **Move Management** - Strategic gameplay with limited actions
- **Hint System** - Shows missing categories and next best move
- **Score System** - Word-based points (3-12 points per word)
- **Mobile-First** - Touch-optimized for phones and tablets
- **Drag & Drop** - Intuitive card dragging with haptic feedback
- **Smooth Animations** - Card flip, dealing, and sorting effects
- **PWA Support** - Install on home screen, works offline, GitHub Pages ready
- **Privacy-Friendly Analytics** - GoatCounter tracking (no cookies, no personal data)
- **Accessibility** - WCAG 2.1 AA compliant, screen reader support

## 🚀 Quick Start

### Play Instantly
1. Download/extract the ZIP file
2. Open `index.html` in any modern browser
3. Start playing!

### Local Server (Optional)
```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

## 📂 Project Structure

```
ground-state/
├── index.html              # Main HTML structure
├── about.html              # About page (birthday gift story)
├── styles.css              # Mobile-first responsive design
├── vocabulary-dictionary.js # Multi-domain category & word database (Physics, Chemistry, CS)
├── game-logic.js          # Associations-style game mechanics
├── main.js                # UI controller & event handling
├── analytics.js           # GoatCounter analytics wrapper
├── manifest.json          # PWA configuration
├── service-worker.js      # Offline support and caching
├── icons/                 # PWA icons (72px to 512px)
├── ROADMAP.md             # Future features roadmap
└── README.md              # This file
```

## 🎯 Game Mechanics Deep Dive

### Categories & Words

**Mechanics** ⚙️ (Forces, motion, energy)
- Basic: force, mass, speed, work, power, energy
- Intermediate: momentum, velocity, friction, gravity, torque
- Advanced: lagrangian, hamiltonian, centripetal

**Thermodynamics** 🔥 (Heat, temperature, entropy)
- Basic: heat, cold, steam, boil, freeze
- Intermediate: thermal, entropy, pressure, temperature
- Advanced: adiabatic, isothermal, carnot

**Electromagnetism** ⚡ (Electricity, magnetism)
- Basic: volt, amp, watt, charge, current, circuit
- Intermediate: voltage, resistance, capacitor, inductor
- Advanced: maxwell, faraday, dielectric

**Quantum Physics** ⚛️ (Particles, wave functions)
- Basic: atom, ion, nucleus
- Intermediate: photon, proton, neutron, electron
- Advanced: fermion, boson, quark, heisenberg

**Relativity** 🌌 (Space, time, gravity)
- Basic: time, space, light
- Intermediate: velocity, frame
- Advanced: spacetime, einstein, singularity

**Waves & Optics** 🌊 (Oscillations, light)
- Basic: wave, ray, lens, prism, sound
- Intermediate: amplitude, frequency, wavelength, refraction
- Advanced: polarization, coherence, dispersion

**Chemistry** ⚗️ (Elements, compounds, reactions, bonding)
- **Elements:** hydrogen, oxygen, carbon, nitrogen, helium, iron, gold, silver
- **Organic Chemistry:** methane, ethanol, glucose, protein, enzyme, hydrocarbon
- **Reactions:** combustion, oxidation, reduction, catalyst, equilibrium
- **Bonding:** covalent, ionic, metallic, hydrogen bond, dipole
- **States of Matter:** solid, liquid, gas, plasma, sublimation, condensation
- **Acids & Bases:** pH, acid, base, neutral, salt, buffer

**Computer Science** 💻 (Algorithms, data structures, programming)
- **Data Structures:** array, list, stack, queue, tree, graph, hash table, linked list
- **Algorithms:** sort, search, recursion, iteration, binary search, merge sort
- **Programming:** variable, function, loop, class, object, method, syntax
- **Networks:** internet, protocol, TCP, IP, HTTP, DNS, router, packet
- **Databases:** SQL, query, table, index, key, JOIN, transaction
- **Security:** encryption, hash, password, firewall, authentication, SSL

### Scoring System

- **Word Points:** Based on letter complexity and difficulty
  - Basic words: 3-6 points (e.g., "heat" = 4, "energy" = 6)
  - Intermediate: 6-10 points (e.g., "momentum" = 8, "temperature" = 11)
  - Advanced: 8-12 points (e.g., "eigenvalue" = 10, "interference" = 12)

- **Level Progression:**
  - Level 1: 3 categories, ~15 words, 30 moves
  - Level 5: 4 categories, ~25 words, 45 moves
  - Level 10: 6 categories, ~40 words, 70 moves

### Strategic Tips (Following Associations Best Practices)

**1. Analyze the Layout First**
- Study all face-up cards before making any moves
- Identify which categories have the most visible words
- Check which columns have the most face-down cards (prioritize revealing these)

**2. Manage Moves Carefully**
- Every action costs exactly 1 move (place category, sort word, draw card)
- Wrong category guess = card stays put BUT you lose the move
- Example: 30 moves for 20 cards = 10-move margin for mistakes/draws

**3. Prioritize Tableau Over Stock**
- **Always** sort from tableau columns before drawing
- Sorting tableau cards reveals face-down cards underneath
- Drawing from stock doesn't reveal anything new on the board
- Only draw when absolutely no valid tableau moves exist

**4. Think Before Every Tap**
- Verify word-category match before tapping
- Wrong guess wastes a move (even if card doesn't move)
- Use hint system if uncertain about categorization

**5. Category Placement Strategy**
- Place categories that have the most visible matching words
- Don't place all categories at once - save moves for sorting
- If torn between categories, place the one from tableau (reveals cards)

## 🛠️ Customization Guide

### Adding New Categories

Edit `vocabulary-dictionary.js`:

```javascript
// Add to an existing domain (e.g., Physics)
const DomainData = {
    physics: {
        categories: [
            // Add new category
            {
                id: 'astronomy',
                name: 'Astronomy',
                icon: '🔭',
                description: 'Stars, planets, and galaxies'
            }
        ],
        words: {
            astronomy: [
                { word: 'star', difficulty: 'basic', points: 4 },
                { word: 'planet', difficulty: 'basic', points: 6 },
                { word: 'galaxy', difficulty: 'intermediate', points: 6 }
            ]
        }
    }
};
```

### Adjusting Difficulty

Modify move allocation in `game-logic.js`:

```javascript
// More generous moves
this.maxMoves = Math.floor(totalCards * 2) + 20;

// Stricter challenge
this.maxMoves = Math.floor(totalCards * 1.2) + 5;
```

### Changing Layout

Adjust column count in `game-logic.js`:

```javascript
// createTableauLayout()
const numColumns = Math.min(4 + Math.floor(this.level / 2), 7);
// Creates 4-7 columns instead of 3-5
```

## 🧪 Testing Scenarios

### Win State
- All word cards sorted to correct categories
- Moves remaining > 0

### Loss States
- Moves remaining = 0 with unsorted words
- No playable cards + empty stock + unsorted words

### Edge Cases
- Drawing when waste pile has a card (costs extra move)
- Sorting word to wrong category (move penalty)
- Placing duplicate category (rejected, no move cost)

## 🎓 Learning Extensions

### Beginner Enhancements
1. **Undo Feature** - Allow players to reverse last 3 moves
2. **Tutorial Mode** - Guided first level with hints
3. **Daily Challenge** - Same seed for all players

### Intermediate Features
1. **Time Attack Mode** - Bonus points for fast completion
2. **Combo System** - Sort 3+ words in a row for multipliers
3. **Achievement System** - Badges for milestones

### Advanced Projects
1. **Multiplayer** - Race mode using WebSockets
2. **Level Editor** - Create custom category/word combinations
3. **Analytics Dashboard** - Track win rates, average moves
4. **Progressive Web App** - Offline play, push notifications

## 📊 Game Balance

### Current Tuning:
- **Move Ratio:** 1.5x total cards + 10 base moves
- **Stock Reserve:** 30% of deck
- **Face-Down Ratio:** ~60% of tableau cards
- **Categories per Level:** Scales 3 → 6 across 9+ levels

### Difficulty Curve:
```
Level 1-3:   Basic terms only, 3 categories, forgiving moves
Level 4-6:   Basic + Intermediate, 4 categories, moderate challenge
Level 7-9:   All difficulties, 5 categories, tight move economy
Level 10+:   Expert mode, 6 categories, minimal margin for error
```

## 🐛 Known Issues & Roadmap

### Current Status (v1.0 - Jan 1, 2026)
- ✅ Core gameplay mechanics complete
- ✅ Phase 4: Animations (flip, deal, stagger, bounce, shake, pulse)
- ✅ Phase 5: PWA + Analytics (offline support, GoatCounter tracking)
- ✅ Drag-and-drop with haptic feedback
- ✅ Accessibility (WCAG 2.1 AA compliant)
- ✅ Performance optimizations (low-performance mode detection)

### Current Limitations
- Abbreviated mode only (full words abbreviated to 4-6 characters)
- No domain switching UI (defaults to Physics; Chemistry and CS accessible via code only)
- No save/load system (progress resets on refresh)
- Single-device only (no cloud sync)
- No sound effects (haptic feedback only)

### Planned Features (See ROADMAP.md)
- **v2.0 (Late January):** Icon + Label display mode
- **v3.0 (Feb-March):** Classroom features (teacher dashboard, student tracking)
- **v4.0 (Q2 2026):** Biology and Mathematics vocabularies *(Chemistry and CS already integrated!)*

## 🎨 Design Philosophy

**Mobile-First:**
- Touch targets ≥ 44px
- Swipe-friendly card layout
- Responsive font scaling
- No hover-dependent interactions

**Cognitive Load Management:**
- Color-coded categories
- Visual feedback for every action
- Clear move counter always visible
- Confirmation for destructive actions

**Accessibility:**
- Semantic HTML structure
- ARIA labels on interactive elements
- Reduced motion support
- High contrast color ratios

## 📚 STEM Education Value

This game serves as a:
- **Vocabulary Builder** - Reinforces STEM terminology across Physics, Chemistry, and Computer Science
- **Conceptual Organizer** - Groups terms by subdiscipline and domain
- **Memory Aid** - Active recall through category matching
- **Study Tool** - Makes review sessions engaging across multiple subjects

Perfect for:
- High school STEM students (Physics, Chemistry, CS courses)
- College undergrads reviewing for exams
- Teachers for classroom activities across multiple subjects
- Lifelong learners exploring science and technology concepts

## 🤝 Contributing Ideas

Want to extend the game? Try:
- Adding new domains (Biology, Mathematics)
- Creating themed levels (Chemistry Week, CS Fundamentals Month)
- Building a domain-switching UI (currently requires code changes)
- Implementing cross-domain challenge modes
- Building a word submission system for community terms
- Implementing difficulty-based scoring multipliers

## 📝 License

Educational project - free to use, modify, and learn from!

---

**Built to demonstrate:**
- Category-based sorting mechanics with solitaire-style constraints
- Multi-domain vocabulary architecture (extensible to any subject)
- Mobile-first responsive design
- State management in vanilla JavaScript
- Educational game design principles
- Progressive difficulty systems

**Perfect for developers learning:**
- Game state architecture
- Touch event handling
- Move-based gameplay systems
- Multi-domain content architecture
- Educational content integration
