# Design Tokens & Style Guide

This document provides a quick reference for all design tokens, colors, and styling conventions used in the AI Classroom Co-Pilot frontend.

## 🎨 Color Palette

### Primary Colors
```css
--primary-blue: #003B8E        /* main brand color - headers, primary buttons */
--primary-blue-dark: #003B8E   /* hover states, darker accents */
--primary-blue-light: #2F6CC8  /* light accents, gradients */
```

### Accent Colors
```css
--accent-green: #28a745          /* success states, action buttons */
--accent-green-hover: #218838    /* green button hover state */
```

### Background Colors
```css
--background-white: #ffffff      /* card backgrounds, input fields */
--background-gray: #f5f5f5       /* page background, secondary surfaces */
```

### Text Colors
```css
--text-dark: #333333            /* primary text, headings */
--text-light: #666666           /* secondary text, descriptions */
```

### UI Colors
```css
--border-gray: #dddddd          /* borders, dividers */
--error-red: #dc3545            /* error messages, warnings */
--warning-yellow: #ffc107       /* warning states, processing */
```

## 📏 Spacing System

### Spacing Scale
```css
--spacing-xs: 0.25rem    /* 4px - tight spacing */
--spacing-sm: 0.5rem     /* 8px - small gaps */
--spacing-md: 1rem       /* 16px - standard spacing */
--spacing-lg: 1.5rem     /* 24px - section spacing */
--spacing-xl: 2rem       /* 32px - large gaps */
--spacing-xxl: 3rem      /* 48px - major sections */
```

### Usage Guidelines
- **xs**: Icon padding, badge spacing
- **sm**: Button padding, small gaps
- **md**: Standard padding, form fields
- **lg**: Card padding, section margins
- **xl**: Page padding, major sections
- **xxl**: Hero sections, large containers

## 🔤 Typography

### Font Family
```css
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
               'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
               'Helvetica Neue', sans-serif;
```

### Font Sizes
```css
--font-size-sm: 0.875rem    /* 14px - small text, captions */
--font-size-base: 1rem      /* 16px - body text */
--font-size-lg: 1.125rem    /* 18px - large text, subheadings */
--font-size-xl: 1.5rem      /* 24px - section headings */
--font-size-xxl: 2rem       /* 32px - page titles */
```

### Font Weights
- **400**: Regular text
- **600**: Semibold - buttons, labels, emphasis
- **700**: Bold - headings (when needed)

### Line Height
- **Body Text**: 1.6
- **Headings**: 1.2-1.4
- **Buttons**: 1.5

## 🔲 Border Radius

```css
--radius-sm: 4px     /* small elements, badges */
--radius-md: 8px     /* buttons, inputs, cards */
--radius-lg: 12px    /* large cards, containers */
```

## 🌑 Shadows

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1)      /* subtle elevation */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)      /* standard cards */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)    /* elevated elements */
```

## 🎯 Component Patterns

### Buttons

#### Primary Button
```css
background: var(--primary-purple)
color: white
border: 2px solid var(--primary-purple)
padding: var(--spacing-md) var(--spacing-lg)
border-radius: var(--radius-md)
```

#### Secondary Button
```css
background: white
color: var(--primary-purple)
border: 2px solid var(--primary-purple)
padding: var(--spacing-md) var(--spacing-lg)
border-radius: var(--radius-md)
```

#### Success Button
```css
background: var(--accent-green)
color: white
border: 2px solid var(--accent-green)
padding: var(--spacing-md) var(--spacing-lg)
border-radius: var(--radius-md)
```

### Cards
```css
background: white
border-radius: var(--radius-lg)
box-shadow: var(--shadow-sm)
padding: var(--spacing-lg)
```

### Input Fields
```css
border: 2px solid var(--border-gray)
border-radius: var(--radius-md)
padding: var(--spacing-md)
font-size: var(--font-size-base)

