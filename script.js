var canvas = document.querySelector(`canvas`),
ctx = canvas.getContext(`2d`),
thicknessSlider = document.getElementById(`thicknessSlider`),
savedDrawings = document.getElementById(`savedDrawings`),
penColor = `black`,
penThickness = thicknessSlider.value,
mouseDown = false
function updateDrawings() {
    Array.from(savedDrawings.children).forEach(elem => {if (elem.tagName == `DIV`) elem.remove()})
    localStorage.getItem(`drawings`).split(`, `).filter(str => str != ``).forEach(str => {
        var drawingDiv = document.createElement(`div`)
        drawingDiv.style.margin = `10px`
        drawingDiv.style.width = `25%`
        drawingDiv.style.display = `inline-block`
        var name = document.createElement(`label`)
        name.textContent = str.split(`*`)[0]
        name.style.fontSize = `30px`
        var drawing = document.createElement(`img`)
        drawing.src = str.split(`*`)[1]
        drawing.style.width = `100%`
        var deleteBtn = document.createElement(`button`)
        deleteBtn.textContent = `Delete`
        deleteBtn.style.fontSize = `30px`
        deleteBtn.style.backgroundColor = `lightblue`
        deleteBtn.onclick = saveDrawingData.bind(this, localStorage.getItem(`drawings`).replace(`${name.textContent}*${drawing.src}, `, ``))
        var renameBtn = document.createElement(`button`)
        renameBtn.textContent = `Rename`
        renameBtn.style.fontSize = `30px`
        renameBtn.style.backgroundColor = `lightblue`
        renameBtn.onclick = saveDrawing.bind(this, {name: name.textContent, src: drawing.src}, deleteBtn)
        drawingDiv.appendChild(name)
        drawingDiv.appendChild(drawing)
        drawingDiv.appendChild(renameBtn)
        drawingDiv.appendChild(deleteBtn)
        savedDrawings.appendChild(drawingDiv)
    })
} if (localStorage.getItem(`drawings`)) updateDrawings()
else localStorage.setItem(`drawings`, ``)
thicknessSlider.oninput = function() {
    penThickness = this.value
    thicknessSlider.slid
}; canvas.onmousedown = function(e) {
    mouseDown = true; draw(e)
}; canvas.ontouchstart = canvas.onmousedown
canvas.onmousemove = draw
canvas.ontouchmove = canvas.onmousemove
canvas.onmouseup = function() {mouseDown = false}
canvas.onmouseout = canvas.onmouseup
canvas.ontouchend = canvas.onmouseup
canvas.ontouchcancel = canvas.onmouseup
function draw(e) {
    if (mouseDown) {
        var mouseX = (e.touches ? e.touches[0].clientX : e.clientX) - canvas.getBoundingClientRect().left
        var mouseY = (e.touches ? e.touches[0].clientY : e.clientY) - canvas.getBoundingClientRect().top
        ctx.beginPath()
        ctx.fillStyle = penColor
        ctx.arc(mouseX, mouseY, penThickness, 0, Math.PI * 2)
        ctx.fill()
        ctx.closePath()
    }
} Array.from(document.getElementById(`colors`).children).forEach(color => {
    color.onclick = function() {
        penColor = this.style.backgroundColor;
        this.style.border = `4px solid ${penColor == `black` ? `red` : `black`}`
        Array.from(this.parentElement.children).forEach(child => {
            if (child != color) child.style.border = ``
        })
    }
}); function newPage(newPage) {
    if (newPage == `canvas`) {
        savedDrawings.hidden = true
        Array.from(document.body.children).filter((elem, i, arr) => i >= arr.indexOf(canvas)).forEach(elem => elem.hidden = false)
    } else {Array.from(document.body.children).filter((elem, i, arr) => i >= arr.indexOf(canvas)).forEach(elem => elem.hidden = true)
        savedDrawings.hidden = false
    }
} function saveDrawing(rename, deleteBtn) {
    var name = prompt(`Give your drawing a ${rename ? `new ` : ``}name.`)
    if (localStorage.getItem(`drawings`).includes(`${name}*`) || (name != null && name.replaceAll(` `, ``) == ``)) {
        if (name != null && name.replaceAll(` `, ``) == ``) alert(`That is not a valid name.`)
        else {
            if (confirm(`You already have a drawing with that name. Do you want to replace it with this drawing?`) == true) {
                deleteBtn.click()
                saveDrawingData(localStorage.getItem(`drawings`).replace(localStorage.getItem(`drawings`).split(`, `).find(str => str.includes(`${name}*`)).split(`*`)[1], rename ? rename.src : canvas.toDataURL()))
                return
            }
        } saveDrawing(rename, deleteBtn)
    } else if (name != null) saveDrawingData(rename ? localStorage.getItem(`drawings`).replace(`${rename.name}*`, `${name}*`) : localStorage.getItem(`drawings`) + `${name}*${canvas.toDataURL()}, `)
} function saveDrawingData(data) {
    localStorage.setItem(`drawings`, data)
    updateDrawings()
}