const express = require("express");
const movies = require("../controllers/movie.controller");

const router = express.Router();

router.route("/")
    .get(movies.findAll)
    .post(movies.create)
    .delete(movies.deleteAll);

router.route("/favorite")
    .get(movies.findAllFavorite);

router.route("/:id")
    .get(movies.findOne)
    .put(movies.update)
    .delete(movies.delete);

module.exports = router;