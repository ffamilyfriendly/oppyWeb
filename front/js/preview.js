//channelList

$(document).ready(() => {
    if(!window.location.hash) window.location = "index.html"
    $.get(`${basepath}/template/${window.location.hash.substr(1)}`,(data) => {
        const template = data[0]
        template.data = JSON.parse(template.data)
        $("#servername").text(template.name)
        for(let i = 0; i < template.data.channels.length; i++) {
            const channel = template.data.channels[i]
            $("#channelList").append(`<li class="category">${channel.name}</li>`)
            for(let j = 0; j < channel.children.length; j++) {
                const child = channel.children[j]
                $("#channelList").append(`<li class="channel"><strong>${child.type == "text" ? "#" : "🔊"}</strong>  ${child.name}</li>`)
            }
            $("#channelList").append("<br>")
        }
    })
})
