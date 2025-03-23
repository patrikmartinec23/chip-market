class FooterManager {
    constructor(containerId = 'footer-container') {
        this.containerId = containerId;
        this.defaultFooterConfig = {
            companyName: 'Chip Market',
            copyrightYear: new Date().getFullYear(),
            links: [
                { text: 'Terms & Conditions', href: '#' },
                { text: 'Privacy Policy', href: '#' },
                { text: 'Contact', href: '#contact' },
            ],
            menuLinks: [
                { text: 'Home', href: './index.html#' },
                { text: 'Products', href: './products.html' },
                { text: 'Deals', href: './deals.html' },
                { text: 'About Us', href: './index.html#about-us' },
                { text: 'Contact', href: './index.html#contact' },
            ],
            socialLinks: [
                { platform: 'facebook', href: '#', icon: 'bi bi-facebook' },
                { platform: 'twitter', href: '#', icon: 'bi bi-twitter' },
                { platform: 'instagram', href: '#', icon: 'bi bi-instagram' },
                { platform: 'pinterest', href: '#', icon: 'bi bi-pinterest' },
            ],
            contactEmail: 'contact@site.com',
        };
    }

    render(customConfig = {}) {
        // Merge default and custom configurations
        const config = { ...this.defaultFooterConfig, ...customConfig };
        const footerContainer = document.getElementById(this.containerId);
        if (!footerContainer) return;

        footerContainer.innerHTML = `
            <footer class="footer py-6">
                <hr />
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 my-3">
                            <h6>${config.companyName} Copyright © ${
            config.copyrightYear
        }</h6>
                            <p>Date: ${this.getFormattedDate()}</p>
                        </div>
                        <div class="col-md-4 my-3">
                            <h6>Links</h6>
                            <ul class="list-unstyled">
                                <li>Important:
                                    ${config.links
                                        .map(
                                            (link) =>
                                                `<a href="${link.href}">${link.text}</a>`
                                        )
                                        .join(', ')}
                                </li>
                                <li>Design By: 
                                    <a href="https://patrikmartinec.com">Patrik Martinec</a>
                                </li>
                                <li>Menu: 
                                    ${config.menuLinks
                                        .map(
                                            (link) =>
                                                `<a href="${link.href}">${link.text}</a>`
                                        )
                                        .join(', ')}
                                </li>
                            </ul>
                        </div>
                        <div class="col-md-4 my-3">
                            <div class="mb-4">
                                ${this.createSocialLinks(config.socialLinks)}
                            </div>
                            <p>We would love to hear from you
                                <a href="mailto:${config.contactEmail}">
                                    <strong>${config.contactEmail}</strong>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    createSocialLinks(socialLinks) {
        return socialLinks
            .map(
                (social) => `
                <a href="${social.href}" class="text-decoration-none">
                    <i class="${social.icon} fa-3x text-white mx-2"></i>
                </a>
            `
            )
            .join('');
    }

    getFormattedDate() {
        const date = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-UK', options);
    }

    static initialize(containerId = 'footer-container') {
        document.addEventListener('DOMContentLoaded', () => {
            const footerManager = new FooterManager(containerId);
            footerManager.render();
        });
    }
}

// Initialize the footer
FooterManager.initialize();
