/**
 * Contact & Messaging System for Hadi.T Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initCopyEmail();
  initHeroContactScroll();
});

/**
 * Initialize Contact Form Handling
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.form-submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const statusBanner = document.getElementById('form-status-banner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous status
    clearStatus(statusBanner);

    // Get field values
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Project Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    // Validation
    let hasError = false;
    if (!name) {
      highlightError(nameInput, 'Please enter your name');
      hasError = true;
    } else {
      removeError(nameInput);
    }

    if (!email || !isValidEmail(email)) {
      highlightError(emailInput, 'Please enter a valid email address');
      hasError = true;
    } else {
      removeError(emailInput);
    }

    if (!message) {
      highlightError(messageInput, 'Please write a brief message');
      hasError = true;
    } else {
      removeError(messageInput);
    }

    if (hasError) return;

    // Loading State
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'Sending Message...';
    }

    // Prepare mailto link with encoded content
    const emailTo = 'hadithommankadan8411@gmail.com';
    const emailSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
    const emailBody = encodeURIComponent(
      `Hi Hadi,\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from your portfolio website`
    );
    const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

    // Simulate sending delay for smooth UI feedback
    setTimeout(() => {
      // Trigger user's mail client
      window.location.href = mailtoUrl;

      // Show success message
      showStatus(
        statusBanner,
        'success',
        `✓ Thank you, ${escapeHtml(name)}! Your message draft is ready. If your email app didn't open automatically, click below:`
      );

      // Add a direct mailto action link inside status banner
      const actionLink = document.createElement('a');
      actionLink.href = mailtoUrl;
      actionLink.className = 'status-action-link';
      actionLink.textContent = 'Open in Email Client';
      statusBanner.appendChild(actionLink);

      // Reset form fields
      form.reset();

      // Reset button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        if (btnText) btnText.textContent = 'Send Message';
      }
    }, 600);
  });
}

/**
 * Copy Email to Clipboard with Tooltip Feedback
 */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'hadithommankadan8411@gmail.com';

      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.classList.add('copied');
        btn.setAttribute('aria-label', 'Email copied to clipboard');

        const tooltip = btn.querySelector('.copy-tooltip');
        if (tooltip) {
          tooltip.textContent = 'Copied!';
        }

        setTimeout(() => {
          btn.classList.remove('copied');
          if (tooltip) {
            tooltip.textContent = 'Copy';
          }
        }, 2200);
      }).catch(() => {
        // Fallback
        prompt('Copy email address:', email);
      });
    });
  });
}

/**
 * Smooth scroll from Hero contact pill to contact form
 */
function initHeroContactScroll() {
  const heroEmailLinks = document.querySelectorAll('a[href^="mailto:hadithommankadan8411@gmail.com"].contact-pill-link');
  heroEmailLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('connect');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nameInput = document.getElementById('contact-name');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 600);
        }
      }
    });
  });
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Helper: Highlight form error
 */
function highlightError(input, message) {
  if (!input) return;
  input.classList.add('input-error');
  let errSpan = input.parentNode.querySelector('.error-msg');
  if (!errSpan) {
    errSpan = document.createElement('span');
    errSpan.className = 'error-msg';
    input.parentNode.appendChild(errSpan);
  }
  errSpan.textContent = message;
}

/**
 * Helper: Remove form error
 */
function removeError(input) {
  if (!input) return;
  input.classList.remove('input-error');
  const errSpan = input.parentNode.querySelector('.error-msg');
  if (errSpan) {
    errSpan.remove();
  }
}

/**
 * Helper: Display status banner message
 */
function showStatus(banner, type, message) {
  if (!banner) return;
  banner.className = `form-status-banner status-${type}`;
  banner.innerHTML = `<span>${message}</span>`;
  banner.style.display = 'flex';
}

/**
 * Helper: Clear status banner
 */
function clearStatus(banner) {
  if (!banner) return;
  banner.className = 'form-status-banner';
  banner.innerHTML = '';
  banner.style.display = 'none';
}

/**
 * Helper: Escape HTML
 */
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
