const express = require("express");
const router = express.Router();
const propertyController = require("./property.controller");

router.get("/", propertyController.getAll);
router.get("/:id", propertyController.getProperty);

module.exports = router;
