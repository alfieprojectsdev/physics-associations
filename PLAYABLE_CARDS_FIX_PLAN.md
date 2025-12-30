# Playable Cards Logic Fix Plan

## Current Issue

**Problem:** Only the top card of each tableau column is playable, limiting strategic options.

**Current Implementation:**
- `game-logic.js:135` - `getPlayableCards()` only returns top card per column
- `main.js:518-524` - Only top and bottom cards get `playable` class and click handlers
- Documentation states: "Only top card of each tableau column + waste pile are interactive"

**User Request:** "The entire column should be playable (within standard solitaire constraints)"

---

## Game Context

**Associations Game Mechanics:**
- NOT a building/stacking game (no rank/suit sequences like Klondike)
- Cards are sorted by CATEGORY only (physics terms → physics categories)
- Removing a card from tableau reveals the card underneath
- Strategic value: Access any face-up card, not just the top one

**"Standard Solitaire Constraints" in this context:**
- ALL face-up cards should be clickable
- Face-down cards remain locked until revealed
- When a card is removed from a column, cards shift down

---

## Proposed Changes

### 1. Update `getPlayableCards()` in `game-logic.js`

**Current Code (lines 135-154):**
```javascript
getPlayableCards() {
    const playable = [];

    // Top card from each column
    this.tableau.forEach((column, colIndex) => {
        if (column.length > 0) {
            const topCard = column[column.length - 1];
            if (topCard.faceUp) {
                playable.push({ ...topCard, source: 'tableau', colIndex });
            }
        }
    });

    // Waste pile card
    if (this.waste && this.waste.faceUp) {
        playable.push({ ...this.waste, source: 'waste' });
    }

    return playable;
}
```

**Proposed Fix:**
```javascript
getPlayableCards() {
    const playable = [];

    // ALL face-up cards from each column (not just top)
    this.tableau.forEach((column, colIndex) => {
        column.forEach((card, cardIndex) => {
            if (card.faceUp) {
                playable.push({
                    ...card,
                    source: 'tableau',
                    colIndex,
                    cardIndex  // Add position in column for removal logic
                });
            }
        });
    });

    // Waste pile card
    if (this.waste && this.waste.faceUp) {
        playable.push({ ...this.waste, source: 'waste' });
    }

    return playable;
}
```

**Changes:**
- Loop through ALL cards in each column, not just top
- Check `card.faceUp` for each card individually
- Add `cardIndex` to track position in column (needed for removal)

---

### 2. Update Card Removal Logic

**Current Implementation:**
- `placeCategory()` and `sortWord()` assume top card removal
- Use `column.pop()` to remove last element

**Required Changes:**

#### In `placeCategory()` (around line 159):
```javascript
placeCategory(cardId) {
    const playable = this.getPlayableCards();
    const card = playable.find(c => c.id === cardId);

    if (!card) {
        return { success: false, message: 'Card is not playable' };
    }

    if (card.type !== 'category') {
        return { success: false, message: 'Only category cards can be placed on foundations' };
    }

    // Handle removal based on source
    if (card.source === 'tableau') {
        // Remove from specific position, not just pop()
        this.tableau[card.colIndex].splice(card.cardIndex, 1);

        // Reveal card underneath if it exists and is face-down
        const column = this.tableau[card.colIndex];
        if (column.length > 0) {
            const newTopCard = column[column.length - 1];
            if (!newTopCard.faceUp) {
                newTopCard.faceUp = true;
            }
        }
    } else if (card.source === 'waste') {
        this.waste = null;
    }

    // Rest of category placement logic...
}
```

