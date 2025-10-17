/**
 * Focus Indicator and Keyboard Navigation System
 * Part of T026 - Focus indicators for User Story 3
 * 
 * Provides accessible focus indicators, keyboard navigation patterns,
 * and visual feedback for interactive elements following WCAG guidelines.
 */

// Focus Indicator Styles
export const FOCUS_INDICATORS = {
  // Basic focus ring styles
  ring: {
    default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    tight: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    wide: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-4',
    none: 'focus:outline-none',
  },
  
  // Color variants for different contexts
  colors: {
    primary: 'focus:ring-blue-500',
    secondary: 'focus:ring-slate-500',
    success: 'focus:ring-green-500',
    warning: 'focus:ring-amber-500',
    danger: 'focus:ring-red-500',
    info: 'focus:ring-cyan-500',
  },
  
  // Focus within (for container elements)
  within: {
    default: 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
    subtle: 'focus-within:ring-1 focus-within:ring-blue-400 focus-within:ring-offset-1',
  },
  
  // Visible focus for enhanced accessibility
  visible: {
    default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    enhanced: 'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2',
  },
} as const;

// Interactive State Patterns
export const INTERACTIVE_STATES = {
  // Button states
  button: {
    base: 'transition-all duration-200 ease-in-out',
    focus: `${FOCUS_INDICATORS.ring.default}`,
    hover: 'hover:shadow-md hover:scale-105',
    active: 'active:scale-95 active:shadow-sm',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
    loading: 'cursor-wait opacity-75',
  },
  
  // Input field states
  input: {
    base: 'transition-all duration-200 ease-in-out',
    focus: `${FOCUS_INDICATORS.ring.tight} focus:border-blue-400`,
    hover: 'hover:border-slate-400',
    error: 'border-red-300 focus:border-red-400 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-400 focus:ring-green-500',
    disabled: 'disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-75',
  },
  
  // Link states
  link: {
    base: 'transition-all duration-150 ease-in-out',
    focus: `${FOCUS_INDICATORS.ring.tight}`,
    hover: 'hover:underline hover:text-blue-700',
    active: 'active:text-blue-800',
    visited: 'visited:text-purple-600',
  },
  
  // Card/container states
  card: {
    base: 'transition-all duration-200 ease-in-out',
    focus: `${FOCUS_INDICATORS.within.default}`,
    hover: 'hover:shadow-lg hover:border-slate-300',
    interactive: 'cursor-pointer',
  },
} as const;

// Keyboard Navigation Patterns
export const KEYBOARD_NAVIGATION = {
  // Tab order management
  tabIndex: {
    focusable: '0',
    notFocusable: '-1',
    firstInGroup: '0',
    skipNavigation: '-1',
  },
  
  // Keyboard shortcuts and navigation
  shortcuts: {
    submit: 'Enter',
    cancel: 'Escape',
    next: 'Tab',
    previous: 'Shift+Tab',
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    home: 'Home',
    end: 'End',
    pageUp: 'PageUp',
    pageDown: 'PageDown',
  },
  
  // ARIA navigation roles
  navigation: {
    menu: 'menu',
    menubar: 'menubar',
    menuitem: 'menuitem',
    tablist: 'tablist',
    tab: 'tab',
    tabpanel: 'tabpanel',
    listbox: 'listbox',
    option: 'option',
    grid: 'grid',
    gridcell: 'gridcell',
    tree: 'tree',
    treeitem: 'treeitem',
  },
} as const;

// Component-specific focus patterns
export const COMPONENT_FOCUS = {
  // Form components
  form: {
    container: `${FOCUS_INDICATORS.within.subtle}`,
    fieldset: 'focus-within:border-blue-200',
    legend: FOCUS_INDICATORS.ring.default,
    label: FOCUS_INDICATORS.ring.tight,
    input: `${INTERACTIVE_STATES.input.base} ${INTERACTIVE_STATES.input.focus}`,
    textarea: `${INTERACTIVE_STATES.input.base} ${INTERACTIVE_STATES.input.focus}`,
    select: `${INTERACTIVE_STATES.input.base} ${INTERACTIVE_STATES.input.focus}`,
    checkbox: `${FOCUS_INDICATORS.ring.tight} focus:ring-offset-0`,
    radio: `${FOCUS_INDICATORS.ring.tight} focus:ring-offset-0`,
  },
  
  // Button variants
  button: {
    primary: `${INTERACTIVE_STATES.button.base} ${INTERACTIVE_STATES.button.focus} ${INTERACTIVE_STATES.button.hover} ${INTERACTIVE_STATES.button.active}`,
    secondary: `${INTERACTIVE_STATES.button.base} ${INTERACTIVE_STATES.button.focus} ${INTERACTIVE_STATES.button.hover} ${INTERACTIVE_STATES.button.active}`,
    danger: `${INTERACTIVE_STATES.button.base} focus:ring-red-500 focus:ring-offset-2 ${INTERACTIVE_STATES.button.hover} ${INTERACTIVE_STATES.button.active}`,
    ghost: `${INTERACTIVE_STATES.button.base} ${FOCUS_INDICATORS.ring.tight} hover:bg-slate-100 ${INTERACTIVE_STATES.button.active}`,
  },
  
  // Navigation components
  navigation: {
    menu: FOCUS_INDICATORS.within.default,
    menuItem: `${FOCUS_INDICATORS.ring.tight} hover:bg-slate-100`,
    breadcrumb: FOCUS_INDICATORS.ring.tight,
    pagination: `${FOCUS_INDICATORS.ring.default} hover:bg-slate-100`,
  },
  
  // Content components
  content: {
    card: `${INTERACTIVE_STATES.card.base} ${INTERACTIVE_STATES.card.focus}`,
    modal: 'focus:outline-none',
    dialog: 'focus:outline-none',
    tooltip: 'focus:outline-none',
  },
} as const;

