/**
 * Dynamic Branding Injector for Education & Coaching Template
 * Reads ?business_name=..., &phone=..., &whatsapp=..., &location=...
 * and customizes the academy/coaching website in real-time.
 */
(function () {
  function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let stored = {};
    try {
      stored = JSON.parse(sessionStorage.getItem('custom_education_demo_data') || '{}');
    } catch (e) {}

    const data = {
      businessName: urlParams.get('business_name') || stored.businessName || '',
      category: urlParams.get('category') || stored.category || 'Education & Coaching',
      location: urlParams.get('location') || stored.location || 'Hyderabad, India',
      phone: urlParams.get('phone') || stored.phone || '+91 93472 49697',
      whatsapp: urlParams.get('whatsapp') || stored.whatsapp || '919347249697',
      agency: urlParams.get('agency') || stored.agency || 'Dhanex Studio',
      concept: urlParams.get('concept') || stored.concept || 'true',
    };

    if (urlParams.get('business_name')) {
      try {
        sessionStorage.setItem('custom_education_demo_data', JSON.stringify(data));
      } catch (e) {}
    }
    return data;
  }

  function applyBranding() {
    const data = getParams();
    if (!data.businessName) return;

    // 1. Title
    document.title = `${data.businessName} — Official Concept Experience`;

    // 2. Add Dhanex Concept Watermark Banner
    if (!document.getElementById('dhanex-concept-watermark') && document.body) {
      const banner = document.createElement('div');
      banner.id = 'dhanex-concept-watermark';
      banner.style.cssText = `
        background: linear-gradient(90deg, #1e1b4b, #312e81, #1e1b4b);
        color: #e0e7ff;
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
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      `;
      banner.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; display: inline-block;"></span>
        <span>Independent Website Concept • Prepared by ${data.agency || 'Dhanex Studio'} for <strong>${data.businessName}</strong></span>
      `;
      document.body.prepend(banner);
    }

    // 3. Dynamic Logo Transformation
    const logoBadge = document.querySelector('nav a .font-serif.text-xl');
    if (logoBadge) {
      logoBadge.innerText = data.businessName.charAt(0);
    }
    const logoTitle = document.querySelector('nav a span.font-serif.text-lg');
    if (logoTitle) {
      logoTitle.innerText = data.businessName;
    }
    const logoSubtitle = document.querySelector('nav a span.text-\\[0\\.65rem\\]');
    if (logoSubtitle) {
      logoSubtitle.innerText = data.location;
    }

    // 4. Replace occurrences of GIET
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while ((node = walker.nextNode())) {
      if (node.nodeValue && (node.nodeValue.includes('GIET') || node.nodeValue.includes('giet'))) {
        textNodes.push(node);
      }
    }
    textNodes.forEach((n) => {
      n.nodeValue = n.nodeValue.replace(/GIET\s*University/gi, data.businessName).replace(/GIET/g, data.businessName);
    });

    // 5. Connect Apply / Enquire CTAs to WhatsApp
    const waText = encodeURIComponent(
      `Hi ${data.businessName}, I would like to book a free demo class / enquire about courses via your website concept!`
    );
    const waUrl = `https://wa.me/${data.whatsapp}?text=${waText}`;

    const applyBtns = document.querySelectorAll('a[href*="apply"], a.bg-indigo-950, nav a[href="#contact"]');
    applyBtns.forEach((btn) => {
      if (btn.tagName.toLowerCase() === 'a') {
        btn.href = waUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        if (btn.innerText.toLowerCase().includes('apply')) {
          btn.innerText = 'WhatsApp Demo Class';
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
