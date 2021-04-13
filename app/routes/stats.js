import express from 'express';
import * as statsController from '../BL/stats';
import { isAuth } from '../BL/middleware/auth';

const router = express.Router();

router.get('/', isAuth, statsController.getStats);

module.exports = router;
