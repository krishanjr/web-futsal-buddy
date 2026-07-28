import { Router } from 'express';
import { upload } from '../configs/multer.config';
import { UploadController } from '../controllers/upload.controller';
import { authorizedMiddleware } from '../middlewares/authorized.middleware';

const router = Router();

router.post('/', authorizedMiddleware, upload.single('file'), UploadController.uploadFile);
router.delete('/:filename', authorizedMiddleware, UploadController.deleteFile);

export default router;
