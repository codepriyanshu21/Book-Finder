import  { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

const BookCard = ({ book, index, onClick }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = (e) => {
    setIsLoading(false)
    setHasError(true)
    e.target.style.display = 'none'
    e.target.nextSibling.style.display = 'flex'
  }

  return (
    <div
      key={book.key || index}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <div className="bg-gray-200 h-48 flex items-center justify-center relative">
        {book.cover_i && !hasError && (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <LoadingSpinner />
              </div>
            )}
            <img
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
              alt={book.title}
              className={`w-full h-full object-cover ${isLoading ? 'invisible' : 'visible'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        )}
        <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold" style={{display: book.cover_i && !hasError ? 'none' : 'flex'}}>
          No Cover
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
        </p>
        <p className="text-gray-500 text-xs">
          {book.first_publish_year && `Published: ${book.first_publish_year}`}
        </p>
        {book.subject && book.subject.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">Subjects:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {book.subject.slice(0, 3).map((subj, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {subj}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookCard
