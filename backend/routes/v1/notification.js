const express = require("express");

const notificationController = require("../../controllers/v1/notification");
const authenticatedMiddleware = require("../../middlewares/authenticated");
const isAdminMiddleware = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/see/:id")
  .put(authenticatedMiddleware, isAdminMiddleware, notificationController.see);

module.exports = router;
