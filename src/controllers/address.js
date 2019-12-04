import Province from '../models/province';
import District from '../models/district';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';

export async function GetProvince(req, res) {
  try {
    const { domain } = req.query;

    let listProvince;

    if (domain !== undefined) {
      listProvince = await Province.find({ domain }).sort('name');
    } else {
      listProvince = await Province.find({}).sort('name');
    }

    res.status(statusCode.OK).json({ listProvince });
  } catch (error) {
    logger.error(`GET /api/v1/district ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

export async function GetDistrict(req, res) {
  try {
    const { provinceID } = req.query;

    let listDistrict;

    if (provinceID !== undefined) {
      listDistrict = await District.find({ provinceID })
        .sort('name')
        .populate('province');
    } else {
      listDistrict = await District.find({})
        .sort('name')
        .populate('province');
    }

    console.log(listDistrict[0].provinceID);

    res.status(statusCode.OK).json({ listDistrict });
  } catch (error) {
    logger.error(`GET /api/v1/district ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
