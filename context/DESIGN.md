# Web3 Portfolio Design System

A comprehensive design system for a Web3 product manager portfolio featuring dark and light modes with elegant typography and consistent spacing.

## Features

- 🎨 **Dual Theme Support**: Seamless dark and light mode switching
- 🔤 **Premium Typography**: Instrument Serif & Instrument Sans font pairing
- 📐 **Consistent Spacing**: Token-based spacing system
- 🧩 **Reusable Components**: Production-ready React components
- ✨ **Smooth Animations**: Premium easing and transitions
- 📱 **Fully Responsive**: Mobile, tablet, and desktop optimized

## 🚨 Governance ("The Prime Directive")
**The Design System is the Single Source of Truth.**
*   **Do not** use hardcoded values in components.
*   **Do not** add "snowflake" styles without justification.
*   **Updates**: If you need a new style, add it to `globals.css` AND document it here first.

## Quick Start

### Theme System

The design system uses CSS custom properties for theming. Toggle between dark and light modes using the `ThemeToggle` component.

```tsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Using Components

All components are available in the `/components` directory:

```tsx
import { Button } from './components/Button';
import { Tag } from './components/Tag';
import { CaseStudyCard } from './components/CaseStudyCard';

// Primary button
<Button variant="primary" href="#contact">Get in touch</Button>

// Secondary button
<Button variant="secondary" href="#work">View work</Button>

// Tags
<Tag>Web3</Tag>
<Tag>Product</Tag>
```

## Available Components

### Buttons

- **Primary Button**: Solid background with accent hover
- **Secondary Button**: Text link with underline

```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
```

### Cards

#### Case Study Card
Displays project information with metrics:

```tsx
<CaseStudyCard
  year="2024"
  title="Project Title"
  description="Project description"
  tags={['Tag1', 'Tag2']}
  metrics={[
    { label: 'Metric', value: '100K' }
  ]}
/>
```

#### Experience Card
Shows work experience with achievements:

```tsx
<ExperienceCard
  period="2023 — Present"
  company="Company Name"
  role="Role Title"
  description="Description"
  achievements={['Achievement 1', 'Achievement 2']}
/>
```

#### Certification Card
Displays certifications with decorative corner:

```tsx
<CertificationCard
  title="Certification Name"
  issuer="Issuer"
  date="Date"
  credentialId="ID-123"
/>
```

### UI Elements

#### Tags
Small labels for categorization:

```tsx
<Tag variant="bordered">Category</Tag>
```

#### Status Indicator
Visual status with optional label:

```tsx
<StatusIndicator status="online" label="Open to work" />
```

#### Section Header
Labeled divider for sections:

```tsx
<SectionHeader label="Section Title" />
```

### Navigation

Fixed navigation with "Frosted Glass" (Glassmorphism) effect and compact padding.

```tsx
<Navigation logo="yourname.eth" />
```

### Floating Actions (Omnibar)

Centralized floating action button for high-value conversions.

```tsx
<Omnibar />
```

## Color System

### CSS Variables

All colors are defined as CSS custom properties in `/styles/globals.css`:

#### Dark Mode (Default)
- `--color-background`: #08080a
- `--color-text-primary`: #e8e6e3
- `--color-accent`: #c29a6c
- `--color-success`: #4ade80

#### Light Mode
- `--color-background`: #fafafa
- `--color-text-primary`: #050505
- `--color-accent`: #8a6642
- `--color-success`: #22c55e

### Using Colors

```css
.custom-element {
  color: var(--color-text-primary);
  background: var(--color-background);
  border: 1px solid var(--color-border);
}
```

## Typography

### Font Families

- **Instrument Serif** (Italic): Headlines, accent text
- **Instrument Sans**: Body text, UI elements

### Type Scale

- **H1**: clamp(3rem, 8vw, 8rem) - Hero headlines
- **H2**: clamp(1.75rem, 2.5vw, 2.625rem) - Section titles
- **H3**: clamp(1.25rem, 1.5vw, 1.625rem) - Card titles
- **Body**: 15px - Standard text
- **Body Large**: 19px - Introductory text

### Usage

```tsx
<h1>Building at the edge of trust</h1>
<h2>Section Title</h2>
<h3>Card Title</h3>
<p>Body text paragraph</p>
```

## Spacing System

Token-based spacing using CSS custom properties:

- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 16px
- `--space-lg`: 24px
- `--space-xl`: 32px
- `--space-2xl`: 48px
- `--space-3xl`: 64px

### Usage

```css
.container {
  padding: var(--space-xl);
  gap: var(--space-md);
}
```

## Animations

### Transitions

Primary easing function:
```css
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
--transition-fast: 0.2s ease;
--transition-medium: 0.4s var(--ease-smooth);
```

### Common Animations

```css
/* Fade in */
animation: fadeIn 0.8s ease forwards;

