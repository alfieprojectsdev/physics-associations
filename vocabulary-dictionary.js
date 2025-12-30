// Vocabulary Dictionary - Multi-Domain Category-Based System for Associations Gameplay

// Display mode constants
const displayModes = {
  ABBREVIATED: 'abbreviated',
  ICON_LABEL: 'icon_label'  // Future feature
};

// Domain registry
const Domains = {
    PHYSICS: 'physics',
    CHEMISTRY: 'chemistry',
    CS: 'computer-science',
    BIOLOGY: 'biology',
    MATHEMATICS: 'mathematics'
};

// Domain definitions
const DomainData = {
    physics: {
        name: 'Physics',
        icon: '⚛️',
        description: 'Forces, energy, matter, and the universe',

        categories: [
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
        ],

        words: {
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
                { word: 'elastic', difficulty: 'intermediate', points: 7 },
                // Symbols and acronyms
                { word: 'F', type: 'symbol', definition: 'Force', validCategories: ['mechanics'], difficulty: 'basic', points: 4 },
                { word: 'm', type: 'symbol', definition: 'Mass', validCategories: ['mechanics'], difficulty: 'basic', points: 3 },
                { word: 'v', type: 'symbol', definition: 'Velocity (vector)', isVector: true, validCategories: ['mechanics'], difficulty: 'basic', points: 4 },
                { word: 'a', type: 'symbol', definition: 'Acceleration (vector)', isVector: true, validCategories: ['mechanics'], difficulty: 'basic', points: 4 },
                { word: 'p', type: 'symbol', definition: 'Momentum (vector)', isVector: true, validCategories: ['mechanics'], difficulty: 'intermediate', points: 5 },
                { word: 'KE', type: 'acronym', definition: 'Kinetic Energy', validCategories: ['mechanics'], difficulty: 'basic', points: 4 },
                { word: 'PE', type: 'acronym', definition: 'Potential Energy', validCategories: ['mechanics'], difficulty: 'basic', points: 4 },
                { word: 'μ', type: 'symbol', definition: 'Coefficient of Friction', validCategories: ['mechanics'], difficulty: 'intermediate', points: 5 },
                { word: 'τ', type: 'symbol', definition: 'Torque', validCategories: ['mechanics'], difficulty: 'intermediate', points: 5 },
                { word: 'ω', type: 'symbol', definition: 'Angular Velocity', validCategories: ['mechanics'], difficulty: 'advanced', points: 6 },
                { word: 'COM', type: 'acronym', definition: 'Center of Mass', validCategories: ['mechanics'], difficulty: 'intermediate', points: 5 }
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
                { word: 'kelvin', difficulty: 'intermediate', points: 6 },
                // Symbols and acronyms
                // Note: 'T' and 'V' moved to ambiguousSymbols array (shared with other categories)
                { word: 'Q', type: 'symbol', definition: 'Heat', validCategories: ['thermodynamics'], difficulty: 'basic', points: 4 },
                { word: 'S', type: 'symbol', definition: 'Entropy', validCategories: ['thermodynamics'], difficulty: 'intermediate', points: 5 },
                { word: 'P', type: 'symbol', definition: 'Pressure', validCategories: ['thermodynamics'], difficulty: 'basic', points: 4 },
                { word: 'k_B', type: 'symbol', definition: 'Boltzmann Constant', validCategories: ['thermodynamics'], difficulty: 'advanced', points: 7 },
                { word: 'η', type: 'symbol', definition: 'Efficiency', validCategories: ['thermodynamics'], difficulty: 'intermediate', points: 5 }
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
                { word: 'inductor', difficulty: 'intermediate', points: 8 },
                // Symbols and acronyms (V is shared with thermodynamics)
                { word: 'I', type: 'symbol', definition: 'Current', validCategories: ['electromagnetism'], difficulty: 'basic', points: 4 },
                { word: 'R', type: 'symbol', definition: 'Resistance', validCategories: ['electromagnetism'], difficulty: 'basic', points: 4 },
                { word: 'q', type: 'symbol', definition: 'Charge', validCategories: ['electromagnetism'], difficulty: 'basic', points: 4 },
                { word: 'C', type: 'symbol', definition: 'Capacitance', validCategories: ['electromagnetism'], difficulty: 'intermediate', points: 5 },
                { word: 'B', type: 'symbol', definition: 'Magnetic Field', validCategories: ['electromagnetism'], difficulty: 'intermediate', points: 5 },
                { word: 'E', type: 'symbol', definition: 'Electric Field (vector)', isVector: true, validCategories: ['electromagnetism'], difficulty: 'intermediate', points: 6 },
                { word: 'Ω', type: 'symbol', definition: 'Ohm', validCategories: ['electromagnetism'], difficulty: 'basic', points: 4 },
                { word: 'EMF', type: 'acronym', definition: 'Electromotive Force', validCategories: ['electromagnetism'], difficulty: 'intermediate', points: 5 }
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
                { word: 'particle', difficulty: 'intermediate', points: 8 },
                // Symbols and acronyms
                // Note: 'n' moved to ambiguousSymbols array (shared with waves)
                { word: 'ψ', type: 'symbol', definition: 'Wavefunction', validCategories: ['quantum'], difficulty: 'intermediate', points: 6 },
                { word: 'h', type: 'symbol', definition: 'Planck\'s Constant', validCategories: ['quantum'], difficulty: 'intermediate', points: 6 },
                { word: 'ħ', type: 'symbol', definition: 'Reduced Planck Constant (h-bar)', validCategories: ['quantum'], difficulty: 'advanced', points: 7 },
                { word: 'eV', type: 'symbol', definition: 'Electron Volt', validCategories: ['quantum'], difficulty: 'intermediate', points: 5 }
            ],

            relativity: [
                { word: 'time', difficulty: 'basic', points: 4 },
                { word: 'space', difficulty: 'basic', points: 5 },
                { word: 'light', difficulty: 'basic', points: 5 },
                { word: 'velocity', difficulty: 'intermediate', points: 8 },
                { word: 'spacetime', difficulty: 'advanced', points: 9 },
                { word: 'relativity', difficulty: 'advanced', points: 10 },
                { word: 'einstein', difficulty: 'advanced', points: 8 },
                // Symbols and acronyms
                { word: 'c', type: 'symbol', definition: 'Speed of Light', validCategories: ['relativity'], difficulty: 'basic', points: 4 },
                { word: 'E=mc²', type: 'symbol', definition: 'Mass-Energy Equivalence', validCategories: ['relativity'], difficulty: 'basic', points: 6 },
                { word: 'γ', type: 'symbol', definition: 'Lorentz Factor', validCategories: ['relativity'], difficulty: 'advanced', points: 7 },
                { word: 'G', type: 'symbol', definition: 'Gravitational Constant', validCategories: ['relativity'], difficulty: 'intermediate', points: 6 }
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
                { word: 'reflection', difficulty: 'intermediate', points: 10 },
                // Symbols and acronyms (T and n are shared with other categories)
                { word: 'λ', type: 'symbol', definition: 'Wavelength', validCategories: ['waves'], difficulty: 'basic', points: 4 },
                { word: 'f', type: 'symbol', definition: 'Frequency', validCategories: ['waves'], difficulty: 'basic', points: 4 },
                { word: 'A', type: 'symbol', definition: 'Amplitude', validCategories: ['waves'], difficulty: 'basic', points: 4 },
                { word: 'Hz', type: 'symbol', definition: 'Hertz', validCategories: ['waves'], difficulty: 'basic', points: 4 }
            ]
        },

        abbreviations: {
            // === MECHANICS ===
            'force': 'F',
            'mass': 'm',
            'speed': 'v',
            'work': 'W',
            'power': 'P',
            'energy': 'E',
            'motion': 'motion',
            'weight': 'W',
            'lever': 'lever',
            'pulley': 'pulley',
            'momentum': 'p',
            'velocity': 'v',
            'friction': 'f',
            'gravity': 'g',
            'inertia': 'inertia',
            'torque': 'τ',
            'kinetic': 'KE',
            'potential': 'PE',
            'collision': 'collis.',
            'elastic': 'elastic',

            // === THERMODYNAMICS ===
            'heat': 'Q',
            'cold': 'cold',
            'steam': 'steam',
            'boil': 'boil',
            'freeze': 'freeze',
            'thermal': 'thermal',
            'entropy': 'S',
            'pressure': 'P',
            'volume': 'V',
            'temperature': 'T',
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
            'ohm': 'Ω',
            'charge': 'q',
            'current': 'I',
            'circuit': 'circuit',
            'magnet': 'magnet',
            'voltage': 'V',
            'resistance': 'R',
            'capacitor': 'C',
            'inductor': 'L',
            'resistor': 'R',
            'conductor': 'conduc.',
            'insulator': 'insul.',
            'magnetic': 'B',
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
            'photon': 'γ',
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
            'eigenvalue': 'λ',
            'spin': 'spin',

            // === RELATIVITY ===
            'time': 't',
            'space': 'space',
            'light': 'c',
            'spacetime': 'spacet.',
            'relativity': 'relat.',
            'einstein': 'Einstein',
            'singularity': 'singul.',
            'wormhole': 'wormh.',
            'redshift': 'z',
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
            'frequency': 'f',
            'wavelength': 'λ',
            'spectrum': 'spectr.',
            'refraction': 'refr.',
            'reflection': 'refl.',
            'diffraction': 'diffr.',
            'interference': 'interf.',
            'resonance': 'reson.',
            'harmonic': 'harmon.',
            'polarization': 'polar.',
            'coherence': 'coher.',
            'dispersion': 'disper.'
        },

        ambiguousSymbols: [
            {
                word: 'T',
                type: 'symbol',
                definition: 'Temperature OR Period',
                validCategories: ['thermodynamics', 'waves'],
                difficulty: 'basic',
                points: 5
            },
            {
                word: 'V',
                type: 'symbol',
                definition: 'Volume OR Voltage',
                validCategories: ['thermodynamics', 'electromagnetism'],
                difficulty: 'basic',
                points: 5
            },
            {
                word: 'n',
                type: 'symbol',
                definition: 'Quantum Number OR Refractive Index',
                validCategories: ['quantum', 'waves'],
                difficulty: 'intermediate',
                points: 5
            }
        ]
    },

    chemistry: {
        name: 'Chemistry',
        icon: '⚗️',
        description: 'Elements, compounds, reactions, and bonding',

        categories: [
            {
                id: 'elements',
                name: 'Elements',
                icon: '🔬',
                description: 'Periodic table elements'
            },
            {
                id: 'organic',
                name: 'Organic Chemistry',
                icon: '🧪',
                description: 'Carbon-based compounds'
            },
            {
                id: 'reactions',
                name: 'Reactions',
                icon: '⚡',
                description: 'Chemical reactions and processes'
            },
            {
                id: 'bonding',
                name: 'Bonding',
                icon: '🔗',
                description: 'Molecular structure and bonds'
            },
            {
                id: 'states',
                name: 'States of Matter',
                icon: '💧',
                description: 'Solids, liquids, gases, plasma'
            },
            {
                id: 'acids-bases',
                name: 'Acids & Bases',
                icon: '⚖️',
                description: 'pH, acids, bases, salts'
            }
        ],

        words: {
            elements: [
                // Basic elements
                { word: 'hydrogen', difficulty: 'basic', points: 4 },
                { word: 'oxygen', difficulty: 'basic', points: 4 },
                { word: 'carbon', difficulty: 'basic', points: 4 },
                { word: 'nitrogen', difficulty: 'basic', points: 5 },
                { word: 'helium', difficulty: 'basic', points: 4 },
                { word: 'iron', difficulty: 'basic', points: 3 },
                { word: 'gold', difficulty: 'basic', points: 3 },
                { word: 'silver', difficulty: 'basic', points: 4 },
                // Intermediate
                { word: 'sodium', difficulty: 'intermediate', points: 6 },
                { word: 'chlorine', difficulty: 'intermediate', points: 6 },
                { word: 'calcium', difficulty: 'intermediate', points: 6 },
                { word: 'uranium', difficulty: 'intermediate', points: 7 },
                { word: 'aluminum', difficulty: 'intermediate', points: 8 },
                { word: 'copper', difficulty: 'intermediate', points: 6 },
                // Symbols
                { word: 'H', type: 'symbol', definition: 'Hydrogen', validCategories: ['elements'], difficulty: 'basic', points: 3 },
                { word: 'O', type: 'symbol', definition: 'Oxygen', validCategories: ['elements'], difficulty: 'basic', points: 3 },
                { word: 'C', type: 'symbol', definition: 'Carbon', validCategories: ['elements'], difficulty: 'basic', points: 3 },
                { word: 'N', type: 'symbol', definition: 'Nitrogen', validCategories: ['elements'], difficulty: 'basic', points: 3 },
                { word: 'Fe', type: 'symbol', definition: 'Iron', validCategories: ['elements'], difficulty: 'intermediate', points: 4 },
                { word: 'Au', type: 'symbol', definition: 'Gold', validCategories: ['elements'], difficulty: 'intermediate', points: 4 },
                { word: 'Na', type: 'symbol', definition: 'Sodium', validCategories: ['elements'], difficulty: 'intermediate', points: 4 },
                { word: 'Cl', type: 'symbol', definition: 'Chlorine', validCategories: ['elements'], difficulty: 'intermediate', points: 4 }
            ],

            organic: [
                { word: 'methane', difficulty: 'basic', points: 5 },
                { word: 'ethanol', difficulty: 'basic', points: 5 },
                { word: 'glucose', difficulty: 'intermediate', points: 6 },
                { word: 'protein', difficulty: 'intermediate', points: 6 },
                { word: 'benzene', difficulty: 'intermediate', points: 7 },
                { word: 'polymer', difficulty: 'intermediate', points: 7 },
                { word: 'alkane', difficulty: 'advanced', points: 8 },
                { word: 'carboxyl', difficulty: 'advanced', points: 8 },
                { word: 'amino acid', difficulty: 'intermediate', points: 9 },
                { word: 'lipid', difficulty: 'intermediate', points: 5 },
                // Symbols
                { word: 'CH₄', type: 'symbol', definition: 'Methane', validCategories: ['organic'], difficulty: 'basic', points: 5 },
                { word: 'H₂O', type: 'symbol', definition: 'Water', validCategories: ['organic'], difficulty: 'basic', points: 4 },
                { word: 'CO₂', type: 'symbol', definition: 'Carbon Dioxide', validCategories: ['organic'], difficulty: 'basic', points: 5 }
            ],

            reactions: [
                { word: 'combustion', difficulty: 'basic', points: 6 },
                { word: 'oxidation', difficulty: 'intermediate', points: 7 },
                { word: 'reduction', difficulty: 'intermediate', points: 7 },
                { word: 'catalyst', difficulty: 'intermediate', points: 8 },
                { word: 'exothermic', difficulty: 'intermediate', points: 9 },
                { word: 'endothermic', difficulty: 'intermediate', points: 9 },
                { word: 'synthesis', difficulty: 'intermediate', points: 8 },
                { word: 'decomposition', difficulty: 'advanced', points: 11 },
                { word: 'equilibrium', difficulty: 'advanced', points: 10 }
            ],

            bonding: [
                { word: 'covalent', difficulty: 'intermediate', points: 7 },
                { word: 'ionic', difficulty: 'intermediate', points: 6 },
                { word: 'molecule', difficulty: 'basic', points: 6 },
                { word: 'atom', difficulty: 'basic', points: 4 },
                { word: 'electron', difficulty: 'basic', points: 6 },
                { word: 'valence', difficulty: 'advanced', points: 7 },
                { word: 'bond', difficulty: 'basic', points: 4 },
                { word: 'polar', difficulty: 'intermediate', points: 5 },
                { word: 'nonpolar', difficulty: 'intermediate', points: 7 }
            ],

            states: [
                { word: 'solid', difficulty: 'basic', points: 4 },
                { word: 'liquid', difficulty: 'basic', points: 4 },
                { word: 'gas', difficulty: 'basic', points: 3 },
                { word: 'plasma', difficulty: 'intermediate', points: 6 },
                { word: 'sublimation', difficulty: 'advanced', points: 10 },
                { word: 'condensation', difficulty: 'intermediate', points: 10 },
                { word: 'evaporation', difficulty: 'intermediate', points: 10 },
                { word: 'melting', difficulty: 'basic', points: 6 },
                { word: 'freezing', difficulty: 'basic', points: 6 }
            ],

            'acids-bases': [
                { word: 'acid', difficulty: 'basic', points: 4 },
                { word: 'base', difficulty: 'basic', points: 4 },
                { word: 'pH', type: 'symbol', definition: 'Acidity measure', validCategories: ['acids-bases'], difficulty: 'basic', points: 4 },
                { word: 'neutral', difficulty: 'basic', points: 6 },
                { word: 'alkaline', difficulty: 'intermediate', points: 7 },
                { word: 'buffer', difficulty: 'intermediate', points: 6 },
                { word: 'indicator', difficulty: 'intermediate', points: 9 },
                { word: 'titration', difficulty: 'advanced', points: 9 },
                { word: 'hydronium', difficulty: 'advanced', points: 8 }
            ]
        },

        abbreviations: {
            // Elements
            'hydrogen': 'H',
            'oxygen': 'O',
            'carbon': 'C',
            'nitrogen': 'N',
            'helium': 'He',
            'iron': 'Fe',
            'gold': 'Au',
            'silver': 'Ag',
            'sodium': 'Na',
            'chlorine': 'Cl',
            'calcium': 'Ca',
            'uranium': 'U',
            'aluminum': 'Al',
            'copper': 'Cu',

            // Organic
            'methane': 'CH₄',
            'ethanol': 'EtOH',
            'glucose': 'C₆H₁₂O₆',
            'protein': 'protein',
            'benzene': 'C₆H₆',
            'polymer': 'polymer',
            'alkane': 'alkane',
            'carboxyl': 'COOH',
            'amino acid': 'amino',
            'lipid': 'lipid',

            // Reactions
            'combustion': 'combust',
            'oxidation': 'oxidat.',
            'reduction': 'reduct.',
            'catalyst': 'catalys',
            'exothermic': 'exo',
            'endothermic': 'endo',
            'synthesis': 'synth.',
            'decomposition': 'decomp',
            'equilibrium': 'equilib',

            // Bonding
            'covalent': 'covalen',
            'ionic': 'ionic',
            'molecule': 'molecul',
            'atom': 'atom',
            'electron': 'e⁻',
            'valence': 'valence',
            'bond': 'bond',
            'polar': 'polar',
            'nonpolar': 'nonpol',

            // States
            'solid': 'solid',
            'liquid': 'liquid',
            'gas': 'gas',
            'plasma': 'plasma',
            'sublimation': 'sublim',
            'condensation': 'condens',
            'evaporation': 'evapor',
            'melting': 'melting',
            'freezing': 'freezin',

            // Acids & Bases
            'acid': 'acid',
            'base': 'base',
            'neutral': 'neutral',
            'alkaline': 'alkalin',
            'buffer': 'buffer',
            'indicator': 'indicat',
            'titration': 'titrat.',
            'hydronium': 'H₃O⁺'
        },

        ambiguousSymbols: [
            // C removed - Carbon is unambiguous within Chemistry domain
        ]
    },

    'computer-science': {
        name: 'Computer Science',
        icon: '💻',
        description: 'Algorithms, data structures, and computing',

        categories: [
            {
                id: 'data-structures',
                name: 'Data Structures',
                icon: '📊',
                description: 'Arrays, trees, graphs, queues'
            },
            {
                id: 'algorithms',
                name: 'Algorithms',
                icon: '🔄',
                description: 'Sorting, searching, optimization'
            },
            {
                id: 'programming',
                name: 'Programming',
                icon: '⌨️',
                description: 'Languages, paradigms, syntax'
            },
            {
                id: 'networks',
                name: 'Networks',
                icon: '🌐',
                description: 'Internet, protocols, communication'
            },
            {
                id: 'databases',
                name: 'Databases',
                icon: '🗄️',
                description: 'SQL, NoSQL, storage'
            },
            {
                id: 'security',
                name: 'Security',
                icon: '🔒',
                description: 'Encryption, authentication, safety'
            }
        ],

        words: {
            'data-structures': [
                // Basic
                { word: 'array', difficulty: 'basic', points: 4 },
                { word: 'list', difficulty: 'basic', points: 3 },
                { word: 'stack', difficulty: 'basic', points: 4 },
                { word: 'queue', difficulty: 'basic', points: 4 },
                { word: 'tree', difficulty: 'basic', points: 4 },
                { word: 'graph', difficulty: 'basic', points: 5 },
                { word: 'node', difficulty: 'basic', points: 4 },
                // Intermediate
                { word: 'hash table', difficulty: 'intermediate', points: 8 },
                { word: 'linked list', difficulty: 'intermediate', points: 9 },
                { word: 'binary tree', difficulty: 'intermediate', points: 9 },
                { word: 'heap', difficulty: 'intermediate', points: 5 },
                { word: 'dictionary', difficulty: 'intermediate', points: 9 },
                // Advanced
                { word: 'red-black tree', difficulty: 'advanced', points: 12 },
                { word: 'trie', difficulty: 'advanced', points: 6 }
            ],

            algorithms: [
                // Basic
                { word: 'sort', difficulty: 'basic', points: 4 },
                { word: 'search', difficulty: 'basic', points: 5 },
                { word: 'loop', difficulty: 'basic', points: 4 },
                { word: 'iteration', difficulty: 'basic', points: 8 },
                // Intermediate
                { word: 'binary search', difficulty: 'intermediate', points: 11 },
                { word: 'quicksort', difficulty: 'intermediate', points: 8 },
                { word: 'merge sort', difficulty: 'intermediate', points: 9 },
                { word: 'recursion', difficulty: 'intermediate', points: 8 },
                { word: 'greedy', difficulty: 'intermediate', points: 6 },
                { word: 'divide and conquer', difficulty: 'intermediate', points: 16 },
                // Advanced
                { word: 'dynamic programming', difficulty: 'advanced', points: 16 },
                { word: 'backtracking', difficulty: 'advanced', points: 11 },
                // Big-O notation symbols
                { word: 'O(n)', type: 'symbol', definition: 'Linear time complexity', validCategories: ['algorithms'], difficulty: 'intermediate', points: 6 },
                { word: 'O(log n)', type: 'symbol', definition: 'Logarithmic time', validCategories: ['algorithms'], difficulty: 'advanced', points: 8 },
                { word: 'O(1)', type: 'symbol', definition: 'Constant time', validCategories: ['algorithms'], difficulty: 'intermediate', points: 6 }
            ],

            programming: [
                // Basic
                { word: 'variable', difficulty: 'basic', points: 6 },
                { word: 'function', difficulty: 'basic', points: 6 },
                { word: 'loop', difficulty: 'basic', points: 4 },
                { word: 'string', difficulty: 'basic', points: 5 },
                { word: 'integer', difficulty: 'basic', points: 6 },
                { word: 'boolean', difficulty: 'basic', points: 6 },
                // Intermediate
                { word: 'class', difficulty: 'intermediate', points: 5 },
                { word: 'object', difficulty: 'intermediate', points: 6 },
                { word: 'inheritance', difficulty: 'intermediate', points: 10 },
                { word: 'encapsulation', difficulty: 'intermediate', points: 12 },
                { word: 'API', type: 'acronym', definition: 'Application Programming Interface', validCategories: ['programming'], difficulty: 'intermediate', points: 5 },
                { word: 'compiler', difficulty: 'intermediate', points: 8 },
                { word: 'interpreter', difficulty: 'intermediate', points: 10 },
                // Advanced
                { word: 'polymorphism', difficulty: 'advanced', points: 11 },
                { word: 'closure', difficulty: 'advanced', points: 7 },
                { word: 'lambda', difficulty: 'advanced', points: 6 }
            ],

            networks: [
                // Basic
                { word: 'internet', difficulty: 'basic', points: 6 },
                { word: 'web', difficulty: 'basic', points: 3 },
                { word: 'server', difficulty: 'basic', points: 6 },
                { word: 'client', difficulty: 'basic', points: 6 },
                { word: 'router', difficulty: 'basic', points: 6 },
                // Intermediate
                { word: 'HTTP', type: 'acronym', definition: 'HyperText Transfer Protocol', validCategories: ['networks'], difficulty: 'basic', points: 5 },
                { word: 'TCP', type: 'acronym', definition: 'Transmission Control Protocol', validCategories: ['networks'], difficulty: 'intermediate', points: 5 },
                { word: 'IP', type: 'acronym', definition: 'Internet Protocol', validCategories: ['networks'], difficulty: 'basic', points: 4 },
                { word: 'DNS', type: 'acronym', definition: 'Domain Name System', validCategories: ['networks'], difficulty: 'intermediate', points: 5 },
                { word: 'URL', type: 'acronym', definition: 'Uniform Resource Locator', validCategories: ['networks'], difficulty: 'basic', points: 5 },
                { word: 'firewall', difficulty: 'intermediate', points: 7 },
                { word: 'bandwidth', difficulty: 'intermediate', points: 8 },
                { word: 'latency', difficulty: 'intermediate', points: 7 },
                // Advanced
                { word: 'protocol', difficulty: 'advanced', points: 8 },
                { word: 'packet', difficulty: 'advanced', points: 6 }
            ],

            databases: [
                // Basic
                { word: 'table', difficulty: 'basic', points: 4 },
                { word: 'row', difficulty: 'basic', points: 3 },
                { word: 'column', difficulty: 'basic', points: 6 },
                { word: 'data', difficulty: 'basic', points: 4 },
                // Intermediate
                { word: 'SQL', type: 'acronym', definition: 'Structured Query Language', validCategories: ['databases'], difficulty: 'basic', points: 5 },
                { word: 'query', difficulty: 'basic', points: 5 },
                { word: 'index', difficulty: 'intermediate', points: 6 },
                { word: 'join', difficulty: 'intermediate', points: 5 },
                { word: 'transaction', difficulty: 'intermediate', points: 10 },
                { word: 'primary key', difficulty: 'intermediate', points: 9 },
                { word: 'foreign key', difficulty: 'intermediate', points: 9 },
                { word: 'NoSQL', type: 'acronym', definition: 'Not Only SQL', validCategories: ['databases'], difficulty: 'intermediate', points: 6 },
                // Advanced
                { word: 'normalization', difficulty: 'advanced', points: 12 },
                { word: 'ACID', type: 'acronym', definition: 'Atomicity, Consistency, Isolation, Durability', validCategories: ['databases'], difficulty: 'advanced', points: 6 }
            ],

            security: [
                // Basic
                { word: 'password', difficulty: 'basic', points: 6 },
                { word: 'username', difficulty: 'basic', points: 6 },
                { word: 'login', difficulty: 'basic', points: 5 },
                { word: 'authentication', difficulty: 'basic', points: 12 },
                // Intermediate
                { word: 'encryption', difficulty: 'intermediate', points: 9 },
                { word: 'hash', difficulty: 'intermediate', points: 5 },
                { word: 'SSL', type: 'acronym', definition: 'Secure Sockets Layer', validCategories: ['security'], difficulty: 'intermediate', points: 5 },
                { word: 'firewall', difficulty: 'intermediate', points: 7 },
                { word: 'malware', difficulty: 'basic', points: 6 },
                { word: 'virus', difficulty: 'basic', points: 5 },
                { word: 'token', difficulty: 'intermediate', points: 5 },
                // Advanced
                { word: 'cryptography', difficulty: 'advanced', points: 11 },
                { word: 'RSA', type: 'acronym', definition: 'Rivest-Shamir-Adleman encryption', validCategories: ['security'], difficulty: 'advanced', points: 5 },
                { word: 'OAuth', type: 'acronym', definition: 'Open Authorization', validCategories: ['security'], difficulty: 'advanced', points: 7 }
            ]
        },

        abbreviations: {
            // Data Structures
            'array': 'arr',
            'list': 'list',
            'stack': 'stack',
            'queue': 'queue',
            'tree': 'tree',
            'graph': 'graph',
            'node': 'node',
            'hash table': 'hash',
            'linked list': 'linked',
            'binary tree': 'binary',
            'heap': 'heap',
            'dictionary': 'dict',
            'red-black tree': 'RB tree',
            'trie': 'trie',

            // Algorithms
            'sort': 'sort',
            'search': 'search',
            'loop': 'loop',
            'iteration': 'iter',
            'binary search': 'binsrch',
            'quicksort': 'qsort',
            'merge sort': 'msort',
            'recursion': 'recur',
            'greedy': 'greedy',
            'divide and conquer': 'D&C',
            'dynamic programming': 'DP',
            'backtracking': 'backtr',

            // Programming
            'variable': 'var',
            'function': 'fn',
            'string': 'str',
            'integer': 'int',
            'boolean': 'bool',
            'class': 'class',
            'object': 'obj',
            'inheritance': 'inherit',
            'encapsulation': 'encap',
            'compiler': 'compile',
            'interpreter': 'interp',
            'polymorphism': 'polymor',
            'closure': 'closure',
            'lambda': 'λ',

            // Networks
            'internet': 'net',
            'web': 'web',
            'server': 'server',
            'client': 'client',
            'router': 'router',
            'firewall': 'firewal',
            'bandwidth': 'bandwid',
            'latency': 'latency',
            'protocol': 'proto',
            'packet': 'packet',

            // Databases
            'table': 'table',
            'row': 'row',
            'column': 'col',
            'data': 'data',
            'query': 'query',
            'index': 'index',
            'join': 'join',
            'transaction': 'transac',
            'primary key': 'PK',
            'foreign key': 'FK',
            'normalization': 'normal',

            // Security
            'password': 'passwd',
            'username': 'user',
            'login': 'login',
            'authentication': 'auth',
            'encryption': 'encrypt',
            'hash': 'hash',
            'malware': 'malware',
            'virus': 'virus',
            'token': 'token',
            'cryptography': 'crypto'
        },

        ambiguousSymbols: []
    },

    biology: {
        name: 'Biology',
        icon: '🧬',
        description: 'Life, cells, evolution, and ecosystems',

        categories: [
            {
                id: 'cell-biology',
                name: 'Cell Biology',
                icon: '🦠',
                description: 'Cell structure, organelles, membranes'
            },
            {
                id: 'genetics',
                name: 'Genetics',
                icon: '🧬',
                description: 'Heredity, genes, and DNA'
            },
            {
                id: 'evolution',
                name: 'Evolution',
                icon: '🦕',
                description: 'Natural selection and adaptation'
            },
            {
                id: 'ecology',
                name: 'Ecology',
                icon: '🌿',
                description: 'Ecosystems and environments'
            },
            {
                id: 'anatomy',
                name: 'Anatomy',
                icon: '🫀',
                description: 'Body systems and functions'
            },
            {
                id: 'microbiology',
                name: 'Microbiology',
                icon: '🦠',
                description: 'Bacteria, viruses, and microbes'
            }
        ],

        words: {
            'cell-biology': [
                // Basic terms
                { word: 'cell', difficulty: 'basic', points: 4 },
                { word: 'nucleus', difficulty: 'basic', points: 7 },
                { word: 'membrane', difficulty: 'basic', points: 8 },
                { word: 'cytoplasm', difficulty: 'basic', points: 9 },
                { word: 'mitochondria', difficulty: 'basic', points: 12 },
                { word: 'ribosome', difficulty: 'basic', points: 8 },
                { word: 'DNA', type: 'acronym', definition: 'Deoxyribonucleic Acid', validCategories: ['cell-biology'], difficulty: 'basic', points: 5 },
                { word: 'RNA', type: 'acronym', definition: 'Ribonucleic Acid', validCategories: ['cell-biology'], difficulty: 'basic', points: 5 },
                { word: 'protein', difficulty: 'basic', points: 7 },
                { word: 'enzyme', difficulty: 'basic', points: 6 },
                // Intermediate terms
                { word: 'endoplasmic reticulum', difficulty: 'intermediate', points: 18 },
                { word: 'golgi apparatus', difficulty: 'intermediate', points: 13 },
                { word: 'lysosome', difficulty: 'intermediate', points: 8 },
                { word: 'vacuole', difficulty: 'intermediate', points: 7 },
                { word: 'chloroplast', difficulty: 'intermediate', points: 11 },
                { word: 'cell wall', difficulty: 'intermediate', points: 8 },
                { word: 'ATP', type: 'acronym', definition: 'Adenosine Triphosphate', validCategories: ['cell-biology'], difficulty: 'intermediate', points: 5 },
                { word: 'chromosome', difficulty: 'intermediate', points: 10 },
                // Advanced terms
                { word: 'telomere', difficulty: 'advanced', points: 8 },
                { word: 'centrosome', difficulty: 'advanced', points: 10 },
                { word: 'nucleolus', difficulty: 'advanced', points: 9 },
                { word: 'cristae', difficulty: 'advanced', points: 7 },
                { word: 'thylakoid', difficulty: 'advanced', points: 9 }
            ],

            genetics: [
                // Basic terms
                { word: 'gene', difficulty: 'basic', points: 4 },
                { word: 'allele', difficulty: 'basic', points: 6 },
                { word: 'trait', difficulty: 'basic', points: 5 },
                { word: 'inherit', difficulty: 'basic', points: 7 },
                { word: 'dominant', difficulty: 'basic', points: 8 },
                { word: 'recessive', difficulty: 'basic', points: 9 },
                { word: 'chromosome', difficulty: 'basic', points: 10 },
                { word: 'mutation', difficulty: 'basic', points: 8 },
                { word: 'DNA', type: 'acronym', definition: 'Deoxyribonucleic Acid', validCategories: ['genetics'], difficulty: 'basic', points: 5 },
                { word: 'RNA', type: 'acronym', definition: 'Ribonucleic Acid', validCategories: ['genetics'], difficulty: 'basic', points: 5 },
                // Intermediate terms
                { word: 'genotype', difficulty: 'intermediate', points: 8 },
                { word: 'phenotype', difficulty: 'intermediate', points: 9 },
                { word: 'heterozygous', difficulty: 'intermediate', points: 12 },
                { word: 'homozygous', difficulty: 'intermediate', points: 10 },
                { word: 'punnett square', difficulty: 'intermediate', points: 13 },
                { word: 'crossing over', difficulty: 'intermediate', points: 12 },
                { word: 'meiosis', difficulty: 'intermediate', points: 7 },
                { word: 'mitosis', difficulty: 'intermediate', points: 7 },
                // Advanced terms
                { word: 'epistasis', difficulty: 'advanced', points: 9 },
                { word: 'pleiotropy', difficulty: 'advanced', points: 10 },
                { word: 'linkage', difficulty: 'advanced', points: 7 },
                { word: 'recombination', difficulty: 'advanced', points: 13 },
                { word: 'transcription', difficulty: 'advanced', points: 13 },
                { word: 'translation', difficulty: 'advanced', points: 11 }
            ],

            evolution: [
                // Basic terms
                { word: 'evolution', difficulty: 'basic', points: 9 },
                { word: 'species', difficulty: 'basic', points: 7 },
                { word: 'fossil', difficulty: 'basic', points: 6 },
                { word: 'adapt', difficulty: 'basic', points: 5 },
                { word: 'natural selection', difficulty: 'basic', points: 16 },
                { word: 'survival', difficulty: 'basic', points: 8 },
                { word: 'extinction', difficulty: 'basic', points: 10 },
                { word: 'ancestor', difficulty: 'basic', points: 8 },
                { word: 'descent', difficulty: 'basic', points: 7 },
                // Intermediate terms
                { word: 'speciation', difficulty: 'intermediate', points: 10 },
                { word: 'adaptation', difficulty: 'intermediate', points: 10 },
                { word: 'fitness', difficulty: 'intermediate', points: 7 },
                { word: 'gene pool', difficulty: 'intermediate', points: 8 },
                { word: 'genetic drift', difficulty: 'intermediate', points: 12 },
                { word: 'mutation', difficulty: 'intermediate', points: 8 },
                { word: 'homology', difficulty: 'intermediate', points: 8 },
                { word: 'vestigial', difficulty: 'intermediate', points: 9 },
                // Advanced terms
                { word: 'allopatric', difficulty: 'advanced', points: 10 },
                { word: 'sympatric', difficulty: 'advanced', points: 9 },
                { word: 'convergent evolution', difficulty: 'advanced', points: 18 },
                { word: 'divergent', difficulty: 'advanced', points: 9 },
                { word: 'coevolution', difficulty: 'advanced', points: 11 },
                { word: 'phylogeny', difficulty: 'advanced', points: 9 }
            ],

            ecology: [
                // Basic terms
                { word: 'ecosystem', difficulty: 'basic', points: 9 },
                { word: 'habitat', difficulty: 'basic', points: 7 },
                { word: 'niche', difficulty: 'basic', points: 5 },
                { word: 'food chain', difficulty: 'basic', points: 9 },
                { word: 'predator', difficulty: 'basic', points: 8 },
                { word: 'prey', difficulty: 'basic', points: 4 },
                { word: 'producer', difficulty: 'basic', points: 8 },
                { word: 'consumer', difficulty: 'basic', points: 8 },
                { word: 'biome', difficulty: 'basic', points: 5 },
                // Intermediate terms
                { word: 'food web', difficulty: 'intermediate', points: 7 },
                { word: 'trophic level', difficulty: 'intermediate', points: 12 },
                { word: 'biomass', difficulty: 'intermediate', points: 7 },
                { word: 'symbiosis', difficulty: 'intermediate', points: 9 },
                { word: 'mutualism', difficulty: 'intermediate', points: 9 },
                { word: 'parasitism', difficulty: 'intermediate', points: 10 },
                { word: 'commensalism', difficulty: 'intermediate', points: 12 },
                { word: 'biodiversity', difficulty: 'intermediate', points: 12 },
                // Advanced terms
                { word: 'keystone species', difficulty: 'advanced', points: 15 },
                { word: 'pioneer species', difficulty: 'advanced', points: 14 },
                { word: 'succession', difficulty: 'advanced', points: 10 },
                { word: 'eutrophication', difficulty: 'advanced', points: 14 },
                { word: 'biogeochemical cycle', difficulty: 'advanced', points: 20 },
                { word: 'carrying capacity', difficulty: 'advanced', points: 16 }
            ],

            anatomy: [
                // Basic terms
                { word: 'organ', difficulty: 'basic', points: 5 },
                { word: 'tissue', difficulty: 'basic', points: 6 },
                { word: 'muscle', difficulty: 'basic', points: 6 },
                { word: 'bone', difficulty: 'basic', points: 4 },
                { word: 'heart', difficulty: 'basic', points: 5 },
                { word: 'lung', difficulty: 'basic', points: 4 },
                { word: 'brain', difficulty: 'basic', points: 5 },
                { word: 'blood', difficulty: 'basic', points: 5 },
                { word: 'nerve', difficulty: 'basic', points: 5 },
                { word: 'skin', difficulty: 'basic', points: 4 },
                // Intermediate terms
                { word: 'circulatory', difficulty: 'intermediate', points: 11 },
                { word: 'respiratory', difficulty: 'intermediate', points: 11 },
                { word: 'digestive', difficulty: 'intermediate', points: 9 },
                { word: 'nervous', difficulty: 'intermediate', points: 7 },
                { word: 'skeletal', difficulty: 'intermediate', points: 8 },
                { word: 'muscular', difficulty: 'intermediate', points: 8 },
                { word: 'cardiovascular', difficulty: 'intermediate', points: 14 },
                { word: 'homeostasis', difficulty: 'intermediate', points: 11 },
                // Advanced terms
                { word: 'endocrine', difficulty: 'advanced', points: 9 },
                { word: 'lymphatic', difficulty: 'advanced', points: 9 },
                { word: 'integumentary', difficulty: 'advanced', points: 13 },
                { word: 'neurotransmitter', difficulty: 'advanced', points: 16 },
                { word: 'hormone', difficulty: 'advanced', points: 7 },
                { word: 'synapse', difficulty: 'advanced', points: 7 },
                { word: 'nephron', difficulty: 'advanced', points: 7 },
                // Acronyms
                { word: 'RBC', type: 'acronym', definition: 'Red Blood Cell', validCategories: ['anatomy'], difficulty: 'intermediate', points: 5 },
                { word: 'WBC', type: 'acronym', definition: 'White Blood Cell', validCategories: ['anatomy'], difficulty: 'intermediate', points: 5 },
                { word: 'CNS', type: 'acronym', definition: 'Central Nervous System', validCategories: ['anatomy'], difficulty: 'intermediate', points: 5 },
                { word: 'PNS', type: 'acronym', definition: 'Peripheral Nervous System', validCategories: ['anatomy'], difficulty: 'intermediate', points: 5 }
            ],

            microbiology: [
                // Basic terms
                { word: 'bacteria', difficulty: 'basic', points: 8 },
                { word: 'virus', difficulty: 'basic', points: 5 },
                { word: 'microbe', difficulty: 'basic', points: 7 },
                { word: 'germ', difficulty: 'basic', points: 4 },
                { word: 'pathogen', difficulty: 'basic', points: 8 },
                { word: 'infection', difficulty: 'basic', points: 9 },
                { word: 'antibody', difficulty: 'basic', points: 8 },
                { word: 'vaccine', difficulty: 'basic', points: 7 },
                { word: 'fungus', difficulty: 'basic', points: 6 },
                { word: 'yeast', difficulty: 'basic', points: 5 },
                // Intermediate terms
                { word: 'prokaryote', difficulty: 'intermediate', points: 10 },
                { word: 'eukaryote', difficulty: 'intermediate', points: 9 },
                { word: 'archaea', difficulty: 'intermediate', points: 7 },
                { word: 'phage', difficulty: 'intermediate', points: 5 },
                { word: 'plasmid', difficulty: 'intermediate', points: 7 },
                { word: 'spore', difficulty: 'intermediate', points: 5 },
                { word: 'culture', difficulty: 'intermediate', points: 7 },
                { word: 'colony', difficulty: 'intermediate', points: 6 },
                { word: 'antibiotic', difficulty: 'intermediate', points: 10 },
                // Advanced terms
                { word: 'gram-positive', difficulty: 'advanced', points: 13 },
                { word: 'gram-negative', difficulty: 'advanced', points: 13 },
                { word: 'capsid', difficulty: 'advanced', points: 6 },
                { word: 'lysogenic', difficulty: 'advanced', points: 9 },
                { word: 'lytic', difficulty: 'advanced', points: 5 },
                { word: 'prion', difficulty: 'advanced', points: 5 },
                { word: 'endospore', difficulty: 'advanced', points: 9 },
                { word: 'conjugation', difficulty: 'advanced', points: 11 },
                // Scientific names
                { word: 'E. coli', type: 'symbol', definition: 'Escherichia coli', validCategories: ['microbiology'], difficulty: 'intermediate', points: 7 },
                { word: 'COVID-19', type: 'symbol', definition: 'Coronavirus Disease 2019', validCategories: ['microbiology'], difficulty: 'basic', points: 8 },
                { word: 'HIV', type: 'acronym', definition: 'Human Immunodeficiency Virus', validCategories: ['microbiology'], difficulty: 'intermediate', points: 5 }
            ]
        },

        abbreviations: {
            // Cell Biology
            'cell': 'cell',
            'nucleus': 'nucleus',
            'membrane': 'membr.',
            'cytoplasm': 'cytopla',
            'mitochondria': 'mito',
            'ribosome': 'ribosom',
            'protein': 'protein',
            'enzyme': 'enzyme',
            'endoplasmic reticulum': 'ER',
            'golgi apparatus': 'Golgi',
            'lysosome': 'lyso',
            'vacuole': 'vacuole',
            'chloroplast': 'chloro',
            'cell wall': 'wall',
            'chromosome': 'chromo',
            'telomere': 'telomer',
            'centrosome': 'centro',
            'nucleolus': 'nucleol',
            'cristae': 'cristae',
            'thylakoid': 'thylak',

            // Genetics
            'gene': 'gene',
            'allele': 'allele',
            'trait': 'trait',
            'inherit': 'inherit',
            'dominant': 'dom',
            'recessive': 'rec',
            'mutation': 'mutate',
            'genotype': 'genotyp',
            'phenotype': 'phenoty',
            'heterozygous': 'hetero',
            'homozygous': 'homo',
            'punnett square': 'Punnett',
            'crossing over': 'cross.',
            'meiosis': 'meiosis',
            'mitosis': 'mitosis',
            'epistasis': 'epistasis',
            'pleiotropy': 'pleio',
            'linkage': 'linkage',
            'recombination': 'recombi',
            'transcription': 'transcr',
            'translation': 'transla',

            // Evolution
            'evolution': 'evolut',
            'species': 'species',
            'fossil': 'fossil',
            'adapt': 'adapt',
            'natural selection': 'nat sel',
            'survival': 'survive',
            'extinction': 'extinct',
            'ancestor': 'ancesto',
            'descent': 'descent',
            'speciation': 'speciat',
            'adaptation': 'adaptat',
            'fitness': 'fitness',
            'gene pool': 'gene p.',
            'genetic drift': 'drift',
            'homology': 'homolog',
            'vestigial': 'vestig',
            'allopatric': 'allop',
            'sympatric': 'symp',
            'convergent evolution': 'converg',
            'divergent': 'diverg',
            'coevolution': 'coevol',
            'phylogeny': 'phylo',

            // Ecology
            'ecosystem': 'ecosyst',
            'habitat': 'habitat',
            'niche': 'niche',
            'food chain': 'fd chain',
            'predator': 'predatr',
            'prey': 'prey',
            'producer': 'produce',
            'consumer': 'consume',
            'biome': 'biome',
            'food web': 'fd web',
            'trophic level': 'trophic',
            'biomass': 'biomass',
            'symbiosis': 'symbios',
            'mutualism': 'mutual',
            'parasitism': 'parasit',
            'commensalism': 'commensal',
            'biodiversity': 'biodiv',
            'keystone species': 'keystone',
            'pioneer species': 'pioneer',
            'succession': 'success',
            'eutrophication': 'eutro',
            'biogeochemical cycle': 'biogeo',
            'carrying capacity': 'carry',

            // Anatomy
            'organ': 'organ',
            'tissue': 'tissue',
            'muscle': 'muscle',
            'bone': 'bone',
            'heart': 'heart',
            'lung': 'lung',
            'brain': 'brain',
            'blood': 'blood',
            'nerve': 'nerve',
            'skin': 'skin',
            'circulatory': 'circula',
            'respiratory': 'respira',
            'digestive': 'digest',
            'nervous': 'nervous',
            'skeletal': 'skeleta',
            'muscular': 'muscula',
            'cardiovascular': 'cardio',
            'homeostasis': 'homeo',
            'endocrine': 'endocri',
            'lymphatic': 'lymph',
            'integumentary': 'integum',
            'neurotransmitter': 'neurot',
            'hormone': 'hormone',
            'synapse': 'synapse',
            'nephron': 'nephron',

            // Microbiology
            'bacteria': 'bacteri',
            'virus': 'virus',
            'microbe': 'microbe',
            'germ': 'germ',
            'pathogen': 'pathogn',
            'infection': 'infect',
            'antibody': 'antibod',
            'vaccine': 'vaccine',
            'fungus': 'fungus',
            'yeast': 'yeast',
            'prokaryote': 'prokary',
            'eukaryote': 'eukary',
            'archaea': 'archaea',
            'phage': 'phage',
            'plasmid': 'plasmid',
            'spore': 'spore',
            'culture': 'culture',
            'colony': 'colony',
            'antibiotic': 'antibio',
            'gram-positive': 'gram+',
            'gram-negative': 'gram-',
            'capsid': 'capsid',
            'lysogenic': 'lysogen',
            'lytic': 'lytic',
            'prion': 'prion',
            'endospore': 'endospo',
            'conjugation': 'conjuga'
        },

        ambiguousSymbols: [
            {
                word: 'DNA',
                type: 'acronym',
                definition: 'Deoxyribonucleic Acid',
                validCategories: ['cell-biology', 'genetics'],
                difficulty: 'basic',
                points: 5
            },
            {
                word: 'mutation',
                type: 'word',
                definition: 'Genetic change (genetics) OR Evolution driver (evolution)',
                validCategories: ['genetics', 'evolution'],
                difficulty: 'basic',
                points: 8
            }
        ]
    },

    mathematics: {
        name: 'Mathematics',
        icon: '📐',
        description: 'Numbers, equations, shapes, and logic',

        categories: [
            {
                id: 'algebra',
                name: 'Algebra',
                icon: '🔢',
                description: 'Variables, equations, and expressions'
            },
            {
                id: 'geometry',
                name: 'Geometry',
                icon: '📐',
                description: 'Shapes, angles, and space'
            },
            {
                id: 'calculus',
                name: 'Calculus',
                icon: '∫',
                description: 'Limits, derivatives, and integrals'
            },
            {
                id: 'statistics',
                name: 'Statistics',
                icon: '📊',
                description: 'Data analysis and chance'
            },
            {
                id: 'trigonometry',
                name: 'Trigonometry',
                icon: '📐',
                description: 'Triangles and circular functions'
            },
            {
                id: 'logic',
                name: 'Logic',
                icon: '💭',
                description: 'Sets, proofs, and reasoning'
            }
        ],

        words: {
            algebra: [
                // Basic terms
                { word: 'variable', difficulty: 'basic', points: 8 },
                { word: 'equation', difficulty: 'basic', points: 8 },
                { word: 'solve', difficulty: 'basic', points: 5 },
                { word: 'exponent', difficulty: 'basic', points: 8 },
                { word: 'factor', difficulty: 'basic', points: 6 },
                { word: 'term', difficulty: 'basic', points: 4 },
                // Intermediate terms
                { word: 'polynomial', difficulty: 'intermediate', points: 10 },
                { word: 'quadratic', difficulty: 'intermediate', points: 9 },
                { word: 'coefficient', difficulty: 'intermediate', points: 11 },
                { word: 'slope', difficulty: 'intermediate', points: 5 },
                { word: 'inequality', difficulty: 'intermediate', points: 10 },
                { word: 'linear', difficulty: 'intermediate', points: 6 },
                // Advanced terms
                { word: 'logarithm', difficulty: 'advanced', points: 9 },
                { word: 'exponential', difficulty: 'advanced', points: 11 },
                { word: 'asymptote', difficulty: 'advanced', points: 9 },
                // Symbols
                { word: 'x', type: 'symbol', definition: 'Variable x', validCategories: ['algebra'], difficulty: 'basic', points: 3 },
                { word: 'y', type: 'symbol', definition: 'Variable y', validCategories: ['algebra'], difficulty: 'basic', points: 3 },
                { word: '=', type: 'symbol', definition: 'Equals', validCategories: ['algebra'], difficulty: 'basic', points: 3 },
                { word: '±', type: 'symbol', definition: 'Plus-minus', validCategories: ['algebra'], difficulty: 'basic', points: 3 },
                { word: '√', type: 'symbol', definition: 'Square root', validCategories: ['algebra'], difficulty: 'basic', points: 3 },
                { word: '∞', type: 'symbol', definition: 'Infinity', validCategories: ['algebra'], difficulty: 'intermediate', points: 4 },
                { word: 'log', type: 'symbol', definition: 'Logarithm', validCategories: ['algebra'], difficulty: 'advanced', points: 5 }
            ],

            geometry: [
                // Basic terms
                { word: 'angle', difficulty: 'basic', points: 5 },
                { word: 'circle', difficulty: 'basic', points: 6 },
                { word: 'triangle', difficulty: 'basic', points: 8 },
                { word: 'square', difficulty: 'basic', points: 6 },
                { word: 'area', difficulty: 'basic', points: 4 },
                { word: 'perimeter', difficulty: 'basic', points: 9 },
                { word: 'line', difficulty: 'basic', points: 4 },
                { word: 'point', difficulty: 'basic', points: 5 },
                // Intermediate terms
                { word: 'polygon', difficulty: 'intermediate', points: 7 },
                { word: 'diameter', difficulty: 'intermediate', points: 8 },
                { word: 'radius', difficulty: 'intermediate', points: 6 },
                { word: 'circumference', difficulty: 'intermediate', points: 13 },
                { word: 'volume', difficulty: 'intermediate', points: 6 },
                { word: 'rhombus', difficulty: 'intermediate', points: 7 },
                // Advanced terms
                { word: 'congruent', difficulty: 'advanced', points: 9 },
                { word: 'pythagorean', difficulty: 'advanced', points: 11 },
                { word: 'theorem', difficulty: 'advanced', points: 7 },
                // Symbols
                { word: 'π', type: 'symbol', definition: 'Pi', validCategories: ['geometry'], difficulty: 'basic', points: 3 },
                { word: '∠', type: 'symbol', definition: 'Angle', validCategories: ['geometry'], difficulty: 'basic', points: 3 },
                { word: '°', type: 'symbol', definition: 'Degree', validCategories: ['geometry'], difficulty: 'basic', points: 3 },
                { word: 'Δ', type: 'symbol', definition: 'Triangle/Delta', validCategories: ['geometry'], difficulty: 'intermediate', points: 4 },
                { word: '≅', type: 'symbol', definition: 'Congruent', validCategories: ['geometry'], difficulty: 'advanced', points: 4 }
            ],

            calculus: [
                // Basic terms
                { word: 'limit', difficulty: 'basic', points: 5 },
                { word: 'rate', difficulty: 'basic', points: 4 },
                { word: 'derivative', difficulty: 'basic', points: 10 },
                { word: 'integral', difficulty: 'basic', points: 8 },
                { word: 'function', difficulty: 'basic', points: 8 },
                { word: 'continuous', difficulty: 'basic', points: 10 },
                { word: 'slope', difficulty: 'basic', points: 5 },
                { word: 'change', difficulty: 'basic', points: 6 },
                // Intermediate terms
                { word: 'differentiation', difficulty: 'intermediate', points: 15 },
                { word: 'integration', difficulty: 'intermediate', points: 11 },
                { word: 'chain rule', difficulty: 'intermediate', points: 9 },
                { word: 'antiderivative', difficulty: 'intermediate', points: 14 },
                // Advanced terms
                { word: 'Taylor series', difficulty: 'advanced', points: 12 },
                { word: 'convergence', difficulty: 'advanced', points: 11 },
                // Symbols
                { word: 'd/dx', type: 'symbol', definition: 'Derivative', validCategories: ['calculus'], difficulty: 'intermediate', points: 6 },
                { word: '∫', type: 'symbol', definition: 'Integral', validCategories: ['calculus'], difficulty: 'intermediate', points: 4 },
                { word: '∂', type: 'symbol', definition: 'Partial derivative', validCategories: ['calculus'], difficulty: 'advanced', points: 5 },
                { word: 'lim', type: 'symbol', definition: 'Limit', validCategories: ['calculus'], difficulty: 'basic', points: 5 }
            ],

            statistics: [
                // Basic terms
                { word: 'mean', difficulty: 'basic', points: 4 },
                { word: 'median', difficulty: 'basic', points: 6 },
                { word: 'mode', difficulty: 'basic', points: 4 },
                { word: 'average', difficulty: 'basic', points: 7 },
                { word: 'data', difficulty: 'basic', points: 4 },
                { word: 'chance', difficulty: 'basic', points: 6 },
                { word: 'graph', difficulty: 'basic', points: 5 },
                // Intermediate terms
                { word: 'probability', difficulty: 'intermediate', points: 11 },
                { word: 'variance', difficulty: 'intermediate', points: 8 },
                { word: 'distribution', difficulty: 'intermediate', points: 12 },
                { word: 'correlation', difficulty: 'intermediate', points: 11 },
                { word: 'sample', difficulty: 'intermediate', points: 6 },
                // Advanced terms
                { word: 'z-score', difficulty: 'advanced', points: 7 },
                { word: 'regression', difficulty: 'advanced', points: 10 },
                { word: 'hypothesis', difficulty: 'advanced', points: 10 },
                // Symbols
                { word: 'μ', type: 'symbol', definition: 'Population mean (mu)', validCategories: ['statistics'], difficulty: 'intermediate', points: 4 },
                { word: 'σ', type: 'symbol', definition: 'Standard deviation (sigma)', validCategories: ['statistics'], difficulty: 'intermediate', points: 4 },
                { word: 'σ²', type: 'symbol', definition: 'Variance', validCategories: ['statistics'], difficulty: 'intermediate', points: 5 },
                { word: 'P(A)', type: 'symbol', definition: 'Probability of A', validCategories: ['statistics'], difficulty: 'intermediate', points: 6 }
            ],

            trigonometry: [
                // Basic terms
                { word: 'sine', difficulty: 'basic', points: 4 },
                { word: 'cosine', difficulty: 'basic', points: 6 },
                { word: 'tangent', difficulty: 'basic', points: 7 },
                { word: 'angle', difficulty: 'basic', points: 5 },
                { word: 'radian', difficulty: 'basic', points: 6 },
                { word: 'hypotenuse', difficulty: 'basic', points: 10 },
                { word: 'opposite', difficulty: 'basic', points: 8 },
                { word: 'adjacent', difficulty: 'basic', points: 8 },
                // Intermediate terms
                { word: 'secant', difficulty: 'intermediate', points: 6 },
                { word: 'unit circle', difficulty: 'intermediate', points: 10 },
                { word: 'period', difficulty: 'intermediate', points: 6 },
                { word: 'amplitude', difficulty: 'intermediate', points: 9 },
                // Advanced terms
                { word: 'law of sines', difficulty: 'advanced', points: 11 },
                { word: 'law of cosines', difficulty: 'advanced', points: 13 },
                // Symbols
                { word: 'sin', type: 'symbol', definition: 'Sine', validCategories: ['trigonometry'], difficulty: 'basic', points: 5 },
                { word: 'cos', type: 'symbol', definition: 'Cosine', validCategories: ['trigonometry'], difficulty: 'basic', points: 5 },
                { word: 'tan', type: 'symbol', definition: 'Tangent', validCategories: ['trigonometry'], difficulty: 'basic', points: 5 },
                { word: 'sec', type: 'symbol', definition: 'Secant', validCategories: ['trigonometry'], difficulty: 'intermediate', points: 5 },
                { word: 'θ', type: 'symbol', definition: 'Theta (angle)', validCategories: ['trigonometry'], difficulty: 'basic', points: 4 },
                { word: 'π', type: 'symbol', definition: 'Pi', validCategories: ['trigonometry'], difficulty: 'basic', points: 3 }
            ],

            logic: [
                // Basic terms
                { word: 'set', difficulty: 'basic', points: 3 },
                { word: 'element', difficulty: 'basic', points: 7 },
                { word: 'union', difficulty: 'basic', points: 5 },
                { word: 'intersection', difficulty: 'basic', points: 12 },
                { word: 'subset', difficulty: 'basic', points: 6 },
                { word: 'true', difficulty: 'basic', points: 4 },
                { word: 'false', difficulty: 'basic', points: 5 },
                { word: 'logic', difficulty: 'basic', points: 5 },
                // Intermediate terms
                { word: 'complement', difficulty: 'intermediate', points: 10 },
                { word: 'cardinality', difficulty: 'intermediate', points: 11 },
                { word: 'implication', difficulty: 'intermediate', points: 11 },
                { word: 'venn diagram', difficulty: 'intermediate', points: 11 },
                // Advanced terms
                { word: 'bijection', difficulty: 'advanced', points: 9 },
                { word: 'induction', difficulty: 'advanced', points: 9 },
                // Symbols
                { word: '∈', type: 'symbol', definition: 'Element of', validCategories: ['logic'], difficulty: 'basic', points: 3 },
                { word: '∪', type: 'symbol', definition: 'Union', validCategories: ['logic'], difficulty: 'basic', points: 3 },
                { word: '∩', type: 'symbol', definition: 'Intersection', validCategories: ['logic'], difficulty: 'basic', points: 3 },
                { word: '⊂', type: 'symbol', definition: 'Subset', validCategories: ['logic'], difficulty: 'basic', points: 3 },
                { word: '∅', type: 'symbol', definition: 'Empty set', validCategories: ['logic'], difficulty: 'intermediate', points: 3 },
                { word: '∀', type: 'symbol', definition: 'For all', validCategories: ['logic'], difficulty: 'intermediate', points: 4 },
                { word: '∃', type: 'symbol', definition: 'There exists', validCategories: ['logic'], difficulty: 'intermediate', points: 4 },
                { word: '⇒', type: 'symbol', definition: 'Implies', validCategories: ['logic'], difficulty: 'intermediate', points: 4 }
            ]
        },

        abbreviations: {
            // Algebra
            'variable': 'var',
            'equation': 'eq',
            'solve': 'solve',
            'add': 'add',
            'subtract': 'sub',
            'multiply': 'mult',
            'divide': 'div',
            'exponent': 'exp',
            'factor': 'factor',
            'term': 'term',
            'polynomial': 'poly',
            'quadratic': 'quad',
            'binomial': 'binom',
            'coefficient': 'coeff',
            'linear': 'linear',
            'slope': 'm',
            'intercept': 'b',
            'inequality': 'ineq',
            'absolute value': '|x|',
            'discriminant': 'Δ',
            'conjugate': 'conjug',
            'logarithm': 'log',
            'exponential': 'e^x',
            'asymptote': 'asympt',
            'rational expression': 'ratio',

            // Geometry
            'shape': 'shape',
            'angle': '∠',
            'line': 'line',
            'point': 'pt',
            'circle': 'circle',
            'triangle': 'Δ',
            'square': 'square',
            'rectangle': 'rect',
            'area': 'A',
            'perimeter': 'P',
            'polygon': 'poly',
            'parallelogram': 'parall',
            'trapezoid': 'trapez',
            'rhombus': 'rhomb',
            'diameter': 'd',
            'radius': 'r',
            'circumference': 'C',
            'volume': 'V',
            'surface area': 'SA',
            'congruent': '≅',
            'similar': '∼',
            'tangent': 'tan',
            'secant': 'sec',
            'chord': 'chord',
            'arc': 'arc',
            'pythagorean': 'Pythag',
            'theorem': 'thm',
            'proof': 'proof',

            // Calculus
            'limit': 'lim',
            'rate': 'rate',
            'change': 'Δ',
            'slope': 'm',
            'derivative': 'd/dx',
            'integral': '∫',
            'function': 'f(x)',
            'graph': 'graph',
            'continuous': 'contin',
            'differentiation': 'differ',
            'integration': 'integr',
            'chain rule': 'chain',
            'product rule': 'produc',
            'quotient rule': 'quotie',
            'antiderivative': 'antide',
            'fundamental theorem': 'FTC',
            'implicit differentiation': 'implic',
            'partial derivative': '∂',
            'Taylor series': 'Taylor',
            'convergence': 'convge',

            // Statistics
            'mean': 'μ',
            'median': 'median',
            'mode': 'mode',
            'range': 'range',
            'average': 'avg',
            'data': 'data',
            'graph': 'graph',
            'chart': 'chart',
            'chance': 'chance',
            'outcome': 'outcome',
            'probability': 'P',
            'variance': 'σ²',
            'deviation': 'σ',
            'distribution': 'dist',
            'correlation': 'r',
            'sample': 'sample',
            'population': 'pop',
            'outlier': 'outlie',
            'normal distribution': 'normal',
            'z-score': 'z',
            'p-value': 'p',
            'regression': 'regres',
            'hypothesis': 'H₀',
            'confidence interval': 'CI',
            'chi-square': 'χ²',

            // Trigonometry
            'sine': 'sin',
            'cosine': 'cos',
            'tangent': 'tan',
            'angle': '∠',
            'degree': '°',
            'radian': 'rad',
            'hypotenuse': 'hyp',
            'opposite': 'opp',
            'adjacent': 'adj',
            'right triangle': 'rt Δ',
            'secant': 'sec',
            'cosecant': 'csc',
            'cotangent': 'cot',
            'unit circle': 'unit ○',
            'period': 'period',
            'amplitude': 'A',
            'frequency': 'f',
            'phase shift': 'phase',
            'inverse trig': 'inv',
            'arctangent': 'arctan',
            'law of sines': 'sin law',
            'law of cosines': 'cos law',
            'polar coordinates': 'polar',
            'spherical': 'sphere',

            // Logic & Set Theory
            'set': 'set',
            'element': 'elem',
            'union': '∪',
            'intersection': '∩',
            'subset': '⊂',
            'logic': 'logic',
            'true': 'T',
            'false': 'F',
            'and': '∧',
            'or': '∨',
            'not': '¬',
            'complement': 'c',
            'universal set': 'U',
            'empty set': '∅',
            'cardinality': '|A|',
            'venn diagram': 'Venn',
            'implication': '⇒',
            'converse': 'conver',
            'De Morgan\'s laws': 'De Mrg',
            'bijection': 'bijec',
            'injection': 'injec',
            'surjection': 'surjec',
            'proof by contradiction': 'contra',
            'induction': 'induct'
        },

        ambiguousSymbols: [
            {
                word: 'π',
                type: 'symbol',
                definition: 'Pi (geometry) OR Pi (trigonometry)',
                validCategories: ['geometry', 'trigonometry'],
                difficulty: 'basic',
                points: 3
            },
            {
                word: 'Δ',
                type: 'symbol',
                definition: 'Triangle (geometry) OR Delta/Change (calculus)',
                validCategories: ['geometry', 'calculus'],
                difficulty: 'intermediate',
                points: 4
            },
            {
                word: 'Σ',
                type: 'symbol',
                definition: 'Summation (calculus) OR Summation (statistics)',
                validCategories: ['calculus', 'statistics'],
                difficulty: 'intermediate',
                points: 4
            },
            {
                word: 'x',
                type: 'symbol',
                definition: 'Variable (algebra) OR Coordinate (geometry)',
                validCategories: ['algebra', 'geometry'],
                difficulty: 'basic',
                points: 3
            },
            {
                word: 'y',
                type: 'symbol',
                definition: 'Variable (algebra) OR Coordinate (geometry)',
                validCategories: ['algebra', 'geometry'],
                difficulty: 'basic',
                points: 3
            }
        ]
    }
};