#### In `sortWord()` (around line 198):
```javascript
sortWord(wordCardId, categoryId) {
    const playable = this.getPlayableCards();
    const card = playable.find(c => c.id === wordCardId);

    if (!card) {
        return { success: false, message: 'Card is not playable' };
    }

    // ... validation logic ...

    // Handle removal based on source
    if (card.source === 'tableau') {
        // Remove from specific position, not just pop()
        this.tableau[card.colIndex].splice(card.cardIndex, 1);

        // Reveal card underneath if it exists and is face-down
        const column = this.tableau[card.colIndex];
        if (column.length > 0) {
            const newTopCard = column[column.length - 1];
            if (!newTopCard.faceUp) {
                newTopCard.faceUp = true;
            }
        }
    } else if (card.source === 'waste') {
        this.waste = null;
    }

    // Rest of sorting logic...
}
```

**Key Changes:**
- Use `splice(cardIndex, 1)` instead of `pop()` to remove from specific position
- After removal, check if there's a new top card
- If new top card is face-down, flip it to face-up (reveals hidden cards)

---

### 3. Update Rendering in `main.js`

**Current Code (lines 518-524):**
```javascript
if ((isTopCard || isBottomCard) && card.faceUp) {
    cardEl.classList.add('playable');
    cardEl.addEventListener('click', () => handleCardClick(card));
} else {
    // Middle cards: no playable class, no event handlers
    cardEl.classList.remove('playable');
}
```

**Proposed Fix:**
```javascript
// Make ALL face-up cards playable
if (card.faceUp) {
    const isPlayable = playableCards.some(p =>
        p.id === card.id &&
        p.source === 'tableau' &&
        p.colIndex === colIndex
    );

    if (isPlayable) {
        cardEl.classList.add('playable');
        cardEl.addEventListener('click', () => handleCardClick(card));
    }
} else {
    // Face-down cards remain non-interactive
    cardEl.classList.remove('playable');
}
```

**Changes:**
- Check if card exists in `playableCards` array (from state)
- Apply `playable` class to ALL face-up cards in column
- Remove the `isTopCard || isBottomCard` restriction

**Alternative (Simpler):**
```javascript
// All face-up cards are clickable
if (card.faceUp) {
    cardEl.classList.add('playable');
    cardEl.addEventListener('click', () => handleCardClick(card));
}
```

This simpler approach works because `handleCardClick()` already validates via `getPlayableCards()`.

---

### 4. Update Documentation

**Files to Update:**

#### `CLAUDE.md` (line 337-342):
```markdown
### Playable Cards System

All face-up cards in tableau columns + waste pile are interactive:
- `game-logic.js:getPlayableCards()` returns ALL face-up cards from columns
- `main.js` adds `playable` class to all face-up cards for visual feedback
- Face-down cards cannot be interacted with until revealed
- Removing a card from the middle of a column reveals the card underneath
```

---

## Strategic Implications

### Before Fix:
- Limited to top card only
- No way to access buried cards except by clearing top cards first
- Less strategic depth

### After Fix:
- Access any face-up card in column
- Strategic choice: which card to sort first
- Reveals cards faster by targeting middle cards
- More complex decision-making (similar to Spider Solitaire)

---

## Edge Cases to Handle

### 1. Empty Column After Removal
**Scenario:** Remove the last card from a column
**Handling:** Already handled - column becomes empty array `[]`

### 2. Removing Bottom Card
**Scenario:** Remove the bottom-most face-up card in a column
**Handling:**
- Cards above shift down naturally (array behavior)
- Check if new top card (last element) is face-down
- If face-down, flip to face-up

### 3. Multiple Face-Up Cards in Sequence
**Scenario:** Column has 3 face-up cards stacked
**Handling:** All 3 should be clickable and in `playableCards` array

### 4. Click on Face-Down Card
**Scenario:** User somehow clicks a face-down card
**Handling:** Already handled in `handleCardClick()` via `getPlayableCards()` validation

---

## Testing Checklist

### Unit Tests (Manual)
- [ ] `getPlayableCards()` returns ALL face-up cards from all columns
- [ ] Removing top card works correctly
- [ ] Removing middle card works correctly
- [ ] Removing bottom card reveals card underneath
- [ ] Face-down cards are NOT in playableCards array
- [ ] Waste pile card still included in playableCards

