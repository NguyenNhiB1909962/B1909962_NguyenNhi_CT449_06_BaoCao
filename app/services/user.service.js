const { ObjectId } = require("mongodb");
const { email } = require("mongodb");

class UserService {
    constructor(client) {
        this.user = client.db().collection("users");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractLiteraryData(payload) {
        const user = {
            name: payload.name,
            email: payload.email,
            re_password: payload.re_password,
            password: payload.password,
            address: payload.address,
        };
        // Xóa các trường không xác định
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user
    }

    async create(payload) {
        const user = this.extractLiteraryData(payload);
        const result = await this.user.findOneAndUpdate(
            user,
            { $set: { favorite: user.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async findUser(emailUser) {
        return await this.user.findOne({
            email: emailUser
        })
    }
}
module.exports = UserService;