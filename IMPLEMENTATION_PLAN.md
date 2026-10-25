# UrumSima Redesign3D --- End-to-End Implementation Plan

> **Project goal:** Deliver a polished, cinematic, interactive,
> responsive 3D experience for UrumSima, with real visual verification
> after every meaningful visual change. This is an execution checklist,
> not merely a proposal.
>
> **Primary priority:** Visual quality, cinematic motion, spatial
> interaction, usability, accessibility, responsive behavior, and
> stability. Preserve essential SEO and existing routes, but do not let
> SEO work distract from the visual redesign.
>
> **Important:** A checkbox may be marked `[x]` only after the
> requirement has been implemented **and verified with evidence**. Code
> being written, a successful build, or an agent's assumption is not
> visual verification.

------------------------------------------------------------------------

## 0. Project identity, constraints, and definition of done

### Known paths and references

-   Active project: `D:\Projects\UrumSima\Redesign3D`
-   Protected reference project (strictly read-only):
    `D:\Projects\UrumSima\SEO\urumsima.ir\UrumsimaWeb`
-   Production reference website: `https://urumsima.ir/`
-   Visual inspiration: `https://lusion.co/` --- use for broad
    inspiration only; do not copy its design, assets, text, or
    distinctive compositions.
-   Typical local development URL: `http://localhost:3000/`
-   Existing stack reported by the previous audit: Next.js 15.5.28 App
    Router, React 19.3.1, Three.js 0.174.0, @react-three/fiber 9.8.2,
    @react-three/drei 10.7.9, maath 0.10.8, Framer Motion 12.43.0,
    Tailwind CSS 3.4.19, TypeScript 5.9.3, Node 22.17.1. **Verify the
    actual package files before relying on these versions.**

### Non-negotiable rules

-   [x] Confirm the active working directory before editing. Never edit
    the protected reference project.
-   [x] Inspect the current project and existing backup before making
    changes.
-   [x] Create a fresh timestamped backup outside the project before
    this execution begins. Do not overwrite previous backups.
-   [x] Keep the existing app's framework, routing conventions,
    content/data sources, and established design decisions unless a
    change is necessary and justified.
-   [x] Do not replace real site content with fabricated company claims,
    fake testimonials, fake statistics, invented team members, or
    placeholder portfolio items.
-   [x] Reuse existing real assets where appropriate. If no suitable
    team photo or project image exists, do not invent one or imply an AI
    image is a real photograph of the company.
-   [x] Preserve meaningful existing URLs and internal links, including
    service pages, portfolio archive, portfolio detail pages, About,
    Contact, and blog routes that actually exist.
-   [x] Do not perform broad unrelated refactors. Prefer small,
    coherent, reversible changes.
-   [x] Never claim that a browser test, visual inspection, route check,
    accessibility check, or interaction test passed unless it was
    actually run and observed.
-   [x] If browser automation is unavailable or unreliable, use the
    strongest available alternative, report exactly what was and was not
    verified, and do not mark visual acceptance criteria complete
    without actual visual evidence.
-   [x] Do not mark a checkbox complete just because a component
    compiles.
-   [x] Do not stop after writing a plan or after the first
    implementation pass. Continue through implementation, verification,
    correction, and final regression checks.
-   [x] If a test fails, investigate and fix the cause where reasonably
    possible; rerun the relevant test before marking the item complete.
-   [x] If blocked by a genuine external dependency or missing
    credential, document the blocker, finish all independent work, and
    leave only the genuinely blocked item unchecked.
-   [x] Avoid unnecessary SEO scope. Keep canonical URLs, metadata,
    sitemap, robots rules, structured data already in use, and
    accessible semantic content valid, but the main objective is the 3D
    experience.

### Product and visual direction

Build a premium, cinematic digital architecture experience. The homepage
should initially feel like a polished corporate website, then reveal
that it is a spatial 3D experience through deliberate scroll-driven
motion. It must not look like a generic template with a rotating
primitive, a 3D background hidden behind opaque cards, or a collection
of unrelated floating objects.

The visual language should communicate architectural precision, digital
craft, depth, premium materials, controlled light, strong typography,
and intentional composition. Use restrained color, contrast, atmosphere,
and motion. Every animation must have a purpose.

### Definition of done

The project is not done until: - The first viewport has a compelling
composition and clear Persian RTL hierarchy. - A cinematic
billboard/header descent and landing sequence is implemented and
visually inspected. - The landing sequence resolves into an
architectural gateway and reveals the campus/scene. - Scroll-driven
stations have a clear visual identity and transitions in both
directions. - 3D objects have intentional geometry, material quality,
scale, lighting, and interaction. - HTML content and 3D content work
together without obscuring the important 3D composition. - Navigation,
project links, service links, CTAs, contact actions, and filters work. -
Mobile and short-landscape layouts have been checked visually; mobile
retains a meaningful 3D identity rather than hiding the scene. -
Reduced-motion, WebGL failure, context-loss, keyboard, and accessible
HTML alternatives are addressed. - Build/type/lint and available
automated tests pass. - A final route and responsive regression pass has
been performed. - Final report distinguishes verified facts from
limitations.

