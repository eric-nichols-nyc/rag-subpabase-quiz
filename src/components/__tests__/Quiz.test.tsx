import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Quiz } from '../Quiz'
import { QuizData } from '../../types/quiz'

const mockQuizData: QuizData = {
  id: '1',
  title: 'Test Quiz',
  description: 'A test quiz',
  status: 'ACTIVE',
  questions: [
    {
      id: '1',
      question: 'What is 2+2?',
      options: ['3', '4', '5', '6'],
      correct_answer: '4',
      explanation: 'Basic arithmetic',
      quiz_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct_answer: 'Paris',
      explanation: 'Geography basics',
      quiz_id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  created_at: new Date(),
  updated_at: new Date(),
  userId: 'test-user',
}

describe('Quiz Component', () => {
  it('renders quiz title and description', () => {
    render(<Quiz quizData={mockQuizData} />)
    expect(screen.getByText('Test Quiz')).toBeInTheDocument()
    expect(screen.getByText('A test quiz')).toBeInTheDocument()
  })

  it('shows correct progress through quiz', async () => {
    render(<Quiz quizData={mockQuizData} />)
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
    
    // Answer first question
    fireEvent.click(screen.getByLabelText('4'))
    await waitFor(() => {
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
    })
  })

  it('calculates score correctly', async () => {
    render(<Quiz quizData={mockQuizData} />)
    
    // Answer first question correctly
    fireEvent.click(screen.getByLabelText('4'))
    await waitFor(() => {
      expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
    })
    
    // Answer second question incorrectly
    fireEvent.click(screen.getByLabelText('London'))
    
    await waitFor(() => {
      expect(screen.getByText('You scored 1 out of 2 (50%)')).toBeInTheDocument()
    })
  })
}) 