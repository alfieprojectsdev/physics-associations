# ADR-001: Multi-Domain Progression System

## Revision log

| Date | Description |
|------|-------------|
| 2026-01-05 | Document created |

## Context

Ground State currently focuses exclusively on physics vocabulary with linear level progression. The educational impact is limited to a single domain, and there is no mechanism for unlocking advanced interdisciplinary content based on mastery combinations across multiple knowledge areas.

## Decision

We will transform Ground State into a multi-domain educational platform by implementing a skill-tree progression system that unlocks new domains (Astronomy, Statistical Mechanics, Economics, Finance) based on prerequisite level completion combinations, with student-contributed concept pages for approximately 20% of advanced vocabulary terms.

## Consequences

**Benefits:**
- Dramatically expands educational scope beyond physics into interconnected STEM and social science domains
- Creates natural progression pathways that mirror real-world career and academic advancement
- Enables collaborative content creation workflow with students for high-value educational material
- Provides intrinsic motivation through unlockable content rather than purely score-based progression
- Allows for cross-domain vocabulary (e.g., "entropy" in physics, stat mech, and economics contexts)
- Scales content library without proportionally scaling core development effort via student collaboration

**Tradeoffs:**
- Significant increase in data complexity: must track per-domain progress, unlock states, and prerequisites
- Content management becomes multi-contributor workflow requiring review and quality control
- Mobile-first constraints challenged by larger data payloads (multiple domain dictionaries)
- Progression gating may frustrate users who want immediate access to specific domains
- Educational quality inconsistency risk with student-contributed concept pages
- Increased architectural complexity in state management, data schema, and UI navigation

**Operational Implications:**
- User progression state must persist across sessions (introduces storage requirement)
- Domain selection UI layer needed before level selection
- Concept page rendering system adds new content type beyond cards
- Student collaboration workflow requires submission, review, and approval pipeline
- Performance testing needed for multi-domain data loading on mobile devices
- Analytics required to track which prerequisite combinations lead to domain unlocks

## Implementation

1. **Phase 1 - Data Schema Evolution (v2.0)**
   - Extend `physics-dictionary.js` structure to generic `domain-dictionary.js` pattern
   - Create domain metadata schema: id, name, icon, prerequisites (array of prerequisite objects)
   - Define prerequisite logic: `{domain: 'physics', minLevel: 5}` or `{combinationOf: ['physics', 'astronomy'], minLevel: 3}`
   - Implement progression state persistence using localStorage with domain unlock status

2. **Phase 2 - Domain Management System (v2.1)**
   - Create domain registry: `domains = [{id, name, icon, unlockRequirements, dictionary}]`
   - Build progression validator: checks current progress against unlock requirements
   - Implement domain selection UI: locked/unlocked states with visual progression tree
   - Add analytics tracking for unlock events and progression pathways

3. **Phase 3 - Concept Page Integration (v2.2)**
   - Define concept page schema: `{termId, domainId, content, contributors, reviewStatus}`
   - Identify 20% of vocabulary as "advanced terms" eligible for concept pages
   - Create concept page viewer: modal or dedicated route for rich educational content
   - Implement contribution workflow: submission form, review queue, approval system

4. **Phase 4 - Multi-Domain Content (v3.0)**
   - Port astronomy vocabulary dictionary following established data patterns
   - Create initial stat mech vocabulary set with cross-references to physics concepts
   - Define cross-domain term linking: same word appearing in multiple domains
   - Implement domain-specific unlock notifications and career roadmap visualization

5. **Phase 5 - Student Collaboration Platform (v3.1+)**
   - Build content submission portal for student contributors
   - Create review dashboard for educators to approve/reject concept pages
   - Implement contributor attribution and gamification (e.g., "content creator" badges)
   - Add version control for concept pages to track revisions

## Related Decisions

This is the foundational ADR for the multi-domain progression system. Future ADRs will extend this decision with implementation specifics.

## Future Considerations

**Cross-Domain Vocabulary Handling:**
- How to represent terms that appear in multiple domains (e.g., "entropy" in physics, stat mech, economics)
- Should users unlock cross-domain insights after encountering same term in 2+ domains?

**Prerequisite Complexity:**
- Current design assumes simple AND/OR logic for prerequisites
- May need more sophisticated graph-based dependency system for complex career paths
- Consider "elective" unlocks: multiple paths to same domain

**Content Quality Control:**
- Student-contributed concept pages require review workflow
- May need tiered contributor system: novice, verified, expert
- Consider peer review mechanisms within student cohorts

**Performance and Data Management:**
- Multiple domain dictionaries may exceed reasonable mobile data limits
- May need lazy-loading per domain or offline-first architecture
- Consider CDN or API-based content delivery for concept pages vs bundled JavaScript

