import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../services/authService';
import { generateToken } from '../utils/util';
import passport from 'passport';

export const login = (req: Request, res: Response) => {
    const user = findUserByUsername(req.body.username) 
    if(user) {
        const token = generateToken(user)
        res.json({ authenticated: true, token });
    } else {
        res.status(401).json({ 
            code: "ACCESS_DENIED",
            message: 'Authentication failed' });
    }

};