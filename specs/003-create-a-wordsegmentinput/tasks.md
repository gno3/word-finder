# Tasks: WordSegmentInput Component Enhancement

**Input**: Design documents from `/specs/003-create-a-wordsegmentinput/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the specification - focusing on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Tailwind CSS setup required by constitution

- [x] T001 Install Tailwind CSS dependencies: `npm install -D tailwindcss postcss autoprefixer`
- [x] T002 Initialize Tailwind configuration: `npx tailwindcss init -p` and configure content paths
- [x] T003 [P] Add Tailwind directives to src/index.css (@tailwind base; @tailwind components; @tailwind utilities;)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create segment validation utilities in src/utils/segmentValidation.ts (validateAvailableLetters, validateTargetLength, normalizeLetters)
- [x] T005 [P] Create segment collection validation utilities in src/utils/segmentValidation.ts (validateSegmentCount, isCollectionValid)
- [x] T006 [P] Add validation interfaces to src/types/wordFilter.ts (SegmentValidationState, ValidationError extensions)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Segment Management (Priority: P1) 🎯 MVP

**Goal**: Enable users to define single word segment with letters and length, including basic validation and search integration

**Independent Test**: User can enter "abc" in letters field, "3" in length field, create segment, and search executes with constraints

### Implementation for User Story 1

- [x] T007 [P] [US1] Enhance SegmentInput component validation in src/components/WordFilter/SegmentInput.tsx (add real-time validation, case normalization, length vs letters validation)
- [x] T008 [P] [US1] Convert SegmentInput component styling from inline to Tailwind CSS classes in src/components/WordFilter/SegmentInput.tsx
- [x] T009 [US1] Add error message display below segment inputs in src/components/WordFilter/SegmentInput.tsx (position errors per clarification)
- [x] T010 [US1] Integrate validation state with parent WordFilterForm in src/components/WordFilter/WordFilterForm.tsx
- [x] T011 [US1] Add ARIA accessibility attributes to SegmentInput in src/components/WordFilter/SegmentInput.tsx (aria-describedby, aria-invalid, aria-required)
- [x] T011a [US1] Implement field reordering: Available Letters left, Target Length right in src/components/WordFilter/SegmentInput.tsx
- [x] T011b [US1] Update input icons: document icon for Available Letters, hash icon for Target Length in src/components/WordFilter/SegmentInput.tsx
- [x] T011c [US1] Standardize input field heights (h-12) for visual consistency in src/components/WordFilter/SegmentInput.tsx
- [x] T011d [US1] Update help text from "Pool of letters" to "Possible letters" in src/components/WordFilter/SegmentInput.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 4 - Input Validation and Error Feedback (Priority: P2)

**Goal**: Provide comprehensive real-time validation with clear error messages for invalid inputs

**Independent Test**: User enters "abc123" in letters field and sees immediate error, enters "0" in length field and sees immediate error, search is prevented with invalid data

### Implementation for User Story 4

- [x] T012 [P] [US4] Implement real-time validation triggers in src/components/WordFilter/SegmentInput.tsx (onChange handlers with immediate validation)
- [x] T013 [P] [US4] Add length constraint validation (1-10 range) in src/components/WordFilter/SegmentInput.tsx
- [x] T014 [US4] Implement search prevention logic when validation errors exist in src/components/WordFilter/WordFilterForm.tsx
- [x] T015 [US4] Add validation error styling with Tailwind classes in src/components/WordFilter/SegmentInput.tsx (red-600 bg-red-50 border-red-200)
- [x] T015a [US4] Add length vs letters validation rule in src/components/WordFilter/SegmentInput.tsx (prevent target length > available letters)

**Checkpoint**: At this point, User Stories 1 AND 4 should both work independently with comprehensive validation

---

## Phase 5: User Story 2 - Multiple Segment Creation (Priority: P2)

**Goal**: Enable users to add multiple segments (up to 5) with independent state management

**Independent Test**: User can add multiple segments, enter different values in each, verify each maintains independent state, search applies all constraints

### Implementation for User Story 2

- [ ] T016 [P] [US2] Add segment count constraint (maximum 5) to WordFilterForm in src/components/WordFilter/WordFilterForm.tsx
- [ ] T017 [P] [US2] Implement addSegment functionality with validation in src/components/WordFilter/WordFilterForm.tsx
- [ ] T018 [US2] Add "Add Segment" button with disabled state at maximum in src/components/WordFilter/WordFilterForm.tsx
- [ ] T019 [US2] Implement independent segment state management in src/components/WordFilter/WordFilterForm.tsx (preserve data when adding segments)

**Checkpoint**: At this point, User Stories 1, 2, AND 4 should all work independently

---

## Phase 6: User Story 3 - Segment Removal and Total Length Display (Priority: P3)

**Goal**: Enable segment removal (except last one) and display total word length calculation above search button

**Independent Test**: User can remove segments (but not last one), total length displays and updates correctly (e.g., segments with lengths 3,4,2 show "Total Word Length: 9")

### Implementation for User Story 3

- [ ] T020 [P] [US3] Implement removeSegment functionality with constraint (cannot remove last) in src/components/WordFilter/WordFilterForm.tsx
- [ ] T021 [P] [US3] Add total length calculation using useMemo in src/components/WordFilter/WordFilterForm.tsx
- [x] T022 [US3] Display total word length above search button in src/components/WordFilter/WordFilterForm.tsx
- [x] T022a [US3] Position total word length display above search button in src/components/WordFilter/WordFilterForm.tsx (integrate with existing search button layout)
- [x] T022b [US3] Move word count display to Filter Results header in src/components/WordFilter/FilterResults.tsx (enhance results presentation)
- [ ] T023 [US3] Update remove button state based on segment count in src/components/WordFilter/SegmentInput.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final integration

- [ ] T024 [P] Performance optimization: Add useCallback for stable event handlers in src/components/WordFilter/SegmentInput.tsx
- [ ] T025 [P] Performance optimization: Add useMemo for derived validation state in src/components/WordFilter/WordFilterForm.tsx
- [ ] T026 [P] Accessibility testing: Verify screen reader compatibility and keyboard navigation
- [ ] T027 [P] Responsive design testing: Verify component works on mobile, tablet, and desktop viewports
- [ ] T028 Code cleanup: Remove unused CSS classes and ensure Tailwind migration is complete
- [ ] T029 Run quickstart.md validation scenarios to verify all requirements are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2/P4 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 validation but is independently testable
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1/US2 but should be independently testable

### Within Each User Story

- Core component enhancements before integration
- Styling conversion can happen in parallel with logic changes
- Parent component integration after individual component enhancements
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Component styling and logic changes marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch component enhancements for User Story 1 together:
Task: "Enhance SegmentInput component validation in src/components/WordFilter/SegmentInput.tsx"
Task: "Convert SegmentInput component styling from inline to Tailwind CSS classes in src/components/WordFilter/SegmentInput.tsx"

# Then integrate:
Task: "Add error message display below segment inputs in src/components/WordFilter/SegmentInput.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (Tailwind CSS installation)
2. Complete Phase 2: Foundational (validation utilities)
3. Complete Phase 3: User Story 1 (basic segment with validation)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - users can create single segments with validation

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - basic segment validation!)
3. Add User Story 4 → Test independently → Deploy/Demo (Enhanced validation feedback)
4. Add User Story 2 → Test independently → Deploy/Demo (Multiple segments support)
5. Add User Story 3 → Test independently → Deploy/Demo (Full feature with total length)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (basic functionality)
   - Developer B: User Story 4 (validation enhancements)
   - Developer C: User Story 2 (multiple segments)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files/sections, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Component enhancement approach (not new component creation)
- Focus on existing SegmentInput.tsx component enhancement
- Tailwind CSS migration required by project constitution
- Real-time validation per clarification requirements
- Maximum 5 segments, maximum 10 characters per segment per clarifications
- Case normalization to lowercase per clarifications
- Error display below each segment per clarifications