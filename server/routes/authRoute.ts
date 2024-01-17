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

router.post('/register', authController.register)

router.post('/authenticate', passport.authenticate('keplr', {
  session: true, // Enable session-based authentication
  failWithError: true
}), (req, res) => {
  const { walletAddress } = req.body;
  try {
    if (verifySignature(walletAddress)) {
      // Serialize the user to make it available in the session
      req.login({ walletAddress }, (err) => {
        if (err) {
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.status(200).json({ authenticated: true, sessionToken: generateToken({}) });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});



export default router;
