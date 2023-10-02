const downloadFile = require("../apiCalls/downloadFiles");
const fs = require("fs-extra");

const downloadHandler = async (req, res) => {
  const filename = req.params.filename;
  const videoPath = path.join(__dirname, `video/uploads/${filename}`);

  const videoStream = fs.createReadStream(videoPath);
  videoStream.pipe(res);
};

module.exports = downloadHandler;
// export default downloadHandler;
