import multer from "multer";
const storage = multer.memoryStorage();

const multipleUpload = multer({ storage }).array("files", 4);

export default multipleUpload;
