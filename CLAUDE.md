# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ground State is a mobile-first word game combining solitaire mechanics with physics terminology. Players sort physics terms into category foundations before running out of moves. The game is built with vanilla JavaScript, HTML, and CSS - no build tools or dependencies required.

Live demo: https://alfieprojectsdev.github.io/physics-associations/

## Development Setup

### Running the Game

This is a pure client-side application with no build step:

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Run local server (recommended for testing)
python -m http.server 8000
# Visit: http://localhost:8000
```

### Testing

No automated test suite exists. Manual testing workflow:

1. Open in browser or local server
2. Test on actual mobile devices for touch interactions
3. Use browser DevTools mobile emulation for responsive layout
4. Check TOUCH_OPTIMIZATION.md for touch testing checklist

## Using Gemini CLI for Large Codebase Analysis

When analyzing large codebases or multiple files that might exceed context limits, use the Gemini CLI with its massive context window. Use `gemini -p` to leverage Google Gemini's large context capacity.

### File and Directory Inclusion Syntax

Use the `@` syntax to include files and directories in your Gemini prompts. The paths should be relative to WHERE you run the gemini command:

**Examples:**

```bash
# Single file analysis
gemini -p "@game-logic.js Explain the move economy and scoring system"

# Multiple files
gemini -p "@main.js @game-logic.js How do the UI layer and game logic layer interact?"

# Analyze game state management
gemini -p "@game-logic.js Show how the GameEngine class manages game state and what getGameState() returns"

# Multiple implementation files
gemini -p "@game-logic.js @physics-dictionary.js How does the game logic layer consume data from the physics dictionary?"

# Current directory and subdirectories
gemini -p "@./ Give me an overview of the entire physics associations game implementation"

# Or use --all_files flag
gemini --all_files -p "Analyze all JavaScript files and identify common patterns in card rendering and event handling"
```

### Implementation Verification Examples

```bash
# Check if a feature is implemented
gemini -p "@game-logic.js @main.js Is the solitaire-style tableau layout correctly implementing face-up/face-down card logic?"

# Verify move economy logic
gemini -p "@game-logic.js Does the move calculation system properly penalize wasteful draws and wrong category guesses?"

# Check for playable cards system
gemini -p "@game-logic.js @main.js How is the playable cards system implemented? Show the relevant code in both logic and UI layers"

# Verify state management synchronization
gemini -p "@game-logic.js @main.js How is game state managed and synchronized between logic and UI? Are there any direct state mutations?"

# Check category rendering completeness
gemini -p "@physics-dictionary.js @main.js Are all physics categories in the dictionary properly rendered in the foundations UI?"

# Verify touch optimization implementation
gemini -p "@styles.css @main.js What touch optimizations are implemented? Check tap target sizes and haptic feedback"

# Check win/loss condition logic
gemini -p "@game-logic.js What are the exact win and loss conditions? Show all the relevant checks"

# Verify card type distinction
gemini -p "@game-logic.js How does the game distinguish between category cards and word cards? Show placeCategory() and sortWord() validation"

# Check responsive design
gemini -p "@styles.css @index.html How is mobile-first responsive design implemented? Show breakpoints and viewport settings"

# Verify rendering flow consistency
gemini -p "@main.js @game-logic.js Is the rendering flow following the pattern: state change → getGameState() → renderGame()?"

# Check data layer structure
gemini -p "@physics-dictionary.js What is the structure of PhysicsCategories and PhysicsWords? Are they properly formatted?"

# Verify event handling
gemini -p "@main.js How are card click events handled? Show the flow from DOM event to game logic to re-render"

# Check stock pile mechanics
gemini -p "@game-logic.js How is the stock pile and waste pile system implemented? What happens when drawing cards?"

# Verify foundation sorting logic
gemini -p "@game-logic.js How does the game validate that a word belongs to a category foundation?"

# Check level progression
gemini -p "@game-logic.js @physics-dictionary.js How does level difficulty scale? Show column count, move allocation, and deck generation"

# Verify accessibility features
gemini -p "@styles.css @index.html Are WCAG touch target requirements (44x44px minimum) met? Check all interactive elements"

# Check CSS architecture
gemini -p "@styles.css How is the CSS organized? Are component sections clearly separated?"

# Verify no direct DOM manipulation in logic
gemini -p "@game-logic.js Does the game logic layer contain any DOM manipulation or references to DOM elements?"

# Check modal dialog implementation
gemini -p "@main.js How are win/loss modal dialogs implemented and triggered?"