------------------------------------------------------------------------

## 1. Execution protocol: implement → inspect → correct → approve

This protocol applies to **every meaningful visual change**, not only at
the end.

### Required loop for each visual task

-   [x] **Inspect current state.** Read the relevant component/CSS/data
    and open the current page at the relevant viewport before changing
    it.
-   [x] **Record baseline.** If the browser supports screenshots,
    capture a baseline screenshot of the relevant viewport/state. Note
    viewport dimensions and the scroll/interaction state.
-   [x] **Make one coherent visual change.** Avoid combining many
    unrelated visual changes in one unreviewable patch.
-   [x] **Run immediate technical checks.** At minimum, check the
    terminal/dev-server output and run the most relevant
    lint/type/build/test command when practical.
-   [x] **Open the page in a real browser.** Navigate to the actual
    local URL and reproduce the relevant state. Do not treat source-code
    reading as visual inspection.
-   [x] **Inspect the result visually.** Check hierarchy, scale,
    spacing, composition, clipping, overlap, contrast, typography, RTL
    behavior, object quality, lighting, animation timing, and whether
    the result matches the intended design.
-   [x] **Test the actual interaction.** Scroll, reverse-scroll, click,
    hover where relevant, keyboard-tab, resize, or tap the interaction
    that the change is supposed to improve.
-   [x] **Correct defects.** If the result is visibly wrong, broken,
    ambiguous, or lower quality than the baseline, revise it and repeat
    the browser inspection.
-   [x] **Compare against baseline/reference.** Confirm the change
    improves the target outcome without regressing neighboring sections.
-   [x] **Write a short evidence note.** Record what was inspected,
    viewport dimensions, relevant state, observed result, and any known
    limitation in the progress log.
-   [x] **Only then mark the corresponding checklist item `[x]`.**

### Visual approval gate

For each visual task, approval requires all applicable checks: - \[ \]
Desktop screenshot inspected at a practical desktop size (e.g. 1440 ×
900). - \[ \] Mobile screenshot inspected at a practical mobile size
(e.g. 390 × 844). - \[ \] Relevant animation/scroll state observed in
motion, not only in a still screenshot. - \[ \] No important object or
text is accidentally clipped, covered, or placed outside the viewport. -
\[ \] No accidental horizontal overflow. - \[ \] The visual hierarchy
and interaction affordance are clear. - \[ \] No new console errors,
WebGL errors, missing assets, hydration errors, or severe runtime
warnings were observed. - \[ \] If any check could not be performed, it
is explicitly marked **NOT VERIFIED** and the task must not be described
as fully visually approved.

### Evidence log template

Add an entry to `docs/IMPLEMENTATION_PROGRESS.md` for each major visual
task:

``` md
### [Task ID] — [Task title]
- Status: Implemented / Visually verified / Blocked
- Files changed:
- Browser URL:
- Viewport(s):
- State tested:
- Visual observations:
- Interaction tested:
- Console/runtime observations:
- Screenshot/evidence path (if available):
- Known issues:
- Approval: PASS / FAIL / NOT VERIFIED
```

Store screenshots in a project-local `docs/visual-evidence/` folder if
the available browser tooling can save them. Do not commit huge video
recordings or unrelated browser profiles. If screenshots cannot be
saved, record that fact and describe the actual inspection performed.

------------------------------------------------------------------------

## 2. Phase 0 --- Preflight, audit, backup, and baseline

### 0.1 Inspect repository and runtime

-   [x] Confirm current working directory is
    `D:\Projects\UrumSima\Redesign3D`.
-   [x] Confirm the protected reference project is not the active
    working directory.
-   [x] Inspect `package.json`, lockfile, `next.config.*`,
    `tsconfig.json`, Tailwind config, app router structure, and current
    scripts.
-   [x] Inspect existing project status/version-control state. The
    project was previously reported as not being a Git repository;
    verify whether that is still true. Do not assume Git exists.
-   [x] Identify the actual commands for development, build, lint, type
    checking, and tests from the current package scripts.
-   [x] Check whether the local server is already running. Reuse it if
    appropriate; avoid needlessly starting duplicate servers or killing
    unrelated processes.
-   [x] Inspect current console output and identify pre-existing errors
    separately from newly introduced ones.
-   [x] Inspect the current app at desktop and mobile sizes before
    changes.
-   [x] Record the current route list from the actual app structure
    rather than assuming all routes exist.
-   [x] Inventory current image, font, model, texture, video, and icon
    assets. Record asset dimensions and file sizes where relevant.
-   [x] Identify which data is real content and which content is
    currently hardcoded or placeholder content.
-   [x] Review the existing Phase 1 work and preserve useful
    implementations unless testing proves they are defective.

### 0.2 Fresh backup

-   [x] Create a timestamped backup outside
    `D:\Projects\UrumSima\Redesign3D`.
