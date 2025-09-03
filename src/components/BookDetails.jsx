import React, { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

const BookDetails = ({ book, onClose, loading, error, onOpenAIPanel }) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  if (!book) return null

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = (e) => {
    setImageLoading(false)
    setImageError(true)
    e.target.src = "https://via.placeholder.com/400x600/cccccc/000000?text=No+Cover"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading book details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">Error loading book details: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {/* Cover Image */}
              <div className="flex justify-center mb-4 relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg shadow-md">
                    <LoadingSpinner />
                  </div>
                )}
                <img
                  src={book.cover_i && !imageError ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : "https://via.placeholder.com/400x600/cccccc/000000?text=No+Cover"}
                  alt={book.title}
                  className={`max-w-xs rounded-lg shadow-md ${imageLoading ? 'invisible' : 'visible'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Author(s)</h3>
                  <p className="text-gray-600">
                    {book.author_name ? book.author_name.join(', ') : 'Unknown'}
                  </p>
                </div>

                {book.first_publish_year && (
                  <div>
                    <h3 className="font-semibold text-gray-700">First Published</h3>
                    <p className="text-gray-600">{book.first_publish_year}</p>
                  </div>
                )}

                {book.number_of_pages_median && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Pages</h3>
                    <p className="text-gray-600">{book.number_of_pages_median}</p>
                  </div>
                )}

                {book.publisher && book.publisher.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Publisher</h3>
                    <p className="text-gray-600">{book.publisher[0]}</p>
                  </div>
                )}
              </div>

              {/* ISBN */}
              {book.isbn && book.isbn.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700">ISBN</h3>
                  <p className="text-gray-600">{book.isbn[0]}</p>
                </div>
              )}

              {/* Subjects */}
              {book.subject && book.subject.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700">Subjects</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {book.subject.slice(0, 10).map((subj, i) => (
                      <span key={i} className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="font-semibold text-gray-700">Description</h3>
                  <p className="text-gray-600 mt-1">
                    {typeof book.description === 'string'
                      ? book.description
                      : book.description.value || 'No description available'}
                  </p>
                </div>
              )}

              {/* AI Insights Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={onOpenAIPanel}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                >
                  🤖 Get AI Insights
                  <span className="text-sm opacity-90">Recommendations & Summary</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails
