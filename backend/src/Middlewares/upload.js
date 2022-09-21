// https://bezkoder.com/node-js-upload-image-mysql/
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ dest: 'uploads/', storage: storage }).single('file')
module.exports = upload
