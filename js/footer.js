class FooterManager {
    constructor(containerId = 'footer-container') {
        this.containerId = containerId;
        this.defaultFooterConfig = {
            companyName: 'Chip Market',
            copyrightYear: new Date().getFullYear(),
            links: [
                { text: 'Privacy Policy', href: '/privacy' },
                { text: 'Terms of Service', href: '/terms' },
                { text: 'Contact', href: '/contact' },
            ],
            socialLinks: [
                {
                    platform: 'twitter',
                    href: '#',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>`,
                },
                {
                    platform: 'linkedin',
                    href: '#',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                    </svg>`,
                },
            ],
        };
    }

    // Render the footer with configurable options
    render(customConfig = {}) {
        // Merge default and custom configurations
        const config = {
            ...this.defaultFooterConfig,
            ...customConfig,
        };

        // Get the footer container
        const footerContainer = document.getElementById(this.containerId);
        if (!footerContainer) return;

        // Create the footer HTML
        footerContainer.innerHTML = `
            <footer class="py-3 my-4">
                <div class="container">
                    ${this.createQuickLinks(config.links)}
                    ${this.createSocialLinks(config.socialLinks)}
                    <p class="text-center text-body-secondary border-top pt-3">
                        <span>© ${config.copyrightYear} ${
            config.companyName
        }</span>
                    </p>
                </div>
            </footer>
        `;

        // Add event listeners to footer links
        this.addLinkEventListeners();
    }

    // Create quick links section
    createQuickLinks(links) {
        if (!links || links.length === 0) return '';

        return `
            <ul class="nav justify-content-center border-bottom pb-3 mb-3">
                ${links
                    .map(
                        (link) => `
                    <li class="nav-item">
                        <a href="${link.href}" class="nav-link px-2 text-body-secondary">
                            ${link.text}
                        </a>
                    </li>
                `
                    )
                    .join('')}
            </ul>
        `;
    }

    // Create social media links
    createSocialLinks(socialLinks) {
        if (!socialLinks || socialLinks.length === 0) return '';

        return `
            <ul class="nav justify-content-center mb-3">
                ${socialLinks
                    .map(
                        (social) => `
                    <li class="nav-item">
                        <a href="${social.href}" class="nav-link px-2 text-body-secondary" aria-label="${social.platform}">
                            ${social.icon}
                        </a>
                    </li>
                `
                    )
                    .join('')}
            </ul>
        `;
    }

    // Add event listeners to footer links
    addLinkEventListeners() {
        const footerLinks = document.querySelectorAll(
            '#' + this.containerId + ' a'
        );

        footerLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                // Optional: Add tracking or custom navigation logic
                console.log(`Navigating to: ${link.href}`);

                // Prevent default if you want to handle navigation manually
                // e.preventDefault();
            });
        });
    }

    // Method to update specific parts of the footer
    updateCopyright(newYear, newCompanyName) {
        const copyrightElement = document.querySelector(
            `#${this.containerId} .text-body-secondary span`
        );
        if (copyrightElement) {
            copyrightElement.textContent = `© ${newYear} ${newCompanyName}`;
        }
    }

    // Initialize footer when DOM is loaded
    static initialize(containerId = 'footer-container') {
        document.addEventListener('DOMContentLoaded', () => {
            const footerManager = new FooterManager(containerId);
            footerManager.render();
        });
    }
}

// Initialize the footer
FooterManager.initialize('footer-container');