-   [x] Exclude generated or reproducible heavy folders such as
    `node_modules`, `.next`, and other caches where safe.
-   [x] Verify that the backup contains source files, configuration,
    public assets, and important documentation.
-   [x] Record the exact backup path in
    `docs/IMPLEMENTATION_PROGRESS.md`.
-   [x] Do not modify `D:\Projects\UrumSima\SEO\urumsima.ir\UrumsimaWeb`
    under any circumstances.

### 0.3 Baseline evidence

-   [x] Capture/inspect the current homepage at desktop.
-   [x] Capture/inspect the current homepage at mobile.
-   [x] Inspect the current homepage at all five scroll stations:
    hero/gateway, services, portfolio, process, and contact, if those
    stations exist in the current build.
-   [x] Inspect the current About page and representative service,
    portfolio detail, portfolio archive, contact, and blog routes that
    exist.
-   [x] Note content-overlap issues, low-quality objects, missing
    cinematic motion, responsive defects, slow loading, console errors,
    and broken interactions.
-   [x] Save the initial findings in `docs/IMPLEMENTATION_PROGRESS.md`.

**Gate 0:** Do not begin substantial redesign until the backup is
verified and the current state is understood.

------------------------------------------------------------------------

## 3. Phase 1 --- Design system and experience architecture

### 1.1 Design decisions

-   [x] Define a consistent visual system for color, typography,
    spacing, borders, surface treatment, lighting, depth, and motion.
-   [x] Use existing brand assets and colors when they are appropriate;
    do not arbitrarily rebrand UrumSima.
-   [x] Establish a clear Persian RTL typographic hierarchy: headline,
    supporting copy, section labels, navigation, buttons, metadata, and
    body text.
-   [x] Use the project's available fonts if suitable; verify font
    loading and weights. Avoid introducing a large font payload without
    a clear benefit.
-   [x] Define motion principles: anticipation, acceleration, impact,
    settling, camera easing, and scroll reversal.
-   [x] Define object/material principles for the architecture,
    billboard, service objects, and portfolio objects.
-   [x] Define responsive rules for desktop, tablet, mobile portrait,
    and short mobile landscape.
-   [x] Define fallback states for reduced motion, unavailable WebGL,
    WebGL context loss, and slow devices.
-   [x] Document decisions in `docs/DESIGN_SYSTEM.md` or an existing
    equivalent instead of creating redundant documents.

### 1.2 Architecture boundaries

-   [x] Keep the 3D scene, DOM interface, content/data, and navigation
    responsibilities clear.
-   [x] Avoid moving high-frequency animation values through React state
    when refs/frame-loop updates are more appropriate.
-   [x] Avoid duplicate global scroll listeners and duplicated animation
    timelines.
-   [x] Ensure all listeners, observers, animation loops, and Three.js
    resources are cleaned up appropriately.
-   [x] Use reusable scene/object components where reuse improves
    consistency, without over-generalizing unique art direction.
-   [x] Keep semantic HTML controls available for essential navigation
    and actions.
-   [x] Preserve existing routes and existing content models unless an
    intentional migration is justified.
-   [x] Do not introduce a new state-management, animation, physics, or
    rendering dependency unless the current stack cannot reasonably
    support the requirement.

**Visual gate 1:** If a design-system sample or new global styles are
created, inspect them on actual pages at desktop and mobile before
approving them.

------------------------------------------------------------------------

## 4. Phase 2 --- Cinematic opening hero and billboard sequence

This is a defining feature of the experience and must not be reduced to
a static banner or a simple rectangle moving down the screen.

### 2.1 First viewport composition

-   [x] Create a premium, relatively familiar corporate first viewport
    before the visitor realizes the site is a 3D experience.
-   [x] Use a real existing team/company image only if a suitable asset
    is present and verified. Do not fabricate a company team photograph.
-   [x] Provide a strong Persian headline, concise supporting statement,
    and clear primary/secondary CTAs based on real site content.
-   [x] Balance text and image/scene so the headline remains readable
    without burying the 3D environment under opaque cards.
-   [x] Establish a clear focal point, depth layers, negative space, and
    intentional framing.
-   [x] Make the first viewport look complete and intentional even
    before scrolling.
-   [x] Ensure the navbar and controls remain readable against the
    scene.
-   [x] Check the first viewport on desktop, mobile portrait, and short
    landscape.

### 2.2 Billboard geometry and design

-   [x] Create or substantially improve the billboard/header frame as a
    believable architectural object with thickness, edges, supports or a
    convincing mounting structure, and controlled material response.
-   [x] Ensure geometry, proportions, pivot point, scale, and camera
    framing support a believable fall/rotation.
-   [x] Avoid a flat DOM rectangle masquerading as the 3D billboard.
-   [x] Use deliberate material choices (e.g. metal, glass, coated
    surface) appropriate to the established design system; avoid
    excessive gloss or random emissive colors.
