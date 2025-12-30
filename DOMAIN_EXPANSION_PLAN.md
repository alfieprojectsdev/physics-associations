# Domain Expansion Plan: Biology & Mathematics

## Current State

**Main Branch Status:**
- Physics-only vocabulary (`physics-dictionary.js`)
- Single-domain game mechanics
- No domain selector UI

**Feature Branch Status (`claude/review-word-association-game-ZhNe2`):**
- Multi-domain architecture implemented (`vocabulary-dictionary.js`)
- Three domains active: Physics, Chemistry, Computer Science
- Domain selector UI functional
- Domain-specific category lookups fixed

## Planned Additions

### 1. Biology Domain 🧬

**Domain Metadata:**
```javascript
biology: {
    name: 'Biology',
    icon: '🧬',
    description: 'Life, cells, evolution, and ecosystems'
}
```

**Categories (6):**

#### 1. Cell Biology (id: `cell-biology`)
- **Icon:** 🦠
- **Description:** Cell structure, organelles, membranes
- **Basic Terms:** cell, nucleus, membrane, cytoplasm, mitochondria, ribosome, DNA, RNA, protein, enzyme
- **Intermediate:** endoplasmic reticulum, golgi apparatus, lysosome, vacuole, chloroplast, cell wall, ATP, chromosome
- **Advanced:** telomere, centrosome, nucleolus, cristae, thylakoid
- **Symbols:**
  - DNA (deoxyribonucleic acid)
  - RNA (ribonucleic acid)
  - ATP (adenosine triphosphate)

#### 2. Genetics (id: `genetics`)
- **Icon:** 🧬
- **Description:** Heredity, genes, and DNA
- **Basic Terms:** gene, allele, trait, inherit, dominant, recessive, chromosome, mutation, DNA, RNA
- **Intermediate:** genotype, phenotype, heterozygous, homozygous, punnett square, crossing over, meiosis, mitosis
- **Advanced:** epistasis, pleiotropy, linkage, recombination, transcription, translation
- **Symbols:**
  - AA, Aa, aa (genotype notation)
  - mRNA, tRNA, rRNA

#### 3. Evolution (id: `evolution`)
- **Icon:** 🦕
- **Description:** Natural selection and adaptation
- **Basic Terms:** evolution, species, fossil, adapt, natural selection, survival, extinction, ancestor, descent
- **Intermediate:** speciation, adaptation, fitness, gene pool, genetic drift, mutation, homology, vestigial
- **Advanced:** allopatric, sympatric, convergent evolution, divergent, coevolution, phylogeny
- **Symbols/Acronyms:**
  - LUCA (Last Universal Common Ancestor)

#### 4. Ecology (id: `ecology`)
- **Icon:** 🌿
- **Description:** Ecosystems and environments
- **Basic Terms:** ecosystem, habitat, niche, food chain, predator, prey, producer, consumer, biome
- **Intermediate:** food web, trophic level, biomass, symbiosis, mutualism, parasitism, commensalism, biodiversity
- **Advanced:** keystone species, pioneer species, succession, eutrophication, biogeochemical cycle, carrying capacity
- **Symbols:**
  - N (nitrogen cycle)
  - C (carbon cycle)
  - 10% rule (energy transfer)

#### 5. Anatomy & Physiology (id: `anatomy`)
- **Icon:** 🫀
- **Description:** Body systems and functions
- **Basic Terms:** organ, tissue, muscle, bone, heart, lung, brain, blood, nerve, skin
- **Intermediate:** circulatory, respiratory, digestive, nervous, skeletal, muscular, cardiovascular, homeostasis
- **Advanced:** endocrine, lymphatic, integumentary, neurotransmitter, hormone, synapse, nephron
- **Symbols:**
  - RBC (red blood cell)
  - WBC (white blood cell)
  - CNS (central nervous system)
  - PNS (peripheral nervous system)

#### 6. Microbiology (id: `microbiology`)
- **Icon:** 🦠
- **Description:** Bacteria, viruses, and microbes
- **Basic Terms:** bacteria, virus, microbe, germ, pathogen, infection, antibody, vaccine, fungus, yeast
- **Intermediate:** prokaryote, eukaryote, archaea, phage, plasmid, spore, culture, colony, antibiotic
- **Advanced:** gram-positive, gram-negative, capsid, lysogenic, lytic, prion, endospore, conjugation
- **Symbols:**
  - E. coli (common bacteria)
  - COVID-19, HIV (viruses)

**Ambiguous Symbols (cross-category):**
- **C:** Carbon (cell biology) vs. Carbon cycle (ecology)
- **N:** Nitrogen (cell biology) vs. Nitrogen cycle (ecology)
- **DNA:** Found in genetics AND cell biology
- **mutation:** Genetics mechanism AND evolution driver

**Abbreviations Strategy:**
- Full words for most biological terms (no heavy abbreviation)
- Symbols for DNA, RNA, ATP displayed as-is
- Scientific names abbreviated (E. coli → E.coli)

