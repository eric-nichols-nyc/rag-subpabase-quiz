import { render, screen, waitFor } from '@testing-library/react'
import QuizGallery from '../quiz-gallery'

// Mock fetch globally
global.fetch = jest.fn()

describe('QuizGallery Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
  })

  it('shows loading state initially', () => {
    render(<QuizGallery id="test-id" />)
    expect(screen.getByText('Loading quiz...')).toBeInTheDocument()
  })

  it('handles successful quiz fetch', async () => {
    const mockQuizData = {
      id: 'test-id',
      title: 'Test Quiz',
      questions: []
    }

    ;(fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockQuizData)
      })
    )

    render(<QuizGallery id="test-id" />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading quiz...')).not.toBeInTheDocument()
    })
  })

  it('handles quiz fetch error', async () => {
    ;(fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    )

    render(<QuizGallery id="test-id" />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load quiz. Please try again later.')).toBeInTheDocument()
    })
  })
}) 