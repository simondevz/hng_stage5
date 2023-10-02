const { log, error } = require("console");
const streamToBuffer = require("fast-stream-to-buffer");
const fs = require("fs-extra");
const path = require("path");

const downloadHandler = async (req, res) => {
  const filename = req.params.filename;
  const videoPath = path.join(__dirname, `video/uploads/${filename}`);
  const videoStat = fs.statSync(videoPath);

  res.writeHead(200, {
    "Content-Type": "video/mp4",
    "Content-Length": videoStat.size,
  });

  const videoStream = fs.createReadStream(videoFilePath);
  videoStream.pipe(res);
};

module.exports = downloadHandler;
// export default downloadHandler;
