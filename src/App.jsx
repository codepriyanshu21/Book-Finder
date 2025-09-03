import  { useState } from 'react'
import SearchBar from './components/SearchBar'
import BookList from './components/BookList'
import ErrorMessage from './components/ErrorMessage'
import LoadingSpinner from './components/LoadingSpinner'
import NoResultsMessage from './components/NoResultsMessage'
import BookDetails from './components/BookDetails'

const App = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedBook, setSelectedBook] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')

  const searchBooks = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      const data = await response.json()
      setResults(data.docs || [])
    } catch (err) {
      setError(err.message || 'An error occurred while searching')
    } finally {
      setLoading(false)
    }
  }

  const fetchBookDetails = async (book) => {
    setSelectedBook(null)
    setDetailsLoading(true)
    setDetailsError('')

    try {
      // Fetch more details using the book key
      const response = await fetch(`https://openlibrary.org${book.key}.json`)
      if (!response.ok) {
        throw new Error('Failed to fetch book details')
      }
      const data = await response.json()
      // Merge the original book data with the detailed data
      setSelectedBook({ ...book, ...data })
    } catch (err) {
      setDetailsError(err.message || 'An error occurred while fetching book details')
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchBooks()
    }
  }

  const handleBookClick = (book) => {
    fetchBookDetails(book)
  }

  const closeDetails = () => {
    setSelectedBook(null)
    setDetailsError('')
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
          onSearch={searchBooks}
          loading={loading}
          onKeyPress={handleKeyPress}
        />

        {error && <ErrorMessage error={error} />}

        {loading && <LoadingSpinner />}

        <BookList results={results} onBookClick={handleBookClick} />

        {results.length === 0 && !loading && !error && query && <NoResultsMessage query={query} />}

        <BookDetails
          book={selectedBook}
          onClose={closeDetails}
          loading={detailsLoading}
          error={detailsError}
        />
      </div>
    </div>
  )
}

export default App
