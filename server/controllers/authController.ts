import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createNewUser, findUserByUsername } from '../services/authService';
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

export const register = (req: Request, res: Response) => {
    const { username, password } = req.body;

    const existingUser = findUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({
            code: "USER_EXISTS",
            message: 'User already exists'
        });
    }

    const newUser = createNewUser(username, password);

    if(newUser.length > 0) {
        res.status(201).json({
            code: "USER_CREATED",
            message: 'User successfully registered',
            token: generateToken(username) 
        });
    }
};
