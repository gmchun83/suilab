describe('Wallet Connection', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays connect wallet button when not connected', () => {
    cy.contains('Connect Wallet').should('be.visible')
  })

  it('navigates to wallet page when connect button is clicked', () => {
    cy.contains('Connect Wallet').click()
    cy.url().should('include', '/wallet')
  })

  it('displays wallet options on wallet page', () => {
    cy.visit('/wallet')
    cy.contains('Connect Your Wallet').should('be.visible')
    cy.contains('Sui Wallet').should('be.visible')
    cy.contains('Ethos Wallet').should('be.visible')
  })

  it('shows connected state when wallet is connected', () => {
    // Mock wallet connection
    cy.window().then((win) => {
      win.localStorage.setItem('walletConnected', 'true')
      win.localStorage.setItem('walletAddress', '0x123456789abcdef')
    })
    
    // Reload the page to apply the wallet connection
    cy.reload()
    
    // Check if wallet address is displayed
    cy.contains('0x1234...cdef').should('be.visible')
    cy.contains('Disconnect').should('be.visible')
  })

  it('disconnects wallet when disconnect button is clicked', () => {
    // Mock wallet connection
    cy.window().then((win) => {
      win.localStorage.setItem('walletConnected', 'true')
      win.localStorage.setItem('walletAddress', '0x123456789abcdef')
    })
    
    // Reload the page to apply the wallet connection
    cy.reload()
    
    // Click disconnect button
    cy.contains('Disconnect').click()
    
    // Check if connect button is displayed again
    cy.contains('Connect Wallet').should('be.visible')
  })
})
