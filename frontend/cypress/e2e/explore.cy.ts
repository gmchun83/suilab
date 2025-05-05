describe('Explore Page', () => {
  beforeEach(() => {
    cy.visit('/explore')
  })

  it('displays the explore page title', () => {
    cy.contains('Explore Coins').should('be.visible')
  })

  it('displays the search input', () => {
    cy.get('input[placeholder*="Search"]').should('be.visible')
  })

  it('displays coin list with pagination', () => {
    // Check if the coin list container exists
    cy.get('[data-testid="coin-list"]').should('exist')
    
    // Check if pagination controls exist
    cy.get('[data-testid="pagination"]').should('exist')
  })

  it('allows filtering coins', () => {
    // Click on filter dropdown
    cy.get('[data-testid="filter-dropdown"]').click()
    
    // Select a filter option
    cy.contains('Highest Market Cap').click()
    
    // Verify the filter was applied
    cy.get('[data-testid="active-filter"]').should('contain', 'Highest Market Cap')
  })

  it('allows searching for coins', () => {
    // Type in search box
    cy.get('input[placeholder*="Search"]').type('Test')
    
    // Wait for search results
    cy.get('[data-testid="search-results"]').should('exist')
  })
})
