export function pathFromCoords(x: number, z: number) {
    let path = "x";
    path += splitNumberToPath(x);

    path += "z";
    path += splitNumberToPath(z);

    path = path.substring(0, path.length - 1);

    return path;
}

function splitNumberToPath(num: number) {
    let path = "";

    if (num < 0) {
        num = -num;
        path += "-";
    }

    let s = num.toString();

    for (let i = 0; i < s.length; i++) {
        path += s.charAt(i) + "/";
    }

    return path;
}

export function stringToImage(string: string) {
    const image = document.createElementNS("http://www.w3.org/1999/xhtml", "img") as HTMLImageElement;
    image.src = string;
    return image;
}
