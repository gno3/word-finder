# Quick Start: WordSegmentInput Component Enhancement

**Feature**: WordSegmentInput Component Enhancement  
**Target**: Developers implementing validation enhancements  
**Time**: ~30 minutes setup + implementation

## Prerequisites

- Node.js 18+ installed
- Existing word-finder project cloned
- VS Code or preferred editor
- Basic React + TypeScript knowledge

## Setup Steps

### 1. Install Tailwind CSS (Required by Constitution)

```bash
cd /path/to/word-finder
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure Tailwind** (`tailwind.config.js`):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Add Tailwind directives** (`src/index.css`):
```css
@tailwind base;
@tailwind components; 
@tailwind utilities;
```

### 2. Review Existing Component

**Location**: `src/components/WordFilter/SegmentInput.tsx`

**Current functionality**:
- Basic segment input (letters + length)
- Simple validation on letters field
- Remove button with basic constraints
- Inline styling (needs Tailwind conversion)

**Enhancement scope**:
- Real-time validation with immediate feedback
- Enhanced constraints (max 5 segments, max 10 length)
- Case normalization (convert to lowercase)
- Improved error display positioning

### 3. Examine Type Definitions

**File**: `src/types/wordFilter.ts`

**Key interface**:
```typescript
interface Segment {
  availableLetters: string;
  targetLength: number;
}
```

**No changes needed** - existing interface supports requirements.

## Implementation Checklist

### Phase 1: Validation Enhancement

- [ ] **Create validation utilities** (`src/utils/segmentValidation.ts`)
  - Letters validation (alphabetic only)
  - Length validation (1-10 range) 
  - Case normalization function
  - Collection validation (segment count 1-5)

- [ ] **Enhance SegmentInput component**
  - Add real-time validation on onChange
  - Implement case normalization
  - Update error display (below each segment)
  - Convert inline styles to Tailwind classes

### Phase 2: State Management

- [ ] **Update parent component integration**
  - Handle validation state in WordFilterForm
  - Implement segment count constraints
  - Add total length calculation display
  - Prevent search on validation errors

### Phase 3: UI/UX Polish

- [ ] **Error display enhancements**
  - Position errors below segments
  - Style with red color scheme
  - Add ARIA accessibility attributes
  - Ensure responsive design maintained

## Key Files to Modify

### Primary Changes
1. **`src/components/WordFilter/SegmentInput.tsx`**
   - Add real-time validation
   - Convert to Tailwind styling
   - Enhance error display

2. **`src/utils/segmentValidation.ts`** (New file)
   - Validation functions
   - Case normalization
   - Error message generation

### Secondary Changes  
3. **`src/components/WordFilter/WordFilterForm.tsx`**
   - Integrate validation state
   - Add segment count limits
   - Display total length calculation

4. **`src/types/wordFilter.ts`** (Minor additions)
   - Add validation error interfaces (optional)
   - Maintain backward compatibility

## Testing Strategy

### Manual Testing Scenarios

1. **Real-time validation**:
   - Type "abc123" in letters field → Error appears immediately
   - Type "0" in length field → Error appears immediately
   - Fix validation errors → Errors disappear immediately

2. **Case normalization**:
   - Type "AbC" in letters field → Displays as "abc"
   - Mixed case input → Always normalized to lowercase

3. **Segment constraints**:
   - Add segments until reaching 5 → Add button disables
   - Try to remove last segment → Remove button disabled/hidden

4. **Responsive design**:
   - Test on mobile viewport → Layout adapts appropriately
   - Test on tablet/desktop → Maintains usability

### Automated Testing (Optional)

```bash
# If using Vite testing
npm test -- --watch SegmentInput
```

**Key test cases**:
- Validation function unit tests
- Component rendering tests  
- User interaction tests (onChange, onRemove)
- Integration with parent component

## Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Code Implementation Order

1. **Validation utilities first** (pure functions, easy to test)
2. **Component enhancement** (integrate validation)
3. **Parent integration** (state management)
4. **Styling conversion** (Tailwind migration)
5. **Manual testing** (verify all requirements)

### 3. Verification Checklist

**Functional Requirements** (from spec):
- [x] FR-001: Add segments dynamically (max 5)
- [x] FR-002: Remove segments (except last one)  
- [x] FR-003: Input fields for letters and length
- [x] FR-004: Length validation (1-10 positive integers)
- [x] FR-005: Letters validation + lowercase conversion
- [x] FR-006: Real-time validation messages below segments
- [x] FR-007: Total length calculation display
- [x] FR-008: Total length above search button
- [x] FR-009: Prevent search with invalid data
- [x] FR-010: Maintain at least one segment
- [x] FR-011: Preserve data when adding/removing segments

## Common Issues & Solutions

### Issue 1: Tailwind Classes Not Applied
**Symptom**: Styles don't appear after Tailwind installation  
**Solution**: 
- Verify `tailwind.config.js` content paths
- Check `src/index.css` has Tailwind directives
- Restart development server after configuration

### Issue 2: Validation Not Triggering
**Symptom**: Error messages don't appear on invalid input  
**Solution**:
- Check onChange handlers are connected
- Verify validation functions return expected format
- Ensure error state is properly managed in component

### Issue 3: Case Normalization Not Working
**Symptom**: Mixed case letters remain mixed case  
**Solution**:
- Apply normalization in onChange handler
- Update input value with normalized result
- Test with `console.log` to verify function execution

### Issue 4: Performance Issues
**Symptom**: UI becomes sluggish with real-time validation  
**Solution**:
- Verify useMemo is used for derived calculations
- Check validation functions are efficient (no complex operations)
- Consider useCallback for stable event handlers

## Success Metrics

**Performance targets** (from spec):
- Validation feedback appears within 1 second
- Total length updates immediately
- UI remains responsive with 5 segments

**User experience**:
- 95% of test users create segments without errors
- No external documentation needed for operation
- Clear error messages guide users to correct input

## Next Steps After Implementation

1. **User testing** with actual word filtering scenarios
2. **Performance monitoring** in real usage conditions  
3. **Accessibility testing** with screen readers
4. **Code review** for compliance with constitution principles
5. **Documentation updates** reflecting new validation features

## Support Resources

- **React documentation**: https://react.dev
- **TypeScript handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS documentation**: https://tailwindcss.com/docs
- **Project constitution**: `.specify/memory/constitution.md`
- **Feature specification**: `specs/003-create-a-wordsegmentinput/spec.md`