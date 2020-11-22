const config = require("config");
module.exports = function() {
  //ta zmienna powinna być ustawiona jako pusty string w pliku config/default.json
  if (!config.get("jwtPrivateKey")) {
    throw new Error(`FATAL ERROR: jwtPrivateKey is not defined`);
  }
};
