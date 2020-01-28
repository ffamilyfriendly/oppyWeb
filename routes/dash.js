const router = require("express").Router(),
    log = require("../lib/logger"),
    hasVoted = require("../lib/premium"),
    createTemplate = require("../lib/template"),
    {client,db} = require("../index"),
    conf = require("../config");

const escapeString = (str) => {
    return str.replace(/\"|\'/gi,"*")
}

const escapeHtml = (str) => {
    return str.replace(/\<|\>/gi,"*");
}

router.use("/a",(req,res,next) => {
    if(!req.session.user) return res.redirect("/")
    else next()
})

router.get("/a/server/:id",(req,res) => {
    const id = req.params.id
    if(!id) return res.send(false);
    if(client.guilds.has(id)) return res.send(true)
    else res.send(false)
})

router.get("/a/getTemplates",(req,res) => {
    db.all(`SELECT * FROM templates WHERE createdBy = "${req.session.user.id}"`,(err,rows) => {
        res.send(rows)
    })
})

router.delete("/a/template/:id",(req,res) => {
    db.all(`DELETE FROM templates WHERE id = "${escapeString(req.params.id)}" AND createdBy = "${req.session.user.id}"`,(err) => {
        if(err) res.status(500).send("could not delete template")
        else res.send("deleted template succesfully!")
    })
})

router.patch("/a/template/:id",(req,res) => {
    const {name,description,tags} = req.body
    const id = req.params.id
    db.all(`UPDATE templates SET name = "${escapeHtml(escapeString(name))}", description = "${escapeHtml(escapeString(description))}", tags = "${escapeHtml(escapeString(tags))}" WHERE id = "${escapeString(id)}" AND createdBy = "${req.session.user.id}"`,(err) => {
        if(err) res.status(500).send("could not delete template")
        else res.send("updated template succesfully!")
    })
})

router.post("/a/new", async (req,res) => {
    let {name,description,tags,private,id} = req.body
    if([name,description,tags,id].includes(undefined)) return res.status(400).send("missing required fields")
    if(!client.guilds.has(id)) return res.status(403).send("no such server")
    const voted = await hasVoted(req.session.user.id)
    if(!private || !voted) private = false;
    db.all(`SELECT * FROM templates WHERE createdBy = "${req.session.user.id}"`,(err,rows) => {
        if(rows && rows.length >= 3 && !hasVoted) {
            return res.status(403).send("non premium user may not have more then 3 templates")
        }
        const serverdata = JSON.stringify(createTemplate(id))
        const now = new Date().getTime()
        db.run(`INSERT INTO templates VALUES ("${Buffer.from(Math.random().toString()).toString("base64")}","${escapeHtml(escapeString(name))}","${req.session.user.id}","${escapeHtml(escapeString(description))}","${escapeHtml(escapeString(tags))}",'${serverdata}',${now},${now},${private ? 1 : 0})`,(err) => {
            if(err) res.status(500).send(err)
            else res.send("created!")
        })
    })
})

module.exports = router;