// Accessibility utilities
export const accessibilityUtils = {
  /**
   * Get focus classes for a specific component type
   */
  getFocusClasses: (component: keyof typeof COMPONENT_FOCUS, variant?: string) => {
    const componentFocus = COMPONENT_FOCUS[component] as Record<string, string>;
    return componentFocus[variant || 'primary'] || componentFocus.primary || FOCUS_INDICATORS.ring.default;
  },
  
  /**
   * Create accessible button with proper focus management
   */
  createFocusableButton: (
    variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary',
    disabled: boolean = false
  ) => {
    const baseClasses = COMPONENT_FOCUS.button[variant];
    const disabledClasses = disabled ? INTERACTIVE_STATES.button.disabled : '';
    return `${baseClasses} ${disabledClasses}`.trim();
  },
  
  /**
   * Create accessible input with proper focus management
   */
  createFocusableInput: (hasError: boolean = false) => {
    const baseClasses = COMPONENT_FOCUS.form.input;
    const errorClasses = hasError ? INTERACTIVE_STATES.input.error : '';
    return `${baseClasses} ${errorClasses}`.trim();
  },
  
  /**
   * Manage focus trap for modals and dialogs
   */
  focusTrap: {
    attributes: {
      'data-focus-trap': 'true',
      'tabIndex': '-1',
    },
    firstElement: 'data-focus-first',
    lastElement: 'data-focus-last',
  },
  
  /**
   * Skip navigation link for screen readers
   */
  skipNav: {
    classes: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded',
    href: '#main-content',
    text: 'Skip to main content',
  },
  
  /**
   * Live region announcements
   */
  liveRegion: {
    polite: { 'aria-live': 'polite', 'aria-atomic': 'true' },
    assertive: { 'aria-live': 'assertive', 'aria-atomic': 'true' },
    off: { 'aria-live': 'off' },
  },
} as const;

// Focus management hooks data
export const FOCUS_MANAGEMENT = {
  // Focus restoration patterns
  restoration: {
    saveLastFocused: 'data-last-focused',
    restoreOnClose: 'data-restore-focus',
    focusOnOpen: 'data-focus-on-open',
  },
  
  // Roving tabindex patterns for groups
  rovingTabindex: {
    groupRole: 'group',
    activeDescendant: 'aria-activedescendant',
    currentItem: '0',
    otherItems: '-1',
  },
  
  // Modal and dialog focus management
  modal: {
    backdrop: 'data-modal-backdrop',
    container: 'data-modal-container',
    closeButton: 'data-modal-close',
    focusTrap: 'data-focus-trap',
  },
} as const;

// Enhanced contrast and visibility patterns
export const ENHANCED_VISIBILITY = {
  // High contrast mode support
  highContrast: {
    border: 'border-2 border-slate-900 contrast-more:border-black',
    background: 'bg-white contrast-more:bg-white',
    text: 'text-slate-900 contrast-more:text-black',
    focus: 'focus:ring-4 focus:ring-blue-600 contrast-more:focus:ring-black',
  },
  
  // Reduced motion support
  reducedMotion: {
    respectPreference: 'motion-reduce:transition-none motion-reduce:animate-none',
    essentialMotion: 'motion-reduce:duration-200',
  },
  
  // Dark mode focus adjustments
  darkMode: {
    ring: 'dark:focus:ring-blue-400',
    background: 'dark:focus:bg-slate-800',
    text: 'dark:focus:text-white',
  },
} as const;

// Export types for TypeScript support
export type FocusIndicator = keyof typeof FOCUS_INDICATORS.ring;
export type FocusColor = keyof typeof FOCUS_INDICATORS.colors;
export type InteractiveState = keyof typeof INTERACTIVE_STATES;
export type ComponentFocus = keyof typeof COMPONENT_FOCUS;
export type KeyboardShortcut = keyof typeof KEYBOARD_NAVIGATION.shortcuts;