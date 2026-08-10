var canvas = document.getElementById(`canvas`),
ctx = canvas.getContext(`2d`),
drawingText = document.getElementById(`drawingText`),
saveBtn = document.getElementById(`saveBtn`),
clearCanvas = document.getElementById(`clearCanvas`),
backToDrawing = document.getElementById(`backToDrawing`),
eraserButton = document.getElementById(`eraserButton`),
pickColor = document.getElementById(`pickColor`),
realPickColor = document.getElementById(`realPickColor`),
thicknessSlider = document.getElementById(`thicknessSlider`),
savedDrawings = document.getElementById(`savedDrawings`),
savedDrawingsBtn = document.getElementById(`savedDrawingsBtn`),
savedColors = document.getElementById(`savedColors`),
penColor = `rgb(0, 0, 0)`, penThickness = thicknessSlider.value,
mouseDown = false, strokes = [], currentStrokeIndex = -1

if (localStorage.getItem(`savedColors`)) {
    localStorage.getItem(`savedColors`).split(`*`).filter(color => color != ``).forEach(color => {
        penColor = color
        saveColor(true)
    })
} penColor = `rgb(0, 0, 0)`

pickColor.onclick = function() {
    realPickColor.click();
}

savedColors.addEventListener(`wheel`, (e) => {
    e.preventDefault()
    savedColors.scrollLeft += e.deltaY / 3
}, {passive: false})

realPickColor.oninput = function(e) {
    var hex = this.value
    var rgb = `rgb(${parseInt(hex.substring(1, 3), 16)}, ${parseInt(hex.substring(3, 5), 16)}, ${parseInt(hex.substring(5, 7), 16)})`
    selectColor(rgb)
    pickColor.style.backgroundColor = rgb
}

function selectColor(color) {
    penColor = color
    thicknessSlider.style.accentColor = penColor
    Array.from(savedColors.children).forEach(child => {
        if (child.style.backgroundColor != color) child.style.border = `4px solid white`
    }); eraserButton.style.border = `4px solid white`
}

