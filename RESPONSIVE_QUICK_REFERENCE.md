# Responsive Design Quick Reference

## Breakpoints
```css
mobile:   0-639px   (default)
tablet:   640-1023px (sm:)
desktop:  1024-1279px (md:, lg:)
large:    1280px+    (xl:)
```

## Common Patterns

### Container
```jsx
<div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6">
```

### Grid Layout
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Responsive Spacing
```jsx
<div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
```

### Typography
```jsx
<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
```

## React Hooks

### Viewport Hook
```typescript
const { breakpoint, isMobile, isTablet, isDesktop } = useOptimizedViewport();
```

### Performance Monitoring
```typescript
const monitor = new ResponsivePerformanceMonitor();
monitor.startMonitoring();
```

### Accessibility Validation
```typescript
const issues = await auditAccessibility(element);
```

## Design System

### Colors
```typescript
import { designUtils } from '../utils/visualDesignSystem';

const primaryButton = designUtils.createButton('primary', 'md');
const successColor = designUtils.getSemanticColor('success', 'background');
```

### Cards
```typescript
const cardClasses = designUtils.createCard('elevated');
```

## Testing Commands

```bash
# Development panels
npm run dev  # Shows testing panels in browser

# Build validation
npm run build

# Type checking
npm run type-check
```

## Development Panels

1. **Cross-Browser Panel** (bottom-right): Browser compatibility
2. **Performance Panel** (bottom-right, stacked): Real-time metrics
3. **Validation Panel** (bottom-left): Comprehensive validation

## Troubleshooting

### Performance Issues
- Use `useOptimizedViewport` instead of basic viewport hooks
- Monitor with Performance Panel
- Check memory usage and frame rate

### Layout Issues
- Verify responsive classes (`sm:`, `md:`, `lg:`)
- Test on multiple screen sizes
- Use Grid for complex layouts, Flexbox for simple ones

### Accessibility Issues
- Check color contrast ratios
- Ensure keyboard navigation works
- Verify ARIA labels are present
- Test with screen readers

## Key Files

- `src/utils/visualDesignSystem.ts` - Design tokens and utilities
- `src/utils/performanceOptimizations.ts` - Viewport and performance hooks
- `src/utils/smoothTransitions.ts` - Animation and transition system
- `src/utils/accessibilityValidation.ts` - A11y testing utilities
- `src/utils/crossBrowserTesting.ts` - Browser compatibility testing
- `src/utils/finalValidation.ts` - Comprehensive validation system