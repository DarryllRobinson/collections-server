const multer = require('multer');

// File upload
exports.upload_file = function (req, res) {
  console.log('multering');
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
    console.log('multer upload');
    if (err) {
      res.json(err);
      return;
    }

    if (!req.file) {
      res.json('No file to upload');
    }
    return res.status(200).send(req.file);

    console.log('no problem');
  });
};
