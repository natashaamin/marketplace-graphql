import { Router } from "express";
import * as marketController from '../controllers/marketController';
import passport from "passport";

const router = Router();

router.post('/sendBid', passport.authenticate(['jwt', 'keplr'], { session: true }), marketController.postBidding)
router.get('/getItems', marketController.getListOfMarketPlace)
router.post('/getHistory', passport.authenticate(['jwt', 'keplr'], { session: true }), marketController.getBidHistory)
router.post('/getTotalTransactions', passport.authenticate(['jwt', 'keplr'], { session: true }), marketController.getTotalTransactions)
export default router