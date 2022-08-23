import { CreateRecord, getRecords, getRecord } from "../controller/records.js";

import { authenticationToken } from '../verification/index.js'
import express from "express";

const router = express.Router();

router.post('/', CreateRecord);
router.get('/', authenticationToken, getRecords);
router.get('/:id', authenticationToken, getRecord);


export default router;