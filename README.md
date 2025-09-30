# Recipe Ideas 🍳

**Perfect platform for anyone who love to explore new recipies!**

A modern, interactive web application that helps busy professionals discover amazing recipes based on ingredients they have at home. Built with React, Vite, and Tailwind CSS, powered by TheMealDB API.

![Recipe Ideas App](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

# Live
Live : ![Recipe Ideas](https://recipe-ideas-mocha.vercel.app/)

## ✨ Features

### 🔍 **Smart Recipe Search**
- Search recipes by ingredients you have at home
- Intelligent suggestions for popular ingredients
- Search history for quick access to recent searches

### ⏰ **Time-Conscious Filtering**
- Quick meals (15 minutes or less)
- Medium prep (30 minutes)
- Weekend projects (1+ hour)
- Perfect for busy schedule

### 🧑🏻‍🍳 **Personal Recipe Collection**
- Save favorite recipes for later
- Persistent storage using localStorage
- Quick access to your saved recipes

### 📱 **Modern, Responsive Design**
- Beautiful, interactive UI with smooth animations
- Mobile-first responsive design
- Intuitive user experience with visual feedback

### 🍽️ **Detailed Recipe Information**
- Complete ingredient lists with measurements
- Step-by-step cooking instructions
- Links to video tutorials (when available)
- Cuisine types and difficulty levels

### 🎯 **Personalized for Busy Professionals**
- Quick ingredient suggestions
- Time-based meal planning
- Easy-to-follow instructions
- Professional-friendly interface

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd Recipe_Ideas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the app in action!

## 🛠️ Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## 🌐 Live Demo

✨ **Deployed on Vercel** - Lightning-fast performance and global CDN!

**Other deployment platforms:**
- [CodeSandbox](https://codesandbox.io) - Perfect for quick demos
- [StackBlitz](https://stackblitz.com) - Great for sharing
- [Netlify](https://netlify.com) - Easy deployment

### Quick Deploy to CodeSandbox:
1. Go to [CodeSandbox](https://codesandbox.io)
2. Click "Create Sandbox"
3. Select "Upload files" and drag your project folder
4. The app will automatically build and run!

## 🔧 Technology Stack

### Frontend Framework
- **React 18.2.0** - Modern React with hooks and functional components
- **Vite 5.2.0** - Lightning-fast build tool and dev server
- **JavaScript (ES6+)** - Modern JavaScript features

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Custom animations** - Smooth, engaging user interactions

### API & Data
- **TheMealDB API** - Free recipe database
- **Axios** - HTTP client for API requests
- **localStorage** - Persistent favorites storage

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixes

## 📁 Project Structure

```
Recipe_Ideas/
├── public/
├── src/
│   ├── components/
│   │   ├── RecipeSearch.jsx     # Search input and suggestions
│   │   ├── RecipeGrid.jsx       # Recipe cards grid layout
│   │   ├── RecipeModal.jsx      # Detailed recipe view
│   │   ├── FilterPanel.jsx      # Time and difficulty filters
│   │   └── LoadingSpinner.jsx   # Loading states
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # React app entry point
│   └── index.css              # Global styles and Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Design Features

### Color Palette
- **Primary Orange** (#FF6B35) - Action buttons and highlights
- **Warm Yellow** (#F7931E) - Accent colors and gradients
- **Fresh Green** (#4ECDC4) - Success states and quick actions
- **Cool Blue** (#45B7D1) - Information and links
- **Professional Gray** - Text and subtle elements

### User Experience
- **Smooth animations** - Fade-ins, slides, and hover effects
- **Visual feedback** - Loading states, hover effects, and transitions
- **Intuitive navigation** - Clear calls-to-action and logical flow
- **Accessibility** - Proper contrast ratios and semantic HTML

## 🍳 How to Use

### For Individual (and other busy professionals):

1. **Quick Start**: Enter an ingredient you have (like "chicken" or "tomato")
2. **Filter by Time**: Choose how much time you have to cook
3. **Browse Results**: Click any recipe card to see full details
4. **Save Favorites**: Heart icon to save recipes for later
5. **Get Cooking**: Follow the step-by-step instructions

### Pro Tips:
- Use common ingredients for better results
- Check the "Recent searches" for quick access
- Save recipes during meal planning sessions
- Use video links for visual cooking guidance

## 🔗 API Reference

This app uses **TheMealDB API** - a free recipe database:

- **Search by Ingredient**: `https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}`
- **Recipe Details**: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={mealId}`
- **Documentation**: [TheMealDB API Docs](https://www.themealdb.com/api.php)

## 🚀 Deployment Guide

### Vercel (Recommended - Currently Deployed! ✨)
1. Connect your GitHub repository to [vercel.com](https://vercel.com)
2. Import your `Recipe_Ideas` repository
3. Vercel auto-detects Vite configuration
4. Deploy with zero configuration!
5. Get automatic deployments on every Git push

**Benefits of Vercel:**
- ⚡ Global CDN for lightning-fast loading
- 🔄 Automatic deployments from GitHub
- 📊 Performance analytics
- 🌍 Edge functions for optimal performance

### CodeSandbox (Quick Demo)
1. Visit [codesandbox.io](https://codesandbox.io)
2. Click "Create Sandbox" → "Upload files"
3. Drag your project folder
4. Share the generated URL

### StackBlitz (Instant Development)
1. Visit [stackblitz.com](https://stackblitz.com)
2. Click "Create project" → "Upload files"
3. Your app will be live instantly!

### Netlify (Alternative Production)
1. Build the project: `npm run build`
2. Drag the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
3. Get your live URL

## 🔮 Future Enhancements

- **Meal Planning**: Weekly meal planning features
- **Shopping Lists**: Auto-generate shopping lists from recipes
- **Nutritional Info**: Calorie and nutrition tracking
- **Recipe Scaling**: Adjust serving sizes automatically
- **Social Features**: Share recipes with friends
- **Offline Support**: Cache favorite recipes for offline viewing

## 👨‍💻 Development Notes

### Built with Modern Best Practices
- **Component-based architecture** - Reusable, maintainable components
- **Custom hooks** - Shared logic and state management
- **Error boundaries** - Graceful error handling
- **Performance optimization** - Lazy loading and efficient re-renders
- **Mobile-first design** - Responsive across all devices

### Code Quality
- ESLint configuration for consistent code style
- Modular CSS with Tailwind utilities
- Semantic HTML for accessibility
- Error handling for robust user experience

## 🤝 Contributing

This project was built as a coding challenge, but improvements are welcome!

### Ideas for contributions:
- Add more filter options
- Improve recipe parsing
- Add unit tests
- Enhance accessibility
- Optimize for performance

## 🙏 Acknowledgments

- **TheMealDB** - For providing the free recipe API
- **Lucide** - For the beautiful icon set
- **Tailwind CSS** - For the utility-first CSS framework
- **Vite Team** - For the amazing build tool

---

*Ready to start cooking? Run `npm run dev` and discover your next favorite recipe!* 🍽️