---

### 2. Mathematics Domain 📐

**Domain Metadata:**
```javascript
mathematics: {
    name: 'Mathematics',
    icon: '📐',
    description: 'Numbers, equations, shapes, and logic'
}
```

**Categories (6):**

#### 1. Algebra (id: `algebra`)
- **Icon:** 🔢
- **Description:** Variables, equations, and expressions
- **Basic Terms:** variable, equation, solve, add, subtract, multiply, divide, exponent, factor, term
- **Intermediate:** polynomial, quadratic, binomial, coefficient, linear, slope, intercept, inequality, absolute value
- **Advanced:** discriminant, conjugate, logarithm, exponential, asymptote, rational expression
- **Symbols:**
  - x, y, z (variables)
  - = (equals)
  - ± (plus-minus)
  - √ (square root)
  - ∞ (infinity)
  - log, ln

#### 2. Geometry (id: `geometry`)
- **Icon:** 📐
- **Description:** Shapes, angles, and space
- **Basic Terms:** shape, angle, line, point, circle, triangle, square, rectangle, area, perimeter
- **Intermediate:** polygon, parallelogram, trapezoid, rhombus, diameter, radius, circumference, volume, surface area
- **Advanced:** congruent, similar, tangent, secant, chord, arc, pythagorean, theorem, proof
- **Symbols:**
  - π (pi)
  - ∠ (angle)
  - ⊥ (perpendicular)
  - ∥ (parallel)
  - ° (degree)
  - Δ (triangle/delta)
  - ≅ (congruent)
  - ∼ (similar)

#### 3. Calculus (id: `calculus`)
- **Icon:** ∫
- **Description:** Limits, derivatives, and integrals
- **Basic Terms:** limit, rate, change, slope, derivative, integral, function, graph, continuous
- **Intermediate:** differentiation, integration, chain rule, product rule, quotient rule, antiderivative
- **Advanced:** fundamental theorem, implicit differentiation, partial derivative, Taylor series, convergence
- **Symbols:**
  - d/dx (derivative)
  - ∫ (integral)
  - ∂ (partial derivative)
  - Δ (delta/change)
  - lim (limit)
  - Σ (summation)

#### 4. Statistics & Probability (id: `statistics`)
- **Icon:** 📊
- **Description:** Data analysis and chance
- **Basic Terms:** mean, median, mode, range, average, data, graph, chart, chance, outcome
- **Intermediate:** probability, variance, deviation, distribution, correlation, sample, population, outlier
- **Advanced:** normal distribution, z-score, p-value, regression, hypothesis, confidence interval, chi-square
- **Symbols:**
  - μ (mu - population mean)
  - σ (sigma - standard deviation)
  - σ² (variance)
  - P(A) (probability)
  - n (sample size)
  - r (correlation coefficient)

#### 5. Trigonometry (id: `trigonometry`)
- **Icon:** 📐
- **Description:** Triangles and circular functions
- **Basic Terms:** sine, cosine, tangent, angle, degree, radian, hypotenuse, opposite, adjacent, right triangle
- **Intermediate:** secant, cosecant, cotangent, unit circle, period, amplitude, frequency, phase shift
- **Advanced:** inverse trig, arctangent, law of sines, law of cosines, polar coordinates, spherical
- **Symbols:**
  - sin, cos, tan
  - sec, csc, cot
  - sin⁻¹, cos⁻¹, tan⁻¹
  - θ (theta - angle)
  - π (pi)

#### 6. Logic & Set Theory (id: `logic`)
- **Icon:** 💭
- **Description:** Sets, proofs, and reasoning
- **Basic Terms:** set, element, union, intersection, subset, logic, true, false, and, or, not
- **Intermediate:** complement, universal set, empty set, cardinality, venn diagram, implication, converse
- **Advanced:** De Morgan's laws, bijection, injection, surjection, proof by contradiction, induction
- **Symbols:**
  - ∈ (element of)
  - ∉ (not element of)
  - ∪ (union)
  - ∩ (intersection)
  - ⊂ (subset)
  - ⊆ (subset or equal)
  - ∅ (empty set)
  - ∀ (for all)
  - ∃ (there exists)
  - ¬ (not)
  - ∧ (and)
  - ∨ (or)
  - ⇒ (implies)
  - ⇔ (if and only if)

**Ambiguous Symbols (cross-category):**
- **π:** Geometry (pi for circles) AND Trigonometry (radians)
- **Δ:** Geometry (triangle) AND Calculus (change/delta)
- **sin, cos, tan:** Trigonometry fundamentals, used in Calculus
- **Σ:** Statistics (summation) AND Calculus (summation in series)
- **x, y:** Algebra variables AND Geometry coordinates AND Calculus functions

**Abbreviations Strategy:**
- Most symbols displayed as Unicode (π, θ, Σ, ∫, etc.)
- Function names abbreviated: sine → sin, cosine → cos
- Greek letters as symbols (not spelled out)
- Common terms: triangle → tri, perpendicular → ⊥

