import { Router } from 'express';
import itemController from '../controllers/item.controller.js';
import requireAuth from '../middleware/auth.middleware.js';
import requireRole from '../middleware/role.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', itemController.getItems);
router.post('/', requireRole('OWNER', 'ADMIN'), itemController.createItem);
router.post('/bulk', requireRole('OWNER', 'ADMIN'), itemController.createBulkItems);
router.post('/import-5000', requireRole('OWNER', 'ADMIN'), itemController.import5000Products);
router.post('/import-accessories', requireRole('OWNER', 'ADMIN'), itemController.importAccessories);
router.get('/:id', itemController.getItemById);
router.put('/:id', requireRole('OWNER', 'ADMIN'), itemController.updateItem);
router.delete('/:id', requireRole('OWNER', 'ADMIN'), itemController.deleteItem);

export default router;
