// Progression Manager - State Management for Multi-Domain Progression
// Based on ADR-001: Multi-Domain Progression System

class ProgressionManager {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem('groundstate_progression');
    return saved ? JSON.parse(saved) : this.getInitialState();
  }

  getInitialState() {
    return {
      userId: this.generateUserId(),
      domains: {
        physics: { currentLevel: 1, levelsCompleted: [], highScore: 0, unlocked: true },
        astronomy: { currentLevel: 1, levelsCompleted: [], highScore: 0, unlocked: false },
        stat_mech: { currentLevel: 1, levelsCompleted: [], highScore: 0, unlocked: false },
        economics: { currentLevel: 1, levelsCompleted: [], highScore: 0, unlocked: false },
        finance: { currentLevel: 1, levelsCompleted: [], highScore: 0, unlocked: false }
      },
      careerPaths: {
        'Experimental Physicist': { unlocked: false, achievedAt: null },
        'Astrophysicist': { unlocked: false, achievedAt: null },
        'Theoretical Physicist': { unlocked: false, achievedAt: null },
        'Econometrician': { unlocked: false, achievedAt: null },
        'Quantitative Analyst': { unlocked: false, achievedAt: null },
        'Data Scientist': { unlocked: false, achievedAt: null }
      },
      conceptPagesViewed: [],
      contributedPages: [],
      lastPlayed: new Date().toISOString()
    };
  }

  generateUserId() {
    let userId = localStorage.getItem('groundstate_userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('groundstate_userId', userId);
    }
    return userId;
  }

  saveState() {
    localStorage.setItem('groundstate_progression', JSON.stringify(this.state));
    this.state.lastPlayed = new Date().toISOString();
  }

  updateDomainProgress(domainId, levelData) {
    if (!this.state.domains[domainId]) return;

    const domain = this.state.domains[domainId];

    if (levelData.level > domain.currentLevel) {
      domain.currentLevel = levelData.level;
    }

    if (!domain.levelsCompleted.includes(levelData.level)) {
      domain.levelsCompleted.push(levelData.level);
    }

    if (levelData.score > domain.highScore) {
      domain.highScore = levelData.score;
    }

    this.checkDomainUnlocks();

    this.saveState();
  }

  checkDomainUnlocks() {
    Object.entries(DOMAIN_REGISTRY).forEach(([domainId, domain]) => {
      if (!domain.unlockRequirements) return;

      const shouldUnlock = this.evaluatePrerequisites(domain.unlockRequirements);

      if (shouldUnlock && !this.state.domains[domainId].unlocked) {
        this.state.domains[domainId].unlocked = true;
        this.state.domains[domainId].unlockedAt = new Date().toISOString();
        this.showUnlockNotification(domain);
      }
    });

    this.checkCareerPathUnlocks();

    this.saveState();
  }

  evaluatePrerequisites(requirements) {
    if (!requirements || requirements.type === 'single') {
      return false;
    }

    const prerequisites = requirements.prerequisites;

    if (requirements.type === 'single') {
      return prerequisites.every(prereq => {
        const domain = this.state.domains[prereq.domain];
        return domain.currentLevel >= prereq.minLevel;
      });
    }

    if (requirements.type === 'combination') {
      return prerequisites.every(prereq => {
        const domain = this.state.domains[prereq.domain];
        return domain.currentLevel >= prereq.minLevel;
      });
    }

    if (requirements.type === 'alternative') {
      return prerequisites.some(prereqGroup => {
        if (Array.isArray(prereqGroup)) {
          return prereqGroup.every(prereq => {
            const domain = this.state.domains[prereq.domain];
            return domain.currentLevel >= prereq.minLevel;
          });
        }
        const domain = this.state.domains[prereq.domain];
        return domain.currentLevel >= prereq.minLevel;
      });
    }

    return false;
  }

  checkCareerPathUnlocks() {
    Object.entries(CAREER_PATHS).forEach(([pathName, path]) => {
      const isUnlocked = this.state.careerPaths[pathName]?.unlocked || false;

      if (isUnlocked) return;

      const shouldUnlock = this.evaluateCareerPath(path);

      if (shouldUnlock) {
        this.state.careerPaths[pathName] = {
          unlocked: true,
          achievedAt: new Date().toISOString()
        };
        this.showCareerUnlockNotification(pathName);
      }
    });

    this.saveState();
  }

  evaluateCareerPath(path) {
    if (path.isInterdisciplinary) {
      return path.path.some(prereqGroup =>
        prereqGroup.every(prereq => this.meetsRequirement(prereq))
      );
    }

    if (path.isAlternative) {
      return path.path.some(prereqGroup =>
        prereqGroup.every(prereq => this.meetsRequirement(prereq))
      );
    }

    return path.path.every(prereq => this.meetsRequirement(prereq));
  }

  meetsRequirement(prereq) {
    const [domainId, minLevel] = prereq.split(':').map((d, i) =>
      i === 0 ? d : parseInt(d)
    );
    const domain = this.state.domains[domainId];
    return domain.currentLevel >= minLevel;
  }

  showUnlockNotification(domain) {
    const event = new CustomEvent('domainUnlocked', {
      detail: { domain }
    });
    document.dispatchEvent(event);
  }

  showCareerUnlockNotification(pathName) {
    const event = new CustomEvent('careerPathUnlocked', {
      detail: { pathName, path: CAREER_PATHS[pathName] }
    });
    document.dispatchEvent(event);
  }

  getProgressionData() {
    return {
      domains: Object.fromEntries(
        Object.entries(this.state.domains).map(([id, data]) => [
          id,
          {
            ...data,
            meta: DOMAIN_REGISTRY[id]
          }
        ])
      ),
      careerPaths: this.state.careerPaths,
      totalProgress: this.calculateTotalProgress()
    };
  }

  calculateTotalProgress() {
    let totalLevels = 0;
    let completedLevels = 0;

    Object.values(this.state.domains).forEach(domain => {
      if (domain.unlocked) {
        const meta = DOMAIN_REGISTRY[domain.id];
        totalLevels += meta.maxLevel;
        completedLevels += domain.levelsCompleted.length;
      }
    });

    return {
      total: totalLevels,
      completed: completedLevels,
      percentage: totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0
    };
  }

  getUnlockedDomains() {
    return Object.entries(DOMAIN_REGISTRY)
      .filter(([_, domain]) => {
        return !domain.unlockRequirements || this.state.domains[domain.id]?.unlocked;
      })
      .map(([id, domain]) => ({ id, ...domain }));
  }
}
