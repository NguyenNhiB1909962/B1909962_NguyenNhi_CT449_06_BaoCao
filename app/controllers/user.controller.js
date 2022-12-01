const { ObjectId } = require("mongodb");
const UserService = require("../services/user.service");
const MongoDB = require ("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo và lưu một tài khoản
exports.create = async (req, res, next) =>{
    if (!req.body?.name || !req.body?.password || !req.body?.re_password || !req.body?.email){
        return next(new ApiError(400, "Dữ liệu không được để trống"));
    }

    if (req.body.password !== req.body.re_password){
        return next(new ApiError(400, "Mật khẩu không trùng khớp"));
    }

    if (req.body.password.length < 5){
        return next(new ApiError(400, "Mật khẩu phải lớn hơn 5 ký tự"));
    }

    try{
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.create(req.body);
        return res.send(document);    
    } catch (error) {
        return next(
          new ApiError(500, "Đã xảy ra lỗi khi tạo tài khoản")
        )
    }
};

// Tìm một liên hệ có email
exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findOne(req.params.email);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy review phim"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Lỗi khi truy xuất review phim với id=${req.params.email}`
            )
        );
    }
};

// Tìm liên hệ duy nhất với một email
exports.findUser = async (req, res, next) => {
    try{
        const userservice = new UserService(MongoDB.client);
        const document = await userservice.findUser(req.params.email);
        console.log(req.params.email);
        console.log(document);
        if (!document){
            return next(new ApiError(404, "Không tìm thấy tài khoản"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Lỗi khi truy xuất tài khoản với email=${req.params.email}`
            )
        );
    }
}