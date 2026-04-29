import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Usar caminho absoluto baseado no diretório do projeto
const projectRoot = path.resolve(__dirname, '../../');
const uploadDir = path.join(projectRoot, 'uploads');

console.log("Upload dir →", uploadDir);

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
