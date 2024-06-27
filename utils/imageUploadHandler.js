import imageKit from "../config/imageKit.js";

export const uploadImage = async (file, fileName, folder) => {
  return new Promise(async (resolve, reject) => {
    imageKit.upload(
      {
        file,
        fileName,
        folder: folder,
      },
      async (err, result) => {
        if (err) {
          return reject(err.message);
        } else {
          return resolve(result);
        }
      }
    );
  });
};

export const deleteImage = async (fileId) => {
  return new Promise(async (resolve, reject) => {
    imageKit.deleteFile(fileId, async (err, result) => {
      if (err) {
        return reject(err.message);
      } else {
        return resolve(result);
      }
    });
  });
};
