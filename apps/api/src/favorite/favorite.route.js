const express = require("express");
const router = express.Router();
const favoriteController = require("./favorite.controller");
const { validateFavorite } = require("./favorite.validator");

router.get("/:userId", favoriteController.getFavorites);
router.post("/", validateFavorite, favoriteController.addFavorite);
router.delete("/", validateFavorite, favoriteController.removeFavorite);

module.exports = router;
