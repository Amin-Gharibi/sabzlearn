const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

module.exports.courseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'courses'));
  },
  filename: (req, file, cb) => {
    const sha256 = crypto.createHash('SHA256');
    const hashedFileName = sha256.update(file.originalname).digest('hex');
    cb(null, hashedFileName + path.extname(file.originalname));
  },
});

module.exports.articleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'articles'));
  },
  filename: (req, file, cb) => {
    const sha256 = crypto.createHash('SHA256');
    const hashedFileName = sha256.update(file.originalname).digest('hex');
    cb(null, hashedFileName + path.extname(file.originalname));
  },
});

module.exports.userProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'profile'));
  },
  filename: (req, file, cb) => {
    const sha256 = crypto.createHash('SHA256');
    const hashedFileName = sha256.update(file.originalname).digest('hex');
    cb(null, hashedFileName + path.extname(file.originalname));
  },
});

module.exports.sessionsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'sessions'));
  },
  filename: (req, file, cb) => {
    const sha256 = crypto.createHash('SHA256');
    const hashedFileName = sha256.update(file.originalname).digest('hex');
    cb(null, hashedFileName + path.extname(file.originalname));
  },
});