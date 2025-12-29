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
    CS: 'computer-science'
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
