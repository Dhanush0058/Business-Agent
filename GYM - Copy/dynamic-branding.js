/**
 * Dynamic Branding Injector for Gym Template
 * Reads ?business_name=..., &phone=..., &whatsapp=..., &location=..., &category=...
 * and dynamically transforms the entire website for any prospect in real-time.
 */
(function () {
  function getParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let stored = {};
    try {
      stored = JSON.parse(sessionStorage.getItem('custom_gym_demo_data') || '{}');
    } catch (e) {}

    const data = {
      businessName: urlParams.get('business_name') || stored.businessName || '',
      category: urlParams.get('category') || stored.category || 'Gym & Fitness',
      location: urlParams.get('location') || stored.location || 'Hyderabad, India',
      phone: urlParams.get('phone') || stored.phone || '+91 93472 49697',
      whatsapp: urlParams.get('whatsapp') || stored.whatsapp || '919347249697',
      primaryColor: urlParams.get('color') || stored.primaryColor || '#fec400',
      headline: urlParams.get('headline') || stored.headline || '',
      agency: urlParams.get('agency') || stored.agency || 'Dhanex Studio',
      concept: urlParams.get('concept') || stored.concept || 'true',
    };

    if (urlParams.get('business_name')) {
      try {
        sessionStorage.setItem('custom_gym_demo_data', JSON.stringify(data));
      } catch (e) {}
    }
    return data;
  }

  function applyBranding() {
    const data = getParams();
    if (!data.businessName) return;

    // 1. Page Title
    document.title = `${data.businessName} — Official Concept Experience`;

    // 2. Add Top Concept Demo Disclaimer Banner
    if (!document.getElementById('dhanex-concept-watermark') && document.body) {
      const banner = document.createElement('div');
      banner.id = 'dhanex-concept-watermark';
      banner.style.cssText = `
        background: linear-gradient(90deg, #d97706, #f59e0b, #d97706);
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

    // 3. Dynamic Logo Transformation (Replace static CKO logo)
    const logoImgs = document.querySelectorAll('img[alt*="CKO"], img[src*="cko-logo"], nav a img');
    logoImgs.forEach((img) => {
      const parent = img.parentElement;
      if (parent) {
        const nameParts = data.businessName.split(' ');
        const firstWord = nameParts[0];
        const restWords = nameParts.slice(1).join(' ') || data.category;

        const brandContainer = document.createElement('div');
        brandContainer.className = 'flex items-center gap-2 group';
        brandContainer.innerHTML = `
          <div class="h-10 px-3 py-1 rounded-md bg-[#fec400] text-black font-black text-lg uppercase tracking-tight flex items-center justify-center shadow-lg font-heading">
            ${firstWord}
          </div>
          <div class="flex flex-col justify-center text-left">
            <span class="text-white font-extrabold text-base uppercase tracking-wider font-heading leading-none">
              ${restWords}
            </span>
            <span class="text-[10px] text-[#fec400] font-semibold tracking-widest uppercase">
              ${data.location}
            </span>
          </div>
        `;
        parent.replaceChild(brandContainer, img);
      }
    });

    // 4. Replace hardcoded text in headings, paragraphs, and descriptions
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while ((node = walker.nextNode())) {
      if (node.nodeValue && (node.nodeValue.includes('CKO') || node.nodeValue.includes('cko'))) {
        textNodes.push(node);
      }
    }
    textNodes.forEach((n) => {
      n.nodeValue = n.nodeValue
        .replace(/CKO\s*Kickboxing/gi, data.businessName)
        .replace(/CKO/g, data.businessName);
    });

    // 5. Rebind all Booking / Schedule / Contact CTAs to 1-Tap WhatsApp
    const waText = encodeURIComponent(
      `Hi ${data.businessName}, I saw your website concept and would like to claim a complimentary 1-day trial session!`
    );
    const waUrl = `https://wa.me/${data.whatsapp}?text=${waText}`;

    const ctaLinks = document.querySelectorAll(
      'a[href*="schedule.html"], a[href*="booking"], a.bg-accent, button[type="submit"]'
    );
    ctaLinks.forEach((el) => {
      if (el.tagName.toLowerCase() === 'a') {
        el.href = waUrl;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        if (el.innerText.toLowerCase().includes('book') || el.innerText.toLowerCase().includes('class')) {
          el.innerHTML = `<span>Book WhatsApp Trial</span>`;
        }
      }
    });

    // Also update phone links and address texts
    const addressLabels = document.querySelectorAll('#search-studio label, .studio-label');
    addressLabels.forEach((el) => {
      el.innerText = `Claim Free 1-Day Pass at ${data.businessName} (${data.location})`;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyBranding);
  } else {
    applyBranding();
  }
})();