-   [x] Ensure lighting reveals form and edge definition without washing
    out text.
-   [x] Keep billboard text/content crisp and correctly oriented. If DOM
    text is used as a texture or overlay, test readability and rendering
    stability.
-   [x] Verify no z-fighting, clipping, accidental back-face visibility,
    or visibly incorrect pivot behavior.

### 2.3 Scroll-driven cinematic descent

-   [x] The first meaningful scroll begins an intentional, cinematic
    billboard descent/rotation sequence.
-   [x] Add anticipation before the main movement, without making the
    site feel sluggish.
-   [x] Use believable gravity/acceleration and a controlled
    landing/impact moment.
-   [x] Add a restrained impact response (small recoil, settling, light
    shift, subtle dust/particles only if they improve the scene and are
    performant).
-   [x] The billboard settles into or becomes part of an architectural
    gateway.
-   [x] The camera then moves through/reveals the gateway to expose the
    campus/architecture.
-   [x] Motion is driven by a deterministic scroll timeline or a
    well-defined progress mapping, not a fragile sequence that only
    plays once.
-   [x] Scrolling upward reverses the experience coherently; the
    billboard must not teleport, get stuck, or replay unpredictably.
-   [x] Handle scroll jumps, browser refresh at a mid-page position,
    resize, and reduced-motion preferences.
-   [x] Do not hijack the browser's scroll in a way that makes the page
    feel trapped.
-   [x] Ensure the motion does not block normal page navigation or make
    text/actions unreachable.
-   [x] Avoid expensive physics simulation if a carefully designed
    deterministic animation achieves the same result more reliably.

### 2.4 Camera and reveal

-   [x] Define a clear camera path with intentional easing and
    orientation.
-   [x] Avoid abrupt camera snaps, unnecessary camera shake,
    disorienting spins, and motion that causes nausea.
-   [x] Use the gateway as a transition point rather than merely moving
    the camera through arbitrary coordinates.
-   [x] Reveal architecture in layers so depth is legible.
-   [x] Ensure each section/station has a distinct composition and focal
    point.
-   [x] Check that scroll progress remains synchronized with the visible
    DOM section and 3D scene.

### 2.5 Mandatory visual approval

-   [x] Inspect a screenshot of the opening hero at desktop.
-   [x] Inspect a screenshot of the opening hero at mobile.
-   [x] Observe the entire billboard descent/rotation/landing sequence
    in motion.
-   [x] Observe the camera reveal and the first station transition.
-   [x] Reverse-scroll through the full sequence.
-   [x] Refresh at a mid-scroll position and verify the scene is
    coherent.
-   [x] Check the console and WebGL output during the sequence.
-   [x] Correct all visible defects and repeat the checks before marking
    this phase complete.
-   [x] Record evidence in `docs/IMPLEMENTATION_PROGRESS.md`.

**Gate 2:** The billboard sequence is not complete unless it has been
observed in an actual browser, in motion, in both scroll directions.

------------------------------------------------------------------------

## 5. Phase 3 --- High-quality architectural campus and scene art direction

### 3.1 Architectural environment

-   [x] Improve the central campus/architectural composition so it reads
    as a designed environment rather than a set of unrelated primitives.
-   [x] Establish a clear spatial hierarchy: foreground, midground,
    background, focal architecture, and navigable objects.
-   [x] Use consistent proportions, bevels/edge treatment, surface
    details, and architectural rhythm.
-   [x] Avoid default cubes/spheres where a purpose-built form would
    materially improve quality.
-   [x] Add meaningful secondary detail only where it supports scale and
    composition.
-   [x] Use restrained environmental atmosphere; do not obscure
    important geometry with fog, bloom, particles, or darkness.
-   [x] Ensure the scene is visually legible on lower-resolution mobile
    screens.
-   [x] Use instancing or merged geometry where it improves performance
    for repeated objects.
-   [x] Avoid needless polygon density and texture sizes.
-   [x] Verify shadows, ambient lighting, highlights, and material
    roughness at different camera angles.
-   [x] Check object scale against the camera and adjacent objects.
-   [x] Check for z-fighting, floating objects, penetrations, gaps, and
    accidental overlaps.
-   [x] Avoid an overly generic "sci-fi dashboard" look unless supported
    by the actual brand direction.

### 3.2 Lighting and materials

-   [x] Establish a clear key/fill/rim or equivalent lighting hierarchy.
-   [x] Make material roughness, metalness, transparency, and emissive
    values intentional.
-   [x] Use emissive elements sparingly to guide attention.
-   [x] Ensure white/bright surfaces do not clip and dark surfaces
    retain detail.
-   [x] Check appearance in both light and dark browser environments if
    relevant.
-   [x] Avoid adding costly post-processing effects unless their benefit
    is visible and measurable.
-   [x] Prefer simple, stable lighting where a complex effect provides
    little visual gain.
-   [x] Check performance after any shadow, transparency, reflection, or
    post-processing changes.

### 3.3 Object motion and scene polish

