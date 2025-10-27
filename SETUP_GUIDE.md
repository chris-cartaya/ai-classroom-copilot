# AI Classroom Co-Pilot - Setup Guide

This guide will help you set up and run the AI Classroom Co-Pilot frontend application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm**: Usually comes with Node.js
  - Verify installation: `npm --version`

## 🚀 Quick Start

### Step 1: Navigate to Project Directory

```bash
cd /path/to/ai-classroom-copilot
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- react (^18.2.0)
- react-dom (^18.2.0)
- react-router-dom (^6.20.0)
- react-scripts (for development)

### Step 3: Start Development Server

```bash
npm start
```

The application will automatically open in your default browser at:
```
http://localhost:3000
```

If it doesn't open automatically, manually navigate to the URL above.

## 🛠️ Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.
- Open http://localhost:3000 to view it in your browser
- The page will reload when you make changes
- You will see lint errors in the console

### `npm run build`
Builds the app for production to the `build` folder.
- Correctly bundles React in production mode
- Optimizes the build for best performance
- The build is minified and filenames include hashes

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## 📁 Project Structure Overview

```
ai-classroom-copilot/
├── public/                 # static files
│   ├── index.html         # html template
│   └── manifest.json      # pwa manifest
├── src/                   # source code
│   ├── components/        # reusable components
│   ├── pages/            # page components
│   ├── App.js            # main app component
│   ├── App.css           # app styles
│   ├── index.js          # entry point
│   └── index.css         # global styles
├── package.json          # dependencies and scripts
├── README.md            # project documentation
└── SETUP_GUIDE.md       # this file
```

## 🎨 Features to Test

### 1. Classroom Copilot Page
- Type a question in the textarea
- Click "Ask Question" button
- View the AI response with citations
- Check conversation history

### 2. Course Materials Page
- Switch to "Instructor" role
- Try drag-and-drop file upload
- Click "Browse Files" to select files
- View uploaded files list
- Test file deletion

### 3. Account Settings Page
- Update profile information
- Switch between Light/Dark theme
- Adjust font size
- Change notification preferences

### 4. Role Switching
- Toggle between Student and Instructor roles
- Notice how Course Materials page changes based on role

## 🔧 Troubleshooting

### Port 3000 Already in Use

If you see an error that port 3000 is already in use:

```bash
# Option 1: Kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Use a different port
PORT=3001 npm start
```

### Module Not Found Errors

If you see "Module not found" errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### React Scripts Not Found

If `react-scripts` is not found:

```bash
npm install --save-dev react-scripts
```

## 🌐 Browser Compatibility

The application is tested and works on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

## 📱 Mobile Testing

To test on mobile devices:

1. Find your computer's local IP address:
   ```bash
   # macOS/Linux:
   ifconfig | grep "inet "
   
   # Windows:
   ipconfig
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. On your mobile device, navigate to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

## 🔗 Backend Integration

This frontend is designed to work with a FastAPI backend. To connect:

1. Update API endpoints in the following files:
   - `src/pages/ClassroomCopilot.js` (line ~45)
   - `src/pages/CourseMaterials.js` (line ~85)
   - `src/pages/AccountSettings.js` (line ~75)

2. Replace mock API calls with actual fetch requests

3. Ensure CORS is configured on the backend:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

## 📊 Performance Tips

1. **Production Build**: Always use `npm run build` for production
2. **Code Splitting**: React Router automatically splits code by route
3. **Image Optimization**: Compress images before adding to project
4. **Lazy Loading**: Consider lazy loading components for better performance

## 🐛 Common Issues

### Issue: Blank Page After Build
**Solution**: Check that your server is configured to serve the index.html for all routes

### Issue: Styles Not Loading
**Solution**: Clear browser cache and rebuild: `npm run build`

### Issue: Router Not Working
**Solution**: Ensure BrowserRouter is properly configured in App.js

## 📞 Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the code comments (all in lowercase)
3. Check browser console for error messages
4. Verify all dependencies are installed correctly

## 🎯 Next Steps

After setup:
1. Familiarize yourself with the codebase
2. Test all features and pages
3. Customize colors and branding if needed
4. Integrate with backend API
5. Deploy to production environment

## 📝 Development Workflow

1. **Make Changes**: Edit files in `src/` directory
2. **See Changes**: Development server auto-reloads
3. **Test**: Verify functionality in browser
4. **Commit**: Use git to track changes
5. **Build**: Create production build when ready
6. **Deploy**: Deploy build folder to hosting service

---

**Happy Coding! 🚀**