**Career Roadmap Visualization:**
- "Parang career progression roadmap" suggests visual skill tree UI
- May need dedicated progression map screen showing domain relationships
- Consider integrating real-world career pathway data (e.g., "Astrophysicist requires Physics + Astronomy Level 10")

**Localization and Accessibility:**
- Current system is English-only
- Multi-domain expansion increases translation burden
- Student contributions complicate localization workflow

**Monetization and Sustainability:**
- Free educational content vs premium domains/concept pages
- Student contributor compensation or recognition model
- Institutional partnerships for content validation

## Appendix A: Domain Unlock Prerequisite Examples

```javascript
// Example domain definitions with prerequisite structures

const DOMAINS = [
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    unlockRequirements: null, // Always unlocked (starting domain)
    maxLevel: 20
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    icon: '🌌',
    unlockRequirements: {
      type: 'single',
      prerequisites: [
        { domain: 'physics', minLevel: 5 }
      ]
    },
    maxLevel: 15
  },
  {
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
    maxLevel: 12
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: '💹',
    unlockRequirements: {
      type: 'alternative', // Either path unlocks
      prerequisites: [
        [{ domain: 'stat_mech', minLevel: 5 }],
        [{ domain: 'physics', minLevel: 12 }]
      ]
    },
    maxLevel: 15
  },
  {
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
    maxLevel: 10
  }
];

// Progression state schema
const progressionState = {
  userId: 'user123',
  domains: {
    physics: {
      currentLevel: 8,
      levelsCompleted: [1, 2, 3, 4, 5, 6, 7, 8],
      highScore: 4500,
      unlocked: true,
      unlockedAt: '2025-12-01T10:00:00Z'
    },
    astronomy: {
      currentLevel: 3,
      levelsCompleted: [1, 2, 3],
      highScore: 1200,
      unlocked: true,
      unlockedAt: '2025-12-15T14:30:00Z'
    },
    stat_mech: {
      unlocked: true,
      unlockedAt: '2025-12-28T09:15:00Z',
      currentLevel: 1,
      levelsCompleted: [],
      highScore: 0
    },
    economics: {
      unlocked: false, // Not yet unlocked
      requirementsProgress: {
        // Track progress toward unlock
        path1: { stat_mech: { current: 1, required: 5 } },
        path2: { physics: { current: 8, required: 12 } }
      }
    },
    finance: {
      unlocked: false
    }
  },
  conceptPagesViewed: ['entropy_physics', 'blackbody_astronomy'],
  contributedPages: ['doppler_effect_astronomy'],
  lastPlayed: '2026-01-05T12:00:00Z'
};
```

## Appendix B: Concept Page Schema

```javascript
// Concept page data structure for advanced vocabulary

const conceptPage = {
  id: 'entropy_stat_mech',
  termId: 'entropy',
  domain: 'stat_mech',
  title: 'Entropy in Statistical Mechanics',

  // Content sections
  content: {
    definition: 'Measure of the number of microscopic configurations (microstates) that correspond to a thermodynamic system\'s macroscopic state.',

    intuition: 'Think of entropy as the "disorder" or "spread" of energy in a system. Higher entropy means more possible arrangements of particles.',

    equation: 'S = k_B \\ln(\\Omega)',
    equationExplanation: 'Where S is entropy, k_B is Boltzmann constant, Ω is number of microstates.',

    examples: [
      'Ice melting: solid (low entropy) → liquid (high entropy)',
      'Gas expanding into vacuum: concentrated (low) → dispersed (high)'
    ],

    crossDomainLinks: [
      { domain: 'physics', termId: 'entropy', context: 'Thermodynamic entropy' },
      { domain: 'economics', termId: 'entropy', context: 'Information entropy in market analysis' }
    ],

    visualAid: '/assets/concept-pages/entropy_diagram.svg' // Optional
  },

  // Metadata
  contributors: [
    { name: 'Jane Doe', role: 'student', university: 'MIT', date: '2026-01-03' }
  ],
  reviewers: [
    { name: 'Dr. Smith', role: 'faculty', approved: true, date: '2026-01-04' }
  ],
  reviewStatus: 'approved', // draft, pending_review, approved, rejected

  // Engagement metrics
  views: 145,
  helpfulVotes: 67,
  lastUpdated: '2026-01-04T16:20:00Z'
};

// Concept page eligibility criteria
const conceptPageEligibility = {
  // Only 20% of vocabulary gets concept pages
  criteria: [
    'difficulty === "advanced"',
    'appears in multiple domains',
    'foundational concept with broader implications',
    'frequently misunderstood or requires visualization'
  ],

  // Automatic eligibility for certain terms
  autoEligible: [
    'cross-domain terms (appearing in 2+ domains)',
    'terms with point value >= 15',
    'level 10+ vocabulary'
  ]
};
```

