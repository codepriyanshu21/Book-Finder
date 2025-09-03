import React, { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

// Component for displaying individual book recommendations
const RecommendationCard = ({ recommendation, index }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
      <div className="flex items-start gap-3">
        {/* Rank */}
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
          {index + 1}
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {recommendation.title}
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            by {recommendation.author}
          </p>

          {/* Short Reason */}
          <p className="text-sm text-gray-700 line-clamp-3">
            {recommendation.reason}
          </p>
        </div>
      </div>
    </div>
  )
}


const AIPanel = ({ book, onClose }) => {
  const [activeTab, setActiveTab] = useState('recommendations')
  const [recommendations, setRecommendations] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateRecommendations = async () => {
    if (!book) return

    setLoading(true)
    setError('')
    setRecommendations('')

    try {
      const prompt = `Based on the book "${book.title}" by ${book.author_name?.join(', ') || 'Unknown Author'}, please recommend 5 similar books that readers might enjoy. For each recommendation, include:
1. Book title and author
2. Brief reason why it's similar
3. Target audience

Format the response as a clean, readable list.`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate recommendations')
      }

      const data = await response.json()
      const generatedText = data.candidates[0].content.parts[0].text

      // Remove any introductory text before the numbered list
      const lines = generatedText.split('\n')
      const firstNumberedIndex = lines.findIndex(line => /^\d+\./.test(line.trim()))
      const cleanedText = firstNumberedIndex !== -1 ? lines.slice(firstNumberedIndex).join('\n') : generatedText

      setRecommendations(cleanedText)
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.')
      console.error('Gemini API error :', err)
    } finally {
      setLoading(false)
    }
  }

  const generateSummary = async () => {
    if (!book) return

    setLoading(true)
    setError('')
    setSummary('')

    try {
      const description = book.description ? (typeof book.description === 'string' ? book.description : book.description.value) : 'No description available'
      const prompt = `Please provide a concise but comprehensive summary of the book "${book.title}" by ${book.author_name?.join(', ') || 'Unknown Author'}. Use the following information if available:

Book Description: ${description}
Subjects: ${book.subject?.slice(0, 5).join(', ') || 'Not specified'}
First Published: ${book.first_publish_year || 'Not specified'}
Pages: ${book.number_of_pages_median || 'Not specified'}

Please structure the summary to include:
1. A brief overview of the plot/themes
2. Key characters or concepts
3. Writing style and target audience
4. Why readers might enjoy this book

Keep the summary engaging and around 200-300 words.`

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      const data = await response.json()
      const generatedText = data.candidates[0].content.parts[0].text
      setSummary(generatedText)
    } catch (err) {
      setError('Failed to generate summary. Please try again.')
      console.error('Gemini API error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setError('')
    if (tab === 'recommendations' && !recommendations) {
      generateRecommendations()
    } else if (tab === 'summary' && !summary) {
      generateSummary()
    }
  }

  React.useEffect(() => {
    if (activeTab === 'recommendations' && !recommendations && !loading) {
      generateRecommendations()
    }
  }, [activeTab])

  // Parse the AI-generated recommendations text into structured data
  const parseRecommendations = (text) => {
    // Expected format:
    // 1. Title by Author
    //    Reason: ...
    //    Audience: ...
    // 2. Title by Author
    //    Reason: ...
    //    Audience: ...
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    const recommendations = []
    let current = {}
    lines.forEach(line => {
      const numberMatch = line.match(/^(\d+)\.\s*(.+)$/)
      if (numberMatch) {
        if (Object.keys(current).length > 0) {
          recommendations.push(current)
          current = {}
        }
        // Extract title and author from the line after number
        const titleAuthorMatch = numberMatch[2].match(/^(.+?)\s+by\s+(.+)$/i)
        if (titleAuthorMatch) {
          current.title = titleAuthorMatch[1].trim()
          current.author = titleAuthorMatch[2].trim()
        } else {
          current.title = numberMatch[2].trim()
          current.author = 'Unknown'
        }
      } else if (line.toLowerCase().startsWith('reason')) {
        current.reason = line.split(':').slice(1).join(':').trim()
      } else if (line.toLowerCase().startsWith('audience')) {
        current.audience = line.split(':').slice(1).join(':').trim()
      } else {
        // Append to reason if already started
        if (current.reason) {
          current.reason += ' ' + line
        } else {
          current.reason = line
        }
      }
    })
    if (Object.keys(current).length > 0) {
      recommendations.push(current)
    }
    return recommendations
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">AI Insights for "{book?.title}"</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => handleTabChange('recommendations')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'recommendations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📚 Similar Books
            </button>
            <button
              onClick={() => handleTabChange('summary')}
              className={`px-4 py-2 font-medium text-sm ml-4 ${
                activeTab === 'summary'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📖 Book Summary
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Content Area */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-600">
                    {activeTab === 'recommendations' ? 'Finding similar books...' : 'Generating summary...'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {activeTab === 'recommendations' && recommendations && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {parseRecommendations(recommendations).map((rec, idx) => (
                      <RecommendationCard key={idx} recommendation={rec} index={idx} />
                    ))}
                  </div>
                )}
                {activeTab === 'summary' && summary && (
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {summary}
                  </div>
                )}
                {!loading && !error && !((activeTab === 'recommendations' && recommendations) || (activeTab === 'summary' && summary)) && (
                  <div className="text-center py-12 text-gray-500">
                    Click the tabs above to generate AI insights
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (activeTab === 'recommendations') {
                  generateRecommendations()
                } else {
                  generateSummary()
                }
              }}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Regenerate'}
            </button>
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

export default AIPanel
