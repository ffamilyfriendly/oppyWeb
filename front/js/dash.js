let templates = []
let active

$(document).ready(() => {
    $.get(`${basepath}/dash/a/getTemplates`,(data) => {
        templates = data
        for(let i = 0; i < data.length; i++) {
            const chan = data[i]
            $("#chanlist").append(`<li class="list-group-item d-flex justify-content-between align-items-center"><span>${chan.name} <small>(${chan.id})</small></span> <span onclick="setActive(${i})" data-toggle="modal" data-target="#edit" class="badge menuicon"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path style="fill: white;" d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/></svg></span></li>`)
        }
    })
    $(".menuicon").click((e) => {
        console.log(e)
    })
})

const ud = (text,type = "info") => {
    const stat = $("#mainStat")
    stat.css("display","block")
    stat.attr("class", `alert alert-${type}`)
    stat.text(text)
}

const setActive = (id) => {
    active = templates[id]
    $("#exit_name").val(active.name)
    $("#exit_description").val(active.description)
    $("#exit_tags").val(active.tags)
}

//cash cahs cash
const deleteTemplate = () => {
    $.ajax({
        method:"DELETE",
        url:`${basepath}/dash/a/template/${active.id}`,
        success: data => {
            ud(data,"success")
        },
        error: err => {
            console.error(err)
            ud(err.responseText,"danger")
        }
    })
}

const saveTemplate = () => {
    const name = $("#exit_name").val()
    const description = $("#exit_description").val()
    const tags = $("#exit_tags").val()
    const id = active.id

    $.ajax({
        method:"PATCH",
        url:`${basepath}/dash/a/template/${active.id}`,
        data:{id,name,description,tags},
        success: data => {
            ud(data,"success")
        },
        error: err => {
            console.error(err)
            ud(err.responseText,"danger")
        }
    })
}

//endof cahs cash

const checkId = () => {
    const id = $("#upload_id").val()
    console.log(id)
    let show = false
    if(id) {
        $.get(`${basepath}/dash/a/server/${id}`,(data) => {
            show = data
            $("#displayafter_correctid").css("display",show?"inherit":"none")
        })
    } 
}

const upload = () => {
    const id = $("#upload_id").val()
    const name = $("#upload_name").val()
    const description = $("#upload_description").val()
    const tags = $("#upload_tags").val()
    const private = $("#upload_id").checked
    $.post(`${basepath}/dash/a/new`, {
        id,name,description,tags,private
    },(data) => {
        window.location.reload()
    }).fail(err => console.error(err))
}