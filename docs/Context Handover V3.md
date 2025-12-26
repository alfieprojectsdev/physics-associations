# Context Handover V3: Analytics + PWA Implementation

## Project Overview
**Extends:** V1 (UI/UX improvements) + V2 (Abbreviation system)  
**Focus:** Add privacy-friendly analytics and Progressive Web App capabilities for native-like experience

---

## Part A: GoatCounter Analytics Integration

### Why Analytics for This Game?

**Player Behavior Insights:**
- Which physics categories are most/least popular
- Which levels players struggle with (quit rates)
- Average session length
- Drag vs tap interaction preferences
- Display mode preference (abbreviated vs icons when available)

**Product Decisions:**
- Prioritize icon design for most-played categories
- Adjust difficulty curve based on completion rates
- Identify confusing physics terms (high wrong-guess rate)
- Optimize onboarding based on tutorial completion

**Privacy-First:** No personal data, no IP tracking, GDPR-compliant

---

### Level 1: Basic Pageviews (5 minutes - REQUIRED)

**File:** `index.html`

Add before `</body>`:

```html
<!-- GoatCounter Analytics - Privacy-friendly, no cookies -->
<script data-goatcounter="https://YOUR-CODE.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
</body>
```

**Setup:**
1. Create free account at https://goatcounter.com
2. Get your tracking code (e.g., `physics-solitaire.goatcounter.com`)
3. Replace `YOUR-CODE` in script above with `ithinkandicode`
4. Verify pageviews in dashboard

**Test:**
- Open game in browser
- Check GoatCounter dashboard (updates every ~10 seconds)
- Should see pageview count

---

### Level 2: Game Event Tracking (30 minutes - HIGHLY RECOMMENDED)

**File:** Create new `analytics.js`

```javascript
// Analytics wrapper for GoatCounter
// Privacy-friendly event tracking for game engagement

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
  // Level events
  levelStarted: (level) => trackGameEvent('level-started', { level }),
  levelCompleted: (level, score, moves) => trackGameEvent('level-completed', { level, score, moves }),
  levelFailed: (level, reason) => trackGameEvent('level-failed', { level, reason }),
  
  // Gameplay events
  categoryPlaced: (categoryId) => trackGameEvent('category-placed', { category: categoryId }),
  wordSorted: (correct, categoryId) => trackGameEvent('word-sorted', { 
    correct: correct ? 'yes' : 'no',
    category: categoryId 
  }),
  stockDrawn: (movesLeft) => trackGameEvent('stock-drawn', { movesRemaining: movesLeft }),
  
  // User actions
  hintUsed: (level) => trackGameEvent('hint-used', { level }),
  undoUsed: (level) => trackGameEvent('undo-used', { level }),
  levelRestarted: (level) => trackGameEvent('level-restarted', { level }),
  
  // Settings
  displayModeChanged: (mode) => trackGameEvent('display-mode-changed', { mode }),
  
  // Engagement
  sessionStart: () => trackGameEvent('session-start'),
  sessionEnd: (duration) => trackGameEvent('session-end', { duration }),
  
  // Tutorial
  tutorialStarted: () => trackGameEvent('tutorial-started'),
  tutorialCompleted: () => trackGameEvent('tutorial-completed'),
  tutorialSkipped: () => trackGameEvent('tutorial-skipped'),
  
  // Sharing/virality
  shareClicked: (platform) => trackGameEvent('share-clicked', { platform }),
  installPromptShown: () => trackGameEvent('pwa-install-prompt-shown'),
  installCompleted: () => trackGameEvent('pwa-installed')
};

// Track session duration
let sessionStartTime = Date.now();
window.addEventListener('beforeunload', () => {
  const duration = Math.round((Date.now() - sessionStartTime) / 1000); // seconds
  GameAnalytics.sessionEnd(duration);
});

// Track session start
GameAnalytics.sessionStart();
```

**File:** `index.html`

Add analytics script:

```html
<script src="analytics.js"></script>
<script src="physics-dictionary.js"></script>
<script src="game-logic.js"></script>
<script src="main.js"></script>
```

