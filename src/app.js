require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");

const downloadHandler = require("./controllers/download");
const uploadHandlers = require("./controllers/upload");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/download/:filename", downloadHandler);
app.get("/uploadstart", uploadHandlers.uploadStart);
app.post("/uploadAppend", uploadHandlers.uploadAppend);
app.post("/uploadFinish", uploadHandlers.uploadFinish);
// app.post("/uploadTest", uploadHandlers.uploadTestFile);

app.all("*", (req, res) => {
  res.sendStatus(404);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
