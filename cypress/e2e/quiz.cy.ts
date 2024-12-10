/// <reference types="cypress" />

describe('Quiz Flow', () => {
  beforeEach(() => {
    // Visit the quiz page with a known test quiz ID
    cy.visit('/quiz/test-quiz-id')
  })

  it('completes full quiz flow', () => {
    // Wait for quiz to load
    cy.contains('Test Quiz').should('be.visible')

    // Answer all questions
    cy.get('[type="radio"]').first().click()
    cy.contains('Question 2 of').should('be.visible')
    
    // Test previous button
    cy.contains('Previous Question').click()
    cy.contains('Question 1 of').should('be.visible')
    
    // Complete quiz
    cy.get('[type="radio"]').first().click()
    cy.get('[type="radio"]').first().click()
    
    // Verify results page
    cy.contains('Quiz Results').should('be.visible')
    
    // Test restart functionality
    cy.contains('Restart Quiz').click()
    cy.contains('Question 1 of').should('be.visible')
  })
}) 