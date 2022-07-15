import { commentPost, getCommentPost } from "../controller/comment.js";

import { authenticationToken } from '../verification/index.js'
import express from "express";

const router = express.Router();

router.post('/:id', authenticationToken, commentPost);
router.get('/:id', authenticationToken, getCommentPost);


export default router;