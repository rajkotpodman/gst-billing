import { Router } from 'express';
import aiController from '../controllers/ai.controller.js';

const router = Router();

// Allow storing chat without strict auth block so guest/demo sessions also save chats
router.post('/save-chat', aiController.saveChat);
router.post('/understand', aiController.understandPrompt);
router.get('/history', aiController.getChatHistory);
router.get('/download', aiController.downloadChatFile);

export default router;