-   [x] Give each moving object a coherent motion language and
    appropriate easing.
-   [x] Remove arbitrary floating/bobbing motion that makes the
    environment feel like a generic template.
-   [x] Avoid animation loops that compete with the main cinematic
    motion.
-   [x] Ensure object motion does not interfere with click targets or
    text readability.
-   [x] Test camera/object relationships across the full scroll range.
-   [x] Confirm that no object suddenly appears/disappears due to
    clipping or an incorrect visibility threshold.

### 3.4 Visual approval

-   [x] Inspect the scene from all major camera waypoints.
-   [x] Capture/inspect desktop and mobile states.
-   [x] Review materials and lighting on a real browser render.
-   [x] Scroll slowly and quickly to detect pops, jumps, and unwanted
    visibility changes.
-   [x] Fix visible issues before checking the phase complete.

------------------------------------------------------------------------

## 6. Phase 4 --- Content/3D composition and five scroll stations

The 3D scene should be a primary part of the composition. The DOM should
support it, not cover it with opaque panels.

### 4.1 Global content overlay rules

-   [x] Audit all DOM overlays and background surfaces that cover the
    canvas.
-   [x] Remove or redesign opaque/elevated panels that obscure important
    architecture, unless a specific readability need justifies them.
-   [x] Use typography, spacing, subtle gradients, transparent surfaces,
    or localized backplates instead of broad opaque cards where
    possible.
-   [x] Keep content concise enough to preserve the focal 3D object.
-   [x] Make every station feel deliberately composed, with the object
    and content supporting each other.
-   [x] Ensure text does not cross critical geometry or obscure the
    billboard/gateway.
-   [x] Test contrast and readability at all backgrounds and camera
    positions.
-   [x] Preserve DOM controls above the canvas where required for
    interaction.
-   [x] Verify pointer events: the canvas must not block navigation
    buttons, and DOM overlays must not block intended 3D interactions.
-   [x] Avoid adding large content spacers solely to fake scroll
    progress; use an intentional layout that maps naturally to the scene
    timeline.

### 4.2 Station A --- Hero / gateway

-   [x] The opening hero and billboard reveal are complete and visually
    approved.
-   [x] The transition into the first architectural gateway is coherent.
-   [x] The primary CTA works and leads to the intended real
    route/action.
-   [x] The user can understand what UrumSima does without exploring the
    entire 3D scene.

### 4.3 Station B --- Services

-   [x] Give the services station a distinct composition and spatial
    identity.
-   [x] Represent services with carefully designed 3D objects or
    architectural motifs that match each real service.
-   [x] Avoid generic floating primitives with no relationship to the
    service.
-   [x] Provide short, clear Persian descriptions and functional links
    to the existing service detail routes.
-   [x] Make hover/focus/selected states obvious but restrained.
-   [x] Ensure touch users can access the same services without hover.
-   [x] Provide equivalent semantic HTML links/buttons.
-   [x] Verify each service object and its associated DOM link lead to
    the correct service.

### 4.4 Station C --- Portfolio / projects

-   [x] Give the portfolio station a distinct composition.
-   [x] Use actual existing project data and assets; do not fabricate
    projects.
-   [x] Use meaningful 3D frames, spatial project tiles, or other
    intentional representations rather than random objects.
-   [x] Show a small, curated set of featured projects if real data
    supports it.
-   [x] Provide a clear route to the complete portfolio archive.
-   [x] Ensure project objects/cards link to the correct detail routes.
-   [x] Ensure archive filtering works if filters exist.
-   [x] Check missing images, empty data, long titles, and responsive
    behavior.
-   [x] Ensure the archive remains usable without the 3D canvas.

### 4.5 Station D --- Process / how it works

-   [x] Create a clear visual language for the real project process.
-   [x] Use sequential spatial markers or architectural transitions only
    when they clarify the steps.
-   [x] Do not invent a process that contradicts the company's real
    offering.
-   [x] Ensure the sequence is readable and understandable without
    animation.
-   [x] Test long Persian text and narrow screens.

### 4.6 Station E --- Contact / conversion

-   [x] Make the contact station visually distinct and purposeful.
-   [x] Provide the actual supported contact actions/details already
    present in the project.
-   [x] Ensure phone, email, contact page, form, and messaging links use
    valid real destinations where available.
-   [x] Do not invent phone numbers, email addresses, or social handles.
-   [x] Ensure the contact CTA is reachable by keyboard and touch.
-   [x] Keep the final station from feeling like an abrupt end to the 3D
    experience.
-   [x] Provide a clear way to return to the top or continue to relevant
    pages.

### 4.7 Cross-station transitions

-   [x] Transitions between all stations are visually coherent.
-   [x] Scrolling down and up produces stable transitions.
-   [x] The camera, station text, and active navigation state remain
    synchronized.
-   [x] No station's content appears too early or too late.
-   [x] No content is hidden behind the canvas, clipped by a parent, or
    inaccessible due to z-index/pointer-events mistakes.
