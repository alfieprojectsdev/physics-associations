// Career Roadmap Visualization Component
// Based on ADR-001: Multi-Domain Progression System

class CareerRoadmap {
  constructor(progressionManager) {
    this.manager = progressionManager;
    this.container = null;
    this.nodePositions = this.calculateNodePositions();
    this.connections = this.calculateConnections();
  }

  calculateNodePositions() {
    const positions = {};
    const centerX = window.innerWidth / 2;
    const startY = 100;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      positions['physics'] = { x: centerX - 30, y: startY };
      positions['astronomy'] = { x: centerX - 30, y: startY + 140 };
      positions['stat_mech'] = { x: centerX - 30, y: startY + 280 };
      positions['economics'] = { x: centerX - 30, y: startY + 420 };
      positions['finance'] = { x: centerX - 30, y: startY + 560 };
    } else {
      positions['physics'] = { x: centerX - 30, y: startY };
      positions['astronomy'] = { x: centerX - 120, y: startY + 150 };
      positions['stat_mech'] = { x: centerX + 60, y: startY + 150 };
      positions['economics'] = { x: centerX - 60, y: startY + 300 };
      positions['finance'] = { x: centerX + 120, y: startY + 300 };
    }

    return positions;
  }

  calculateConnections() {
    const connections = [];

    connections.push({
      from: 'physics',
      to: 'astronomy',
      type: 'unlock'
    });

    connections.push({
      from: 'physics',
      to: 'stat_mech',
      type: 'combination'
    });

    connections.push({
      from: 'stat_mech',
      to: 'economics',
      type: 'unlock'
    });

    connections.push({
      from: 'economics',
      to: 'finance',
      type: 'unlock'
    });

    return connections;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = '';

    this.renderHeader();
    this.renderProgressOverview();
    this.renderSkillTree();
    this.renderCareerPaths();
  }

  renderHeader() {
    const header = document.createElement('div');
    header.className = 'roadmap-header';
    header.innerHTML = `
      <h1 class="roadmap-title">🎯 Career Progression Roadmap</h1>
      <p style="color: rgba(255,255,255,255,0.7); max-width: 400px; margin: 0 auto;">
        Master multiple domains to unlock advanced career paths. Your progress shows which STEM areas you've conquered.
      </p>
    `;
    this.container.appendChild(header);
  }

  renderProgressOverview() {
    const progress = this.manager.calculateTotalProgress();
    const overview = document.createElement('div');
    overview.className = 'progress-overview';

    overview.innerHTML = `
      <div class="progress-card">
        <div class="progress-value">${progress.percentage}%</div>
        <div class="progress-label">Total Progress</div>
      </div>
      <div class="progress-card">
        <div class="progress-value">${Object.values(this.manager.state.domains).filter(d => d.unlocked).length}</div>
        <div class="progress-label">Domains Unlocked</div>
      </div>
      <div class="progress-card">
        <div class="progress-value">${Object.values(this.manager.state.careerPaths).filter(p => p.unlocked).length}</div>
        <div class="progress-label">Careers Unlocked</div>
      </div>
    `;

    this.container.appendChild(overview);
  }

  renderSkillTree() {
    const treeContainer = document.createElement('div');
    treeContainer.className = 'skill-tree';

    this.connections.forEach(conn => {
      const line = this.renderConnection(conn);
      treeContainer.appendChild(line);
    });

    Object.entries(this.nodePositions).forEach(([domainId, pos]) => {
      const domain = DOMAIN_REGISTRY[domainId];
      const state = this.manager.state.domains[domainId];
      const node = this.renderNode(domain, state, pos, domainId);
      treeContainer.appendChild(node);
    });

    this.container.appendChild(treeContainer);
  }

  renderNode(domain, state, pos, domainId) {
    const node = document.createElement('div');
    node.className = `tree-node ${state.unlocked ? 'unlocked' : 'locked'}`;
    node.style.left = `${pos.x}px`;
    node.style.top = `${pos.y}px`;
    node.style.background = state.unlocked ? domain.color : '#374151';
    node.textContent = domain.icon;
    node.setAttribute('data-domain-id', domainId);
    node.setAttribute('aria-label', `${domain.name}${state.unlocked ? '' : ' (Locked)'}`);

    if (window.currentDomain === domainId && state.unlocked) {
      node.classList.add('active');
    }

    const levelBadge = document.createElement('div');
    levelBadge.style.cssText = `
      position: absolute;
      bottom: -4px;
      right: -4px;
      background: ${state.unlocked ? 'var(--success)' : 'var(--danger)'};
      color: white;
      font-size: 0.625rem;
      font-weight: bold;
      padding: 2px 6px;
      border-radius: 10px;
    `;
    levelBadge.textContent = `L${state.currentLevel}`;
    node.appendChild(levelBadge);

    node.addEventListener('click', () => {
      if (state.unlocked) {
        this.showDomainDetails(domain, state);
      } else {
        this.showLockRequirements(domain);
      }
    });

    return node;
  }

  renderConnection(conn) {
    const fromPos = this.nodePositions[conn.from];
    const toPos = this.nodePositions[conn.to];

    const line = document.createElement('div');
    line.className = `tree-connection ${this.manager.state.domains[conn.to]?.unlocked ? 'unlocked' : 'locked'}`;

    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    line.style.cssText = `
      left: ${fromPos.x}px;
      top: ${fromPos.y}px;
      width: ${length}px;
      transform: rotate(${angle}deg);
    `;

    return line;
  }

  renderCareerPaths() {
    const pathsContainer = document.createElement('div');
    pathsContainer.style.cssText = `
      margin-top: 32px;
      padding: 0 16px;
    `;

    const title = document.createElement('h2');
    title.style.cssText = `
      color: white;
      font-size: 1.25rem;
      margin-bottom: 16px;
      text-align: center;
    `;
    title.textContent = '🏆 Career Paths';
    pathsContainer.appendChild(title);

    Object.entries(CAREER_PATHS).forEach(([pathName, path]) => {
      const isUnlocked = this.manager.state.careerPaths[pathName]?.unlocked || false;
      const pathCard = this.renderCareerPath(path, pathName, isUnlocked);
      pathsContainer.appendChild(pathCard);
    });

    this.container.appendChild(pathsContainer);
  }

  renderCareerPath(path, pathName, isUnlocked) {
    const card = document.createElement('div');
    card.className = 'career-path-card';

    const requirements = this.formatRequirements(path.path);
    const status = isUnlocked ? 'completed' : 'pending';

    card.innerHTML = `
      <div class="career-path-header">
        <span class="career-icon">${path.icon}</span>
        <span class="career-title">${pathName}</span>
        ${path.isAlternative ? '<span class="career-badge alternative">Alternative</span>' : ''}
        ${path.isInterdisciplinary ? '<span class="career-badge interdisciplinary">Cross-Domain</span>' : ''}
      </div>
      <p class="career-description">${path.description}</p>
      <div class="career-requirements">
        ${requirements}
      </div>
      ${isUnlocked ? `
        <div style="margin-top: 12px; color: var(--success); font-weight: bold;">
          ✅ Unlocked! ${this.manager.state.careerPaths[pathName].achievedAt}
        </div>
      ` : `
        <div style="margin-top: 12px; color: var(--text-light); font-size: 0.75rem;">
          🔒 Complete requirements to unlock
        </div>
      `}
    `;

    return card;
  }

  formatRequirements(path) {
    return path.map(prereqGroup => {
      const group = Array.isArray(prereqGroup) ? prereqGroup : [prereqGroup];

      return group.map(prereq => {
        const [domainId, minLevel] = prereq.split(':').map((d, i) => i === 0 ? d : parseInt(d));
        const domain = DOMAIN_REGISTRY[domainId];
        const state = this.manager.state.domains[domainId];
        const completed = state.currentLevel >= minLevel;

        return `
          <div class="career-req-item ${completed ? 'completed' : 'pending'}">
            <span>${domain.icon}</span>
            <span>${domain.name}</span>
            <span>L${minLevel}</span>
            ${completed ? '<span>✓</span>' : ''}
          </div>
        `;
      }).join('');
    }).join('');
  }

  showDomainDetails(domain, state) {
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 16px;">${domain.icon}</div>
      <h2 class="unlock-title">${domain.name}</h2>
      <p class="unlock-subtitle">Level ${state.currentLevel} / ${domain.maxLevel}</p>
      <p style="margin-bottom: 24px; line-height: 1.6;">
        ${state.unlocked
          ? 'This domain is unlocked and available for play.'
          : `Requires ${this.formatUnlockReqs(domain)} to unlock.`
        }
      </p>
      <button class="unlock-btn" onclick="closeModal(); this.close();">
        ${state.unlocked ? 'Start Playing' : 'Close'}
      </button>
    `;
    document.body.appendChild(modal);
  }

  showLockRequirements(domain) {
    const reqs = domain.unlockRequirements.prerequisites;
    const formatted = reqs.map(prereq => {
      const state = this.manager.state.domains[prereq.domain];
      const progress = Math.min(100, Math.round((state.currentLevel / prereq.minLevel) * 100));
      return `${DOMAIN_REGISTRY[prereq.domain].icon} L${prereq.minLevel} (${progress}%)`;
    }).join(domain.unlockRequirements.type === 'combination' ? ' + ' : ' OR ');

    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
      <div class="unlock-icon">🔒</div>
      <h2 class="unlock-title">Unlock ${domain.name}</h2>
      <p class="unlock-subtitle">Requirements not met</p>
      <div style="background: rgba(239, 68, 68, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        ${formatted}
      </div>
      <button class="unlock-btn" onclick="closeModal(); this.close();">
        Got it
      </button>
    `;
    document.body.appendChild(modal);
  }

  showUnlockNotification(domain) {
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    modal.innerHTML = `
      <div class="unlock-icon">🎉</div>
      <h2 class="unlock-title">New Domain Unlocked!</h2>
      <p class="unlock-subtitle">${domain.name} is now available</p>
      <div style="font-size: 4rem; margin: 16px 0;">${domain.icon}</div>
      <p style="margin-bottom: 24px;">You've proven your mastery and unlocked advanced challenges.</p>
      <button class="unlock-btn" onclick="closeModal(); this.close();">
        Awesome!
      </button>
    `;
    document.body.appendChild(modal);
    if (typeof triggerHaptic === 'function') {
      triggerHaptic('success');
    }
  }

  showCareerUnlockNotification(pathName, path) {
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    modal.innerHTML = `
      <div class="unlock-icon">${path.icon}</div>
      <h2 class="unlock-title">Career Path Unlocked!</h2>
      <p class="unlock-subtitle">${pathName}</p>
      <p style="margin-bottom: 24px; line-height: 1.6;">${CAREER_PATHS[pathName].description}</p>
      <button class="unlock-btn" onclick="closeModal(); this.close();">
        Amazing!
      </button>
    `;
    document.body.appendChild(modal);
    if (typeof triggerHaptic === 'function') {
      triggerHaptic('success');
    }
  }

  close() {
    document.querySelectorAll('.notification-modal').forEach(m => m.remove());
  }

  handleResize() {
    this.nodePositions = this.calculateNodePositions();
    const treeContainer = document.querySelector('.skill-tree');
    if (treeContainer) {
      treeContainer.innerHTML = '';
      this.connections.forEach(conn => {
        const line = this.renderConnection(conn);
        treeContainer.appendChild(line);
      });
      Object.entries(this.nodePositions).forEach(([domainId, pos]) => {
        const domain = DOMAIN_REGISTRY[domainId];
        const state = this.manager.state.domains[domainId];
        const node = this.renderNode(domain, state, pos, domainId);
        treeContainer.appendChild(node);
      });
    }
  }
}
