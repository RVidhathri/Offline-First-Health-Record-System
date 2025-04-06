const setSecurityHeaders = (req, res, next) => {
    // Only apply these security headers to API requests
    // Skip applying CSP to OPTIONS requests and frontend routes
    if (req.method === 'OPTIONS' || !req.path.startsWith('/api/') && !req.path.startsWith('/auth/')) {
        return next();
    }

    // Content Security Policy - Only applied to backend API routes
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com;"
    );

    // Other security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
};

module.exports = setSecurityHeaders;