# Verify documentation accuracy
gemini -p "@CLAUDE.md @README.md @TOUCH_OPTIMIZATION.md Are the architecture descriptions consistent across all documentation?"
```

### When to Use Gemini CLI

Use `gemini -p` when:
- Analyzing entire codebases or large directories
- Comparing multiple implementations (e.g., game logic vs UI rendering)
- Need to understand project-wide patterns or architecture
- Current context window is insufficient for the task
- Working with files totaling more than 100KB
- Verifying if state management and rendering flow are consistent across layers
- Checking for data format compatibility between components (e.g., dictionary → game logic → UI rendering)
- Understanding the complete game mechanics workflow across documentation and code
- Cross-referencing touch optimizations between CSS and JavaScript
- Analyzing card rendering pipelines and event handling flows

### Important Notes

- Paths in `@` syntax are relative to your current working directory when invoking gemini
- The CLI will include file contents directly in the context
- No need for `--yolo` flag for read-only analysis
- Gemini's context window can handle entire codebases that would overflow Claude's context
- When checking implementations, be specific about what you're looking for to get accurate results
- Particularly useful for verifying consistency between game logic state and UI rendering
- Helpful for understanding MVC-style separation and data flow patterns

### Multimodal Capabilities

Gemini CLI is multimodal and can read PDFs, images, and other visual content. This is useful for analyzing screenshots, design mockups, or debugging UI issues.

**Reading PDFs:**

```bash
# Extract exact wordings from documentation
gemini -p "@docs/game-design-doc.pdf Extract all game mechanics rules and scoring formulas"

# Compare PDFs for consistency
gemini -p "@docs/v1-design.pdf @docs/v2-design.pdf Compare the move economy between these two versions. List any differences."

# Extract structured data from PDFs
gemini -p "@docs/physics-categories.pdf Extract all category definitions as a JSON structure"

# Refine documentation using PDF content
gemini -p "@docs/design-spec.pdf @CLAUDE.md Does the implemented architecture match the design specification? List any discrepancies."
```

**Reading Images (screenshots, UI mockups, debug outputs):**

```bash
# Analyze game screenshots
gemini -p "@screenshots/game-board.png What UI elements are visible? Describe the layout and card arrangement."

# Compare design mockups
gemini -p "@mockups/*.png Analyze all game UI mockup images and describe the progression flow"

# Verify UI accuracy
gemini -p "@screenshots/game-board.png @styles.css Does the implemented styling match what's visible in the screenshot? List any discrepancies."
```

**Combining Multimodal with Code:**

```bash
# Verify UI implementation against mockups
gemini -p "@mockups/foundation-layout.png @main.js Does the foundation rendering in the script match the UI mockup?"

# Check if debug screenshots match expected behavior
gemini -p "@debug/touch-interaction.png @main.js Does the card interaction behavior in the image align with the event handling logic?"

