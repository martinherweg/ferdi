const dir = require("node-dir");

module.exports = function searchFile(currentDir) {
  return new Promise((resolve, reject) => {
    dir.readFiles(
      currentDir,
      {
        match: /(config|package).json/g,
        recursive: false
      },
      function(err, content, filename, next) {
        if (err) throw err;
        console.log("searching file");
        if (!content.includes("moduleCreator")) {
          console.log("nothing found");
          reject("Oh no nothign found");
        }
        console.log("found something");
        resolve(filename);
        next();
      }
    );
  });
};
