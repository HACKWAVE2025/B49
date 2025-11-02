import express from 'express'

import { getUser , toggleFollow } from '../controllers/userController.js'

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:username' , authMiddleware , getUser );

router.patch('/follow' , authMiddleware , toggleFollow);

export { router };