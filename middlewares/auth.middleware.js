import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token expired or invalid' });
    }
};