### Integration Tests (In-Game)
- [ ] Click on top card → sorts correctly
- [ ] Click on middle card → sorts correctly, cards shift down
- [ ] Click on bottom card → sorts correctly, reveals next card
- [ ] Multiple face-up cards all have `playable` class
- [ ] Face-down cards do NOT have `playable` class
- [ ] Visual feedback (hover/active states) works on all playable cards
- [ ] Move economy: each card sort costs 1 move
- [ ] Hint system accounts for all playable cards

### Visual Tests
- [ ] All face-up cards show visual "playable" styling
- [ ] Click events work on all face-up cards
- [ ] No visual glitches when removing middle cards
- [ ] Card stack shifts smoothly after removal

---

## Implementation Steps

### Phase 1: Core Logic (game-logic.js)
1. Update `getPlayableCards()` to return all face-up cards
2. Add `cardIndex` tracking to playable cards
3. Update `placeCategory()` card removal logic
4. Update `sortWord()` card removal logic
5. Add face-down flip logic after removal

### Phase 2: UI Rendering (main.js)
1. Update `renderTableau()` to mark all face-up cards as playable
2. Remove `isTopCard || isBottomCard` restriction
3. Test click handlers on middle cards

### Phase 3: Documentation & Testing
1. Update CLAUDE.md documentation
2. Manual testing of all edge cases
3. Verify hint system works with new logic
4. Test on mobile devices for touch interactions

---

## Potential Risks

### 1. Performance Impact
**Risk:** Returning more cards in `getPlayableCards()` increases array size
**Mitigation:** Negligible - typical column has 5-8 cards max, 3-5 columns = ~15-40 cards total
**Assessment:** LOW RISK

### 2. Hint System Compatibility
**Risk:** `getHint()` function may need updates to account for more playable cards
**Mitigation:** Review hint logic - it should work correctly since it uses `getPlayableCards()`
**Assessment:** MEDIUM RISK - requires testing

### 3. Move Economy Balance
**Risk:** More playable cards = easier game, may reduce difficulty
**Mitigation:** This is intentional - increases strategic options, not necessarily easier
**Assessment:** LOW RISK - design decision, not a bug

### 4. Visual Clutter
**Risk:** Too many "playable" highlights could be visually overwhelming
**Mitigation:** Existing CSS styling should handle this well
**Assessment:** LOW RISK

---

## Related Code References

### Key Files:
- `game-logic.js:135-154` - `getPlayableCards()` function
- `game-logic.js:159-195` - `placeCategory()` method
- `game-logic.js:198-248` - `sortWord()` method
- `main.js:486-564` - `renderTableau()` function
- `main.js:649-658` - `handleCardClick()` function

### Dependencies:
- No changes needed to state management
- No changes needed to foundation rendering
- No changes needed to waste pile logic
- Hint system uses `getPlayableCards()` - should auto-adapt

---

## Success Criteria

✅ All face-up cards in tableau columns are clickable
✅ Removing middle card shifts cards down correctly
✅ Face-down cards are revealed after card above is removed
✅ Move economy remains balanced (1 move per sort)
✅ Visual feedback works on all playable cards
✅ No performance degradation
✅ Mobile touch interactions work correctly
✅ Hint system adapts to new playable cards

---

## Alternative Approaches Considered

### Option A: Keep Top Card Only (Current)
- ❌ Limited strategic depth
- ❌ Doesn't match "solitaire constraints"
- ❌ User explicitly requested change

### Option B: All Face-Up Cards (Proposed)
- ✅ Matches standard solitaire mechanics
- ✅ Increases strategic options
- ✅ User explicitly requested
- ✅ Simple to implement

### Option C: Build Sequences (Klondike-style)
- ❌ Too complex for Associations game
- ❌ Would require rank/suit tracking
- ❌ Not requested by user
- ❌ Breaks game design (category-based, not sequence-based)

**Decision:** Option B (All Face-Up Cards) is the clear choice.
