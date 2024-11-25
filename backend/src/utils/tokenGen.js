import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    // Generate a unique token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set the token in an HTTP-only cookie
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true, // Only accessible via HTTP requests
        sameSite: 'strict', // Protect against CSRF
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    });

    // Optionally set the token in the response header
    res.setHeader('Authorization', `Bearer ${token}`);

    // Return the token (if needed elsewhere)
    return token;
};