// Current selected domain (defaults to physics for backward compatibility)
let currentDomain = Domains.PHYSICS;

// Helper to get current domain data
function getCurrentDomainData() {
    return DomainData[currentDomain];
}

// Helper to set current domain
function setCurrentDomain(domain) {
    if (DomainData[domain]) {
        currentDomain = domain;
        // Store in localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('selectedDomain', domain);
        }
        return true;
    }
    return false;
}

// Load saved domain preference on init
if (typeof localStorage !== 'undefined') {
    const savedDomain = localStorage.getItem('selectedDomain');
    if (savedDomain && DomainData[savedDomain]) {
        currentDomain = savedDomain;
    }
}

// Backward compatibility aliases (reference current physics domain data)
const PhysicsCategories = DomainData.physics.categories;
const PhysicsWords = DomainData.physics.words;
const AmbiguousSymbols = DomainData.physics.ambiguousSymbols;
const abbreviations = DomainData.physics.abbreviations;

// Helper function to get display text
function getCardDisplayText(word, mode = displayModes.ABBREVIATED) {
    const domainData = getCurrentDomainData();

    if (mode === displayModes.ABBREVIATED) {
        return domainData.abbreviations[word.toLowerCase()] || word.toUpperCase();
    }

    // Future: icon mode
    if (mode === displayModes.ICON_LABEL) {
        return {
            icon: getWordIcon(word),
            label: domainData.abbreviations[word.toLowerCase()] || word
        };
    }

    return word;
}