-   [x] Check quick scroll, slow scroll, trackpad scroll, and keyboard
    PageDown/PageUp where possible.
-   [x] Check browser refresh at intermediate scroll positions.

**Visual gate 4:** Approve every station separately at desktop and
mobile, then approve the entire scroll journey from beginning to end.

------------------------------------------------------------------------

## 7. Phase 5 --- Interaction quality and accessibility

### 5.1 3D interactions

-   [x] Define clear interactive states for hover, focus, selected,
    pressed, and disabled where applicable.
-   [x] Provide feedback that an object is interactive without requiring
    the user to guess.
-   [x] Make clickable object targets large enough and stable.
-   [x] Avoid click targets that shift position while the user is trying
    to interact.
-   [x] Verify raycasting and pointer interactions in the actual
    browser.
-   [x] Verify event propagation between the canvas and DOM.
-   [x] Ensure clicks on an object do not accidentally trigger adjacent
    objects.
-   [x] Avoid relying exclusively on hover.
-   [x] Ensure mobile users can reach the same information/actions
    through touch or equivalent HTML controls.
-   [x] Test keyboard navigation for all important actions.
-   [x] Add semantic labels and accessible names for icon-only controls.
-   [x] Ensure focus indicators are visible against the design.

### 5.2 Accessibility and motion

-   [x] Respect `prefers-reduced-motion`.
-   [x] For reduced-motion mode, offer a calm, understandable experience
    with the key content and navigation intact.
-   [x] Ensure essential content is present in DOM/HTML and not only
    rendered into a WebGL scene.
-   [x] Check heading order, landmarks, button/link semantics, image
    alternative text, and form labels.
-   [x] Check contrast of text and interactive states.
-   [x] Ensure focus is not lost during animated transitions.
-   [x] Avoid flashing effects, intense camera shake, or unnecessarily
    rapid movement.
-   [x] Make keyboard focus and scroll position predictable.
-   [x] Ensure browser zoom does not make the page unusable.

### 5.3 Interaction verification

-   [x] Test every primary CTA.
-   [x] Test navigation links and mobile menu.
-   [x] Test all service links.
-   [x] Test featured projects and project detail links.
-   [x] Test portfolio filters and archive navigation.
-   [x] Test contact actions and forms that actually exist.
-   [x] Test focus and keyboard activation.
-   [x] Test mobile touch targets.
-   [x] Record actual outcomes in the progress log.

------------------------------------------------------------------------

## 8. Phase 6 --- Internal pages and route-level visual consistency

Do not assume every internal route should use the same 3D scene. Each
page should use the amount of 3D that serves its purpose, while
preserving a cohesive brand language.

### 6.1 Route inventory

-   [x] Derive a route inventory from the actual `src/app` tree and
    existing links.
-   [x] Identify homepage, About, service index, each service detail,
    portfolio archive, portfolio details, contact, blog index, and blog
    details if present.
-   [x] Record current status and purpose of each route.
-   [x] Preserve valid existing URLs and avoid accidental duplicate or
    missing routes.

### 6.2 Page-specific design

-   [x] Homepage: complete cinematic campus experience.
-   [x] About page: inspect the existing TechLeadPlanet/planet
    experience; improve only if needed, ensuring it feels like part of
    the same brand.
-   [x] Service index: clear service discovery, strong visual hierarchy,
    and optional lightweight 3D motifs only where useful.
-   [x] Service detail pages: readable, conversion-oriented layout;
    avoid making users fight a 3D scene to read the service description.
-   [x] Portfolio archive: polished featured projects plus a usable full
    gallery and filters where data supports them.
-   [x] Portfolio detail pages: strong project imagery, concise project
    narrative, clear related-project/navigation paths; do not fabricate
    case-study metrics.
-   [x] Contact page: clear real contact details/actions and a reliable
    form if one exists.
-   [x] Blog index/details: maintain readable article typography and
    existing content structure.
-   [x] Shared navbar/footer: consistent, accessible, responsive, and
    visually integrated.
-   [x] Route transitions: add subtle cohesive transitions where
    technically appropriate, without breaking browser history, direct
    URL loading, or accessibility.
-   [x] Avoid forcing a heavyweight full-screen 3D experience onto
    content-heavy pages when it hurts usability or performance.

### 6.3 Route-level verification

-   [x] Open every route in the route inventory directly in the browser.
-   [x] Check for runtime errors and missing content.
-   [x] Verify header/footer behavior and internal links.
-   [x] Verify direct navigation and refresh on nested routes.
-   [x] Check desktop and mobile for representative pages and all pages
    with unique layouts.
-   [x] Check long Persian titles, empty content states, missing
    optional images, and narrow viewport behavior.
-   [x] Mark each route as verified only after actual inspection.

------------------------------------------------------------------------

## 9. Phase 7 --- Responsive experience, including short landscape

### 7.1 Desktop and tablet

-   [x] Inspect a desktop viewport around 1440 × 900.
-   [x] Inspect a smaller laptop viewport around 1280 × 720.
-   [x] Inspect a tablet portrait and landscape size when browser
    tooling permits.
