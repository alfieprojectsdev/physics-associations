// Physics Dictionary - Category-Based System for Associations Gameplay

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

// Physics Categories (Foundation cards)
const PhysicsCategories = [
    {
        id: 'mechanics',
        name: 'Mechanics',
        icon: '⚙️',
        description: 'Forces, motion, and energy'
    },
    {
        id: 'thermodynamics',
        name: 'Thermodynamics',
        icon: '🔥',
        description: 'Heat, temperature, and entropy'
    },
    {
        id: 'electromagnetism',
        name: 'Electromagnetism',
        icon: '⚡',
        description: 'Electricity, magnetism, and light'
    },
    {
        id: 'quantum',
        name: 'Quantum Physics',
        icon: '⚛️',
        description: 'Particles and wave functions'
    },
    {
        id: 'relativity',
        name: 'Relativity',
        icon: '🌌',
        description: 'Space, time, and gravity'
    },
    {
        id: 'waves',
        name: 'Waves & Optics',
        icon: '🌊',
        description: 'Oscillations and light behavior'
    }
];

// Word cards organized by category
const PhysicsWords = {
    mechanics: [
        { word: 'force', difficulty: 'basic', points: 5 },
        { word: 'mass', difficulty: 'basic', points: 4 },
        { word: 'speed', difficulty: 'basic', points: 5 },
        { word: 'work', difficulty: 'basic', points: 4 },
        { word: 'power', difficulty: 'basic', points: 5 },
        { word: 'energy', difficulty: 'basic', points: 6 },
        { word: 'motion', difficulty: 'basic', points: 6 },
        { word: 'weight', difficulty: 'basic', points: 6 },
        { word: 'lever', difficulty: 'basic', points: 5 },
        { word: 'pulley', difficulty: 'basic', points: 6 },
        { word: 'momentum', difficulty: 'intermediate', points: 8 },
        { word: 'velocity', difficulty: 'intermediate', points: 8 },
        { word: 'friction', difficulty: 'intermediate', points: 8 },
        { word: 'gravity', difficulty: 'intermediate', points: 7 },
        { word: 'inertia', difficulty: 'intermediate', points: 7 },
        { word: 'torque', difficulty: 'intermediate', points: 6 },
        { word: 'kinetic', difficulty: 'intermediate', points: 7 },
        { word: 'potential', difficulty: 'intermediate', points: 9 },
        { word: 'collision', difficulty: 'intermediate', points: 9 },
        { word: 'elastic', difficulty: 'intermediate', points: 7 }
    ],
    
    thermodynamics: [
        { word: 'heat', difficulty: 'basic', points: 4 },
        { word: 'cold', difficulty: 'basic', points: 4 },
        { word: 'steam', difficulty: 'basic', points: 5 },
        { word: 'boil', difficulty: 'basic', points: 4 },
        { word: 'freeze', difficulty: 'basic', points: 6 },
        { word: 'thermal', difficulty: 'intermediate', points: 7 },
        { word: 'entropy', difficulty: 'intermediate', points: 7 },
        { word: 'pressure', difficulty: 'intermediate', points: 8 },
        { word: 'volume', difficulty: 'intermediate', points: 6 },
        { word: 'temperature', difficulty: 'intermediate', points: 11 },
        { word: 'celsius', difficulty: 'intermediate', points: 7 },
        { word: 'kelvin', difficulty: 'intermediate', points: 6 }
    ],
    
    electromagnetism: [
        { word: 'volt', difficulty: 'basic', points: 4 },
        { word: 'amp', difficulty: 'basic', points: 3 },
        { word: 'watt', difficulty: 'basic', points: 4 },
        { word: 'ohm', difficulty: 'basic', points: 3 },
        { word: 'charge', difficulty: 'basic', points: 6 },
        { word: 'current', difficulty: 'basic', points: 7 },
        { word: 'circuit', difficulty: 'basic', points: 7 },
        { word: 'magnet', difficulty: 'basic', points: 6 },
        { word: 'voltage', difficulty: 'intermediate', points: 7 },
        { word: 'resistance', difficulty: 'intermediate', points: 10 },
        { word: 'capacitor', difficulty: 'intermediate', points: 9 },
        { word: 'inductor', difficulty: 'intermediate', points: 8 }
    ],
    
    quantum: [
        { word: 'atom', difficulty: 'basic', points: 4 },
        { word: 'ion', difficulty: 'basic', points: 3 },
        { word: 'nucleus', difficulty: 'basic', points: 7 },
        { word: 'photon', difficulty: 'intermediate', points: 6 },
        { word: 'proton', difficulty: 'intermediate', points: 6 },
        { word: 'neutron', difficulty: 'intermediate', points: 7 },
        { word: 'electron', difficulty: 'intermediate', points: 8 },
        { word: 'quantum', difficulty: 'intermediate', points: 7 },
        { word: 'particle', difficulty: 'intermediate', points: 8 }
    ],
    
    relativity: [
        { word: 'time', difficulty: 'basic', points: 4 },
        { word: 'space', difficulty: 'basic', points: 5 },
        { word: 'light', difficulty: 'basic', points: 5 },
        { word: 'velocity', difficulty: 'intermediate', points: 8 },
        { word: 'spacetime', difficulty: 'advanced', points: 9 },
        { word: 'relativity', difficulty: 'advanced', points: 10 },
        { word: 'einstein', difficulty: 'advanced', points: 8 }
    ],
    
    waves: [
        { word: 'wave', difficulty: 'basic', points: 4 },
        { word: 'ray', difficulty: 'basic', points: 3 },
        { word: 'lens', difficulty: 'basic', points: 4 },
        { word: 'prism', difficulty: 'basic', points: 5 },
        { word: 'sound', difficulty: 'basic', points: 5 },
        { word: 'amplitude', difficulty: 'intermediate', points: 9 },
        { word: 'frequency', difficulty: 'intermediate', points: 9 },
        { word: 'wavelength', difficulty: 'intermediate', points: 10 },
        { word: 'refraction', difficulty: 'intermediate', points: 10 },
        { word: 'reflection', difficulty: 'intermediate', points: 10 }
    ]
};

