import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 100, // Maximum 100 requests per IP
    duration: 60, // Per 60 seconds
});

export default async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    } catch (err) {
        res.status(429).json({
            message: 'Too many requests, please try again later.',
        });
    }
};
