import React from 'react'

const NoResultsMessage = ({ query }) => {
  return (
    <div className="text-center mt-8">
      <p className="text-gray-500">No books found for "{query}". Try a different search term.</p>
    </div>
  )
}

export default NoResultsMessage