/* focus state */
border-color: var(--primary-purple)
box-shadow: 0 0 0 3px rgba(75, 0, 130, 0.1)
```

### Status Badges

#### Success
```css
background: rgba(40, 167, 69, 0.1)
color: var(--accent-green)
padding: var(--spacing-xs) var(--spacing-md)
border-radius: var(--radius-sm)
```

#### Warning
```css
background: rgba(255, 193, 7, 0.1)
color: var(--warning-yellow)
padding: var(--spacing-xs) var(--spacing-md)
border-radius: var(--radius-sm)
```

#### Error
```css
background: rgba(220, 53, 69, 0.1)
color: var(--error-red)
padding: var(--spacing-xs) var(--spacing-md)
border-radius: var(--radius-sm)
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Mobile: Default (up to 480px) */
/* Tablet: 481px - 768px */
@media (max-width: 768px) { ... }

/* Desktop: 769px and up */
@media (min-width: 769px) { ... }

/* Large Desktop: 1200px and up */
@media (min-width: 1200px) { ... }
```

## 🎭 Interaction States

### Hover
```css
transform: translateY(-2px)
box-shadow: var(--shadow-md)
transition: all 0.2s ease
```

### Active/Pressed
```css
transform: translateY(0)
transition: all 0.1s ease
```

### Focus (Accessibility)
```css
outline: 2px solid var(--primary-purple)
outline-offset: 2px
```

### Disabled
```css
opacity: 0.5
cursor: not-allowed
```

## 🎬 Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: fadeIn 0.3s ease-in;
```

### Spinner
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

animation: spin 1s linear infinite;
```

## 🌈 Gradient Patterns

### Purple Gradient
```css
background: linear-gradient(135deg, 
  var(--primary-purple-light) 0%, 
  var(--primary-purple) 100%
);
```

### Green Gradient
```css
background: linear-gradient(90deg, 
  var(--accent-green) 0%, 
  var(--accent-green-hover) 100%
);
```

## ♿ Accessibility Standards

### Minimum Touch Targets
```css
min-width: 44px;
min-height: 44px;
```

### Color Contrast Ratios
- **Normal Text**: 4.5:1 minimum (WCAG AA)
- **Large Text**: 3:1 minimum (WCAG AA)
- **UI Components**: 3:1 minimum (WCAG AA)

### Focus Indicators
- Always visible
- Minimum 2px outline
- High contrast color

## 📐 Layout Patterns

### Container
```css
max-width: 1200px;
margin: 0 auto;
padding: 0 var(--spacing-md);
```

### Flex Row
```css
display: flex;
gap: var(--spacing-md);
align-items: center;
```

### Flex Column
```css
display: flex;
flex-direction: column;
gap: var(--spacing-md);
```

### Grid (2 columns)
```css
display: grid;
grid-template-columns: repeat(2, 1fr);
gap: var(--spacing-lg);
```

## 🎨 Usage Examples

### Question Bubble
```css
background-color: var(--primary-purple);
color: white;
padding: var(--spacing-lg);
border-radius: var(--radius-lg);
max-width: 80%;
margin-left: auto;
```

### Answer Bubble
```css
background-color: var(--background-gray);
padding: var(--spacing-lg);
border-radius: var(--radius-lg);
max-width: 85%;
border-left: 4px solid var(--accent-green);
```

### Citation Item
```css
background-color: white;
padding: var(--spacing-md);
border-radius: var(--radius-md);
border-left: 3px solid var(--primary-purple);
```

## 🔧 Customization Tips

### Changing Primary Color
1. Update `--primary-purple` in `:root`
2. Update `--primary-purple-dark` (darker shade)
3. Update `--primary-purple-light` (lighter shade)

### Changing Accent Color
1. Update `--accent-green` in `:root`
2. Update `--accent-green-hover` (darker shade)

### Adjusting Spacing
- Multiply all spacing values by same factor
- Example: 1.5x for more spacious design
- Example: 0.75x for more compact design

### Font Size Scaling
- Use `rem` units for scalability
- Adjust base font size on `html` element
- All sizes will scale proportionally

---

**Note**: All design tokens are defined in `src/index.css` and can be easily customized to match your brand guidelines.