// Future: Icon mapping (placeholder)
function getWordIcon(word) {
    // To be implemented in Phase 2
    return null;
}

function isWordInCategory(word, categoryId, domain = currentDomain) {
    const domainData = DomainData[domain];
    if (!domainData.words[categoryId]) return false;
    return domainData.words[categoryId].some(
        item => item.word.toLowerCase() === word.toLowerCase()
    );
}

function getCategoryForWord(word, domain = currentDomain) {
    const domainData = DomainData[domain];
    const lowerWord = word.toLowerCase();
    for (let categoryId in domainData.words) {
        const found = domainData.words[categoryId].find(
            item => item.word.toLowerCase() === lowerWord
        );
        if (found) return categoryId;
    }
    return null;
}

function getWordPoints(word, domain = currentDomain) {
    const domainData = DomainData[domain];
    const lowerWord = word.toLowerCase();
    for (let categoryId in domainData.words) {
        const found = domainData.words[categoryId].find(
            item => item.word.toLowerCase() === lowerWord
        );
        if (found) return found.points;
    }
    return 0;
}

function generateLevelDeck(level = 1, domain = currentDomain) {
    const domainData = DomainData[domain];
    const deck = { categoryCards: [], wordCards: [] };
    const numCategories = Math.min(3 + Math.floor(level / 3), 6);
    const shuffledCategories = [...domainData.categories]
        .sort(() => Math.random() - 0.5)
        .slice(0, numCategories);

    // Get active category IDs for this level
    const activeCategoryIds = shuffledCategories.map(cat => cat.id);

    // Add category cards
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

    // Add regular words from each category
    shuffledCategories.forEach(cat => {
        const categoryWords = domainData.words[cat.id];
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
            const card = {
                id: `word-${cat.id}-${index}`,
                type: 'word',
                word: wordData.word,
                points: wordData.points,
                difficulty: wordData.difficulty
            };

            // Support both legacy single category and new ambiguous symbols
            if (wordData.validCategories) {
                // New format: ambiguous symbols with multiple valid categories
                card.validCategories = wordData.validCategories;
            } else {
                // Legacy format: single categoryId for regular words
                card.categoryId = cat.id;
            }

            // Preserve isVector flag if present
            if (wordData.isVector) {
                card.isVector = true;
            }

            deck.wordCards.push(card);
        });
    });

    // Add ambiguous symbols if ANY of their valid categories are active
    domainData.ambiguousSymbols.forEach((symbolData, index) => {
        // Check if at least one valid category is in this level
        const isRelevant = symbolData.validCategories.some(catId =>
            activeCategoryIds.includes(catId)
        );

        if (isRelevant) {
            // Check difficulty filter
            let shouldInclude = false;
            if (level <= 3) {
                shouldInclude = symbolData.difficulty === 'basic';
            } else if (level <= 6) {
                shouldInclude = symbolData.difficulty === 'basic' ||
                               symbolData.difficulty === 'intermediate';
            } else {
                shouldInclude = true;  // Advanced levels include all
            }

            if (shouldInclude) {
                const card = {
                    id: `ambiguous-${index}`,
                    type: 'word',
                    word: symbolData.word,
                    points: symbolData.points,
                    difficulty: symbolData.difficulty,
                    validCategories: symbolData.validCategories,
                    isAmbiguous: true  // Flag for UI visual distinction
                };

                deck.wordCards.push(card);
            }
        }
    });

    deck.wordCards.sort(() => Math.random() - 0.5);
    return deck;
}

function getHint(placedCategories, remainingWords, domain = currentDomain) {
    const domainData = DomainData[domain];
    const categoryCounts = {};
    remainingWords.forEach(card => {
        const cat = card.categoryId;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const missingCategories = Object.keys(categoryCounts)
        .filter(catId => !placedCategories.includes(catId))
        .map(catId => {
            const category = domainData.categories.find(c => c.id === catId);
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
