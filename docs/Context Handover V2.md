# Context Handover V2: Display Mode Toggle + Abbreviation System

## Project Overview
**Extends:** V1 Context Handover (UI/UX improvements with drag-and-drop)  
**Focus:** Implement abbreviation system to solve long physics term readability, with toggle infrastructure for future icon mode

## The Core Problem Solved

**Issue:** Physics vocabulary is 2-3x longer than typical word game vocabulary
- Word Solitaire uses: "Dog" (3), "Chair" (5), "Love" (4)
- Physics game has: "electromagnetism" (16), "thermodynamics" (14), "interference" (12)
- **Result:** Text overflow, tiny fonts, poor UX on mobile cards

**Solution:** Abbreviation system using authentic physics notation + future icon toggle

---

## Phase 1: Abbreviation System (IMPLEMENT NOW)

### 1. Create Abbreviation Mapping

**File:** `physics-dictionary.js`

Add comprehensive abbreviation mapping for all words:

```javascript
// Display mode constants
const displayModes = {
  ABBREVIATED: 'abbreviated',
  ICON_LABEL: 'icon_label'  // Future feature
};

// Abbreviation rules by word length and physics convention
const abbreviations = {
  // === MECHANICS ===
  'force': 'F',           // Standard physics notation
  'mass': 'm',
  'speed': 'v',
  'work': 'W',
  'power': 'P',
  'energy': 'E',
  'motion': 'motion',     // Short enough to keep
  'weight': 'W',
  'lever': 'lever',
  'pulley': 'pulley',
  'momentum': 'p',        // Standard notation
  'velocity': 'v',
  'friction': 'f',
  'gravity': 'g',
  'inertia': 'inertia',
  'torque': 'τ',          // Greek tau
  'kinetic': 'KE',
  'potential': 'PE',
  'collision': 'collis.',
  'elastic': 'elastic',
  
  // === THERMODYNAMICS ===
  'heat': 'Q',            // Standard notation
  'cold': 'cold',
  'steam': 'steam',
  'boil': 'boil',
  'freeze': 'freeze',
  'thermal': 'thermal',
  'entropy': 'S',         // Standard notation
  'pressure': 'P',
  'volume': 'V',
  'temperature': 'T',     // Standard notation
  'celsius': '°C',
  'kelvin': 'K',
  'adiabatic': 'adiab.',
  'isothermal': 'isoth.',
  'carnot': 'Carnot',
  'boltzmann': 'Boltz.',
  
  // === ELECTROMAGNETISM ===
  'volt': 'V',
  'amp': 'A',
  'watt': 'W',
  'ohm': 'Ω',             // Greek omega
  'charge': 'q',          // Standard notation
  'current': 'I',         // Standard notation
  'circuit': 'circuit',
  'magnet': 'magnet',
  'voltage': 'V',
  'resistance': 'R',
  'capacitor': 'C',
  'inductor': 'L',
  'resistor': 'R',
  'conductor': 'conduc.',
  'insulator': 'insul.',
  'magnetic': 'B',        // Magnetic field
  'maxwell': 'Maxwell',
  'faraday': 'Faraday',
  'ampere': 'Ampere',
  'coulomb': 'Coulomb',
  'tesla': 'Tesla',
  'dielectric': 'dielec.',
  
  // === QUANTUM PHYSICS ===
  'atom': 'atom',
  'ion': 'ion',
  'nucleus': 'nucleus',
  'photon': 'γ',          // Greek gamma
  'proton': 'p⁺',
  'neutron': 'n',
  'electron': 'e⁻',
  'quantum': 'quantum',
  'particle': 'particle',
  'isotope': 'isotope',
  'orbital': 'orbital',
  'fermion': 'fermion',
  'boson': 'boson',
  'quark': 'quark',
  'lepton': 'lepton',
  'planck': 'Planck',
  'heisenberg': 'Heisen.',
  'schrodinger': 'Schrö.',
  'eigenvalue': 'λ',      // Eigenvalue notation
  'spin': 'spin',
  
  // === RELATIVITY ===
  'time': 't',
  'space': 'space',
  'light': 'c',           // Speed of light
  'velocity': 'v',
  'spacetime': 'spacet.',
  'relativity': 'relat.',
  'einstein': 'Einstein',
  'singularity': 'singul.',
  'wormhole': 'wormh.',
  'redshift': 'z',        // Redshift notation
  'blueshift': 'blueshift',
  'doppler': 'Doppler',
  'lorentz': 'Lorentz',
  
  // === WAVES & OPTICS ===
  'wave': 'wave',
  'ray': 'ray',
  'lens': 'lens',
  'prism': 'prism',
  'sound': 'sound',
  'amplitude': 'A',
  'frequency': 'f',       // Standard notation
  'wavelength': 'λ',      // Greek lambda (standard)
  'spectrum': 'spectr.',
  'refraction': 'refr.',
  'reflection': 'refl.',
  'diffraction': 'diffr.',
  'interference': 'interf.',
  'resonance': 'reson.',
  'harmonic': 'harmon.',
  'doppler': 'Doppler',
  'polarization': 'polar.',
  'coherence': 'coher.',
  'dispersion': 'disper.'
};

// Helper function to get display text
function getCardDisplayText(word, mode = displayModes.ABBREVIATED) {
  if (mode === displayModes.ABBREVIATED) {
    return abbreviations[word.toLowerCase()] || word.toUpperCase();
  }
  
  // Future: icon mode
  if (mode === displayModes.ICON_LABEL) {
    return {
      icon: getWordIcon(word),  // Future implementation
      label: abbreviations[word.toLowerCase()] || word
    };
  }
  
  return word;
}

// Future: Icon mapping (placeholder)
function getWordIcon(word) {
  // To be implemented in Phase 2
  return null;
}
```