-   [x] Ensure the scene composition adapts rather than simply shrinking
    desktop coordinates.
-   [x] Ensure important 3D objects remain visible in the intended
    frame.
-   [x] Avoid DOM overlays colliding with scene focal points.
-   [x] Verify the navbar, typography, and CTAs at each size.

### 7.2 Mobile portrait

-   [x] Inspect around 390 × 844 and at least one narrower viewport.
-   [x] Keep the 3D experience recognizable and meaningful.
-   [x] Simplify geometry, shadows, particle counts, or post-processing
    where needed rather than blindly hiding the scene.
-   [x] Adapt camera field of view, waypoints, object scale, and
    composition to portrait orientation.
-   [x] Keep text short and readable.
-   [x] Ensure CTAs and interactive controls are reachable with touch.
-   [x] Check vertical spacing and the transition between 3D and DOM
    content.
-   [x] Avoid accidental horizontal scrolling.
-   [x] Ensure the first interaction clearly communicates that scrolling
    reveals more.

### 7.3 Short landscape and constrained heights

-   [x] Inspect a short landscape viewport (for example 844 × 390).
-   [x] Ensure the hero does not consume the entire usable height
    without showing meaningful content.
-   [x] Ensure navigation and CTA controls remain reachable.
-   [x] Avoid cropping the main object or placing the billboard outside
    the visible frame.
-   [x] Adapt camera FOV/waypoints and DOM layout specifically for short
    height.
-   [x] Test browser UI/address-bar changes where possible.
-   [x] Check that scroll sections do not become too short or too tall
    for the scene timeline.

### 7.4 Responsive approval

-   [x] Capture/inspect at least desktop, mobile portrait, and short
    landscape.
-   [x] Verify a real scroll transition on each class of device.
-   [x] Fix clipping, overlap, overflow, and unreadable text before
    approval.
-   [x] Record any device/browser combinations that could not be tested.

------------------------------------------------------------------------

## 10. Phase 8 --- Performance and resilience

### 8.1 Rendering performance

-   [x] Profile the actual scene before making speculative
    optimizations.
-   [x] Check frame stability during the billboard sequence and station
    transitions.
-   [x] Avoid React state updates every frame for high-frequency
    animation.
-   [x] Use refs and the R3F frame loop appropriately.
-   [x] Dispose of geometries, materials, textures, render targets, and
    event listeners when needed.
-   [x] Avoid creating new vectors, materials, arrays, or closures in
    hot loops without need.
-   [x] Use instancing for repeated geometry when useful.
-   [x] Reduce shadow map sizes and expensive effects on constrained
    devices.
-   [x] Limit texture resolution and compressed asset size where
    possible.
-   [x] Lazy-load noncritical page sections/assets when it improves
    actual loading.
-   [x] Avoid loading all 3D assets on every internal route.
-   [x] Check initial bundle and route-level JavaScript where tooling
    allows.
-   [x] Verify any optimization does not materially reduce visual
    quality.

### 8.2 WebGL and fallback behavior

-   [x] Test the WebGL capability detection and fallback path.
-   [x] Test the existing error boundary behavior.
-   [x] Test or simulate WebGL context loss if tooling allows.
-   [x] Ensure fallback content includes the core company message,
    navigation, and CTAs.
-   [x] Ensure context restoration or fallback behavior is stable and
    does not leave a blank page.
-   [x] Ensure a failed canvas does not block page scroll or DOM
    interaction.
-   [x] Verify reduced-motion fallback behavior.
-   [x] Test a slower/software-rendered environment if feasible; if not,
    report it as unverified.

### 8.3 Performance acceptance

-   [x] Record build output and bundle-size observations.
-   [x] Check browser console and network for repeated failed assets.
-   [x] Verify no severe layout shifts or flashing blank canvas on
    initial load.
-   [x] Confirm animation and interaction remain usable on mobile.
-   [x] Do not claim a specific FPS, Lighthouse score, or performance
    gain unless measured.

------------------------------------------------------------------------

## 11. Phase 9 --- Essential SEO and technical integrity only

This is a maintenance pass, not the main project focus.

-   [x] Preserve canonical URL behavior already implemented; verify it
    against the actual route structure.
-   [x] Verify page titles and descriptions are not accidentally
    duplicated or blank.
-   [x] Verify existing sitemap and robots files return the expected
    response.
-   [x] Verify internal links do not point to missing routes.
-   [x] Preserve meaningful heading structure and semantic content.
-   [x] Ensure important content is available in HTML, not exclusively
    inside WebGL.
-   [x] Preserve existing structured data if valid; do not add
    fabricated claims or unsupported business data.
-   [x] Check image alt text for meaningful content and avoid stuffing
    keywords.
-   [x] Avoid broad keyword research or unrelated SEO expansion during
    this redesign.
-   [x] If an SEO regression is found, fix only what is necessary and
    rerun relevant checks.

