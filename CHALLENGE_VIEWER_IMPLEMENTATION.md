# Challenge Viewer Implementation

## Overview
Added a PDF challenge viewer that displays specific pages from the challenges.pdf file on the left side of the screen.

## Features
- **Level Selection**: Dropdown menu to select any challenge level
- **Navigation**: Previous/Next buttons to move between challenges
- **Toggle Visibility**: Button to show/hide the challenge viewer
- **Responsive**: PDF pages scale to fit the viewer

## Components Added

### ChallengeViewer.tsx
- Displays a specific page from challenges.pdf
- Handles PDF loading and error states
- Provides level navigation controls

### ChallengeViewer.css
- Styled overlay positioned on the left side
- Clean, modern UI with rounded corners and shadows
- Responsive button and dropdown styles

## Dependencies
- `react-pdf`: PDF rendering library
- `pdfjs-dist`: PDF.js core library (Mozilla's PDF renderer)

## Usage
The challenge viewer is integrated into the main App component:
- Shows by default on app load
- Toggle button in bottom-left corner
- Automatically detects number of pages in PDF
- Remembers selected level when toggling visibility

## File Structure
```
src/
  components/
    ChallengeViewer.tsx    # Main component
    ChallengeViewer.css    # Styles
  assets/
    challenges.pdf         # Challenge pages
  vite-env.d.ts           # TypeScript declarations for PDF imports
```

## How It Works
1. PDF is imported as a static asset
2. react-pdf renders the selected page number
3. User can navigate between pages using dropdown or buttons
4. PDF.js worker handles rendering in background thread
