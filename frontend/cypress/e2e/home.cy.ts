describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the header', () => {
    cy.get('header').should('be.visible')
    cy.contains('PumpSui').should('be.visible')
  })

  it('displays trending coins section', () => {
    cy.contains('Trending Coins').should('be.visible')
    // Initially shows loading state
    cy.get('[data-testid="trending-coins-loading"]').should('exist')
  })

  it('displays the footer', () => {
    cy.get('footer').should('be.visible')
    cy.contains('© 2023 PumpSui').should('be.visible')
  })
})