**File:** `main.js`

Integrate analytics into existing game flow:

```javascript
// In startNewGame()
function startNewGame(level = 1) {
  game = new PhysicsAssociations();
  game.initLevel(level);
  
  // Track level start
  if (typeof GameAnalytics !== 'undefined') {
    GameAnalytics.levelStarted(level);
  }
  
  renderGame();
}

// In handleSortResult()
function handleSortResult(result) {
  const state = game.getGameState();
  
  if (result.success) {
    triggerHaptic('success');
    showFeedback(result.message, 'success');
    
    // Track successful word sort
    if (typeof GameAnalytics !== 'undefined') {
      GameAnalytics.wordSorted(true, selectedWordCard.categoryId);
    }
    
    renderGame();
  } else {
    triggerHaptic('error');
    showFeedback(result.message, 'error');
    
    // Track wrong guess
    if (typeof GameAnalytics !== 'undefined') {
      GameAnalytics.wordSorted(false, 'wrong-category');
    }
    
    renderGame();
  }
}

// In handleDrawCard()
function handleDrawCard() {
  triggerHaptic('light');
  const result = game.drawFromStock();
  
  if (result.success) {
    triggerHaptic('medium');
    showFeedback(result.message, 'info');
    
    // Track stock draw
    if (typeof GameAnalytics !== 'undefined') {
      const state = game.getGameState();
      GameAnalytics.stockDrawn(state.movesRemaining);
    }
    
    renderGame();
  } else {
    triggerHaptic('error');
    showFeedback(result.message, 'error');
  }
}

// In showGameOverModal()
function showGameOverModal(won, state) {
  // Track game completion
  if (typeof GameAnalytics !== 'undefined') {
    if (won) {
      GameAnalytics.levelCompleted(state.level, state.score, state.movesRemaining);
    } else {
      const reason = state.movesRemaining === 0 ? 'no-moves' : 'no-valid-moves';
      GameAnalytics.levelFailed(state.level, reason);
    }
  }
  
  // ... existing modal code
}

// In handleShowHint()
function handleShowHint() {
  const state = game.getGameState();
  
  // Track hint usage
  if (typeof GameAnalytics !== 'undefined') {
    GameAnalytics.hintUsed(state.level);
  }
  
  // ... existing hint code
}

// In setDisplayMode()
function setDisplayMode(mode) {
  currentDisplayMode = mode;
  localStorage.setItem('physics_display_mode', mode);
  
  // Track display mode change
  if (typeof GameAnalytics !== 'undefined') {
    GameAnalytics.displayModeChanged(mode);
  }
  
  renderGame();
}
```

---

### Event Tracking Priority

**Essential (implement first):**
- ✅ Level started/completed/failed
- ✅ Session start/end
- ✅ Word sorting (correct/incorrect)
- ✅ Display mode changes

**Nice to have:**
- Hint usage
- Stock pile draws
- Category placement
- Level restarts

**Future:**
- Tutorial completion
- Share button clicks
- PWA install events

---

## Part B: Progressive Web App (PWA) Implementation

### Why PWA for This Game?

**Native-like Experience:**
- Install to home screen (iOS/Android)
- Works offline (play without internet)
- Full-screen mode (no browser chrome)
- Faster load times (cached assets)
- App-like feel (boosts engagement)

**User Benefits:**
- Quick access from home screen
- Plays on airplane/subway
- Feels like real app, not website
- Background sync for future features

**Technical Benefits:**
- No app store approval needed
- One codebase for all platforms
- Instant updates (no user action needed)
- Small footprint (~500KB total)

---

### PWA Implementation Checklist

#### 1. Web App Manifest (5 minutes - REQUIRED)

**File:** Create `manifest.json` in root:

```json
{
  "name": "Physics Associations - Word Solitaire",
  "short_name": "Physics Solitaire",
  "description": "Sort physics terms into categories. Educational word game with limited moves.",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "portrait-primary",
  "categories": ["education", "games"],
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/gameplay.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ]
}
```

