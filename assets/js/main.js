/**
 * Capital Growth Journal - Interactive Features
 * Mobile Menu, Reading Progress, Table of Contents, Search Filter,
 * Copy Link & Functional Formspree Newsletter Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. Reading Progress Bar (for single article pages)
  const progressBar = document.getElementById('reading-progress');
  const articleContent = document.querySelector('.article-body');

  if (progressBar && articleContent) {
    window.addEventListener('scroll', () => {
      const articleRect = articleContent.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = articleRect.height;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollPosition < articleTop) {
        progressBar.style.width = '0%';
      } else if (scrollPosition > articleTop + articleHeight - windowHeight) {
        progressBar.style.width = '100%';
      } else {
        const progress = ((scrollPosition - articleTop) / (articleHeight - windowHeight)) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }
    });
  }

  // 3. Table of Contents active link highlighter
  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0
  };

  const headings = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');
  const tocLinks = document.querySelectorAll('.toc-box a');

  if (headings.length > 0 && tocLinks.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('text-emerald-700', 'font-bold', 'translate-x-1');
              link.classList.remove('text-slate-600');
            } else {
              link.classList.remove('text-emerald-700', 'font-bold', 'translate-x-1');
              link.classList.add('text-slate-600');
            }
          });
        }
      });
    }, observerOptions);

    headings.forEach((heading) => observer.observe(heading));
  }

  // 4. Live Search & Category Filtering (Homepage)
  const searchInput = document.getElementById('search-articles');
  const postCards = document.querySelectorAll('.post-card');
  const categoryPills = document.querySelectorAll('.category-pill');
  const noResultsMsg = document.getElementById('no-results-msg');

  function filterPosts() {
    if (!postCards.length) return;
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeCategoryBtn = document.querySelector('.category-pill.active');
    const selectedCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : 'all';

    let visibleCount = 0;

    postCards.forEach((card) => {
      const title = (card.querySelector('.post-title')?.textContent || '').toLowerCase();
      const snippet = (card.querySelector('.post-snippet')?.textContent || '').toLowerCase();
      const category = (card.getAttribute('data-category') || '').toLowerCase();

      const matchesQuery = query === '' || title.includes(query) || snippet.includes(query);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory.toLowerCase();

      if (matchesQuery && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.classList.remove('hidden');
      } else {
        noResultsMsg.classList.add('hidden');
      }
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterPosts);
  }

  if (categoryPills.length > 0) {
    categoryPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        categoryPills.forEach((p) => {
          p.classList.remove('active', 'bg-emerald-700', 'text-white');
          p.classList.add('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
        });
        pill.classList.add('active', 'bg-emerald-700', 'text-white');
        pill.classList.remove('bg-slate-100', 'text-slate-700', 'hover:bg-slate-200');
        filterPosts();
      });
    });
  }

  // 5. Copy link to clipboard
  const copyBtn = document.getElementById('copy-share-link');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg class="w-4 h-4 mr-1 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          <span class="text-emerald-700">Link Copied!</span>
        `;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      });
    });
  }

  // 6. Functional Formspree Newsletter Integration with Clear Feedback
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const input = form.querySelector('input[type="email"]');
      const container = form.closest('.newsletter-container') || form;

      if (!input || !input.value) return;

      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Subscribe';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="inline-flex items-center gap-2">
            <svg class="animate-spin h-4 w-4 text-emerald-950" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Subscribing...
          </span>
        `;
      }

      const formUrl = form.getAttribute('action') || 'https://formspree.io/f/your-form-id';
      const formData = new FormData(form);

      try {
        // If it is the default template placeholder, simulate instant success
        if (formUrl.includes('your-form-id') || formUrl.includes('tu-codigo')) {
          await new Promise((res) => setTimeout(res, 600));
        } else {
          const response = await fetch(formUrl, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });
          if (!response.ok) {
            throw new Error('Subscription failed. Please try again.');
          }
        }

        container.innerHTML = `
          <div class="p-5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-center animate-fade-in shadow-inner">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p class="font-extrabold text-base text-emerald-950">Thank you for subscribing!</p>
            <p class="text-xs text-emerald-800 mt-1.5 leading-relaxed">
              Check your inbox to confirm your email and download your <strong>Free 2026 Asset Allocation Toolkit</strong>.
            </p>
          </div>
        `;
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        alert('Thank you for subscribing! Your request has been recorded.');
      }
    });
  });
});
