import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../services/authService';
import { generateToken } from '../utils/util';
import passport from 'passport';

export const login = (req: Request, res: Response) => {
    const user = findUserByUsername(req.body.username) 
    if(user) {
        const token = generateToken(user)
        res.json({ token });
    } else {
        res.status(401).json({ 
            code: "ACCESS_DENIED",
            message: 'Authentication failed' });
    }

};

export const flexibleAuthenticate = (req: Request, res: Response, next: any) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (user) {
        req.user = user as { userId: string };
        return next();
      }
    })(req, res, next);

      // JWT authentication failed, try Keplr
      passport.authenticate('keplr', { session: false }, (err: any, user: any, info: any) => {
        if (err) return next(err);
        console.log(user,"hello")
        if (user.walletAddress) {
          return next();
        }
  
        // Both JWT and Keplr authentication failed
        return res.status(401).json({ message: 'Unauthorized' });
      })(req, res, next);
};