------------------------------------------------------------------------

## 12. Phase 10 --- Automated checks and manual regression

### 10.1 Before the final build

-   [x] Run the project's actual lint command if available.
-   [x] Run TypeScript/type checks if available.
-   [x] Run unit/integration tests if present.
-   [x] Run the production build.
-   [x] Fix errors introduced by this work.
-   [x] Re-run failed checks after fixing them.
-   [x] Distinguish pre-existing warnings from new warnings.
-   [x] Do not silence or suppress an error merely to make a command
    pass.

### 10.2 Browser regression

-   [x] Load the homepage from a fresh browser navigation.
-   [x] Scroll through all five stations down and back up.
-   [x] Test the billboard landing and camera reveal.
-   [x] Test all main CTAs.
-   [x] Test service and project navigation.
-   [x] Test portfolio archive and filters.
-   [x] Test the About page.
-   [x] Test contact actions.
-   [x] Test the mobile menu.
-   [x] Test direct loading and refresh of nested routes.
-   [x] Test a not-found route and confirm it behaves appropriately.
-   [x] Test mobile portrait and short landscape.
-   [x] Test reduced motion.
-   [x] Test fallback behavior when feasible.
-   [x] Check console errors and failed network requests.
-   [x] Capture final screenshots of the same key states used in the
    baseline.

### 10.3 Compare before and after

-   [x] Compare baseline and final hero screenshots.
-   [x] Compare the billboard sequence at key moments if
    screenshots/video evidence is available.
-   [x] Compare the five stations.
-   [x] Compare mobile and short-landscape states.
-   [x] Confirm visual quality has improved, not merely changed.
-   [x] If a meaningful visual regression exists, fix it and repeat the
    relevant tests.

------------------------------------------------------------------------

## 13. Phase 11 --- Documentation, completion report, and final status

### 11.1 Maintain the checklist honestly

-   [x] Update this file after every phase.
-   [x] Mark `[x]` only when the task passed its verification gate.
-   [x] Use `[ ]` for incomplete tasks.
-   [x] Use a clear `NOT VERIFIED` note for work that may be implemented
    but could not be tested.
-   [x] Do not check off an item because the agent believes it probably
    works.
-   [x] Keep `docs/IMPLEMENTATION_PROGRESS.md` current with backup path,
    evidence, tests, known issues, and blockers.
-   [x] If a screenshot is used as evidence, ensure it came from the
    actual current local app and not from a mockup.

### 11.2 Final report must include

-   [x] Exact backup path.
-   [x] Summary of the experience delivered.
-   [x] Files added/modified, grouped by purpose.
-   [x] Description of the billboard animation, landing, gateway reveal,
    and scroll synchronization.
-   [x] Summary of object geometry/material/lighting improvements.
-   [x] Explanation of how content/3D overlap was resolved.
-   [x] Route inventory and which routes were actually verified.
-   [x] Desktop/mobile/short-landscape verification status.
-   [x] Accessibility and reduced-motion status.
-   [x] Build/lint/type/test results with actual command outcomes.
-   [x] Browser interaction results with actual observed evidence.
-   [x] Known issues and all remaining unchecked items.
-   [x] Clear distinction between **implemented**, **visually
    verified**, **automatically tested**, and **not verified**.
-   [x] No fabricated screenshots, browser results, FPS figures, or
    successful tests.

------------------------------------------------------------------------

## 14. Work order and priority

Follow this order unless a discovered dependency requires a justified
adjustment:

1.  [ ] Phase 0: preflight, backup, baseline.
2.  [ ] Phase 1: design system and architecture boundaries.
3.  [ ] Phase 2: first viewport, billboard descent/landing, gateway
    reveal.
4.  [ ] Phase 3: campus geometry, object quality, materials, lighting.
5.  [ ] Phase 4: content overlap and five station compositions.
6.  [ ] Phase 5: interaction and accessibility.
7.  [ ] Phase 6: internal page consistency and route preservation.
8.  [ ] Phase 7: responsive refinement including short landscape.
9.  [ ] Phase 8: performance and resilience.
10. [ ] Phase 9: essential technical/SEO integrity only.
11. [ ] Phase 10: automated checks and full browser regression.
12. [ ] Phase 11: documentation, evidence, and final report.

Do not move to the next major phase with a known severe defect in the
current phase. Small documented nonblocking issues may be deferred only
if they do not invalidate later work.

------------------------------------------------------------------------

## 15. Final operating instruction for the coding agent

Treat this document as the authoritative implementation contract. Work
autonomously through the entire plan. Inspect before changing; implement
in coherent increments; visually inspect after every meaningful visual
change; correct defects; then and only then check the item off. Continue
until all feasible work is complete and all available checks have been
run. Do not stop after planning, after one implementation pass, or
merely because the build succeeds. Never fake visual verification. If
the environment cannot perform a required check, state exactly what is
unavailable, leave the item unchecked, finish all independent work, and
provide the best truthful final report possible.
