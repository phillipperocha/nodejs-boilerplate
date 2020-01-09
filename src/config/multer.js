import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  // We will configure multer to store files locally
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // We will name all files into a hexadecimal generated randomically.
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
