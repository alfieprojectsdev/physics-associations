// Analytics wrapper for GoatCounter
// Privacy-friendly event tracking for game engagement
// No cookies, no personal data collection

/**
 * Track custom game events
 * @param {string} eventName - Event identifier (e.g., 'level-completed')
 * @param {object} metadata - Optional event metadata
 */
function trackGameEvent(eventName, metadata = {}) {
  if (typeof window === 'undefined' || !window.goatcounter) {
    return; // GoatCounter not loaded yet
  }

  // Build event path with metadata
  let eventPath = `/event/${eventName}`;

  if (Object.keys(metadata).length > 0) {
    const params = Object.entries(metadata)
      .map(([key, val]) => `${key}:${val}`)
      .join(',');
    eventPath += `?${params}`;
  }

  window.goatcounter.count({
    path: eventPath,
    title: eventName,
    event: true
  });
}

// Convenience functions for common game events
const GameAnalytics = {
  // Essential Events - Core gameplay tracking

  /**
   * Track when a level starts
   * @param {number} level - Level number
   */
  levelStarted: (level) => trackGameEvent('level-started', { level }),

  /**
   * Track successful level completion
   * @param {number} level - Level number
   * @param {number} score - Final score
   * @param {number} moves - Number of moves used
   */
  levelCompleted: (level, score, moves) =>
    trackGameEvent('level-completed', { level, score, moves }),

  /**
   * Track level failure
   * @param {number} level - Level number
   * @param {string} reason - Failure reason (e.g., 'out-of-moves', 'time-expired')
   */
  levelFailed: (level, reason) =>
    trackGameEvent('level-failed', { level, reason }),

  /**
   * Track session start
   */
  sessionStart: () => trackGameEvent('session-start'),

  /**
   * Track session end with duration
   * @param {number} duration - Session duration in seconds
   */
  sessionEnd: (duration) => trackGameEvent('session-end', { duration }),

  /**
   * Track word sorting action
   * @param {boolean} correct - Whether the sort was correct
   * @param {string} categoryId - Category identifier
   */
  wordSorted: (correct, categoryId) =>
    trackGameEvent('word-sorted', { correct, categoryId }),

  /**
   * Track display mode changes
   * @param {string} mode - New display mode (e.g., 'light', 'dark')
   */
  displayModeChanged: (mode) =>
    trackGameEvent('display-mode-changed', { mode }),

  // Nice to Have Events - Enhanced tracking

  /**
   * Track category placement
   * @param {string} categoryId - Category identifier
   */
  categoryPlaced: (categoryId) =>
    trackGameEvent('category-placed', { categoryId }),

  /**
   * Track stock pile draws
   * @param {number} movesLeft - Remaining moves
   */
  stockDrawn: (movesLeft) =>
    trackGameEvent('stock-drawn', { movesLeft }),

  /**
   * Track hint usage
   * @param {number} level - Level number
   */
  hintUsed: (level) =>
    trackGameEvent('hint-used', { level }),

  /**
   * Track level restarts
   * @param {number} level - Level number
   */
  levelRestarted: (level) =>
    trackGameEvent('level-restarted', { level }),

  // Future Events - Not wired up yet, but ready for implementation

  /**
   * Track tutorial start
   */
  tutorialStarted: () => trackGameEvent('tutorial-started'),

  /**
   * Track tutorial completion
   */
  tutorialCompleted: () => trackGameEvent('tutorial-completed'),

  /**
   * Track tutorial skip
   */
  tutorialSkipped: () => trackGameEvent('tutorial-skipped'),

  /**
   * Track share button clicks
   * @param {string} platform - Platform name (e.g., 'twitter', 'facebook')
   */
  shareClicked: (platform) =>
    trackGameEvent('share-clicked', { platform }),

  /**
   * Track PWA install prompt shown
   */
  installPromptShown: () => trackGameEvent('install-prompt-shown'),

  /**
   * Track PWA installation completion
   */
  installCompleted: () => trackGameEvent('install-completed')
};

// Session duration tracking
let sessionStartTime = Date.now();

// Track session end on page unload
window.addEventListener('beforeunload', () => {
  const duration = Math.round((Date.now() - sessionStartTime) / 1000);
  GameAnalytics.sessionEnd(duration);
});

// Auto-track session start when script loads
GameAnalytics.sessionStart();
