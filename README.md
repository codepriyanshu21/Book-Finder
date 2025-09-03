# 📚 Book Finder

A modern, responsive React application for discovering and exploring books using the Open Library API. Built with Vite, React, and Tailwind CSS for optimal performance and user experience.

## ✨ Features

- 🔍 **Smart Search**: Search for books by title, author, or subject
- 📖 **Detailed Book Information**: View comprehensive book details including cover images, authors, publication dates, and descriptions
- 🎨 **Modern UI**: Clean, responsive design with smooth animations and hover effects
- ⚡ **Fast Loading**: Optimized with Vite for lightning-fast development and builds
- 🔄 **Loading States**: Elegant loading spinners for better user experience
- 🚨 **Error Handling**: Graceful error handling with user-friendly messages
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: Open Library API
- **Development**: ESLint for code quality

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-finder
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
   Navigate to `http://localhost:5173` to see the application running.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
book-finder/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── BookCard.jsx          # Individual book card component
│   │   ├── BookDetails.jsx       # Detailed book information modal
│   │   ├── BookList.jsx          # Grid layout for book cards
│   │   ├── ErrorMessage.jsx      # Error message display
│   │   ├── LoadingSpinner.jsx    # Loading spinner component
│   │   ├── NoResultsMessage.jsx  # No search results message
│   │   └── SearchBar.jsx         # Search input component
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles and Tailwind imports
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎯 Key Components

### BookCard
- Displays book cover, title, author, and publication year
- Shows loading spinner while cover image loads
- Clickable to view detailed information
- Responsive design with hover effects

### BookDetails
- Modal overlay with comprehensive book information
- Large cover image with loading spinner
- Author, publisher, ISBN, subjects, and description
- Smooth animations and responsive layout

### SearchBar
- Real-time search input with Enter key support
- Loading state during search operations
- Clean, accessible design

### LoadingSpinner
- Reusable loading component
- Consistent styling across the application
- Used for both search operations and image loading

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### Vite Configuration
Build and development settings are configured in `vite.config.js`.

## 🌐 API Integration

The application integrates with the [Open Library API](https://openlibrary.org/developers/api) to:

- Search for books by various criteria
- Retrieve detailed book information
- Fetch book cover images
- Get author and publication data

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full grid layout with hover effects
- **Tablet**: Adjusted grid columns and spacing
- **Mobile**: Single column layout with touch-friendly interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Open Library](https://openlibrary.org/) for providing the book data API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the UI framework
