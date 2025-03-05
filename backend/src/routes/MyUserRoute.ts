import express, { RequestHandler } from 'express';
import MyUserController from '../conrollers/MyUserController';
import { jwtCheck, jwtParse } from '../middleware/auth';


const router = express.Router();

router.get('/', jwtCheck, jwtParse, MyUserController.getCurrentUser as RequestHandler);
router.post('/', jwtCheck, MyUserController.createCurrentUser as RequestHandler); 

export default router;