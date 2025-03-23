class Auth {
    constructor() {
        // Check if auth0 is available
        if (typeof auth0 === 'undefined') {
            console.error(
                'Auth0 SDK not loaded. Make sure to include the Auth0 script first.'
            );
            this.authAvailable = false;
            return;
        }

        this.authAvailable = true;
        this.domain = 'dev-ug5u6gmsbuqaf6f1.eu.auth0.com';
        this.clientId = 'Zs794cwQcCFT3F5DqINA6JMW9pEFLPyy';
        this.redirectUri = window.location.origin;

        // Initialize Auth0 WebAuth
        try {
            this.auth0 = new auth0.WebAuth({
                domain: this.domain,
                clientID: this.clientId, // Note: it's clientID (capital ID), not clientId
                redirectUri: this.redirectUri,
                responseType: 'token id_token',
                scope: 'openid profile email',
            });

            // Bind methods
            this.login = this.login.bind(this);
            this.signup = this.signup.bind(this);
            this.logout = this.logout.bind(this);
            this.handleAuthentication = this.handleAuthentication.bind(this);
            this.isAuthenticated = this.isAuthenticated.bind(this);

            // Create a custom event for auth state changes
            this.authStateEvent = new CustomEvent('authStateChanged');

            // Check authentication state on page load
            this.handleAuthentication();
        } catch (error) {
            console.error('Error initializing Auth0:', error);
            this.authAvailable = false;
        }
    }

    login() {
        if (!this.authAvailable) {
            console.error('Auth0 not properly initialized');
            return;
        }
        this.auth0.authorize();
    }

    signup() {
        if (!this.authAvailable) {
            console.error('Auth0 not properly initialized');
            return;
        }
        this.auth0.authorize({
            mode: 'signUp',
        });
    }

    handleAuthentication() {
        if (!this.authAvailable) return;

        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                window.location.hash = '';
                document.dispatchEvent(this.authStateEvent);
            } else if (err) {
                console.log(err);
                document.dispatchEvent(this.authStateEvent);
            } else {
                document.dispatchEvent(this.authStateEvent);
            }
        });
    }

    setSession(authResult) {
        // Set the time that the access token will expire
        const expiresAt = JSON.stringify(
            authResult.expiresIn * 1000 + new Date().getTime()
        );

        // Store authentication data in sessionStorage
        sessionStorage.setItem('auth0_access_token', authResult.accessToken);
        sessionStorage.setItem('auth0_id_token', authResult.idToken);
        sessionStorage.setItem('auth0_expires_at', expiresAt);
        sessionStorage.setItem('auth0_user_id', authResult.idTokenPayload.sub);
        sessionStorage.setItem(
            'auth0_user_name',
            authResult.idTokenPayload.name || authResult.idTokenPayload.email
        );
        sessionStorage.setItem(
            'auth0_user_email',
            authResult.idTokenPayload.email
        );
    }

    logout() {
        if (!this.authAvailable) return;

        // Remove tokens and expiry time from sessionStorage
        sessionStorage.removeItem('auth0_access_token');
        sessionStorage.removeItem('auth0_id_token');
        sessionStorage.removeItem('auth0_expires_at');
        sessionStorage.removeItem('auth0_user_id');
        sessionStorage.removeItem('auth0_user_name');
        sessionStorage.removeItem('auth0_user_email');

        document.dispatchEvent(this.authStateEvent);

        // Optionally redirect to Auth0 logout page
        this.auth0.logout({
            returnTo: window.location.origin,
        });
    }

    isAuthenticated() {
        if (!this.authAvailable) return false;

        // Check if the current time is past the access token's expiry time
        const expiresAt = JSON.parse(
            sessionStorage.getItem('auth0_expires_at') || '0'
        );
        return new Date().getTime() < expiresAt;
    }

    getCurrentUser() {
        if (!this.isAuthenticated()) return null;

        return {
            id: sessionStorage.getItem('auth0_user_id'),
            name: sessionStorage.getItem('auth0_user_name'),
            email: sessionStorage.getItem('auth0_user_email'),
        };
    }
}

// Create global auth instance
window.auth = new Auth();
