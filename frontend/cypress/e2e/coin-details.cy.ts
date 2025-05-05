describe('Coin Details Page', () => {
  beforeEach(() => {
    // Mock API response for a specific coin
    cy.intercept('GET', '/api/coins/*', {
      statusCode: 200,
      body: {
        data: {
          id: '1',
          name: 'TestCoin',
          symbol: 'TC',
          price: '0.00123',
          marketCap: '1000000',
          volume24h: '500000',
          priceChange24h: '5.2',
          supply: '1000000000',
          creatorAddress: '0x123456789abcdef',
          description: 'This is a test coin for Cypress testing',
          website: 'https://testcoin.example.com',
          twitter: 'https://twitter.com/testcoin',
          telegram: 'https://t.me/testcoin'
        }
      }
    }).as('getCoinDetails')
    
    // Mock transactions for the coin
    cy.intercept('GET', '/api/transactions/coin/*', {
      statusCode: 200,
      body: {
        data: [
          {
            id: 'tx1',
            coinId: '1',
            type: 'buy',
            amount: '1000',
            price: '0.00123',
            walletAddress: '0x123456789abcdef',
            timestamp: new Date().toISOString()
          },
          {
            id: 'tx2',
            coinId: '1',
            type: 'sell',
            amount: '500',
            price: '0.00125',
            walletAddress: '0x123456789abcdef',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2
        }
      }
    }).as('getCoinTransactions')
    
    cy.visit('/coins/1')
    cy.wait('@getCoinDetails')
  })

  it('displays coin details', () => {
    cy.contains('TestCoin').should('be.visible')
    cy.contains('TC').should('be.visible')
    cy.contains('$0.00123').should('be.visible')
    cy.contains('$1,000,000').should('be.visible') // Market cap
    cy.contains('+5.2%').should('be.visible').and('have.class', 'text-green-500')
  })

  it('displays price chart', () => {
    cy.get('[data-testid="price-chart"]').should('be.visible')
  })

  it('displays transaction history', () => {
    cy.contains('Transaction History').should('be.visible')
    cy.wait('@getCoinTransactions')
    
    // Check if transactions are displayed
    cy.contains('Buy').should('be.visible')
    cy.contains('Sell').should('be.visible')
    cy.contains('1,000 TC').should('be.visible')
    cy.contains('500 TC').should('be.visible')
  })

  it('displays social links', () => {
    cy.contains('Website').should('be.visible')
    cy.contains('Twitter').should('be.visible')
    cy.contains('Telegram').should('be.visible')
    
    // Check if links have correct hrefs
    cy.get('a[href="https://testcoin.example.com"]').should('exist')
    cy.get('a[href="https://twitter.com/testcoin"]').should('exist')
    cy.get('a[href="https://t.me/testcoin"]').should('exist')
  })

  it('allows buying and selling tokens when wallet is connected', () => {
    // Mock wallet connection
    cy.window().then((win) => {
      win.localStorage.setItem('walletConnected', 'true')
      win.localStorage.setItem('walletAddress', '0x123456789abcdef')
    })
    
    // Reload the page to apply the wallet connection
    cy.reload()
    cy.wait('@getCoinDetails')
    
    // Check if buy/sell buttons are enabled
    cy.contains('Buy').should('be.enabled')
    cy.contains('Sell').should('be.enabled')
    
    // Test buy flow
    cy.contains('Buy').click()
    cy.get('[data-testid="buy-modal"]').should('be.visible')
    cy.get('input[type="number"]').type('100')
    cy.contains('Confirm').click()
    cy.contains('Transaction submitted').should('be.visible')
  })
})
