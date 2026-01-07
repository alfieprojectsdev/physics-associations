const DOMAIN_REGISTRY = {
  physics: {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    unlockRequirements: null,
    maxLevel: 20,
    color: '#6366f1'
  },
  astronomy: {
    id: 'astronomy',
    name: 'Astronomy',
    icon: '🌌',
    unlockRequirements: {
      type: 'single',
      prerequisites: [{ domain: 'physics', minLevel: 5 }]
    },
    maxLevel: 15,
    color: '#8b5cf6'
  },
  stat_mech: {
    id: 'stat_mech',
    name: 'Statistical Mechanics',
    icon: '📊',
    unlockRequirements: {
      type: 'combination',
      prerequisites: [
        { domain: 'physics', minLevel: 8 },
        { domain: 'astronomy', minLevel: 3 }
      ]
    },
    maxLevel: 12,
    color: '#10b981'
  },
  economics: {
    id: 'economics',
    name: 'Economics',
    icon: '💹',
    unlockRequirements: {
      type: 'alternative',
      prerequisites: [
        [{ domain: 'stat_mech', minLevel: 5 }],
        [{ domain: 'physics', minLevel: 12 }]
      ]
    },
    maxLevel: 15,
    color: '#f59e0b'
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    unlockRequirements: {
      type: 'combination',
      prerequisites: [
        { domain: 'economics', minLevel: 6 },
        { domain: 'stat_mech', minLevel: 4 }
      ]
    },
    maxLevel: 10,
    color: '#ef4444'
  }
};

const CAREER_PATHS = {
  'Experimental Physicist': {
    path: ['physics:10'],
    icon: '🔬',
    description: 'Master fundamental physics concepts',
    color: '#6366f1'
  },
  'Astrophysicist': {
    path: ['physics:10', 'astronomy:10'],
    icon: '🔭',
    description: 'Combine physics and astronomy for stellar research',
    color: '#8b5cf6'
  },
  'Theoretical Physicist': {
    path: ['physics:15', 'astronomy:8', 'stat_mech:10'],
    icon: '🧮',
    description: 'Advanced theoretical modeling and statistical analysis',
    color: '#10b981'
  },
  'Econometrician': {
    path: [
      ['physics:8', 'astronomy:3', 'stat_mech:5', 'economics:10'],
      ['physics:12', 'economics:10']
    ],
    icon: '📈',
    description: 'Apply statistical methods to economic analysis',
    color: '#f59e0b',
    isAlternative: true
  },
  'Quantitative Analyst': {
    path: ['physics:8', 'astronomy:3', 'stat_mech:8', 'economics:10', 'finance:10'],
    icon: '💼',
    description: 'Use mathematical models for financial markets',
    color: '#ef4444'
  },
  'Data Scientist': {
    path: [
      ['physics:8', 'stat_mech:8', 'economics:6'],
      ['physics:10', 'astronomy:5', 'stat_mech:10']
    ],
    icon: '📊',
    description: 'Cross-domain analytical expertise',
    color: '#8b5cf6',
    isInterdisciplinary: true
  }
};
