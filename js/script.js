/**
 * MOHAMED YOUSSEF ELHAMAIMY - DEVELOPER PORTFOLIO JAVASCRIPT
 * Features: Dark/Light Theme Switcher, Mobile Navigation, Scrollspy,
 * Intersection Observer Reveal Animations, Interactive Skill Filters,
 * Form Validation, Copy to Clipboard Toast.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME TOGGLE CONTROLLER (Dark / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;
  const STORAGE_KEY = 'mye_portfolio_theme';

  // Initialize theme from storage or default to 'dark'
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const preferredTheme = savedTheme || 'dark';
  setTheme(preferredTheme);

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }


  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileCloseBtn = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });


  /* ==========================================================================
     3. NAVBAR SCROLL EFFECT & SCROLLSPY
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function handleScrollSpy() {
    const scrollPosition = window.scrollY + 160;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    handleScrollSpy();
  }, { passive: true });

  handleNavbarScroll();
  handleScrollSpy();


  /* ==========================================================================
     4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }


  /* ==========================================================================
     5. SKILL CATEGORY TABS FILTER
     ========================================================================== */
  const skillTabs = document.querySelectorAll('.skills-tab');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');

      // Update active tab button
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter skill cards
      skillCategoryCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          // Re-trigger reveal animation smoothly
          card.classList.add('is-revealed');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ==========================================================================
     6. TOAST NOTIFICATION & COPY EMAIL
     ========================================================================== */
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const EMAIL_ADDRESS = 'mohamedyoussefelhamaimy@gmail.com';
  let toastTimeout;

  function showToast(message, duration = 3000) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(EMAIL_ADDRESS);
          showToast('Email address copied to clipboard!');
        } else {
          // Fallback text selection
          const tempInput = document.createElement('textarea');
          tempInput.value = EMAIL_ADDRESS;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          showToast('Email address copied to clipboard!');
        }
      } catch (err) {
        showToast(`Email: ${EMAIL_ADDRESS}`);
      }
    });
  }


  /* ==========================================================================
     7. CONTACT FORM VALIDATION & HANDLING (Front-End Only)
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const successMessage = document.getElementById('form-success-msg');
  const submitBtn = document.getElementById('form-submit-btn');

  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.trim());
  }

  function setFieldError(fieldElement, hasError) {
    const formGroup = fieldElement.closest('.form-group');
    if (!formGroup) return;
    if (hasError) {
      formGroup.classList.add('has-error');
    } else {
      formGroup.classList.remove('has-error');
    }
  }

  // Clear errors dynamically on input
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) setFieldError(nameInput, false);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (validateEmail(emailInput.value)) setFieldError(emailInput, false);
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length > 0) setFieldError(messageInput, false);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput || nameInput.value.trim().length === 0) {
        if (nameInput) setFieldError(nameInput, true);
        isValid = false;
      } else {
        setFieldError(nameInput, false);
      }

      // Validate Email
      if (!emailInput || !validateEmail(emailInput.value)) {
        if (emailInput) setFieldError(emailInput, true);
        isValid = false;
      } else {
        setFieldError(emailInput, false);
      }

      // Validate Message
      if (!messageInput || messageInput.value.trim().length === 0) {
        if (messageInput) setFieldError(messageInput, true);
        isValid = false;
      } else {
        setFieldError(messageInput, false);
      }

      if (!isValid) return;

      // Simulate front-end submission feedback
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Message...</span>';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          
          if (successMessage) {
            successMessage.classList.add('active');
            contactForm.reset();
            
            showToast('Message simulated successfully!');

            setTimeout(() => {
              successMessage.classList.remove('active');
            }, 6000);
          }
        }, 800);
      }
    });
  }

});