**File:** `index.html` - Add to `<head>`:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#667eea">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Physics Solitaire">
<link rel="apple-touch-icon" href="/icons/icon-152.png">
```

---

#### 2. Service Worker for Offline Support (20 minutes - RECOMMENDED)

**File:** Create `service-worker.js` in root:

```javascript
const CACHE_NAME = 'physics-solitaire-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/physics-dictionary.js',
  '/game-logic.js',
  '/main.js',
  '/analytics.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

**File:** `main.js` - Register service worker:

```javascript
// Register service worker (at top of file, after DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
  loadDisplayPreference();
  initializeElements();
  setupEventListeners();
  startNewGame();
  
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  }
});
```

---

#### 3. Install Prompt (15 minutes - NICE TO HAVE)

**File:** `main.js` - Add install prompt:

```javascript
// PWA Install Prompt
let deferredInstallPrompt = null;

// Capture install prompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default mini-infobar
  e.preventDefault();
  
  // Save prompt for later
  deferredInstallPrompt = e;
  
  // Show custom install button
  showInstallButton();
  
  // Track prompt shown
  if (typeof GameAnalytics !== 'undefined') {
    GameAnalytics.installPromptShown();
  }
});

// Show install button in menu
function showInstallButton() {
  // Add to menu modal
  const installBtn = document.createElement('button');
  installBtn.className = 'btn-stock';
  installBtn.style.background = 'var(--success)';
  installBtn.innerHTML = '📱 Install App';
  installBtn.onclick = promptInstall;
  
  // Insert into menu (you'll add this during menu redesign)
  // For now, log that it's available
  console.log('PWA install available');
}

// Prompt user to install
async function promptInstall() {
  if (!deferredInstallPrompt) {
    return;
  }
  
  // Show install prompt
  deferredInstallPrompt.prompt();
  
  // Wait for user choice
  const { outcome } = await deferredInstallPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('User installed PWA');
    
    // Track installation
    if (typeof GameAnalytics !== 'undefined') {
      GameAnalytics.installCompleted();
    }
  }
  
  // Clear prompt
  deferredInstallPrompt = null;
}

// Detect if running as installed PWA
function isInstalledPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Track if user is using installed version
if (isInstalledPWA() && typeof GameAnalytics !== 'undefined') {
  trackGameEvent('app-launched-from-homescreen');
}
```

---

#### 4. App Icons (10 minutes - REQUIRED)

**Generate icons from base image:**

Use a tool like https://realfavicongenerator.net/ or create manually:

**Required sizes:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Icon design suggestions:**
- Use atom symbol (⚛️) or physics-themed graphic
- Match gradient colors from game (purple/blue)
- Simple, recognizable at small sizes
- Maskable (safe area for rounded corners)

**Folder structure:**
```
/icons/
  icon-72.png
  icon-96.png
  icon-128.png
  icon-144.png
  icon-152.png
  icon-192.png
  icon-384.png
  icon-512.png
```

**Quick icon creation (if no design tool):**
```html
<!-- Create temporary HTML to screenshot -->
<div style="width: 512px; height: 512px; 
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     display: flex; align-items: center; justify-content: center;
     font-size: 256px;">
  ⚛️
</div>
```
Screenshot at 512x512, then resize for other dimensions.

---

### PWA Testing Checklist

**Desktop (Chrome DevTools):**
- [ ] Open DevTools → Application → Manifest
- [ ] Verify manifest loads correctly
- [ ] Check all icons present
- [ ] Application → Service Workers → verify registered
- [ ] Application → Cache Storage → verify files cached
- [ ] Lighthouse audit → PWA score > 90

**Mobile (Real Device):**
- [ ] Android: Chrome shows "Install app" banner
- [ ] iOS: Share → "Add to Home Screen" available
- [ ] App icon appears on home screen
- [ ] Launches in standalone mode (no browser chrome)
- [ ] Works offline (airplane mode test)
- [ ] Splash screen shows correctly

---

## Implementation Priority

