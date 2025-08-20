import express from 'express';
import { addMenu, fetchTodaysMenu } from '../controllers/messmenu.controller.js';
const router = express.Router();


router.post('/add', addMenu); 
router.get('/today', fetchTodaysMenu);

export default router;