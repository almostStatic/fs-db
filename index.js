const fs = require("fs");

/**
 * Create a new filesystem database class.
 * Comes with get, set, and remove functions.
 * @example new Database("./db/");
 */
class Database {
  /**
   * Instantiates the filesystem database with the path specified
   * @param {String} path Where data is to be stored
   * @constructor
   */
	constructor (path) {
		if (!fs.existsSync(path)) {
			throw new Error(`[NONEXISTANT_PATH_ERROR]: Path '${path}' does not exist`)
		} else {
      if (!path.endsWith('/')) {
        this.path = path + '/'; 
      } else {
        this.path = path;
      };
    };
	};
  
  getFilePath(p) {
    if (!p) return this.path;
    if (p.startsWith('/')) p = p.slice(1, p.length);
    return this.path + p;
  };
  fornatOptions(opts = {}, func) {
    if (func == "g") {
      //"g", get function
      if (!opts.precisePath) opts.precisePath = "";
      if (!opts.dataType) opts.dataType = "str";
      if (!opts.encoding) opts.encoding = "utf8";
      if (!opts.flag) opts.flag = "r";
      return opts;
    }
    return opts;
  };
  /**
   * 
   * @param {String} key Name of key to get from database
   * @param {Object} opts Options 
   * @param {String} opts.precisePath Additional precision for the path of the file added on top of the path specified
   * @param {String} opts.dataType Options as to what data type this value should be returned as. This value defaults to `"string"`
   * @param {String} opts.encoding Encoding to get the value in. This value is parsed directly into fs itself. Defaults to `"r"`
   * @param {String} opts.flag Flag which is to be used when reading the contents of the file. This value defaults to `"utf8"`
   */
  get(key, opts = { precisePath: "", dataType: "string", encoding: "utf8", flag: "r" }) {
    if (key.startsWith('/')) key = key.replace('/', '');
    opts = this.fornatOptions(opts, "g");
    let path = this.getFilePath(opts.precisePath + "/" + key);
    if (!fs.existsSync(path)) return null;
    let types = [ [ "bigint", BigInt ], [ "number", Number ], [ "date", Date ], [ "str", String ], [ "json", JSON.parse ] ];
    let value = fs.readFileSync(path, { encoding: opts.encoding, flag: opts.flag }) || null;
    let type = types.findIndex((f) => opts.dataType.toLowerCase().startsWith(f[0])) || 3;
    return types[type][1](value);
  };
  /**
   * Sets a value by creating a txt file in the directory specified, and under the key given with contents of the value parsed
   * @param {String} key Name of the value which is to be set
   * @param {String} value Value of KEY - contents of the txt file
   * @param {Object} options Options of which this must be set under
   * @param {String} options.precisePath Any subfolder in the current path which this is meant to be set in
   */
  set(key, value, opts = { precisePath: "" }) {
    if (!opts.precisePath) opts.precisePath = "";
    let path = this.getFilePath(opts.precisePath);
    if (!fs.existsSync(path)) fs.mkdirSync(path);
    fs.writeFileSync(path + '/' + key, value);
    return true;
  };
  /**
   * Removes a value from your filesystem database, deleting the txt file
   * @param {String} key Name of they key to remove
   * @param {Object} opts Options to remove the file with
   * @param {String} opts.precisePath Any subfolder in the current path which this is meant to be set in
   */
  remove(key, opts = { precisePath: "" }) {
    if (!opts.precisePath) opts.precisePath = "";
    let path = this.getFilePath(opts.precisePath + '/' + key);
    try {
      fs.unlinkSync(path);
    } catch (error) {
      throw error;
    };
    return true; //success
  };
  /**
   * Gets all the entries saved into said <dir> path. Returns a 2 dimensional array. Ignores subfolders in said directory.
   * @param {String} dir Directory of which to get key/value pairs. If this is not specified, then it will default to Database.path
   * @returns {Array<string>} entries 
   */
  entries(dir = "") {
    let dir = this.getFilePath(this.path + dir);
    let data = [];
    for (file of fs.readdirSync(dir)) {
      let bfr = Buffer.from(fs.readFileSync(`${dir}/${file}`)).toString("ascii");
      data.push([file, bfr]);
    };
    return data;
  };
};

module.exports = Database;