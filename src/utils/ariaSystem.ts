/**
 * ARIA Labels and Semantic HTML System
 * Part of T027 - ARIA labels and semantics for User Story 3
 * 
 * Provides comprehensive ARIA attributes, semantic HTML patterns,
 * and screen reader compatibility following WCAG accessibility guidelines.
 */

// ARIA Role Definitions
export const ARIA_ROLES = {
  // Landmark roles
  landmarks: {
    main: 'main',
    navigation: 'navigation',
    banner: 'banner',
    contentinfo: 'contentinfo',
    complementary: 'complementary',
    region: 'region',
    search: 'search',
    form: 'form',
  },
  
  // Widget roles
  widgets: {
    button: 'button',
    link: 'link',
    checkbox: 'checkbox',
    radio: 'radio',
    textbox: 'textbox',
    combobox: 'combobox',
    listbox: 'listbox',
    option: 'option',
    menu: 'menu',
    menuitem: 'menuitem',
    tab: 'tab',
    tabpanel: 'tabpanel',
    dialog: 'dialog',
    alertdialog: 'alertdialog',
    alert: 'alert',
    status: 'status',
    progressbar: 'progressbar',
    slider: 'slider',
    spinbutton: 'spinbutton',
  },
  
  // Structure roles
  structure: {
    article: 'article',
    section: 'section',
    group: 'group',
    list: 'list',
    listitem: 'listitem',
    heading: 'heading',
    img: 'img',
    figure: 'figure',
    table: 'table',
    row: 'row',
    cell: 'cell',
    grid: 'grid',
    gridcell: 'gridcell',
  },
} as const;

// ARIA Properties and States
export const ARIA_PROPERTIES = {
  // Label and description properties
  labeling: {
    label: 'aria-label',
    labelledby: 'aria-labelledby',
    describedby: 'aria-describedby',
    details: 'aria-details',
  },
  
  // State properties
  states: {
    expanded: 'aria-expanded',
    selected: 'aria-selected',
    checked: 'aria-checked',
    pressed: 'aria-pressed',
    disabled: 'aria-disabled',
    hidden: 'aria-hidden',
    invalid: 'aria-invalid',
    required: 'aria-required',
    readonly: 'aria-readonly',
  },
  
  // Relationship properties
  relationships: {
    controls: 'aria-controls',
    owns: 'aria-owns',
    activedescendant: 'aria-activedescendant',
    flowto: 'aria-flowto',
    describedby: 'aria-describedby',
    details: 'aria-details',
  },
  
  // Live region properties
  live: {
    live: 'aria-live',
    atomic: 'aria-atomic',
    relevant: 'aria-relevant',
    busy: 'aria-busy',
  },
  
  // Value properties
  values: {
    valuemin: 'aria-valuemin',
    valuemax: 'aria-valuemax',
    valuenow: 'aria-valuenow',
    valuetext: 'aria-valuetext',
  },
} as const;

// Semantic HTML Elements
export const SEMANTIC_ELEMENTS = {
  // Document structure
  structure: {
    header: 'header',
    nav: 'nav',
    main: 'main',
    section: 'section',
    article: 'article',
    aside: 'aside',
    footer: 'footer',
    address: 'address',
  },
  
  // Content sectioning
  sectioning: {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    hgroup: 'hgroup',
  },
  
  // Text semantics
  text: {
    p: 'p',
    blockquote: 'blockquote',
    pre: 'pre',
    code: 'code',
    em: 'em',
    strong: 'strong',
    mark: 'mark',
    small: 'small',
    del: 'del',
    ins: 'ins',
    sub: 'sub',
    sup: 'sup',
  },
  
  // Lists
  lists: {
    ul: 'ul',
    ol: 'ol',
    li: 'li',
    dl: 'dl',
    dt: 'dt',
    dd: 'dd',
  },
  
  // Forms
  forms: {
    form: 'form',
    fieldset: 'fieldset',
    legend: 'legend',
    label: 'label',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    optgroup: 'optgroup',
    button: 'button',
    output: 'output',
  },
} as const;

