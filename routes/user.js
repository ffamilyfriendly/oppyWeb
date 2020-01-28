const router = require("express").Router(),
    request = require("request"),
    log = require("../lib/logger"),
    conf = require("../config");

router.get("/callback",async (req,res) => {
    if(!req.query.code) return res.send("no code.")
    const code = req.query.code;
    const creds = Buffer.from(`${conf.discord.id}:${conf.discord.secret}`).toString("base64")
    request(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser%2Fcallback`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${creds}`
        }
    },(err,resp) => {
        const json = JSON.parse(resp.body)
        if(!json.access_token) return res.send("no access token passed")
        log.log(`getting user for peer with token ending in "${json.access_token.substr(json.access_token.length-4)}"`,"api")
        request("http://discordapp.com/api/users/@me", {
            method:"GET",
            headers: {
                Authorization: `Bearer ${json.access_token}`
            }
        },(_err,_resp) => {
            const user = JSON.parse(_resp.body)
            log.log(`got user "${user.username}"`,"api")
            req.session.user = user;
            req.session.token = json.access_token;
            res.redirect("/");
        })
    })
})

module.exports = router;