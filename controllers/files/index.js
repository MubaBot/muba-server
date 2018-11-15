const multer = require("multer");
const fs = require("fs");
const SHA = require("js-sha512").sha512_224;

const TempDirectory = [process.env.PWD, "uploads/temp/"].join("/");
const BusinessDirectory = [process.env.PWD, "uploads/business/"].join("/");
const ShopMenuDirectory = [process.env.PWD, "uploads/menu/"].join("/");
const ReviewDirectory = [process.env.PWD, "uploads/review/"].join("/");

exports.uploadPhoto = multer({ dest: TempDirectory, limits: { fileSize: 10 * 1024 * 1024 } });

exports.saveFileFromTempAsRandomName = async (name, ext, type) => {
  var TypeDirectory = null;
  var file = "";

  switch (type) {
    case "Business":
      TypeDirectory = BusinessDirectory;
      break;
    case "ShopMenu":
      TypeDirectory = ShopMenuDirectory;
      break;
    case "Review":
      TypeDirectory = ReviewDirectory;
      break;

    default:
      return false;
  }

  do {
    file = SHA(name + ext + file);
  } while (fs.existsSync(TypeDirectory + file + ext));

  try {
    fs.mkdirSync(TypeDirectory);
  } finally {
    fs.renameSync(TempDirectory + name, TypeDirectory + file + ext);

    if (fs.existsSync(TypeDirectory + file + ext)) return file + ext;
    return false;
  }
};

exports.resetBusinessFile = async (name, old) => {
  return fs.renameSync(BusinessDirectory + name, TempDirectory + old);
};

exports.resetShopMenuFile = async (name, old) => {
  return fs.renameSync(ShopMenuDirectory + name, TempDirectory + old);
};

exports.removeShopMenuFile = async name => {
  return fs.unlink(ShopMenuDirectory + name);
};

exports.removeReviewFile = async name => {
  return fs.unlink(ReviewDirectory + name);
};
