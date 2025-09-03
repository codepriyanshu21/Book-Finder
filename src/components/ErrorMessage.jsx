import React from 'react'

const ErrorMessage = ({ error }) => {
  return (
    <div className="text-center mb-4">
      <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 inline-block">
        {error}
      </p>
    </div>
  )
}

export default ErrorMessage