### 2. Update Card Rendering

**File:** `main.js`

Modify `createCardElement()` to use abbreviations:

```javascript
function createCardElement(card) {
  const cardEl = document.createElement('div');
  cardEl.className = 'card';
  cardEl.dataset.cardId = card.id;
  
  if (!card.faceUp) {
    cardEl.classList.add('face-down');
    return cardEl;
  }
  
  if (card.type === 'category') {
    cardEl.classList.add('category');
    cardEl.innerHTML = `
      <div class="card-icon">${card.icon}</div>
      <div class="card-title">${card.name}</div>
    `;
  } else if (card.type === 'word') {
    cardEl.classList.add('word');
    
    // Get abbreviated display text
    const displayText = getCardDisplayText(card.word, currentDisplayMode);
    
    cardEl.innerHTML = `
      <div class="card-title">${displayText}</div>
      <div class="card-points">${card.points}</div>
    `;
    
    // Add data attribute for full word (for tooltips/sorting feedback)
    cardEl.dataset.fullWord = card.word;
  }
  
  return cardEl;
}
```

### 3. Add Display Mode State Management

**File:** `main.js`

Add at top of file:

```javascript
// Display mode state (persisted in localStorage)
let currentDisplayMode = displayModes.ABBREVIATED;

// Load saved preference
function loadDisplayPreference() {
  const saved = localStorage.getItem('physics_display_mode');
  if (saved && displayModes[saved.toUpperCase()]) {
    currentDisplayMode = displayModes[saved];
  }
}

// Save preference
function setDisplayMode(mode) {
  currentDisplayMode = mode;
  localStorage.setItem('physics_display_mode', mode);
  renderGame(); // Re-render with new mode
}

// Call on init
document.addEventListener('DOMContentLoaded', () => {
  loadDisplayPreference();
  initializeElements();
  setupEventListeners();
  startNewGame();
});
```

### 4. Update Card Styling for Abbreviations

**File:** `styles.css`

Update card title styling to handle abbreviated text:

```css
.card.word .card-title {
  font-size: 1.5rem;  /* Larger since text is shorter */
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}

/* Special handling for Greek letters */
.card.word .card-title {
  font-family: 'Times New Roman', serif; /* Better Greek letter rendering */
}

/* Show full word on hover/long-press (desktop/mobile) */
.card.word:hover::after,
.card.word:active::after {
  content: attr(data-full-word);
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.65rem;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}
```

### 5. Update Feedback Messages

**File:** `main.js`

Show full word in feedback messages:

```javascript
function handleSortResult(result) {
  if (result.success) {
    triggerHaptic('success');
    // Show full word in feedback, not abbreviation
    const fullWord = selectedWordCard.word;
    showFeedback(`"${fullWord}" sorted! +${result.points}`, 'success');
    renderGame();
  } else {
    triggerHaptic('error');
    showFeedback(result.message, 'error'); // Already has full word from game logic
    renderGame();
  }
}
```

---

## Phase 2: Settings Menu with Toggle (IMPLEMENT NOW - Infrastructure Only)

### 1. Add Settings UI

**File:** `index.html`

Add to modal body (activated from menu button):

```html
<!-- In existing modal structure -->
<div id="settings-panel" class="hidden">
  <h3>Display Settings</h3>
  
  <div class="setting-group">
    <label class="setting-label">Card Display Mode</label>
    <div class="radio-group">
      <label class="radio-option">
        <input type="radio" name="display-mode" value="abbreviated" checked>
        <span class="radio-label">
          <strong>Abbreviated</strong>
          <small>Uses physics notation (p, λ, F)</small>
        </span>
      </label>
      
      <label class="radio-option disabled" title="Coming soon!">
        <input type="radio" name="display-mode" value="icon_label" disabled>
        <span class="radio-label">
          <strong>Icon + Label</strong>
          <small>Visual icons with text (Coming Soon)</small>
          <span class="badge">v2.0</span>
        </span>
      </label>
    </div>
  </div>
  
  <div class="setting-info">
    <p><strong>ℹ️ About Abbreviations:</strong></p>
    <p>This game uses standard physics notation. For example:</p>
    <ul>
      <li><strong>p</strong> = momentum</li>
      <li><strong>λ</strong> = wavelength</li>
      <li><strong>F</strong> = force</li>
    </ul>
    <p>Tap any card to see the full word.</p>
  </div>
</div>
```

### 2. Style Settings Panel

**File:** `styles.css`

```css
.setting-group {
  margin: 20px 0;
}

.setting-label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--text-dark);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:not(.disabled):hover {
  border-color: var(--primary);
  background: var(--bg-light);
}

.radio-option.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  position: relative;
}

.radio-option input[type="radio"] {
  margin-right: 12px;
  margin-top: 2px;
}

.radio-option input[type="radio"]:checked + .radio-label {
  color: var(--primary);
}

.radio-label {
  flex: 1;
}

.radio-label strong {
  display: block;
  margin-bottom: 4px;
}

.radio-label small {
  color: var(--text-light);
  font-size: 0.8rem;
}

.badge {
  display: inline-block;
  background: var(--warning);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  margin-left: 8px;
}

.setting-info {
  margin-top: 20px;
  padding: 12px;
  background: #e0f2fe;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
}

.setting-info p {
  margin: 8px 0;
  font-size: 0.875rem;
}

.setting-info ul {
  margin: 8px 0;
  padding-left: 20px;
  font-size: 0.875rem;
}

.setting-info li {
  margin: 4px 0;
}
```

### 3. Wire Up Settings Toggle

**File:** `main.js`

```javascript
function handleShowMenu() {
  const state = game.getGameState();
  
  elements.modalTitle.textContent = 'Settings & Menu';
  elements.modalBody.innerHTML = `
    <div class="menu-tabs">
      <button class="tab-btn active" onclick="showMenuTab('game')">Game</button>
      <button class="tab-btn" onclick="showMenuTab('settings')">Settings</button>
    </div>
    
    <!-- Game tab (existing content) -->
    <div id="game-tab" class="tab-content">
      <!-- Existing menu content here -->
    </div>
    
    <!-- Settings tab (new) -->
    <div id="settings-tab" class="tab-content hidden">
      <!-- Settings panel HTML from above -->
    </div>
  `;
  
  // Setup radio button listener
  document.querySelectorAll('input[name="display-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (!e.target.disabled) {
        setDisplayMode(displayModes[e.target.value.toUpperCase()]);
      }
    });
  });
  
  showModal();
}

function showMenuTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById(`${tab}-tab`).classList.remove('hidden');
  event.target.classList.add('active');
}

// Make globally accessible
window.showMenuTab = showMenuTab;
```

---

## Phase 3: Future Icon Mode (PLACEHOLDER ONLY - Don't Implement)

### Architecture Notes for V2.0

When ready to implement icon mode in the future:

