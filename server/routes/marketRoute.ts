import { Router } from "express";
import * as marketController from '../controllers/marketController';
import passport from "passport";

const router = Router();

router.post('/sendBid', passport.authenticate('jwt', { session: false }), marketController.postBidding)
router.get('/getItems', marketController.getListOfMarketPlace)
router.get('/getHistory', passport.authenticate('jwt', { session: false }), marketController.getBidHistory)
router.get('/getTotalTransactions', passport.authenticate('jwt', { session: false }), marketController.getTotalTransactions)
export default router