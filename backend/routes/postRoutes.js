import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { 
  addComment, 
  createPost, 
  deleteComment, 
  deletePost, 
  changestatus, 
  updateLikes, 
  getPosts ,
  updatePost,
  getFeed,
  getPost
} from '../controllers/postController.js';

const router = express.Router();

router.post('/', authMiddleware, createPost);
router.get('/id/:postId' , authMiddleware , getPost);
router.patch('/:postId/:likedByUser', authMiddleware, updateLikes);
router.patch('/:postId/status', authMiddleware, changestatus);
router.patch('/update/updatepost/:postId', authMiddleware, updatePost);
router.post('/:postId/comments', authMiddleware, addComment);
router.delete('/:postId/comments/:commentId', authMiddleware, deleteComment);
router.delete('/:postId', authMiddleware, deletePost);
router.get('/:username', authMiddleware, getPosts);
router.get('/feed/:username' , authMiddleware , getFeed);

export { router };
