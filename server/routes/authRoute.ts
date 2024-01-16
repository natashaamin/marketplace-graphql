import { NextFunction, Router } from 'express';
import * as authController from '../controllers/authController';
import passport from 'passport';
import { generateToken, verifySignature } from '../utils/util';

const router = Router();
  
router.post('/login', passport.authenticate('local', {
    session: false,
    failWithError: true
})
    , authController.login,
    (err: any, req: any, res: any, next: any) => {
        return res.status(200).json({
            code: "ACCESS_DENIED",
            message: 'Invalid username or password'
        });
    });


router.post('/authenticate', authController.flexibleAuthenticate, (req, res) => {
    const { walletAddress } = req.body;
    try {
        if (verifySignature(walletAddress)) {
            res.status(200).json({ authenticated: true, sessionToken: generateToken(walletAddress) });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


export default router;
