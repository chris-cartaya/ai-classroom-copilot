# AI Classroom Co-Pilot - Frontend GUI

A modern, accessible React-based frontend for the AI Classroom Co-Pilot system. This interface allows students and instructors to interact with an AI assistant that answers questions based on course materials.

## 🎨 Design Features

- **Color Scheme**: Cobalt blue (#0047AB) header with green (#28a745) accent buttons, matching the reference design
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG compliant with keyboard navigation, screen reader support, and high contrast
- **Theme Support**: Light and dark mode options (NFR-18)
- **Font Customization**: Adjustable font sizes for better readability (NFR-18)

## 📋 Pages Included

### 1. Classroom Copilot (Main Chat Interface)
- Natural language question input with textarea
- AI-generated answers with citations (FR-1.3)
- Conversation history display
- Confidence scores for answers
- Real-time response loading states

### 2. Course Materials
- File upload interface with drag-and-drop support (FR-2)
- Supported formats: PPTX, PDF, DOCX
- File management (view, delete)
- Upload progress indicators
- Status badges (processed, processing, error)
- Instructor-only access for uploads (NFR-5)

### 3. Account Settings
- Profile information management
- Role switching (Student/Instructor)
- Theme customization (Light/Dark)
- Font size adjustment
- Password change functionality
- Notification preferences

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Install Dependencies**
   ```bash
   npm install react react-dom react-router-dom
   npm install --save-dev react-scripts
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```
   Creates an optimized production build in the `build` folder

## 📁 Project Structure

```
src/
├── components/          # reusable ui components
│   ├── Header.js       # navigation header with purple background
│   ├── Header.css
│   ├── Button.js       # reusable button component
│   ├── Button.css
│   ├── Card.js         # content container component
│   ├── Card.css
│   ├── Input.js        # text input component
│   ├── Input.css
│   ├── TextArea.js     # multi-line text input
│   └── TextArea.css
├── pages/              # main application pages
│   ├── ClassroomCopilot.js    # main chat interface
│   ├── ClassroomCopilot.css
│   ├── CourseMaterials.js     # file upload page
│   ├── CourseMaterials.css
│   ├── AccountSettings.js     # user settings page
│   └── AccountSettings.css
├── App.js              # main application component with routing
├── App.css             # global application styles
├── index.js            # application entry point
└── index.css           # global css variables and reset
```

## 🎯 Features Implementation

### Must-Have Features (Implemented)
- ✅ **FR-1**: Question input and AI response display
- ✅ **FR-1.3**: Citations with source references (Module X, Slide Y)
- ✅ **FR-2**: File upload interface for instructors
- ✅ **FR-4**: Simple, intuitive web interface
- ✅ **FR-5**: Graceful error handling with informative messages

### Non-Functional Requirements (Implemented)
- ✅ **NFR-5**: Instructor-only file upload access
- ✅ **NFR-14**: Intuitive interface for first-time users
- ✅ **NFR-15**: Minimal training required
- ✅ **NFR-16**: Readable fonts, consistent contrast, responsive design
- ✅ **NFR-17**: Screen reader and keyboard navigation support
- ✅ **NFR-18**: Font size and theme customization
- ✅ **NFR-19**: 100% of answers include citations
- ✅ **NFR-20**: Clear citation display

## 🎨 Color Palette

```css
--primary-purple: #4B0082      /* main header and primary actions */
--primary-purple-dark: #3a0066  /* hover states */
--primary-purple-light: #6a0dad /* accents */
--accent-green: #28a745         /* success actions and buttons */
--accent-green-hover: #218838   /* green hover state */
--background-white: #ffffff     /* card backgrounds */
--background-gray: #f5f5f5      /* page background */
--text-dark: #333333            /* primary text */
--text-light: #666666           /* secondary text */
--border-gray: #dddddd          /* borders and dividers */
--error-red: #dc3545            /* error messages */
--warning-yellow: #ffc107       /* warnings */
```

##  Responsive Breakpoints

- **Desktop**: > 768px (full layout)
- **Tablet**: 481px - 768px (adjusted layout)
- **Mobile**: ≤ 480px (stacked layout)

##  Accessibility Features

- Semantic HTML5 elements (header, nav, main, footer)
- ARIA labels and roles for screen readers
- Keyboard navigation support (Tab, Enter, Escape)
- Focus indicators for interactive elements
- Skip to main content link
- High contrast color ratios (WCAG AA compliant)
- Responsive touch targets (min 44x44px)
- Reduced motion support for animations

##  Testing Recommendations

1. **Browser Compatibility**: Test in Chrome, Firefox, Edge, Safari
2. **Responsive Design**: Test on various screen sizes
3. **Accessibility**: Use screen readers (NVDA, JAWS, VoiceOver)
4. **Keyboard Navigation**: Navigate without mouse
5. **Performance**: Check load times and responsiveness

##  Code Comments

All code includes detailed comments explaining:
- Component purpose and functionality
- State management logic
- Event handlers and their behavior
- API integration points
- Accessibility considerations
- Responsive design decisions

##  Future Enhancements

- Chat history persistence (Could-Have)
- Real-time collaboration features
- Advanced analytics dashboard
- Mobile app version
- Multi-language support
- Voice input for questions



##  Team

Developed by the AI Classroom Co-Pilot team for the Fall 2025 semester.

---

**Note**: This is a frontend prototype. Backend API integration is required for full functionality. Mock data is used for demonstration purposes.