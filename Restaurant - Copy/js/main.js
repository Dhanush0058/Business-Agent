/**
 * Main Javascript logic for Sangria Raipur Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section, header, footer');
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    // 1. Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            // Animate menu icon (optional enhancement)
            const icon = mobileMenuBtn.querySelector('span');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.setAttribute('data-icon', 'lucide:menu');
                } else {
                    icon.setAttribute('data-icon', 'lucide:x');
                }
            }
        });

        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('span');
                if (icon) icon.setAttribute('data-icon', 'lucide:menu');
            }
        });
    }

    // 2. Premium Category Switching with Fade Transition
    window.showCategory = function(category) {
        const targetCategory = document.getElementById(category);
        if (!targetCategory) return;

        // Find currently visible category
        const activeCategory = Array.from(menuCategories).find(cat => !cat.classList.contains('hidden'));

        if (activeCategory === targetCategory) return;

        // Step 1: Fade out active category
        if (activeCategory) {
            activeCategory.style.opacity = '0';
            activeCategory.style.transform = 'translateY(8px)';
            
            setTimeout(() => {
                activeCategory.classList.add('hidden');
                revealNewCategory();
            }, 300); // Match CSS transition duration
        } else {
            revealNewCategory();
        }

        // Step 2: Show and Fade in new category
        function revealNewCategory() {
            targetCategory.classList.remove('hidden');
            // Force reflow
            targetCategory.offsetHeight;
            targetCategory.style.opacity = '1';
            targetCategory.style.transform = 'translateY(0)';
        }

        // Step 3: Update Tab Button Styles
        menuTabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.remove('bg-white/10', 'text-neutral-300', 'hover:bg-white/20');
                tab.classList.add('bg-amber-500', 'text-neutral-900');
            } else {
                tab.classList.add('bg-white/10', 'text-neutral-300', 'hover:bg-white/20');
                tab.classList.remove('bg-amber-500', 'text-neutral-900');
            }
        });
    };

    // 3. Scroll spy - Active Nav Link Highlight
    const activeLinkHandler = () => {
        let scrollPosition = window.scrollY + 200; // Offset for nav bar height

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (id && scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('text-amber-400');
                    link.classList.add('text-neutral-300');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.remove('text-neutral-300');
                        link.classList.add('text-amber-400');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', activeLinkHandler);
    activeLinkHandler(); // Initialize on load

    // 4. Smooth scroll for anchor links with offset
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuBtn.querySelector('span');
                    if (icon) icon.setAttribute('data-icon', 'lucide:menu');
                }
            }
        });
    });
});
