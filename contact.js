/**
 * Contact & Messaging System for Hadi.T Portfolio
 * Powered by EmailJS (https://www.emailjs.com/)
 */

// ============================================================================
// EMAILJS CONFIGURATION
// Replace these placeholders with your actual credentials from:
// https://dashboard.emailjs.com/
//
// 1. PUBLIC_KEY: Found in Account > API Keys > Public Key
// 2. SERVICE_ID: Found in Email Services > Your Service (e.g. 'service_abc123')
// 3. TEMPLATE_ID: Found in Email Templates > Your Template (e.g. 'template_xyz789')
// ============================================================================
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',       // e.g. 'AbC123Def456Ghi78'
  SERVICE_ID: 'YOUR_SERVICE_ID',       // e.g. 'service_xxxxxxx'
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID',     // e.g. 'template_xxxxxxx'
  RECEIVER_EMAIL: 'hadithommankadan8411@gmail.com',
};

document.addEventListener('DOMContentLoaded', () => {
  initEmailJS();
  initContactForm();
  initCopyEmail();
  initHeroContactScroll();
});

/**
 * Initialize the EmailJS SDK
 */
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      try {
        emailjs.init({
          publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
        });
        console.log('✓ EmailJS initialized successfully.');
      } catch (err) {
        console.error('EmailJS initialization error:', err);
      }
    }
  } else {
    console.warn('EmailJS SDK is not loaded. Please ensure the CDN script is included in the HTML.');
  }
}

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

    // Clear previous status messages
    clearStatus(statusBanner);

    // Get form input values
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

    // Helper to generate a fallback mailto URL
    const emailTo = EMAILJS_CONFIG.RECEIVER_EMAIL;
    const emailSubject = encodeURIComponent(`[Portfolio] ${subject} - from ${name}`);
    const emailBody = encodeURIComponent(
      `Hi Hadi,\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent from your portfolio website`
    );
    const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

    // Check if user has entered real EmailJS credentials
    const isConfigured =
      typeof emailjs !== 'undefined' &&
      EMAILJS_CONFIG.PUBLIC_KEY &&
      EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
      EMAILJS_CONFIG.SERVICE_ID &&
      EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
      EMAILJS_CONFIG.TEMPLATE_ID &&
      EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

    if (!isConfigured) {
      // Configuration notice for the developer + smooth fallback
      setTimeout(() => {
        showStatus(
          statusBanner,
          'error',
          `⚠️ <strong>EmailJS setup needed:</strong> Please replace the placeholder keys in <code>contact.js</code> with your EmailJS <code>PUBLIC_KEY</code>, <code>SERVICE_ID</code>, and <code>TEMPLATE_ID</code>. In the meantime, you can send your message directly via email:`
        );

        const actionLink = document.createElement('a');
        actionLink.href = mailtoUrl;
        actionLink.className = 'status-action-link';
        actionLink.textContent = 'Open in Email Client / App';
        statusBanner.appendChild(actionLink);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          if (btnText) btnText.textContent = 'Send Message';
        }
      }, 500);
      return;
    }

    // Prepare template parameters
    // We send common aliases so your EmailJS template variable names match effortlessly:
    // {{name}}, {{from_name}}, {{email}}, {{from_email}}, {{reply_to}}, {{subject}}, {{message}}
    const templateParams = {
      name: name,
      from_name: name,
      email: email,
      from_email: email,
      reply_to: email,
      subject: subject,
      inquiry_type: subject,
      message: message,
      to_name: 'Hadi.T',
      to_email: EMAILJS_CONFIG.RECEIVER_EMAIL,
    };

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('EmailJS response:', response);

      // Show success banner
      showStatus(
        statusBanner,
        'success',
        `✓ Thank you, ${escapeHtml(name)}! Your message has been sent successfully. I will get back to you soon.`
      );

      // Reset form fields
      form.reset();

    } catch (err) {
      console.error('EmailJS error:', err);
      const errDetail = err && err.text ? err.text : (err && err.message ? err.message : 'Unknown error');

      // Show error banner with fallback link
      showStatus(
        statusBanner,
        'error',
        `✕ Could not send email via EmailJS (${escapeHtml(errDetail)}). Please try again or reach out directly:`
      );

      const actionLink = document.createElement('a');
      actionLink.href = mailtoUrl;
      actionLink.className = 'status-action-link';
      actionLink.textContent = 'Send via Email Client instead';
      statusBanner.appendChild(actionLink);

    } finally {
      // Restore submit button state
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        if (btnText) btnText.textContent = 'Send Message';
      }
    }
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
      const email = btn.getAttribute('data-email') || EMAILJS_CONFIG.RECEIVER_EMAIL;

      navigator.clipboard.writeText(email).then(() => {
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
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
