const express = require("express");

const isAdminMiddleware = require("../../middlewares/isAdmin");
const authenticatedMiddleware = require("../../middlewares/authenticated");
const controller = require("../../controllers/v1/off");

const router = express.Router();

router
  .route("/")
  .post(authenticatedMiddleware, isAdminMiddleware, controller.create)
  .get(authenticatedMiddleware, isAdminMiddleware, controller.getAll);

router.route("/setall").put(authenticatedMiddleware, isAdminMiddleware, controller.setOnAll);

router.route("/unsetall").put(authenticatedMiddleware, isAdminMiddleware, controller.unsetOnAll);

router.route("/:code").post(authenticatedMiddleware, controller.getOne);

router.route("/:code/cancel").post(authenticatedMiddleware, controller.cancelRedeemCode);

router
  .route("/:id")
  .delete(authenticatedMiddleware, isAdminMiddleware, controller.remove);

module.exports = router;
