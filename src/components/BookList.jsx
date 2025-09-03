import React from 'react'
import BookCard from './BookCard'

const BookList = ({ results, onBookClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {results.map((book, index) => (
        <BookCard key={book.key || index} book={book} index={index} onClick={() => onBookClick(book)} />
      ))}
    </div>
  )
}

export default BookList
