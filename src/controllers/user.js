import bcrypt from 'bcryptjs';
import User from '../models/user';
import Province from '../models/province';
import District from '../models/district';
import statusCode from '../constant/statusCode';
import logger from '../config/winston';
import config from '../config/main';
import roleUser from '../constant/roleUser';
import typeBulkWrite from '../constant/typeBulkWrite';
import { client } from '../app';

// GET /api/v1/user?page=1&rows=20&q=
// GET List User
export async function GetUser(req, res) {
  try {
    let { page, rows, q } = req.query;

    // Default Rows And Pages
    if (page === undefined) {
      page = 1;
    }

    if (rows === undefined) {
      rows = 20;
    }

    let users;
    let count;
    let userInfo;

    if (q !== undefined) {
      userInfo = await Promise.all([
        User.find({
          $and: [
            {
              $or: [
                { name: { $regex: q } },
                { email: { $regex: q } },
                { phone: { $regex: q } },
                { address: { $regex: q } },
                { coin: { $eq: q } },
              ],
            },
            {
              isdelete: { $eq: false },
            },
          ],
        })
          .skip((page - 1) * rows)
          .limit(rows)
          .sort('-createdAt')
          .populate('listUser')
          .populate('province')
          .populate('district')
          .populate('idmanager')
          .select('-password'),
        User.countDocuments({
          $and: [
            {
              $or: [
                { name: { $regex: q } },
                { email: { $regex: q } },
                { phone: { $regex: q } },
                { address: { $regex: q } },
                { coin: { $eq: q } },
              ],
            },
            {
              isdelete: { $eq: false },
            },
          ],
        }),
      ]);
    } else {
      userInfo = await Promise.all([
        User.find({ isdelete: false })
          .skip((page - 1) * rows)
          .limit(rows)
          .sort('-createdAt')
          .populate('listUser')
          .populate('province')
          .populate('district')
          .populate('idmanager')
          .select('-password'),
        User.countDocuments({ isdelete: false }),
      ]);
    }

    users = userInfo[0];
    count = userInfo[1];

    res.status(statusCode.OK).json({
      users,
      count,
    });
  } catch (error) {
    logger.error(`GET /api/v1/user ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}

// POST /api/v1/user
// CREATE new user
export async function CreateUser(req, res) {
  try {
    const {
      name,
      password,
      email,
      phone,
      address,
      roles,
      province,
      district,
      state,
    } = req.body;

    if (
      !name ||
      !password ||
      !email ||
      !phone ||
      !address ||
      !roles ||
      !state
    ) {
      logger.error('POST /api/v1/user invalid params');

      return res.status(statusCode.BAD_REQUEST).json({
        error: 'Invalid params',
      });
    }

    const checkDB = await Promise.all([
      client.hget(config.REDIS.USER, phone),
      Province.findOne({ _id: province }),
      District.find({ _id: { $in: district } }),
    ]);

    const findUserByPhoneNumber = checkDB[0];

    if (findUserByPhoneNumber) {
      logger.error('POST /api/v1/user is exist user');

      return res.status(statusCode.BAD_REQUEST).json({
        error: 'User is exist please check your data',
      });
    }

    const findProvince = checkDB[1];
    const findDistrict = checkDB[2];

    if (findProvince === undefined || findDistrict.length !== district.length) {
      logger.error('POST /api/v1/user not exist province or district');

      return res.status(statusCode.BAD_REQUEST).json({
        error: 'Province or district is not good, please check again',
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let avatar;
    if (roles == roleUser.SUPER_ADMIN) {
      avatar = '/avatar/superadmin.png';
    } else if (roles == roleUser.ADMIN_COMPANY) {
      avatar = '/avatar/admincompany.jgp';
    } else if (roles == roleUser.DIRECTOR) {
      avatar = '/avatar/director.jpg';
    } else if (roles == roleUser.SALE) {
      avatar = 'avatar/sale.jgp';
    } else if (roles == roleUser.MANAGER) {
      avatar = '/avatar/manager.jgp';
    } else if (roles == roleUser.END_USER) {
      avatar = '/avatar/enduser.jpg';
    } else if (roles == roleUser.DELIVERY) {
      avatar = '/avatar/deliver.jpg';
    } else if (roles == roleUser.CUSTOMER) {
      avatar = '/avatar/customer.jgp';
    } else {
      logger.error('POST /api/v1/user not exist role user');

      return res.status(statusCode.BAD_REQUEST).json({
        error: 'Role user is not good, please check again',
      });
    }

    const newUser = new User({
      name,
      password: hash,
      email,
      phone,
      address,
      roles,
      province,
      district,
      avatar,
      state,
    });

    await client.hset(config.REDIS.USER, phone, newUser._id.toString());

    // Save to cache
    await client.rpush(
      config.KEY_BULKWRITE,
      JSON.stringify({
        type: typeBulkWrite.ADD_USER,
        data: newUser,
      }),
    );

    res.status(statusCode.CREATED).json({
      user: newUser,
    });
  } catch (error) {
    logger.error(`POST /api/v1/user ${error}`);

    res.status(statusCode.BAD_REQUEST).json({
      error: 'Bad Request',
    });
  }
}
