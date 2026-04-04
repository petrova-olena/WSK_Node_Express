import sharp from 'sharp';

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

export {createThumbnail};