/* Slide up */
animation: slideUp 1s var(--ease-smooth) forwards;
```

## Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

### Media Queries

```css
@media (max-width: 767px) {
  /* Mobile styles */
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

## Layout System

Defined in `globals.css` to ensure consistency across all sections.

### Dimensions

- `--layout-max-width`: **1600px** (Wide, premium feel)
- `--nav-height`: **20px** (Compact desktop vertical padding)
- `--nav-height-mobile`: **16px** (Mobile vertical padding)
- `--drawer-width`: **800px** (Case Study slide-over width)
- `--drawer-z-index`: **200** (Above all content)
- `--omnibar-z-index`: **90** (Floating above content, below nav/drawer)
- `--omnibar-height`: **56px** (Standard touch target height)
- `--omnibar-bottom-spacing`: **24px** (Distance from bottom)

### Usage

```css
.section-container {
  max-width: var(--layout-max-width);
  margin: 0 auto;
}
```

## Effects

### Grid Overlay
Subtle dot grid background:

```tsx
<div className="bg-grid" />
```

### Ambient Orbs
Decorative gradient effects:

```tsx
<div className="orb-primary" />
<div className="orb-secondary" />
```

## Best Practices

1. **Always use CSS variables** for colors and spacing
2. **Use semantic component names** for clarity
3. **Maintain consistent spacing** using the token system
4. **Test both themes** when adding new components
5. **Follow responsive patterns** established in the system
6. **Use proper semantic HTML** for accessibility
7. **Leverage the easing functions** for consistent animations

## Customization

### Changing Colors

Edit the CSS variables in `/styles/globals.css`:

```css
:root {
  --color-accent: #your-color;
}

[data-theme="light"] {
  --color-accent: #your-light-color;
}
```

### Adding New Components

1. Create component in `/components`
2. Add styles to `/components/components.css`
3. Use existing design tokens
4. Test in both themes
5. Ensure responsive behavior

## Files Structure

```
/
├── styles/
│   ├── globals.css          # Theme tokens, global styles
│   └── layout.css           # Layout and section styles
├── components/
│   ├── Button.tsx
│   ├── Tag.tsx
│   ├── CaseStudyCard.tsx
│   ├── ExperienceCard.tsx
│   ├── CertificationCard.tsx
│   ├── Navigation.tsx
│   ├── SectionHeader.tsx
│   ├── StatusIndicator.tsx
│   ├── ThemeToggle.tsx
│   ├── DesignSystemShowcase.tsx
│   └── components.css       # Component-specific styles
├── context/
│   └── ThemeContext.tsx     # Theme management
└── App.tsx                  # Main application
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (latest)

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Sufficient color contrast (WCAG AA)
- Semantic HTML structure
- Focus indicators

## Performance

- CSS custom properties for instant theme switching
- Optimized animations using transforms
- Lazy loading ready
- No layout shifts on theme change
- Minimal JavaScript for core functionality
