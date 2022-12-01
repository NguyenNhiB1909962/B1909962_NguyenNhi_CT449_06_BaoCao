// const req = require("express/lib/request");
// const res = require("express/lib/response");

const MovieService = require("../services/movie.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Tạo và lưu review phim
exports.create = async (req, res, next) => {
    if (!req.body?.name || !req.body?.type || !req.body?.time || !req.body?.plusPoint || !req.body?.minusPoint) {
        return next(new ApiError(400, "Dữ liệu không được để trống"));
    }

    try {
        const movieService = new MovieService(MongoDB.client);
        const document = await movieService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo review phim")
        );
    }
};

// Truy xuất tất cả phim của người dùng từ cơ sở dữ liệu
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const movieService = new MovieService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await movieService.findByName(name);
        } else {
            documents = await movieService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi tạo review phim")
        );
    }

    return res.send(documents);
};

// Tìm một bộ phim có id
exports.findOne = async (req, res, next) => {
    try {
        const movieService = new MovieService(MongoDB.client);
        const document = await movieService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy review phim"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Lỗi khi truy xuất review phim với id=${req.params.id}`
            )
        );
    }
};

// Cập nhật phim theo id trong yêu cầu
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length===0) {
        return next(new ApiError(400, "Không được để trống dữ liệu cần cập nhật"));
    }

    try {
        const movieService = new MovieService(MongoDB.client);
        const document = await movieService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy review phim"));
        }
        return res.send({ message: "Review phim đã được cập nhật thành công" });
    } catch (error) {
        return next(
            new ApiError(500, `Lỗi cập nhật reivew phim với id=${req.params.id}`)
        );
    }
};

// Xóa phim có id được chỉ định trong yêu cầu
exports.delete = async (req, res, next) => {
    try {
        const movieService = new MovieService(MongoDB.client);
        const document = await movieService.delete(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy review phim"));
        }
        return res.send({ message: "Review phim đã được xóa thành công" });
    } catch (error) {
        return next(
            new ApiError(
                500, 
                `Không thể xóa review phim với id=${req.params.id}`)
        );
    }
};

// Xóa tất cả phim của người dùng khỏi cơ sở dữ liệu
exports.deleteAll = async(_req, res, next) => {
    try {
        const movieService = new MovieService(MongoDB.client);
        const deletedCount = await movieService.deleteAll();
        return res.send({
            message : `${deletedCount} review phim đã được xóa thành công`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả review phim")
        );
    }
};


// Tìm tất cả các bộ phim yêu thích của người dùng
exports.findAllFavorite = async(_req, res, next) => {
    try {
        const movieService = new MovieService(MongoDB.client);
        const documents = await movieService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500, 
                "Đã xảy ra lỗi khi truy xuất review phim yêu thích"
            )
        );
    }
};