### Must Have (Ship v1.0):
1. ✅ GoatCounter pageview tracking (5 min)
2. ✅ Web app manifest (5 min)
3. ✅ Service worker with offline support (20 min)
4. ✅ App icons (10 min)
5. ✅ Basic event tracking (level start/complete/fail) (15 min)

**Total: ~55 minutes**

### Should Have (Ship v1.1):
- Full event tracking (all game actions)
- Install prompt in menu
- PWA install analytics
- Tutorial completion tracking

### Nice to Have (Ship v2.0):
- Background sync (for future multiplayer)
- Push notifications (daily challenge reminders)
- Share functionality (share score to Twitter/etc)
- Offline indicator in UI

---

## Analytics Dashboard Insights

**What to monitor weekly:**

**Engagement:**
- Sessions per day
- Average session duration
- Level completion rate by level
- Hint usage rate (>50% = too hard)

**UX Optimization:**
- Wrong guess rate by category (confusing terms)
- Stock pile draw frequency (difficulty tuning)
- Level restart rate (frustration indicator)
- Display mode preference split

**Growth:**
- PWA install rate
- Return visitor rate
- Level progression (how far players get)

**Red Flags:**
- High quit rate on specific level → too hard
- Low hint usage → not discoverable
- High wrong-guess rate → confusing categories
- Short session duration → not engaging

---

## Files to Create/Modify

**New Files:**
- `manifest.json` - PWA manifest
- `service-worker.js` - Offline caching
- `analytics.js` - Event tracking wrapper
- `/icons/` - App icon directory (8 sizes)

**Modified Files:**
- `index.html` - Add manifest link, GoatCounter script, analytics script
- `main.js` - Integrate analytics calls, register service worker
- `styles.css` - (Optional) Add install button styling

**Don't Touch:**
- `physics-dictionary.js` - No changes needed
- `game-logic.js` - No changes needed (analytics in UI layer)

---

## Testing Commands

**Local testing:**
```bash
# Serve with HTTPS (required for service workers)
npx http-server -S -C localhost.pem -K localhost-key.pem

# Or use Python
python -m http.server 8000 --bind localhost
```

**PWA validation:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run PWA audit
lighthouse http://localhost:8000 --view --preset=pwa
```

**Service worker debugging:**
- Chrome DevTools → Application → Service Workers
- Click "Update" to force refresh
- Check "Offline" to test offline mode
- Click "Unregister" to reset

---

## Success Criteria

**Analytics is successful when:**
- ✅ Pageviews tracking in GoatCounter dashboard
- ✅ Game events appear in real-time
- ✅ No performance impact (async loading)
- ✅ Privacy-compliant (no PII collected)

**PWA is successful when:**
- ✅ Lighthouse PWA score > 90
- ✅ Installable on iOS and Android
- ✅ Works offline (all core features)
- ✅ Launches in standalone mode
- ✅ Service worker caches all assets
- ✅ Icon shows correctly on home screen

---

## Privacy & Compliance Notes

**GoatCounter is GDPR/CCPA compliant:**
- No cookies required
- No personal data collected
- No IP address tracking
- No third-party data sharing
- Open source and transparent

**What is tracked:**
- Page views (anonymized)
- Custom events (game actions)
- Browser/device type (aggregate)
- Session duration (anonymous)

**What is NOT tracked:**
- Names, emails, user IDs
- IP addresses
- Precise location
- Cross-site activity

**No consent banner needed** (privacy-friendly by default)

---

## Notes for Claude Code

- **Start with analytics Level 1** - Just get pageviews working first
- **Test service worker thoroughly** - Offline bugs are hard to debug
- **Don't over-track** - Only track actionable events
- **Icons are critical** - PWA won't install without proper icons
- **Cache strategy** - Cache-first for assets, network-first for API (if added later)
- **Update manifest version** - Bump cache name when deploying updates
- **GoatCounter is free** - No API limits, perfect for indie games

This completes the game's technical foundation: playable (V1), readable (V2), measurable (V3), and installable (V3)!