function isWordInCategory(word, categoryId) {
    if (!PhysicsWords[categoryId]) return false;
    return PhysicsWords[categoryId].some(
        item => item.word.toLowerCase() === word.toLowerCase()
    );
}

function getCategoryForWord(word) {
    const lowerWord = word.toLowerCase();
    for (let categoryId in PhysicsWords) {
        const found = PhysicsWords[categoryId].find(
            item => item.word.toLowerCase() === lowerWord
        );
        if (found) return categoryId;
    }
    return null;
}

function getWordPoints(word) {
    const lowerWord = word.toLowerCase();
    for (let categoryId in PhysicsWords) {
        const found = PhysicsWords[categoryId].find(
            item => item.word.toLowerCase() === lowerWord
        );
        if (found) return found.points;
    }
    return 0;
}

function generateLevelDeck(level = 1) {
    const deck = { categoryCards: [], wordCards: [] };
    const numCategories = Math.min(3 + Math.floor(level / 3), 6);
    const shuffledCategories = [...PhysicsCategories]
        .sort(() => Math.random() - 0.5)
        .slice(0, numCategories);
    
    shuffledCategories.forEach(cat => {
        deck.categoryCards.push({
            id: `cat-${cat.id}`,
            type: 'category',
            categoryId: cat.id,
            name: cat.name,
            icon: cat.icon,
            description: cat.description
        });
    });
    
    shuffledCategories.forEach(cat => {
        const categoryWords = PhysicsWords[cat.id];
        const wordsPerCategory = Math.min(4 + level, 12);
        let availableWords = categoryWords;
        
        if (level <= 3) {
            availableWords = categoryWords.filter(w => w.difficulty === 'basic');
        } else if (level <= 6) {
            availableWords = categoryWords.filter(w => 
                w.difficulty === 'basic' || w.difficulty === 'intermediate'
            );
        }
        
        const selectedWords = [...availableWords]
            .sort(() => Math.random() - 0.5)
            .slice(0, wordsPerCategory);
        
        selectedWords.forEach((wordData, index) => {
            deck.wordCards.push({
                id: `word-${cat.id}-${index}`,
                type: 'word',
                word: wordData.word,
                categoryId: cat.id,
                points: wordData.points,
                difficulty: wordData.difficulty
            });
        });
    });
    
    deck.wordCards.sort(() => Math.random() - 0.5);
    return deck;
}

function getHint(placedCategories, remainingWords) {
    const categoryCounts = {};
    remainingWords.forEach(card => {
        const cat = card.categoryId;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    const missingCategories = Object.keys(categoryCounts)
        .filter(catId => !placedCategories.includes(catId))
        .map(catId => {
            const category = PhysicsCategories.find(c => c.id === catId);
            return {
                categoryId: catId,
                name: category.name,
                wordCount: categoryCounts[catId]
            };
        });
    
    return {
        missingCategories,
        nextBestMove: missingCategories.length > 0 
            ? `Place "${missingCategories[0].name}" category (${missingCategories[0].wordCount} words waiting)`
            : 'Sort visible words to their categories'
    };
}
