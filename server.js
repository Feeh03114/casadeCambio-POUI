const express = require("express");
const compression = require("compression");

const path = require("path");

const app = express();

app.use(compression());

app.use(express.static(__dirname + "/dist/casa-cambio", { maxAge: 0 }));

app.get("*", function (req, res) {
  res.sendFile(path.join(process.cwd(), "/dist/casa-cambio/index.html"));
});

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});