function saveColor(savedAlready) {
    var savedColorsArr = Array.from(savedColors.children)
    if (savedColorsArr.find(color => color.style.backgroundColor == penColor)) {
        return alert("You already have that color saved!");
    } var newColor = document.createElement(`span`)
    newColor.style.backgroundColor = penColor
    newColor.style.borderRadius = `50%`
    newColor.style.border = `4px solid white`
    newColor.style.width = `50px`
    newColor.style.height = newColor.style.width
    newColor.style.margin = `5px 5px 0 5px`
    newColor.style.display = `inline-block`
    newColor.onclick = function() {selectSavedColor(newColor)}
    savedColors.appendChild(newColor)
    savedColors.scrollLeft = savedColors.scrollWidth
    if (!savedAlready) {
        if (localStorage.getItem(`savedColors`)) {
            localStorage.setItem(`savedColors`, localStorage.getItem(`savedColors`) + `*` + newColor.style.backgroundColor)
        } else localStorage.setItem(`savedColors`, newColor.style.backgroundColor)
    }
}

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
        var editBtn = document.createElement(`button`)
        editBtn.textContent = `Edit`
        editBtn.style.fontSize = `30px`
        editBtn.style.backgroundColor = `lightblue`
        editBtn.onclick = function() {
            drawingText.innerHTML = `<br>${name.textContent}`
            newPage(`canvas`, true)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            var img = new Image()
            img.src = str.replace(name.textContent + `*`, ``)
            ctx.drawImage(img, 0, 0)
        }; drawingDiv.appendChild(name)
        drawingDiv.appendChild(drawing)
        drawingDiv.appendChild(editBtn)
        drawingDiv.appendChild(renameBtn)
        drawingDiv.appendChild(deleteBtn)
        savedDrawings.appendChild(drawingDiv)
    })
} if (localStorage.getItem(`drawings`)) updateDrawings()
else localStorage.setItem(`drawings`, ``)
thicknessSlider.oninput = function() {
    penThickness = this.value
}; canvas.onmousedown = function(e) {
    mouseDown = true; draw(e)
}; canvas.ontouchstart = canvas.onmousedown
canvas.onmousemove = draw
canvas.ontouchmove = canvas.onmousemove
canvas.addEventListener(`mouseup`, e => {
    e.stopImmediatePropagation()
    mouseDown = false, currentStrokeIndex++, addStroke()
}); canvas.onmouseout = canvas.onmouseup
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
} function selectSavedColor(color) {
    var backgroundColor = color.style.backgroundColor
    var redAmount = parseInt(backgroundColor.slice(backgroundColor.indexOf(`(`) + 1, backgroundColor.indexOf(`,`)))
    var greenAmount = parseInt(backgroundColor.slice(backgroundColor.indexOf(`,`) + 2, backgroundColor.lastIndexOf(`,`)))
    var blueAmount = parseInt(backgroundColor.slice(backgroundColor.lastIndexOf(`,`) + 2, backgroundColor.indexOf(`)`)))
    var blackBorderLimit = 80
    if (color.tagName == `IMG`) selectColor(`rgb(255, 255, 255)`)
    else selectColor(backgroundColor)
    if (Number.isNaN(redAmount) ||
        (redAmount > blackBorderLimit
        || greenAmount > blackBorderLimit
        || blueAmount > blackBorderLimit)) {
        color.style.border = `4px solid rgb(0, 0, 0)`
    } else {
        color.style.border = `4px solid rgb(160, 160, 160)`
    }
} function deleteColor() {
    Array.from(savedColors.children).forEach(color => {
        if (!color.style.border.includes(`white`)) {
            color.remove()
            localStorage.setItem(`savedColors`, localStorage.getItem(`savedColors`).replace(color.style.backgroundColor, ``))
        }
    })
} function newPage(page, edit) {
    if (page == `canvas`) {
        savedDrawings.hidden = true
        if (!localStorage.getItem(`drawings`).includes(drawingText.textContent)) {
            edit = false
            clearCanvas.click()
        } Array.from(document.body.children).filter(elem => {
            if (elem != savedDrawings && elem != savedDrawingsBtn) {
                if (elem == drawingText) {
                    if (edit) elem.hidden = false
                    else elem.hidden = true
                } else {
                    elem.hidden = false
                    if (elem.id != `realPickColor`)  {
                        elem.style.visibility = `visible`
                    }
                }
            }
        }); backToDrawing.onclick = function() {newPage(`canvas`, edit)}
    } else {
        Array.from(document.body.children).forEach(elem => {
            if (elem != savedDrawings && elem != savedDrawingsBtn) {
                elem.hidden = true
                if (elem != drawingText) elem.style.visibility = `hidden`
            }
        })
        savedDrawings.hidden = false
    }
} function saveDrawing(rename, deleteBtn) {
    if (drawingText.hidden) {
        var name = prompt(`Give your drawing a ${rename ? `new ` : ``}name.`)
        if (localStorage.getItem(`drawings`).includes(`${name}*`) || (name != null && name.replaceAll(` `, ``) == ``)) {
            if (name != null && name.replaceAll(` `, ``) == ``) alert(`That is not a valid name.`)
            else {
                if (confirm(`You already have a drawing with that name. Do you want to replace it with this drawing?`) == true) {
                    if (deleteBtn) deleteBtn.click()
                    saveDrawingData(localStorage.getItem(`drawings`).replace(localStorage.getItem(`drawings`).split(`, `).find(str => str.includes(`${name}*`)).split(`*`)[1], rename ? rename.src : canvas.toDataURL()))
                    return
                }
            } saveDrawing(rename, deleteBtn)
        } else if (name != null) saveDrawingData(rename ? localStorage.getItem(`drawings`).replace(`${rename.name}*`, `${name}*`) : localStorage.getItem(`drawings`) + `${name}*${canvas.toDataURL()}, `)
    } else {
        saveDrawingData(localStorage.getItem(`drawings`).replace(localStorage.getItem(`drawings`).split(`, `).find(str => str.includes(`${drawingText.textContent}*`)).split(`*`)[1], canvas.toDataURL()))
        saveBtn.textContent = `Saved!`
        setTimeout(() => {
            saveBtn.textContent = `Save`
        }, 3000)
    }
} function saveDrawingData(data) {
    localStorage.setItem(`drawings`, data)
    updateDrawings()
} function undo() {
    currentStrokeIndex--
    var undoImage = new Image(),
    undoImageSrc = strokes[currentStrokeIndex]
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!undoImageSrc) return
    undoImage.src = undoImageSrc
    undoImage.onload = function() {
        ctx.drawImage(undoImage, 0, 0)
    }
} function redo() {currentStrokeIndex++
    var redoImage = new Image(),
    redoImageSrc = strokes[currentStrokeIndex]
    if (!redoImageSrc) return
    redoImage.src = redoImageSrc
    redoImage.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(redoImage, 0, 0)
    }
} function addStroke() {strokes.splice(currentStrokeIndex, 0, canvas.toDataURL())}