**1. Icon Library Options:**
- **Phosphor Icons** (free, SVG, physics-friendly)
- **Heroicons** (free, Tailwind-compatible)
- **Custom SVG set** (commission or community contest)

**2. Icon Mapping Structure:**
```javascript
const wordIcons = {
  'force': '<svg>...</svg>',        // Arrow icon
  'energy': '<svg>...</svg>',       // Lightning bolt
  'wavelength': '<svg>...</svg>',   // Sine wave
  // etc.
};

function getWordIcon(word) {
  return wordIcons[word.toLowerCase()] || null;
}
```

**3. Card Layout Adjustment:**
```html
<!-- Icon mode card structure -->
<div class="card word icon-mode">
  <div class="card-icon-visual">
    <svg>...</svg>  <!-- Icon here -->
  </div>
  <div class="card-title">λ</div>  <!-- Abbreviated label below -->
  <div class="card-points">10</div>
</div>
```

**4. Implementation Checklist (for future):**
- [ ] Source/design 100+ icons (prioritize top 30 first)
- [ ] Create icon mapping in physics-dictionary.js
- [ ] Enable "Icon + Label" radio button in settings
- [ ] Update createCardElement() to render icons
- [ ] Test on mobile (ensure icons are recognizable at small size)
- [ ] Add icon legend in help section

**5. Progressive Rollout:**
- v2.0: Implement top 20 most-used words
- v2.1: Add next 30 words
- v2.2: Complete all words
- Fallback: Words without icons use abbreviated text

---

## Testing Checklist

After implementing abbreviations:

**Functionality:**
- [ ] All word cards show abbreviated text correctly
- [ ] Greek letters (λ, τ, Ω) render properly
- [ ] Hover/tap shows full word tooltip
- [ ] Sorting feedback uses full word names
- [ ] Display mode persists in localStorage
- [ ] Settings panel shows current selection

**Visual Polish:**
- [ ] Abbreviated text is easily readable (1.5rem font)
- [ ] Cards don't look empty (good spacing)
- [ ] Tooltips appear correctly on mobile
- [ ] Greek letters use serif font (better rendering)

**UX:**
- [ ] Abbreviations feel natural (not confusing)
- [ ] Players understand notation after 1-2 rounds
- [ ] Info panel explains common abbreviations
- [ ] Settings toggle is discoverable

**Mobile:**
- [ ] Abbreviated text works on 320px width
- [ ] Tooltips don't overflow screen
- [ ] Settings panel is touch-friendly
- [ ] Radio buttons are easily tappable

---

## Key Design Principles

1. **Authentic Physics Notation:**
   - Use standard symbols (p for momentum, λ for wavelength)
   - Educates players on real physics conventions
   - Makes game feel more professional/academic

2. **Graceful Degradation:**
   - If abbreviation unknown → use full word
   - If Greek letter doesn't render → fallback to Latin

3. **Progressive Enhancement:**
   - Ship with abbreviations (Phase 1)
   - Add icons when ready (Phase 2)
   - User gets choice via toggle

4. **Clear Information Hierarchy:**
   - Big abbreviated text on card (primary)
   - Full word on hover (secondary)
   - Full word in feedback messages (confirmation)

5. **Future-Proof:**
   - Display mode enum allows easy extension
   - Icon mode structure already planned
   - LocalStorage makes preferences persistent

---

## Success Criteria

Abbreviation system is successful when:
- ✅ All physics terms fit comfortably on cards
- ✅ Text is readable at 70px card width
- ✅ Players can identify terms after 1-2 examples
- ✅ Notation feels authentic to physics students
- ✅ Settings toggle is functional (even if icon mode disabled)
- ✅ Game feels polished, not cluttered

---

## Notes for Claude Code

- **Priority:** Implement abbreviation mapping first (solves immediate UX problem)
- **Don't over-engineer:** Icon mode is future feature, just add toggle UI placeholder
- **Test thoroughly:** Ensure Greek letters render on iOS/Android
- **Documentation:** Add abbreviation guide to help/tutorial
- **Flexibility:** Allow easy addition of new abbreviations as vocabulary expands

This solves the core constraint (long words) while setting up infrastructure for future enhancement. Ship Phase 1 immediately, iterate to Phase 2 based on user feedback.