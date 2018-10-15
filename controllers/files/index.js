const multer = require("multer");
const fs = require("fs");
const SHA = require("js-sha512").sha512_224;

const TempDirectory = [process.env.PWD, "uploads/temp/"].join("/");
const BusinessDirectory = [process.env.PWD, "uploads/business/"].join("/");

exports.uploadPhoto = multer({ dest: TempDirectory, limits: { fileSize: 10 * 1024 * 1024 } });

exports.saveFileFromTempAsRandomName = async (name, ext) => {
  var file = "";
  do {
    file = SHA(name + ext + file);
  } while (fs.existsSync(BusinessDirectory + file + ext));

  fs.renameSync(TempDirectory + name, BusinessDirectory + file + ext);

  if (fs.existsSync(BusinessDirectory + file + ext)) return file + ext;
  return false;
};

exports.resetBusinessFile = async (name, old) => {
  fs.renameSync(BusinessDirectory + name, TempDirectory + old);
};
