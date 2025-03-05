import express, { RequestHandler } from 'express';
import MyUserController from '../conrollers/MyUserController';
import { jwtCheck } from '../middleware/auth';


const router = express.Router();

router.post('/', jwtCheck, MyUserController.createCurrentUser as RequestHandler); 

export default router;