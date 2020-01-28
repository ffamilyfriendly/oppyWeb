const basepath = "http://localhost:3000"
const infPath = "https://familyfriendly.xyz/s/bot/info.json"
const botInvite = "https://discord.gg"
const loginLink = "https://discordapp.com/api/oauth2/authorize?client_id=526513625842712576&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fuser%2Fcallback&response_type=code&scope=identify%20guilds"

const prepLink = () => {
    
    $.get(`${basepath}/me`,(data) => {
        const uniqueId = btoa(`inv${data.id}oppy`)
        console.log("gett")
        $.get(`https://l.familyfriendly.xyz/api/l/fetchInfo/${uniqueId}`,(linkData) => {
            if(linkData == "no such link") {
                $.post("https://l.familyfriendly.xyz/api/l/newLink",{
                    url:botInvite,
                    id:uniqueId
                })
            } else {
                const dparsed = JSON.parse(linkData.json)
                $(".uniqueInvLinkProgress").text(dparsed.clicks)
                $(".uniqueInvLinkLeft").text(20 - dparsed.clicks)
                $(".uniqueInvLinkLeftPercent").text(dparsed.clicks / 20 * 100)
            }

        })
        if(typeof data.id == "undefined") {
            $(".uniqueInvlink").text("log in to get unique link")
        } else {
            $(".uniqueInvlink").text(`l.familyfriendly.xyz/${uniqueId}`)
        }
    })
}

$(document).ready(() => {
    $(".inv").attr("href",botInvite)
    $(".login").attr("href",loginLink)
    $.get(`${basepath}/loggedIn`,(data) => {
        $("body").attr("loggedIn",data)
        if(data) prepLink()
    })

    $.get(infPath,(data) => {
        console.log(data)
        for(let i = 0; i < data.headers.length; i++) {
            const header = data.headers[i]
            $("#warningContainer").prepend(`<div class="alert alert-${header.type||"info"} ${header.dismiss ? "alert-dismissible":""}" role="alert">${header.text||"formatting err"} ${header.dismiss ? '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>': ""}`)
        }
    })

    $.get(`${basepath}/stats`,(data) => {
        const percentDone = (data.bot.guild_size / $("#milestone").attr("aria-valuemax")) * 100
        $("#milestone").css("width",`${percentDone}%`)
        $("#milestone").text(`${percentDone}%`)
        $(".templateSize").text(data.templates.preset_count)
    })
})