## Appendix C: Student Contribution Workflow

```javascript
// Student contribution submission and review process

// 1. Student creates concept page draft
const submissionForm = {
  termId: 'doppler_effect',
  domain: 'astronomy',
  content: {
    definition: '...',
    intuition: '...',
    examples: ['...']
  },
  studentInfo: {
    name: 'John Student',
    email: 'jstudent@university.edu',
    university: 'Stanford',
    courseName: 'ASTRO 101'
  }
};

// 2. Submission enters review queue
const reviewQueue = [
  {
    submissionId: 'sub_001',
    termId: 'doppler_effect',
    domain: 'astronomy',
    submittedBy: 'John Student',
    submittedAt: '2026-01-05T10:00:00Z',
    status: 'pending_review',
    assignedReviewer: 'dr.astronomer@stanford.edu'
  }
];

// 3. Educator reviews and provides feedback
const reviewResult = {
  submissionId: 'sub_001',
  decision: 'approved_with_changes', // approved, rejected, approved_with_changes
  feedback: 'Great intuition section! Please add equation and fix typo in example 2.',
  changes: {
    equation: 'f_{observed} = f_{source} * (c + v_observer) / (c + v_source)',
    examples: ['...corrected example...']
  },
  reviewedBy: 'Dr. Astronomer',
  reviewedAt: '2026-01-05T14:30:00Z'
};

// 4. Approved concept page published
const publishedConceptPage = {
  ...conceptPage,
  id: 'doppler_effect_astronomy',
  reviewStatus: 'approved',
  contributors: [
    { name: 'John Student', role: 'student', university: 'Stanford' }
  ],
  reviewers: [
    { name: 'Dr. Astronomer', role: 'faculty', approved: true }
  ],
  publishedAt: '2026-01-05T15:00:00Z'
};

// 5. Contributor receives attribution badge
const contributorProfile = {
  userId: 'jstudent_001',
  badges: [
    { type: 'first_contribution', earnedAt: '2026-01-05T15:00:00Z' },
    { type: 'astronomy_contributor', domain: 'astronomy', count: 1 }
  ],
  contributions: ['doppler_effect_astronomy'],
  reputation: 10 // Points for approved contributions
};
```

## Appendix D: Career Progression Roadmap Visualization

```javascript
// Visual progression tree structure for "career roadmap" analogy

const careerProgressionPaths = {
  // Physics as foundational trunk
  'Experimental Physicist': {
    path: ['physics:10'],
    icon: '🔬',
    description: 'Master fundamental physics concepts'
  },

  // Astronomy branch
  'Astrophysicist': {
    path: ['physics:10', 'astronomy:10'],
    icon: '🔭',
    description: 'Combine physics and astronomy for stellar research'
  },

  // Stat mech requires physics + astronomy foundation
  'Theoretical Physicist': {
    path: ['physics:15', 'astronomy:8', 'stat_mech:10'],
    icon: '🧮',
    description: 'Advanced theoretical modeling and statistical analysis'
  },

  // Economics as separate branch with alternative entry
  'Econometrician': {
    path: [
      // Path 1: via stat mech
      ['physics:8', 'astronomy:3', 'stat_mech:5', 'economics:10'],
      // Path 2: direct from physics (longer)
      ['physics:12', 'economics:10']
    ],
    icon: '📈',
    description: 'Apply statistical methods to economic analysis'
  },

  // Finance as integration domain
  'Quantitative Analyst': {
    path: ['physics:8', 'astronomy:3', 'stat_mech:8', 'economics:10', 'finance:10'],
    icon: '💼',
    description: 'Use mathematical models for financial markets'
  },

  // Interdisciplinary combo
  'Data Scientist': {
    path: [
      ['physics:8', 'stat_mech:8', 'economics:6'],
      ['physics:10', 'astronomy:5', 'stat_mech:10']
    ],
    icon: '📊',
    description: 'Cross-domain analytical expertise'
  }
};

// UI rendering: skill tree nodes with lock/unlock states
const skillTreeNode = {
  domain: 'stat_mech',
  unlocked: true,
  currentLevel: 3,
  maxLevel: 12,
  position: { x: 200, y: 300 }, // SVG coordinates
  connections: [
    { to: 'economics', unlockAt: 5 },
    { to: 'finance', unlockAt: 4, requiresAlso: ['economics:6'] }
  ],
  visualState: 'active' // locked, unlocked, active, completed
};
```
