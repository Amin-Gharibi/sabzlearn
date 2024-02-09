const express = require("express");
const multer = require("multer");

const multerStorage = require("../../util/multerStorage");
const controller = require("../../controllers/v1/auth");
const authenticatedMiddleware = require("../../middlewares/authenticated");

const router = express.Router();
router.post("/register", multer({ storage: multerStorage.userProfileStorage, limits: { fileSize: 1000000000 } }).single("profile"), controller.register);
router.post("/login", controller.login);
router.get("/me", authenticatedMiddleware, controller.getMe);

module.exports = router;
