import multer from 'multer'
import path from 'path'
import fs from 'fs'

console.log("__dirname →", __dirname);

const uploadDir = path.join(__dirname, '../http/controllers/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`
    cb(null, uniqueSuffix)
  }
})
export const upload = multer({ storage })