---

## Implementation Phases

### Phase 4: Biology Domain
**Estimated Scope:** ~90-100 terms across 6 categories

**Tasks:**
1. Add Biology to `Domains` constant
2. Create `DomainData.biology` object
3. Define 6 categories with icons/descriptions
4. Add ~15-18 words per category (mix of basic/intermediate/advanced)
5. Create `abbreviations` mapping for Biology terms
6. Identify `ambiguousSymbols` (DNA, C, N, mutation)
7. Test domain switching to Biology
8. Verify category rendering and card display

### Phase 5: Mathematics Domain
**Estimated Scope:** ~95-105 terms across 6 categories

**Tasks:**
1. Add Mathematics to `Domains` constant
2. Create `DomainData.mathematics` object
3. Define 6 categories with icons/descriptions
4. Add ~16-18 words per category (heavy on symbols)
5. Create `abbreviations` mapping (many Unicode symbols)
6. Identify `ambiguousSymbols` (π, Δ, Σ, x, y, sin/cos/tan)
7. Ensure Unicode symbol rendering works correctly
8. Test domain switching to Mathematics
9. Verify math symbol font rendering (crucial for readability)

---

## Technical Considerations

### Font Stack for Math Symbols
Current font stack handles Greek letters and physics symbols well. Mathematics will need:
- **Enhanced Support:** ∫, ∂, ∑, ∏, √, ∞, ≠, ≤, ≥, ∈, ⊂, ∅, ∀, ∃, ⇒, ⇔
- **Recommendation:** Add 'Cambria Math', 'STIX Two Math' to font stack (already present)
- **Test Priority:** Calculus and Logic symbols (most complex)

### Biology Term Length
Biology has longer terms than other domains:
- endoplasmic reticulum (21 chars)
- deoxyribonucleic acid (21 chars)
- biogeochemical cycle (20 chars)

**Solutions:**
- Rely heavily on abbreviations (ER, DNA, etc.)
- Ensure card layout handles 2-line abbreviations
- Use scientific abbreviations where standard (E. coli, ATP, DNA)

### Mathematics Abbreviations
Mathematics abbreviations are mostly symbols, not shortened words:
- equation → equation (full word, 8 chars - acceptable)
- derivative → d/dx (symbol)
- integral → ∫ (symbol)
- perpendicular → ⊥ (symbol)

**Strategy:**
- Use Unicode symbols as primary display
- Full words as fallback in tooltips/definitions
- No artificial abbreviations for math concepts

---

## Vocabulary Targets

### Per Domain Summary

| Domain | Categories | Est. Words | Symbols/Acronyms | Ambiguous |
|--------|-----------|------------|------------------|-----------|
| Physics | 6 | 85 | 25+ | 4 |
| Chemistry | 6 | 75 | 12+ | 0 |
| Computer Science | 6 | 84 | 8+ | 0 |
| **Biology** | 6 | **90-100** | **15+** | **4** |
| **Mathematics** | 6 | **95-105** | **40+** | **5** |

**Total Vocabulary (5 domains):** ~430-450 unique terms

---

## Quality Standards

### Difficulty Distribution (per category)
- **Basic:** 40-50% (easy, common terms - Levels 1-3)
- **Intermediate:** 35-45% (moderate complexity - Levels 4-6)
- **Advanced:** 10-20% (specialized, technical - Levels 7+)

### Points Assignment
- Basic: 3-6 points (word length ≤ 6 chars)
- Intermediate: 6-10 points (7-12 chars or moderate complexity)
- Advanced: 10+ points (13+ chars or high complexity)
- Symbols: 3-5 points (compact notation)

### Category Coverage
Each category should support:
- **Level 1-3:** 4-6 words (basic only)
- **Level 4-6:** 8-12 words (basic + intermediate)
- **Level 7+:** 12-18 words (all difficulties)

---

## User Experience Goals

### Domain Consistency
All 5 domains should feel:
- **Equally challenging** at equivalent levels
- **Thematically cohesive** within their field
- **Visually distinct** (unique icons, consistent color coding if added later)

### Educational Value
Vocabulary should:
- Reinforce real academic terminology
- Progress from foundational to advanced concepts
- Avoid obscure jargon (unless advanced level)
- Use standard scientific notation

### Accessibility
- Biology: Avoid overly technical medical terms at basic level
- Mathematics: Ensure Unicode symbols render on budget devices
- Both: Provide clear tooltips/definitions for symbols

---

## Next Steps

1. **Review Plan:** Validate category choices and term distribution
2. **Implement Biology:** Add to vocabulary-dictionary.js
3. **Test Biology:** Verify rendering, category logic, abbreviations
4. **Implement Mathematics:** Add to vocabulary-dictionary.js
5. **Test Mathematics:** Verify Unicode symbols, special font rendering
6. **Update Analytics:** Track domain usage in GameAnalytics
7. **Documentation:** Update README.md with new domains
8. **Merge to Main:** When all 5 domains tested and stable
