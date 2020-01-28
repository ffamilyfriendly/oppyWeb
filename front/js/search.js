var url = new URL(window.location.href);
let rows;

const modalOpen = (row) => {
    const template = rows[row]
    if(!template) return
    $("#template_title").text(template.name)
    $("#template_description").text(template.description)
    $("#template_id").val(`b!load ${template.id}`)
    $("#previewbtn").attr("href",`preview.html#${template.id}`)
    console.log(template)
}

const copyId = () => {
    const el = $("#template_id")
    el.select()
    document.execCommand("copy")
    $("#copied").slideDown()
}

$(document).ready(() => {
    if(!url.searchParams.has("q")) {
        //handle
        return;
    }
    const isNew = new Date().getTime() + 604800000
    $.get(`${basepath}/query?q=${url.searchParams.get("q")}`,(data) => {
        rows = data
        for(let i = 0; i < data.length; i ++) {
            $("#results").append(`<li class="list-group-item d-flex justify-content-between align-items-center"><span><b>${data[i].name} -</b> ${data[i].description} ${isNew > data[i].created ? '<span class="badge badge-info">New</span>' : ""}</span> <span style="cursor:pointer;" data-toggle="modal" data-target="#mainModal" onclick="modalOpen(${i})" class="badge menuicon"><svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"><path style="fill: white;" d="M12 18c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm0-9c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/></svg></span></li>`)
        }
    })
})