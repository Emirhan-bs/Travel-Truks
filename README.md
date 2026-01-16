TravelTrucks – Camper Rental Platform

A modern and user-friendly camper rental platform built with React, Redux Toolkit and Vite.

🚐 About the Project

TravelTrucks is a web application where users can easily find, filter and book campers according to their needs.

✨ Core Features

🔍 Advanced Filtering System: Filter by location, vehicle type, features and transmission

💝 Favorites System: Add campers to your favorites

📱 Responsive Design: Works perfectly on all devices

🎨 Modern UI/UX: User-friendly interface based on Figma design

⚡ High Performance: Optimized build system with Vite

🔄 Redux State Management: Centralized and predictable state management

📅 Interactive Calendar: Custom date picker for booking

⭐ Rating System: User reviews and ratings

🔔 Toast Notifications: Instant feedback for user actions

🛠️ Technologies Used

React 18 – UI development

Redux Toolkit – State management

React Router DOM – Routing

Axios – HTTP requests

Vite – Build tool

React Hot Toast – Notifications

CSS Modules – Styling

📦 Installation

Clone the project:

git clone https://github.com/your-username/travel-trucks.git
cd travel-trucks


Install dependencies:

npm install


Start development server:

npm run dev


Open in browser:

http://localhost:5173

🚀 Production Build
npm run build
npm run preview

📁 Project Structure
travel-trucks/
├── public/
│   └── hero-bg.jpg
├── src/
│   ├── api/
│   │   └── campers.js          # API requests
│   ├── app/
│   │   └── store.js            # Redux store
│   ├── assets/
│   │   ├── icons/
│   │   │   └── symbol-defs.svg # SVG sprite
│   │   └── images/
│   ├── components/
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   └── Icon/
│   │       └── Icon.jsx
│   ├── features/
│   │   ├── campers/
│   │   │   └── campersSlice.js
│   │   ├── favorites/
│   │   │   └── favoritesSlice.js
│   │   └── filters/
│   │       └── filtersSlice.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx
│   │   └── CamperDetailsPage.jsx
│   ├── App.jsx
│   └── main.jsx
├── vercel.json                 # Vercel config
├── package.json
└── README.md

🔧 Configuration

API Endpoint:

// src/api/campers.js
baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io"

💡 How to Use

Home Page: Start with hero banner, go to catalog with “View Now”

Catalog: Search campers using filters on the left

Details Page: View camper details and gallery

Booking: Fill the form and select a date

Favorites: Add campers using the heart icon

🎯 Feature Details
Filtering System

Location: Search by city or country

Vehicle Type: Van, Fully Integrated, Alcove

Transmission: Automatic

Features: AC, Kitchen, TV, Bathroom, etc.

Loading Indicators

Loading state during API requests

Skeleton or placeholder UI

Disabled buttons while loading

Responsive Breakpoints

Mobile: < 768px

Tablet: 768px – 1024px

Desktop: > 1024px
👨‍💻 Developer

[Emirhan BUYUKSENİRLİ]

GitHub: [https://github.com/Emirhan-bs]

Email: emirhanbuyuksenirli@gmail.com

LinkedIn: www.linkedin.com/in/emirhan-buyuksenirli

🙏 Credits

MockAPI.io – API service

Unsplash – Images

Figma Community – Design