// Component-specific ARIA patterns
export const COMPONENT_ARIA = {
  // Form components
  form: {
    container: {
      role: ARIA_ROLES.landmarks.form,
      'aria-label': 'Word filter configuration',
    },
    fieldset: {
      role: ARIA_ROLES.structure.group,
    },
    legend: {
      id: 'segments-legend',
    },
    validation: {
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  },
  
  // Input field patterns
  input: {
    text: {
      'aria-required': 'true',
      'aria-describedby': '', // To be set dynamically
    },
    number: {
      'aria-required': 'true',
      'aria-valuemin': '1',
      'aria-valuemax': '10',
    },
    error: {
      'aria-invalid': 'true',
      'aria-describedby': '', // Error ID
    },
    success: {
      'aria-invalid': 'false',
    },
  },
  
  // Button patterns
  button: {
    primary: {
      type: 'submit',
      'aria-describedby': '', // Optional description
    },
    secondary: {
      type: 'button',
    },
    danger: {
      type: 'button',
      'aria-describedby': '', // Warning description
    },
    loading: {
      'aria-busy': 'true',
      'aria-describedby': '', // Loading message ID
    },
  },
  
  // Navigation patterns
  navigation: {
    menu: {
      role: ARIA_ROLES.widgets.menu,
      'aria-label': 'Main navigation',
    },
    menuitem: {
      role: ARIA_ROLES.widgets.menuitem,
    },
    breadcrumb: {
      role: ARIA_ROLES.landmarks.navigation,
      'aria-label': 'Breadcrumb',
    },
  },
  
  // Content patterns
  content: {
    heading: {
      role: ARIA_ROLES.structure.heading,
    },
    region: {
      role: ARIA_ROLES.landmarks.region,
      'aria-label': '', // To be set dynamically
    },
    list: {
      role: ARIA_ROLES.structure.list,
      'aria-label': '', // List description
    },
    listitem: {
      role: ARIA_ROLES.structure.listitem,
    },
  },
  
  // Modal and dialog patterns
  dialog: {
    modal: {
      role: ARIA_ROLES.widgets.dialog,
      'aria-modal': 'true',
      'aria-labelledby': '', // Title ID
      'aria-describedby': '', // Content ID
    },
    alert: {
      role: ARIA_ROLES.widgets.alertdialog,
      'aria-modal': 'true',
      'aria-labelledby': '', // Title ID
      'aria-describedby': '', // Message ID
    },
    backdrop: {
      'aria-hidden': 'true',
    },
  },
  
  // Loading and status patterns
  status: {
    loading: {
      role: ARIA_ROLES.widgets.status,
      'aria-live': 'polite',
      'aria-label': 'Loading',
    },
    progress: {
      role: ARIA_ROLES.widgets.progressbar,
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '', // Current progress
      'aria-label': 'Loading progress',
    },
    alert: {
      role: ARIA_ROLES.widgets.alert,
      'aria-live': 'assertive',
    },
    success: {
      role: ARIA_ROLES.widgets.status,
      'aria-live': 'polite',
      'aria-label': 'Success',
    },
    error: {
      role: ARIA_ROLES.widgets.alert,
      'aria-live': 'assertive',
      'aria-label': 'Error',
    },
  },
} as const;

// Accessibility utility functions
export const ariaUtils = {
  /**
   * Generate unique IDs for ARIA relationships
   */
  generateId: (prefix: string, suffix?: string) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}-${timestamp}-${random}${suffix ? `-${suffix}` : ''}`;
  },
  
  /**
   * Create ARIA label attributes for components
   */
  createAriaLabel: (component: keyof typeof COMPONENT_ARIA, variant: string, customLabel?: string) => {
    const componentAria = COMPONENT_ARIA[component] as Record<string, Record<string, string>>;
    const variantAria = componentAria[variant] || {};
    
    if (customLabel) {
      return { ...variantAria, 'aria-label': customLabel };
    }
    
    return variantAria;
  },
  
  /**
   * Create form field ARIA attributes
   */
  createFieldAria: (required: boolean = false, hasError: boolean = false, errorId?: string, helpId?: string) => {
    const attributes: Record<string, string | boolean> = {
      'aria-required': required,
      'aria-invalid': hasError,
    };
    
    const describedBy: string[] = [];
    if (hasError && errorId) {
      describedBy.push(errorId);
    }
    if (helpId) {
      describedBy.push(helpId);
    }
    
    if (describedBy.length > 0) {
      attributes['aria-describedby'] = describedBy.join(' ');
    }
    
    return attributes;
  },
  
  /**
   * Create live region announcements
   */
  createLiveRegion: (type: 'polite' | 'assertive' | 'off', atomic: boolean = true) => {
    return {
      'aria-live': type,
      'aria-atomic': atomic,
    };
  },
  
  /**
   * Create dialog ARIA attributes
   */
  createDialogAria: (titleId: string, descriptionId?: string, isModal: boolean = true) => {
    const attributes: Record<string, string | boolean> = {
      role: ARIA_ROLES.widgets.dialog,
      'aria-labelledby': titleId,
    };
    
    if (isModal) {
      attributes['aria-modal'] = true;
    }
    
    if (descriptionId) {
      attributes['aria-describedby'] = descriptionId;
    }
    
    return attributes;
  },
  
  /**
   * Create button ARIA attributes with loading state
   */
  createButtonAria: (isLoading: boolean = false, loadingText?: string, describedBy?: string) => {
    const attributes: Record<string, string | boolean> = {};
    
    if (isLoading) {
      attributes['aria-busy'] = true;
      if (loadingText) {
        attributes['aria-label'] = loadingText;
      }
    }
    
    if (describedBy) {
      attributes['aria-describedby'] = describedBy;
    }
    
    return attributes;
  },
  
  /**
   * Create list ARIA attributes
   */
  createListAria: (listLabel: string, itemCount?: number) => {
    const attributes: Record<string, string | number> = {
      role: ARIA_ROLES.structure.list,
      'aria-label': listLabel,
    };
    
    if (itemCount !== undefined) {
      attributes['aria-setsize'] = itemCount;
    }
    
    return attributes;
  },
  
  /**
   * Create screen reader only text
   */
  srOnly: (text: string) => ({
    className: 'sr-only',
    children: text,
  }),
  
  /**
   * Hide decorative elements from screen readers
   */
  hideFromScreenReader: () => ({
    'aria-hidden': 'true',
  }),
} as const;

// Screen reader text patterns
export const SCREEN_READER_TEXT = {
  // Navigation
  navigation: {
    skipToMain: 'Skip to main content',
    skipToNavigation: 'Skip to navigation',
    mainNavigation: 'Main navigation',
    breadcrumb: 'You are here:',
  },
  
  // Form interactions
  forms: {
    required: 'Required field',
    optional: 'Optional field',
    invalid: 'Invalid input',
    valid: 'Valid input',
    loading: 'Form is submitting',
    submitted: 'Form submitted successfully',
    error: 'Form submission failed',
  },
  
  // Actions and states
  actions: {
    loading: 'Loading content',
    saving: 'Saving changes',
    deleting: 'Deleting item',
    expanding: 'Expanding section',
    collapsing: 'Collapsing section',
    opening: 'Opening dialog',
    closing: 'Closing dialog',
  },
  
  // Content descriptions
  content: {
    empty: 'No items to display',
    filtered: 'Showing filtered results',
    sorted: 'Results sorted by',
    selected: 'Selected item',
    unselected: 'Unselected item',
    page: 'Page',
    of: 'of',
    results: 'results',
  },
  
  // Word filter specific
  wordFilter: {
    segmentLabel: 'Segment configuration',
    availableLetters: 'Letters available for this segment',
    targetLength: 'Target word length for this segment',
    addSegment: 'Add new segment',
    removeSegment: 'Remove this segment',
    filterWords: 'Start filtering words',
    resetForm: 'Reset all segments',
    resultsFound: 'words found matching your criteria',
    noResults: 'No words found matching your criteria',
  },
} as const;

// Export types for TypeScript support
export type AriaRole = keyof typeof ARIA_ROLES.landmarks | keyof typeof ARIA_ROLES.widgets | keyof typeof ARIA_ROLES.structure;
export type AriaProperty = keyof typeof ARIA_PROPERTIES.labeling | keyof typeof ARIA_PROPERTIES.states | keyof typeof ARIA_PROPERTIES.relationships;
export type SemanticElement = keyof typeof SEMANTIC_ELEMENTS.structure | keyof typeof SEMANTIC_ELEMENTS.forms;
export type ComponentAria = keyof typeof COMPONENT_ARIA;