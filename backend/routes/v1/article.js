const express = require("express");
const multer = require("multer");

const articleController = require("../../controllers/v1/articleController");
const multerStorage = require("../../util/multerStorage");
const authenticatedMiddleware = require("../../middlewares/authenticated");
const isAdminMiddleware = require("../../middlewares/isAdmin");

const router = express.Router();

router
  .route("/")
  .post(
    multer({ storage: multerStorage.articleStorage, limits: { fileSize: 1000000000 } }).single(
      "cover"
    ),
    authenticatedMiddleware,
    isAdminMiddleware,
    articleController.create
  )
  .get(articleController.getAll);

router.route("/:shortName").get(articleController.getOne);

router
  .route("/draft")
  .post(
    multer({ storage: multerStorage.articleStorage, limits: { fileSize: 1000000000 } }).single(
      "cover"
    ),
    authenticatedMiddleware,
    isAdminMiddleware,
    articleController.saveDraft
  );

router
  .route("/:id")
  .delete(authenticatedMiddleware, isAdminMiddleware, articleController.remove)
  .put(multer({ storage: multerStorage.articleStorage, limits: { fileSize: 1000000000 } }).single(
    "cover"
  ),
  authenticatedMiddleware,
  isAdminMiddleware,
  articleController.edit);

module.exports = router;
