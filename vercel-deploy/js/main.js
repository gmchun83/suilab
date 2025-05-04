document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Connect wallet button functionality
  const connectWalletBtn = document.querySelector('.btn-primary');
  if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', function() {
      alert('Wallet connection feature coming soon!');
    });
  }

  // Create coin button functionality
  const createCoinBtn = document.querySelector('.hero-buttons .btn-secondary');
  if (createCoinBtn) {
    createCoinBtn.addEventListener('click', function() {
      alert('Coin creation feature coming soon!');
    });
  }

  // Explore coins button functionality
  const exploreCoinBtn = document.querySelector('.hero-buttons .btn:not(.btn-secondary)');
  if (exploreCoinBtn) {
    exploreCoinBtn.addEventListener('click', function() {
      alert('Explore coins feature coming soon!');
    });
  }

  // Form submission - Netlify will handle the actual form submission
  // This is just for enhanced user experience
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // We don't prevent default here because we want Netlify to handle the form
    contactForm.addEventListener('submit', function() {
      // Show a message in console for debugging
      console.log('Form submitted to Netlify');

      // We don't need to manually reset the form as the page will refresh
      // after Netlify processes the submission
    });
  }

  // Add animation to coin cards
  const coinCards = document.querySelectorAll('.coin-card');
  coinCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});
