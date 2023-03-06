// Alternative mapping arrays
const DARK_TO_BRIGHT_ASCII_1 = "@#$&%*o+i;:,.'` "
const DARK_TO_BRIGHT_ASCII_2 = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
const DARK_TO_BRIGHT_ASCII_3 = "Ñ@#W$9876543210?!abc;:+=-,._ "
const DARK_TO_BRIGHT_EMOJI = ["1F5A4", "1F977", "1F98D",  "1F993", "1F463",   "1F47b", "1F480",  "1F440", "1F9B4", "1F90D", "1F4AC",  "1F5EF", " "].map(x => (x !== " ") ? "&#x" + x : x)

const getPixelAt = (imageData, x, y) => {
    const redIdx = y * (imageData.width * 4) + x * 4;
    return {
        red: imageData.data[redIdx],
        green: imageData.data[redIdx + 1],
        blue: imageData.data[redIdx + 2],
        alpha: imageData.data[redIdx + 3]
    }
}

const updateCanvas = (canvas, imageData) => {
    var ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0)
}

const brightnessToChar = (darkToBrightArray, brightness) => {
    const charIdx = Math.floor(  ((darkToBrightArray.length-1) / 255) * brightness)
    const character = darkToBrightArray[charIdx];
    // Force the web page to actually render a space character
    return character === " " ? "&nbsp;": character;
}

const brightnessAt = (imageData, x,y) => {
    const {red,green,blue,alpha} = getPixelAt(imageData, x, y);
    if (alpha < 255) {
        return 255;
    }
    return Math.floor(red + green + blue) / 3
}

const convertToDomElement = (imageData, document, darkToBrightArray) => {
    const container = document.createElement("div");
    container.style = "font-family: monospace; display:grid; grid-template-columns: repeat(" + imageData.width  +", 1rem)"

    for (let i=0; i < imageData.data.length; i += 4) {
        const x = (i / 4) % imageData.width;
        const y = Math.floor((i / 4) / imageData.width);

        const cell = document.createElement("div")
        cell.innerHTML = brightnessToChar(darkToBrightArray, brightnessAt(imageData, x,y));
        container.appendChild(cell)
    }

    return container;
}

const SCALE_FACTOR = 15;

window.addEventListener('DOMContentLoaded', (event) => {
    const content = document.getElementById("content");

    // Read raw image
    const rawImageElement = document.getElementById("sourceImage");

    // Canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = Math.abs(rawImageElement.width / SCALE_FACTOR);
    canvas.height = Math.abs(rawImageElement.height / SCALE_FACTOR);
    context.drawImage(rawImageElement, 0,0, canvas.width, canvas.height )

    const imageData = context.getImageData(0,0, canvas.width, canvas.height)

    // Add canvas element
    const outputCanvasElement = document.createElement("canvas")

    outputCanvasElement.id = "theCanvas";
    outputCanvasElement.width = canvas.width;
    outputCanvasElement.height = canvas.height;

    updateCanvas(outputCanvasElement, imageData)

    const asciiDomElement = convertToDomElement(imageData, document, DARK_TO_BRIGHT_EMOJI,);
    content.appendChild(asciiDomElement);
});