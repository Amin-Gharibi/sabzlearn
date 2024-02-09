const express = require("express");
const multer = require("multer");

const multerStorage = require("../../util/multerStorage");
const userController = require("../../controllers/v1/user");
const isAdminMiddleware = require("./../../middlewares/isAdmin");
const isAuthenticated = require("./../../middlewares/authenticated");

const router = express.Router();


router
  .route("/")
  .get(isAuthenticated, isAdminMiddleware, userController.getAll)
  .put(isAuthenticated, userController.updateUser);

router
  .route("/:id")
  .delete(isAuthenticated, isAdminMiddleware, userController.removeUser)
  .put(
    multer({ storage: multerStorage.userProfileStorage, limits: { fileSize: 1000000000 } }).single("profile"),
    isAuthenticated,
    userController.editUser);

router
  .route("/ban/:id")
  .put(isAuthenticated, isAdminMiddleware, userController.banUser);

router
  .route("/unban/:id")
  .put(isAuthenticated, isAdminMiddleware, userController.unBanUser)

router.route("/courses").get(isAuthenticated, userController.getUserCourses);
router
  .route("/role")
  .put(isAuthenticated, isAdminMiddleware, userController.changeUserRole);

module.exports = router;
