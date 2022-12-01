const { ObjectId } = require("mongodb");

class MovieService {
    constructor(client) {
        this.Movie = client.db().collection("movies");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractConactData(payload) {
        const movie = {
            name: payload.name,
            type: payload.type,
            time: payload.time,
            plusPoint: payload.plusPoint,
            minusPoint: payload.minusPoint,
            favorite: payload.favorite,
        };
        // Xóa các trường không xác định
        Object.keys(movie).forEach(
            (key) => movie[key] === undefined && delete movie[key]
        );
        return movie;
    }
    
    async create(payload) {
        const movie = this.extractConactData(payload);
        const result = await this.Movie.findOneAndUpdate(
            movie,
            { $set: { favorite: movie.favorite === true } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter) {
        const cursor = await this.Movie.find(filter);
        return await cursor.toArray();
    }
    
    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    } 

    async findById(id) {
        return await this.Movie.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }    
    
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Movie.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    } 

    async delete(id) {
        const result = await this.Movie.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    } 
    
    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Movie.deleteMany({});
        return result.deletedCount;
    }
}

module.exports = MovieService;
     