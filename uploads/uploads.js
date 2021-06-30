const multer = require('multer');

// File upload
exports.upload_file = function (req, res) {
  // Checking if directory exists - will use when I can
  // figure out how to access the name I'm sending!!
  /*const fs = require('fs');
  const dir = './tmp';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }*/

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({ storage: storage }).single('file');

  upload(req, res, function (err) {
    if (err) {
      res.json(err);
      return;
    }

    if (!req.file) {
      res.json('No file to upload');
    }

    const logoLocation = req.file.path;
    console.log('logoLocation: ' + logoLocation);
    return res.status(200).send(req.file);
  });
};
