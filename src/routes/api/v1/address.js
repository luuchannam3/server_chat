import express from 'express';
import * as AddressController from '../../../controllers/address';

const router = express.Router();

// GET /api/v1/province?domain=
// GET Province
router.get('/province', AddressController.GetProvince);

// GET /api/v1/district?provinceID=
// GET district
router.get('/district', AddressController.GetDistrict);

export default router;
