const conf = require("./config"),
    log = require("./lib/logger"),
    discord = require("discord.js"),
    client = new discord.Client(),
    app = require("express")(),
    dbl = require("dblapi.js"),
    session = require('express-session'),
    sql = require("sqlite3");

var db = new sql.Database("./data/data.db");
var DBL = new dbl(conf.discord.dblToken);
//make sure table exists
db.run("CREATE TABLE IF NOT EXISTS templates (id TEXT PRIMARY KEY, name TEXT, createdBy TEXT, description TEXT, tags TEXT, data TEXT, created INTEGER, last_used INTEGER, private INTEGER)");
const bp = require("body-parser")

app.use(bp.urlencoded({extended:false}))
app.use(bp.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

module.exports = {
    client:client,
    db:db,
    dbl:DBL
}

app.use("/user",require("./routes/user"))
app.use("/dash",require("./routes/dash"))

const escapeString = (str) => {
    return str.replace(/\"|\'/gi,"*")
}

app.get("/stats",(req,res) => {
    db.all("SELECT * FROM templates;",(err,rows) => {
        res.json({
            bot: {
                guild_size: client.guilds.size,
                user_size: client.users.size
            },
            templates: {
                preset_count: rows.length
            }
        })
    })
})

app.get("/loggedIn",(req,res) => {
    res.send(!!req.session.user)
})

app.get("/me",(req,res) => {
    res.send(req.session.user)
})

app.get("/query",(req,res) => {
    if(!req.query.q) return res.status(400).send("no q query parameter");
    req.query.q = escapeString(req.query.q)
    db.all(`SELECT * FROM templates WHERE name LIKE "%${req.query.q}%" OR description LIKE "%${req.query.q}%" OR instr(tags, '${req.query.q}') > 0 AND private = 0`,(err,rows) => {
        if(err) console.error(err)
        res.send(rows)
    })
})

app.get("/template/:id",(req,res) => {
    const id = req.params.id
    db.all(`SELECT * FROM templates WHERE id = "${escapeString(id)}"`,(err, rows) => {
        res.send(rows)
    })
})

//REMOVE AFTER DEBUG PERIOD
app.get(/\/(.*)/,(req,res) => {
    res.sendFile(`/home/jonathan/Documents/code/javascript/oppyApi/front/${req.params["0"]}`)
})

app.listen(conf.port,() => {
    log.log("listening...","api");
})

//discord shit
client.login(conf.discord.token)
.catch(err => log.log(`could not init discord client. "${err}"`,"discord"))

client.once("ready",() => {
    log.log(`discord client initialized succesfully.`)
})


