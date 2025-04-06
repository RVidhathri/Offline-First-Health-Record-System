const setSecurityHeaders = (req, res, next) => {
    // Content Security Policy
    res.setHeader(
        'Content-Security-Policy',
        `default-src 'self' https://*.googleapis.com https://*.gstatic.com;
         script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com;
         style-src 'self' 'unsafe-inline' https://*.googleapis.com;
         img-src 'self' data: https://*.googleapis.com https://*.gstatic.com;
         connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com;
         frame-src 'self' https://*.firebaseapp.com;
         font-src 'self' https://*.gstatic.com data:;
         object-src 'none';`
    );

    // Other security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    next();
};

module.exports = setSecurityHeaders;
