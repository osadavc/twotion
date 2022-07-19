const fs = require("fs");
const path = require("path");

const popupDir = path.join("dist/popup");
const indexFile = path.join(popupDir, "index.css");

fs.existsSync(indexFile) && fs.unlinkSync(indexFile);

const cssFiles = fs
  .readdirSync(popupDir)
  .filter((file) => file.endsWith(".css"));

fs.renameSync(path.join(popupDir, cssFiles[0]), indexFile);
