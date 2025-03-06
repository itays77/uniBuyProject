import express, { RequestHandler } from 'express';
import ItemController from '../conrollers/ItemController';
import { jwtCheck, jwtParse } from '../middleware/auth';

const router = express.Router();

// PUBLIC ROUTES - no authentication required
router.get('/', ItemController.getAllItems as RequestHandler);
router.get('/:id', ItemController.getItemById as RequestHandler);

// PROTECTED ROUTES - authentication required
// For now, any authenticated user can create, update, or delete items
// You'll implement admin role checking later
router.post('/', jwtCheck, ItemController.createItem as RequestHandler);
router.put('/:id', jwtCheck, ItemController.updateItem as RequestHandler);
router.delete('/:id', jwtCheck, ItemController.deleteItem as RequestHandler);

export default router;
