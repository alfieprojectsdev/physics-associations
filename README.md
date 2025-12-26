# Ground State

A mobile-first category-sorting word game that combines classic solitaire mechanics with physics terminology. Sort physics terms into their correct categories before running out of moves!

▶ Play here: https://alfieprojectsdev.github.io/physics-associations/

## 🎮 Game Overview

### Objective
Clear the board by sorting every word card into its corresponding category foundation within a **limited number of moves**.

### Core Mechanics (Based on Word Solitaire: Associations)

**Setup:**
- Cards are arranged in a solitaire-style tableau (columns with face-up and face-down cards)
- 6 physics categories: Mechanics, Thermodynamics, Electromagnetism, Quantum Physics, Relativity, Waves & Optics
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

- **6 Physics Categories** with 100+ terms across difficulty levels
- **Progressive Difficulty** - Levels 1-3 (basic), 4-6 (intermediate), 7+ (advanced)
- **Move Management** - Strategic gameplay with limited actions
- **Hint System** - Shows missing categories and next best move
- **Score System** - Word-based points (3-12 points per word)
- **Mobile-First** - Touch-optimized for phones and tablets

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
physics-word-solitaire/
├── index.html              # Main HTML structure
├── styles.css              # Mobile-first responsive design
├── physics-dictionary.js   # Category definitions & word database
├── game-logic.js          # Associations-style game mechanics
├── main.js                # UI controller & event handling
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

Edit `physics-dictionary.js`:

```javascript
const PhysicsCategories = [
    // Add new category
    {
        id: 'astronomy',
        name: 'Astronomy',
        icon: '🔭',
        description: 'Stars, planets, and galaxies'
    }
];

const PhysicsWords = {
    astronomy: [
        { word: 'star', difficulty: 'basic', points: 4 },
        { word: 'planet', difficulty: 'basic', points: 6 },
        { word: 'galaxy', difficulty: 'intermediate', points: 6 }
    ]
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

### Current Limitations
- No save/load system (progress resets on refresh)
- Single-device only (no cloud sync)
- No sound effects or haptic feedback

### Planned Features
- [ ] LocalStorage persistence
- [ ] Sound toggle with victory/error audio
- [ ] Colorblind-friendly category indicators
- [ ] Statistics tracking (win rate, best score)
- [ ] "Quick Restart" button
- [ ] Difficulty presets (Easy/Normal/Hard)

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

## 📚 Physics Education Value

This game serves as a:
- **Vocabulary Builder** - Reinforces physics terminology
- **Conceptual Organizer** - Groups terms by subdiscipline
- **Memory Aid** - Active recall through category matching
- **Study Tool** - Makes review sessions engaging

Perfect for:
- High school physics students
- College undergrads reviewing for exams
- Physics teachers for classroom activities
- Lifelong learners exploring science concepts

## 🤝 Contributing Ideas

Want to extend the game? Try:
- Adding subdiscipline categories (Classical vs Modern Physics)
- Creating themed levels (E&M Week, Quantum Month)
- Building a word submission system for community terms
- Implementing difficulty-based scoring multipliers

## 📝 License

Educational project - free to use, modify, and learn from!

---

**Built to demonstrate:**
- Category-based sorting mechanics
- Mobile-first responsive design
- State management in vanilla JavaScript
- Educational game design principles
- Progressive difficulty systems

**Perfect for developers learning:**
- Game state architecture
- Touch event handling
- Move-based gameplay systems
- Educational content integration
