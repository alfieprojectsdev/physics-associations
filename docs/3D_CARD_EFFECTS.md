# 3D Card Effects Implementation

## Overview

This document describes the 3D card rotation and spring animation system added to Ground State. These enhancements make card dragging feel more physical and tactile, inspired by the [image-card-stack](https://github.com/mirayatech/image-card-stack) project by mirayatech.

## Features Implemented

### 1. 3D Card Rotation on Drag

**What it does:** Cards tilt and rotate in 3D space based on where you touch them, creating a realistic "holding a physical card" feel.

**How it works:**
- When dragging a card, its rotation is calculated based on touch position relative to the card's center
- Touch above center → card tilts backward (negative rotateX)
- Touch below center → card tilts forward (positive rotateX)
- Touch left of center → card tilts left (negative rotateY)
- Touch right of center → card tilts right (positive rotateY)
- Maximum rotation: ±20 degrees

**Code locations:**
- CSS: `styles.css` lines 52-53 (perspective on game container)
- CSS: `styles.css` lines 386-387 (preserve-3d on cards)
- JS: `main.js` lines 264-298 (`calculate3DRotation()` and `apply3DTransform()` functions)
- JS: `main.js` lines 368-385 (rotation applied in `handleTouchMove()`)

**Math formula:**
```javascript
const rotateX = -(offsetY / cardRect.height) * MAX_ROTATION;
const rotateY = (offsetX / cardRect.width) * MAX_ROTATION;
```

### 2. Dynamic Shadow Intensity

**What it does:** Shadow gets darker and larger as the card tilts more, enhancing the 3D illusion.

**How it works:**
- Calculates rotation magnitude: `sqrt(rotateX² + rotateY²)`
- Three shadow levels:
  - Light: 0-8° rotation → subtle shadow
  - Medium: 8-15° rotation → moderate shadow
  - Heavy: 15-20° rotation → dramatic shadow

**Code locations:**
- CSS: `styles.css` lines 897-907 (shadow classes)
- JS: `main.js` lines 278-285 (shadow calculation)
- JS: `main.js` lines 384-385 (shadow class application)

### 3. Spring-Based Animations

**What it does:** Cards bounce and snap with natural spring physics instead of linear easing.

**How it works:**
- Uses cubic-bezier easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- This creates overshoot and bounce-back effect
- Applied to:
  - Card transforms (rotation, scale)
  - Card snap-back on invalid drop
  - Success/error feedback animations

**Code locations:**
- CSS: `styles.css` line 379 (spring easing on card transitions)
- CSS: `styles.css` lines 910-924 (springBounce keyframes)
- CSS: `styles.css` lines 927-930 (card-returning class)
- JS: `main.js` lines 431-443 (success snap animation)

**Spring curve characteristics:**
- Accelerates quickly (0.34 at 34% progress)
- Overshoots target (1.56 > 1.0)
- Bounces back (0.64, 1)
- Feels natural and playful

### 4. Enhanced Haptic Feedback

**What it does:** Added haptic vibration on drag start for better tactile feedback.

**Code location:**
- JS: `main.js` line 357 (`triggerHaptic('light')` on drag start)

## CSS Classes Added

### `.card-dragging`
Applied to card clone during drag. Provides:
- Elevated z-index (1000)
- Immediate response (no transition)
- Enhanced shadow

### `.shadow-light`, `.shadow-medium`, `.shadow-heavy`
Dynamic shadow intensity based on rotation angle.

### `.card-snap`
Spring bounce animation for successful card placement.

### `.card-returning`
Smooth spring-based return animation when drag ends.

## Performance Optimizations

1. **`will-change: transform`** on `.card` - Hints browser to GPU-accelerate
2. **`perspective: 1000px`** on container - Enables hardware-accelerated 3D
3. **`transform-style: preserve-3d`** - Ensures 3D context preserved
4. **No transitions during drag** - Immediate response for smooth dragging

## Browser Compatibility

**Supported:**
- All modern mobile browsers (iOS Safari, Chrome, Firefox, Edge)
- Desktop browsers with touch/mouse input

**CSS Features Used:**
- `perspective` - 3D space
- `transform-style: preserve-3d` - 3D child elements
- `rotateX()`, `rotateY()` - 3D rotations
- `cubic-bezier()` - Custom easing
- `will-change` - Performance hint

**JavaScript APIs Used:**
- `getBoundingClientRect()` - Card position
- `Touch` events - `touchstart`, `touchmove`, `touchend`
- `Math.sqrt()` - Rotation magnitude
- `setTimeout()` - Delayed animations

## Accessibility Considerations

### Reduced Motion Support

Users with `prefers-reduced-motion: reduce` get simplified animations:
- 3D rotation still works but returns to 0° faster
- Spring bounce disabled
- Reduced transition speeds

**Code location:**
- CSS: `styles.css` lines 958-988 (media query)

### Screen Readers

- No impact on screen reader announcements
- Animations are purely visual
- Game logic unchanged

## Future Enhancements

Potential improvements (not yet implemented):

1. **Velocity-based flick gestures**
   - Fast upward flick → auto-submit word
   - Fast downward flick → discard/skip

2. **Particle effects on snap**
   - Small burst of particles when card successfully snaps

3. **Lighting gradient**
   - Dynamic gradient overlay based on rotation angle
   - Simulates light source

4. **Multi-finger gestures**
   - Two-finger pinch → zoom card for better readability
   - Two-finger rotate → manual card rotation

## Testing Checklist

- [ ] Test on iPhone Safari (iOS 15+)
- [ ] Test on Android Chrome (Android 10+)
- [ ] Test with reduced motion enabled
- [ ] Test on low-end devices (< 2GB RAM)
- [ ] Verify haptic feedback works
- [ ] Check shadow rendering performance

## Credits

Inspired by [image-card-stack](https://github.com/mirayatech/image-card-stack) by [mirayatech](https://github.com/mirayatech).

## Implementation Statistics

- **Lines added:** ~150 (CSS + JS combined)
- **New functions:** 2 (`calculate3DRotation`, `apply3DTransform`)
- **New CSS classes:** 6
- **Performance impact:** Minimal (GPU-accelerated)
- **Bundle size impact:** 0 (vanilla JS, no dependencies)

---

**Status:** ✅ Implemented on `feature/3d-card-effects` branch
**Next Steps:** Mobile testing, merge to main after validation
