/**
 * Dynamic Branding Injector for Restaurant Template
 * Reads ?business_name=..., &phone=..., &whatsapp=..., &location=...
 * and customizes the entire restaurant website dynamically.
 */
(function () {
  function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let stored = {};
    try {
      stored = JSON.parse(sessionStorage.getItem('custom_restaurant_demo_data') || '{}');
    } catch (e) {}

    const data = {
      businessName: urlParams.get('business_name') || stored.businessName || '',
      category: urlParams.get('category') || stored.category || 'Restaurant & Café',
      location: urlParams.get('location') || stored.location || 'Hyderabad, India',
      phone: urlParams.get('phone') || stored.phone || '+91 93472 49697',
      whatsapp: urlParams.get('whatsapp') || stored.whatsapp || '919347249697',
      agency: urlParams.get('agency') || stored.agency || 'Dhanex Studio',
      concept: urlParams.get('concept') || stored.concept || 'true',
    };

    if (urlParams.get('business_name')) {
      try {
        sessionStorage.setItem('custom_restaurant_demo_data', JSON.stringify(data));
      } catch (e) {}
    }
    return data;
  }

  function applyBranding() {
    const data = getParams();
    if (!data.businessName) return;

    // 1. Page Title
    document.title = `${data.businessName} — Fine Dining & Culinary Experience`;

    // 2. Add Dhanex Concept Watermark Banner
    if (!document.getElementById('dhanex-concept-watermark') && document.body) {
      const banner = document.createElement('div');
      banner.id = 'dhanex-concept-watermark';
      banner.style.cssText = `
        background: linear-gradient(90deg, #b45309, #f59e0b, #b45309);
        color: #000;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 8px 16px;
        text-align: center;
        position: relative;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      `;
      banner.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #000; display: inline-block;"></span>
        <span>Independent Website Concept • Prepared by ${data.agency || 'Dhanex Studio'} for <strong>${data.businessName}</strong></span>
      `;
      document.body.prepend(banner);
    }

    // 3. Update Brand Logo text in Navbar
    const brandLink = document.querySelector('nav a.text-amber-400, nav a[style*="Playfair"]');
    if (brandLink) {
      brandLink.innerText = data.businessName;
    }

    // 4. Update Phone in Navbar & Footer
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach((el) => {
      el.href = `tel:${data.phone}`;
      el.innerHTML = `<span class="iconify" data-icon="lucide:phone" data-width="16"></span> ${data.phone}`;
    });

    // 5. Replace text occurrences of Sangria
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while ((node = walker.nextNode())) {
      if (node.nodeValue && (node.nodeValue.includes('Sangria') || node.nodeValue.includes('sangria'))) {
        textNodes.push(node);
      }
    }
    textNodes.forEach((n) => {
      n.nodeValue = n.nodeValue.replace(/Sangria\s*Raipur/gi, data.businessName).replace(/Sangria/g, data.businessName);
    });

    // 6. Connect "Reserve Table" buttons to 1-Tap WhatsApp
    const waText = encodeURIComponent(
      `Hi ${data.businessName}, I would like to reserve a table / place an order via your online website concept!`
    );
    const waUrl = `https://wa.me/${data.whatsapp}?text=${waText}`;

    const reserveBtns = document.querySelectorAll('a[href*="#reserve"], a.bg-amber-500, button[type="submit"]');
    reserveBtns.forEach((btn) => {
      if (btn.tagName.toLowerCase() === 'a') {
        btn.href = waUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        if (btn.innerText.toLowerCase().includes('reserve')) {
          btn.innerText = 'Reserve via WhatsApp';
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBranding);
  } else {
    applyBranding();
  }
})();
