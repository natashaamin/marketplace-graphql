import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../services/authService';
import { generateToken } from '../utils/util';
import passport from 'passport';

export const login = (req: Request, res: Response) => {
    try {
        const name = req.user as any;
        const user = findUserByUsername(name.username)
        if (user) {
            const token = generateToken(user)
            res.json({ authenticated: true, token });
        } else {
            res.status(401).json({
                code: "ACCESS_DENIED",
                message: 'Authentication failed'
            });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};