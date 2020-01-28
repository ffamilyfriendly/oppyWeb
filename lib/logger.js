const fs = require("fs")
let logBuffer = "";
let it = 0;

exports.log = (text,type="log") => {
    const logstr = `[${new Date().toISOString()}/${type.toUpperCase()}] : ${text}`
    console.log(logstr)
    logBuffer += `${logstr}\n`
    if(it > 10) {
        exports.flush()
    }
    it++;
}

exports.flush = () => {
    it = 0;
    fs.appendFileSync("./log.txt",logBuffer)
    logBuffer = "";
}