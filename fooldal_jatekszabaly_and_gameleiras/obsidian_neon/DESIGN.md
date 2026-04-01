# Design System Strategy: High-Tech Fantasy & The Obsidian Layer

## 1. Overview & Creative North Star: "The Obsidian Astral"
The Creative North Star for this design system is **"The Obsidian Astral."** This concept rejects the flat, static nature of traditional game HUDs in favor of a living, breathing interface that feels like a holographic projection cast onto dark glass. 

To move beyond the "standard dark mode" template, this system utilizes **Intentional Depth Layering**. We break the rigid grid through "asymmetric equilibrium"—where large, bold display typography balances against delicate, high-tech micro-details. Elements should feel like they are floating in a void, using overlapping glass panels and neon light-bleeds to create a sense of infinite spatial depth.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in the transition from absolute zero to high-frequency light.

### The Palette
*   **Neutral Core:** `surface` (#0e0e0f) and `surface_container_lowest` (#000000) form our obsidian base.
*   **Vibrant Accents:** `primary` (#8ff5ff - Cyan) and `secondary` (#ac89ff - Purple) are our high-energy sources.
*   **The "No-Line" Rule:** Explicitly prohibit 1px solid borders for sectioning. Structural boundaries are defined by shifting between `surface_container_low` (#131314) and `surface_container_high` (#201f21). A section’s end is marked by a change in tonal depth, not a stroke.
*   **Surface Hierarchy & Nesting:** Treat the UI as a physical stack.
    *   **Base Layer:** `surface` (The void).
    *   **Main Content:** `surface_container` (The stage).
    *   **Interactive Modals:** `surface_container_highest` with a backdrop blur of 12px-20px to create the Glassmorphism effect.
*   **The "Glass & Gradient" Rule:** Use linear gradients from `primary` to `on_primary_container` for progress bars and active states. This adds "soul" and mimics the way light fades in a sci-fi environment.

---

## 3. Typography: The Futuristic Editorial
We pair the technical precision of **Space Grotesk** with the human-centric readability of **Manrope**.

*   **Display & Headline (Space Grotesk):** These are your "Brand Moments." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for level-ups or mission titles. The geometric nature of Space Grotesk provides that "high-tech" edge.
*   **Body & Titles (Manrope):** For item descriptions and lore, `body-md` (0.875rem) provides superior legibility against dark backgrounds.
*   **Labels (Space Grotesk):** `label-sm` (0.6875rem) should always be uppercase with increased tracking (+0.1em) to mimic the readout of a tactical computer.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are replaced by **Ambient Luminance**.

*   **The Layering Principle:** To lift a card, move from `surface_container_low` to `surface_container_highest`. The elevation is perceived through brightness, not drop shadows.
*   **Ambient Shadows:** For floating action buttons (FABs), use a shadow tinted with `primary` at 8% opacity with a 32px blur. This creates a "glow" rather than a shadow, suggesting the button is a light source.
*   **The "Ghost Border" Fallback:** For rare item slots, use `outline_variant` at 20% opacity. If the item is "Legendary," use a 1px inner glow using `tertiary` (#ff59e3).
*   **Glassmorphism:** Apply to all non-modal panels. Use `surface_variant` at 40% opacity with a `backdrop-filter: blur(10px)`. This integrates the UI into the game world imagery behind it.

---

## 5. Components

### Buttons & Interaction
*   **Primary Action:** Solid `primary` background with `on_primary` text. Use `roundedness.md` (0.375rem). On hover, add a `primary_container` outer glow.
*   **Secondary Action:** `outline` ghost button with a `surface_variant` hover state. No solid fill.
*   **Floating Action Button (FAB):** Circular (`roundedness.full`), using `secondary` (#ac89ff) to pop against the charcoal backgrounds.

### Data & Progress
*   **Sleek Progress Bars:** 4px height. Background: `surface_container_highest`. Fill: Gradient from `primary` to `primary_dim`.
*   **Chips:** Use `surface_bright` with `label-md` typography. For "Rare" tags, use a `tertiary` ghost border.

### Input & Cards
*   **Input Fields:** Bottom-border only (0.5px `outline_variant`). When focused, the border transforms into a `primary` glow.
*   **Cards:** Forbid divider lines. Separate "Header," "Body," and "Footer" of a card using `spacing.4` (0.9rem) and subtle shifts from `surface_container_low` to `surface_container`.
*   **Isometric Icon Containers:** Icons should never sit on a flat surface. Place icons on a `surface_container_high` tilted hex-grid or a subtle glass plinth.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place high-level stats (XP, Currency) in unbalanced corners to create a custom, high-end feel.
*   **Embrace Breathing Room:** Use `spacing.16` (3.5rem) between major modules. The "void" is a design element.
*   **Animate Transitions:** Use "Spring" easing for panels sliding in—simulate the physical weight of glass.

### Don’t:
*   **No Pure Grey:** Never use #888888. Use `on_surface_variant` (#adaaab) to maintain the cool, obsidian temperature.
*   **No Thick Borders:** Thick borders break the "holographic" immersion. Use light and blur to define edges instead.
*   **No Clutter:** If a piece of information isn't vital to the current "state," hide it behind a hover or a micro-interaction. High-tech fantasy is about precision, not noise.