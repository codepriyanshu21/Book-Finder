import React, { useState } from 'react'
import BookList from './components/BookList'
import BookDetails from './components/BookDetails'
import ErrorMessage from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'
import NoResultsMessage from './components/NoResultsMessage'
import SearchBar from './components/SearchBar'
import AIPanel from './components/AIPanel'

const App = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAIPanel, setShowAIPanel] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }
      const data = await response.json()
      // Filter to only include books with cover images
      const filteredResults = (data.docs || []).filter(book => book.cover_i)
      setResults(filteredResults)
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBookClick = (book) => {
    setSelectedBook(book)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleCloseDetails = () => {
    setSelectedBook(null)
  }

  const handleOpenAIPanel = () => {
    setShowAIPanel(true)
  }

  const handleCloseAIPanel = () => {
    setShowAIPanel(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Book Finder</h1>
          <p className="text-gray-600">Discover your next great read</p>
        </header>
        <SearchBar
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          loading={loading}
          onKeyPress={handleKeyPress}
        />
        {error && <ErrorMessage error={error} />}
        {!loading && results.length === 0 && query && <NoResultsMessage query={query} />}
        {loading && <LoadingSpinner />}
        {!loading && results.length > 0 && (
          <BookList results={results} onBookClick={handleBookClick} />
        )}
        {selectedBook && (
          <BookDetails
            book={selectedBook}
            onClose={handleCloseDetails}
            loading={loading}
            error={error}
            onOpenAIPanel={handleOpenAIPanel}
          />
        )}
        {showAIPanel && selectedBook && (
          <AIPanel book={selectedBook} onClose={handleCloseAIPanel} />
        )}
      </div>
    </div>
  )
}

export default App