# Validate game mechanics against design screenshots
gemini -p "@screenshots/tableau-cards.png @game-logic.js Does the tableau layout follow the face-up/face-down pattern shown in the screenshot?"
```

**Use Cases for Multimodal Analysis:**

- **Exact wording extraction** - Get authoritative text from PDF design docs for game implementation
- **UI validation** - Verify that implemented card layouts match design mockups
- **Documentation compliance** - Check if rendered game boards match official design specifications
- **Visual debugging** - Analyze screenshot evidence of touch interaction or rendering issues
- **Flow analysis** - Extract game flow diagrams from architecture documents
- **Screenshot-based testing** - Verify UI appearance or card state display

**Important:**
- PDF quality affects extraction accuracy - clear technical documentation works best
- For tables in PDFs, explicitly request structured output (JSON, CSV, markdown tables)
- Images should be clear and high-resolution for best OCR results
- Screenshots of mobile devices are particularly useful for verifying responsive design

## Architecture

### File Structure

```
├── index.html              # Main HTML structure, includes all scripts
├── styles.css              # Mobile-first responsive design with touch optimizations
├── physics-dictionary.js   # Category & word data definitions
├── game-logic.js          # Core game state & mechanics (GameEngine class)
├── main.js                # UI controller & DOM event handling
└── TOUCH_OPTIMIZATION.md  # Touch interaction implementation details
```

### Architecture Pattern: MVC-style Separation

The codebase follows a three-layer separation:

1. **Data Layer** (`physics-dictionary.js`):
   - `PhysicsCategories` array: Category definitions (id, name, icon, description)
   - `PhysicsWords` object: Words organized by category with difficulty/points
   - `generateLevelDeck()` function: Creates shuffled decks for each level

2. **Game Logic Layer** (`game-logic.js`):
   - `GameEngine` class: Core game state machine
   - Manages tableau (solitaire-style columns), foundations, stock pile, waste pile
   - Pure game logic - no DOM manipulation
   - Exposes `getGameState()` for UI consumption

3. **UI Layer** (`main.js`):
   - DOM manipulation and event handling only
   - Calls game logic methods, then renders state changes
   - Handles touch interactions, haptic feedback, modal dialogs
   - All rendering functions (`renderGame()`, `renderTableau()`, etc.)

### Key Game Mechanics

**Board Layout (Solitaire-style):**
- Tableau: 3-5 columns (scales with level) containing face-up/face-down cards
- Stock pile: 30% of cards reserved for drawing
- Waste pile: Currently drawn card
- Foundations: 6 category slots where words are sorted

**Move Economy:**
- Every action costs 1 move (place category, sort word, draw card)
- Moves = `totalCards * 1.5 + 10`
- Wrong category guess = move penalty
- Drawing without using previous card = move penalty

**Win/Loss Conditions:**
- Win: All words sorted before moves run out
- Loss: Moves = 0 OR no valid moves remain

### State Management

Game state is centralized in `GameEngine` class:

```javascript
{
    level: number,
    movesRemaining: number,
    score: number,
    tableau: Array<Array<Card>>,      // Columns of cards
    stockPile: Array<Card>,            // Draw pile
    waste: Card | null,                // Currently drawn card
    foundations: Object<categoryId, Array<Card>>,
    placedCategories: Array<categoryId>,
    gameState: 'ready' | 'playing' | 'won' | 'lost'
}
```

Access via `game.getGameState()` - never mutate state directly.

## Common Modifications

### Adding New Physics Categories

Edit `physics-dictionary.js`:

1. Add category to `PhysicsCategories` array
2. Add words to `PhysicsWords` object with same key
3. Update foundations rendering in `main.js` if changing layout

### Adjusting Difficulty

**Move allocation** (`game-logic.js:31`):
```javascript
this.maxMoves = Math.floor(totalCards * 1.5) + 10;
// Increase multiplier for easier, decrease for harder
```

**Column count** (`game-logic.js:54`):
```javascript
const numColumns = Math.min(3 + Math.floor(this.level / 2), 5);
// More columns = more strategic complexity
```

**Stock pile reserve** (`game-logic.js:57`):
```javascript
const stockCount = Math.floor(allCards.length * 0.3);
// Higher % = more cards hidden initially
```

### Modifying Touch Behavior

All touch optimizations are in `styles.css`:
- Touch targets: `.card` (70x90px), buttons have 52x52px tap zones via `::before`
- Haptic feedback: `main.js` - search for `navigator.vibrate()`
- Scroll behavior: `.foundations-scroll` has snap points

See TOUCH_OPTIMIZATION.md for complete touch implementation details.

## Important Implementation Notes

### Card Rendering Flow

1. `game-logic.js` maintains canonical state
2. `main.js:renderGame()` reads state via `getGameState()`
3. `renderTableau()`, `renderFoundations()`, `renderWaste()` create DOM elements
4. Event listeners attached to cards call game logic methods
5. After state change, `renderGame()` called again (full re-render)

**Note:** This is not a reactive framework - every state change requires explicit `renderGame()` call.

### Playable Cards System

Only top card of each tableau column + waste pile are interactive:
- `game-logic.js:getPlayableCards()` determines what's clickable
- `main.js` adds `playable` class for visual feedback
- Face-down cards cannot be interacted with until revealed

### Category vs Word Card Distinction

Cards have `type: 'category' | 'word'`:
- Category cards: Placed on empty foundations to define sorting slots
- Word cards: Sorted to matching category foundations
- Logic in `placeCategory()` and `sortWord()` methods validates types

## Mobile-First Design Philosophy

This game is **mobile-first** - desktop is secondary:
- All touch targets ≥ 44x44px (WCAG AAA)
- CSS uses `touch-action: manipulation` to remove 300ms tap delay
- Haptic feedback on key actions (card tap, sort success/failure)
- No hover states or tooltips - touch-friendly only
- Viewport locked to prevent accidental zoom

When adding features, **test on actual mobile devices** before desktop browsers.

## CSS Architecture

Organized by component sections:
1. Root variables (colors, spacing, transitions)
2. Base layout (game container, header, board)
3. Card styling (shared between category/word cards)
4. Touch optimizations (tap zones, scroll snap)
5. Responsive breakpoints (tablets, landscape)

Uses CSS Grid for board layout, Flexbox for card arrangements.

## Performance Considerations

- Pure vanilla JS - no framework overhead
- Cards rendered as DOM elements (not canvas) for accessibility
- Animations use `transform` (GPU accelerated) not `left/top`
- Event delegation used where possible
- No polling or continuous updates - event-driven only

## Known Limitations

- No save/load system (progress lost on refresh)
- No undo functionality
- Single-player only (no multiplayer)
- English language only
- No sound effects (haptics only)

See README.md "Known Issues & Roadmap" section for planned features.
