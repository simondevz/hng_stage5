const path = require("path");
const streamToBuffer = require("fast-stream-to-buffer");
const fs = require("fs-extra");
const { formidable } = require("formidable");

module.exports.uploadStart = (req, res) => {
  res.status(200).send({ session_id: Math.round(Math.random() * 10 ** 10) });
};

module.exports.uploadAppend = appendUpload = async (req, res) => {
  const { data, session_id, index } = req.body;
  const tempFilePath = `videos/tmp/${session_id}/${index}.tmp`;
  const filePath = path.join(__dirname, tempFilePath); // __dirname gives you the current directory

  streamToBuffer(data, async function (error, buffer) {
    if (error) {
      res.sendStatus(500);
    }
    await fs.outputFile(filePath, buffer);
  });

  return { session_id };
  x;
  // res.status(200).send({ session_id });
};

module.exports.uploadFinish = async (req, res) => {
  const { session_id, fileExtension } = req.body;
  const tempFileDir = `videos/tmp/${session_id}/`;
  const filepath = `videos/uploads/video_${session_id}.${
    fileExtension ? fileExtension : "mp4"
  }`;

  const fileLocation = path.join(__dirname, filepath);
  await fs.ensureFile(fileLocation);
  let outputFile = fs.createWriteStream(fileLocation);

  fs.readdir(path.join(__dirname, tempFileDir), async (err, files) => {
    try {
      if (err) {
        throw err;
      }

      files.forEach((temp, index, array) => {
        const file = array.filter((str) => {
          return Number(str.split(".")[0]) === index;
        });

        const data = fs.readFileSync(
          path.join(__dirname, tempFileDir + "/" + file)
        );

        outputFile.write(data);
        fs.removeSync(`${tempFileDir}/${file}`);
      });
      outputFile.end();
    } catch (error) {
      log(error);
    }
  });

  outputFile.on("finish", async function () {
    await fs.remove(tempFileDir);
  });

  res.status(201).send({
    filename: `video_${session_id}.${fileExtension ? fileExtension : "mp4"}`,
  });
};

module.exports.uploadTestFile = async (req, res) => {
  const form = formidable({});
  try {
    const [fields, files] = await form.parse(req);
    const { size, filepath } = files.data[0];
    const session_id = fields.session_id[0];
    let chunks = 0;
    const chunckSize = 5 * 1024 * 1024;

    while (chunks * chunckSize < size) {
      const start = chunks * chunckSize;
      const end = start + chunckSize - 1;
      const readstream = fs.createReadStream(filepath, {
        start,
        end,
      });

      await appendUpload(
        { body: { data: readstream, session_id, index: chunks } },
        res
      );
      chunks++;
    }
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
