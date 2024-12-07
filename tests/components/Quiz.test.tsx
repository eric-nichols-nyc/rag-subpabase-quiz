import { render, screen, fireEvent } from '@testing-library/react'
import { Quiz } from '../../src/components/quiz'
import '@testing-library/jest-dom'

const mockQuizData = {
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
    }
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

  it('handles answering questions', () => {
    render(<Quiz quizData={mockQuizData} />)
    
    // Find and click an answer
    fireEvent.click(screen.getByLabelText('4'))
    
    // Should show results after answering
    expect(screen.getByText('Quiz Results')).toBeInTheDocument()
    expect(screen.getByText('You scored 1 out of 1 (100%)')).toBeInTheDocument()
  })

  it('allows navigating between questions', () => {
    const twoQuestionQuiz = {
      ...mockQuizData,
      questions: [
        mockQuizData.questions[0],
        {
          id: '2',
          question: 'What is 3+3?',
          options: ['4', '5', '6', '7'],
          correct_answer: '6',
          explanation: 'Basic arithmetic',
          quiz_id: '1',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ]
    }

    render(<Quiz quizData={twoQuestionQuiz} />)
    
    // Answer first question
    fireEvent.click(screen.getByLabelText('4'))
    
    // Should show second question
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
    
    // Test previous button
    fireEvent.click(screen.getByText('Previous Question'))
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
  })
}) 