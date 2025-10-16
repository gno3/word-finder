# Feature Specification: WordSegmentInput Component

**Feature Branch**: `003-create-a-wordsegmentinput`  
**Created**: October 16, 2025  
**Status**: Draft  
**Input**: User description: "Create a WordSegmentInput component that allows users to add/remove word segments, where each segment has inputs for available letters (string) and segment length (number). Add validation to ensure segment length is a positive integer and letters input only contains alphabetic characters. Display the total word length as the sum of all segment lengths above the search button."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Segment Management (Priority: P1)

A user wants to define a single word segment with specific letters and length to search for matching words. They need to input available letters for that segment and specify how long that segment should be.

**Why this priority**: This is the core functionality that delivers immediate value - users can define basic word constraints and perform searches.

**Independent Test**: Can be fully tested by adding one segment with valid inputs and verifying the search functionality works, delivering basic word filtering capability.

**Acceptance Scenarios**:

1. **Given** the word filter interface is displayed, **When** user enters "abc" in the letters field and "3" in the length field, **Then** a single segment is created with those values
2. **Given** a segment exists with valid data, **When** user clicks the search button, **Then** the search executes using the segment constraints
3. **Given** no segments exist, **When** user views the interface, **Then** one empty segment is displayed by default

---

### User Story 2 - Multiple Segment Creation (Priority: P2)

A user wants to define multiple word segments to search for words with complex patterns, such as a 4-letter segment followed by a 3-letter segment.

**Why this priority**: Enables advanced word pattern matching which significantly expands the utility beyond basic single-segment searches.

**Independent Test**: Can be tested by adding multiple segments with different constraints and verifying each segment maintains its own state independently.

**Acceptance Scenarios**:

1. **Given** one segment exists, **When** user clicks "Add Segment", **Then** a new empty segment appears below the existing one
2. **Given** multiple segments exist, **When** user enters different letters and lengths in each, **Then** each segment maintains its own values independently
3. **Given** multiple segments with valid data, **When** user initiates search, **Then** all segment constraints are applied to the word search

---

### User Story 3 - Segment Removal and Total Length Display (Priority: P3)

A user wants to remove unwanted segments and see the total expected word length to understand the scope of their search pattern.

**Why this priority**: Provides essential management capabilities and helpful feedback, but the core search functionality works without these features.

**Independent Test**: Can be tested by creating multiple segments, removing some, and verifying the total length calculation updates correctly.

**Acceptance Scenarios**:

1. **Given** multiple segments exist, **When** user clicks "Remove" on a segment, **Then** that segment is deleted and remaining segments remain intact
2. **Given** segments with lengths 3, 4, and 2, **When** user views the interface, **Then** "Total Word Length: 9" is displayed above the search button
3. **Given** one segment remains, **When** user tries to remove it, **Then** the removal is prevented (at least one segment must exist)

---

### User Story 4 - Input Validation and Error Feedback (Priority: P2)

A user enters invalid data (negative numbers, non-alphabetic characters) and receives clear feedback about what needs to be corrected.

**Why this priority**: Essential for usability and preventing invalid searches, but search functionality can work without comprehensive validation.

**Independent Test**: Can be tested by entering various invalid inputs and verifying appropriate error messages appear without breaking the interface.

**Acceptance Scenarios**:

1. **Given** a segment exists, **When** user enters "abc123" in the letters field, **Then** an error message appears indicating only alphabetic characters are allowed
2. **Given** a segment exists, **When** user enters "-2" or "0" in the length field, **Then** an error message appears indicating length must be a positive integer
3. **Given** invalid data exists in any segment, **When** user attempts to search, **Then** the search is prevented until all validation errors are resolved

---

### Edge Cases

- What happens when a user tries to remove the last remaining segment?
- How does the system handle extremely large segment lengths (e.g., 1000)? (Resolved: Maximum 10 characters per segment)
- What occurs when a user enters mixed case letters (e.g., "AbC")? (Resolved: Convert to lowercase)
- How does the system respond to empty letters field with valid length?
- What happens when the total word length exceeds reasonable limits?
- What happens when target length exceeds available letters count? (Resolved: Display error message preventing invalid constraint)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add new word segments dynamically (maximum 5 segments)
- **FR-002**: System MUST allow users to remove existing word segments except when only one remains (maintain at least one segment at all times)
- **FR-003**: System MUST provide input fields for available letters (positioned left) and segment length (positioned right) for each segment with improved visual flow
- **FR-004**: System MUST validate that segment length is a positive integer (greater than 0 and maximum 10)
- **FR-005**: System MUST validate that letters input contains only alphabetic characters (a-z, A-Z) and convert all letters to lowercase for consistency
- **FR-011**: System MUST validate that target length does not exceed the number of available letters and display appropriate error message
- **FR-006**: System MUST display validation error messages immediately as user types invalid inputs (real-time validation) below each segment
- **FR-007**: System MUST display word count results in the Filter Results section header when results are available
- **FR-008**: System MUST position the total word length display above the search button
- **FR-009**: System MUST prevent search execution when any segment contains invalid data
- **FR-010**: System MUST preserve existing segment data when adding or removing other segments

### Key Entities

- **Word Segment**: Represents a portion of a word with available letters and required length
- **Segment Collection**: Contains all user-defined segments with validation state and total length calculation
- **Validation Result**: Captures validation errors for letters and length fields per segment

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create and manage multiple word segments in under 30 seconds
- **SC-002**: Invalid input validation provides feedback within 1 second of user entry
- **SC-003**: Total word length calculation updates immediately when segment lengths change
- **SC-004**: 95% of users successfully create multi-segment patterns without encountering errors
- **SC-005**: Search functionality remains responsive with up to 5 word segments defined
- **SC-006**: Users can complete segment definition and validation without requiring external help or documentation

## Clarifications

### Session 2025-10-16

- Q: When should validation error messages appear for invalid inputs? → A: Immediately as user types (real-time validation)
- Q: What is the maximum number of segments users should be able to create? → A: 5 segments maximum (simpler interface, faster processing)
- Q: How should the system handle mixed case letters (e.g., "AbC") in the letters input field? → A: Convert all letters to lowercase for consistency
- Q: What is the maximum length allowed for a single word segment? → A: 10 character limit per segment
- Q: What should the help text display for available letters input? → A: "Possible letters" (simplified from original "Pool of letters")
- Q: What happens when target length exceeds available letters count? → A: Display error message preventing invalid constraint with specific counts

## Assumptions

- Users will primarily define 1-5 word segments for most search scenarios
- Alphabetic character validation will accept both uppercase and lowercase letters
- Segment length will typically range from 1-10 characters for common word patterns (per maximum constraint)
- Users expect immediate visual feedback for validation errors
- The component integrates with existing word filter search functionality
- Default state includes one empty segment to guide user interaction
