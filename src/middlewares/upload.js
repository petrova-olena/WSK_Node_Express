import sharp from 'sharp';
import multer from 'multer';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  let extension = 'jpg';
  if (req.file.mimetype === 'image/png') {
    extension = 'png';
  } else if (req.file.mimetype === 'image/gif') {
    extension = 'gif';
  } else if (req.file.mimetype === 'image/webp') {
    extension = 'webp';
  }

  await sharp(req.file.path)
    .resize(160, 160)
    .toFile(`${req.file.path}_thumb.${extension}`);
  console.log('Thumbnail created:', `${req.file.path}_thumb.${extension}`);
  next();
};

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      const error = new Error('Only images and videos are allowed!');
      error.status = 400;
      cb(error, false);
    }
  },
});

export {createThumbnail, upload};
