import DataUriParser from "datauri/parser.js";
import path from "path";

// const getDataUri = (file) => {
//   const parser = new DataUriParser();
//   const extName = path.extname(file.originalname);

//   return parser.format(extName, file.buffer);
// };

// export default getDataUri;

const getDataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error(
      "Invalid file object. Expected properties: originalname, buffer."
    );
  }

  const parser = new DataUriParser();
  const extName = path.extname(file.originalname);

  if (!extName) {
    throw new Error("File extension cannot be determined.");
  }

  // `parser.format` returns an object. Access `.content` for the Data URI.
  const result = parser.format(extName, file.buffer);

  if (!result || !result.content) {
    throw new Error("Failed to generate Data URI.");
  }

  return {
    fileName: file.originalname,
    content: result.content,
  };
};

export default getDataUri;
