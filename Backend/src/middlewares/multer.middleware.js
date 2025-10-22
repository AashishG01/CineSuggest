import multer from "multer";

// 1️⃣ Configure Multer disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Folder where files will be stored
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
   
    cb(null, file.originalname);
  },
});


export const upload = multer({
  storage: storage,
});

