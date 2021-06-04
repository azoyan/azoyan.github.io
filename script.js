
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function copy() {
    var copyText = document.getElementById("target");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

class Time {
    constructor(time_str) {
        let raw_strings = time_str.split(':').reverse()
        this.seconds = parseInt(raw_strings[0] ? raw_strings[0] : "00")
        this.minutes = parseInt(raw_strings[1] ? raw_strings[1] : "00")
        this.hours = parseInt(raw_strings[2] ? raw_strings[2] : "00")
    }

    tostring() {
        let s = '' + pad(this.hours, 2) + ':' + pad(this.minutes, 2) + ':' + pad(this.seconds, 2) + '.000'
        return s
    }
    add_one_minute() {
        if ((this.minutes + 1) > 60) {
            this.hours += 1
            this.minutes = 0
        } else {
            this.minutes += 1
        }
        return this
    }
}

String.prototype.decodeHTML = function() {
    var map = {"gt":">" /* , … */};
    return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
};

function downloadFile() {
    translate()
    let text = document.getElementById("target").innerHTML
    text = text.decodeHTML()
    var filename = "WEBVTT.vtt";
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function translate() {
    let str = document.getElementById("source").value;

    let result = 'WEBVTT\nKind: captions\nLanguage: en\n\n'

    const regex = new RegExp(/(?:\d\d(?::)\d\d)/)
    const regex_multiline = new RegExp(/(?:\d\d(?::)\d\d)/igm)

    let descriptions = str.split(regex)
    descriptions = descriptions.filter(function (el) {
        return el != null && el.length > 0
    })
    for (i = 0; i < descriptions.length; ++i) {
        descriptions[i] = descriptions[i].replace("➡️", '').trim()
    }
    descriptions.forEach(element => {
        return element.replace("➡️", '')
    });
    console.log(descriptions)
    let timecodes = []

    while (match = regex_multiline.exec(str)) {
        timecodes.push(match.toString())
    }
    console.log(timecodes)

    let vtt = []
    for (let i = 0; i < timecodes.length; ++i) {
        let time1 = new Time(timecodes[i])
        let time1str = time1.tostring()
        let time2 = ((i + 1 < timecodes.length) ?
            new Time(timecodes[i + 1]) : time1.add_one_minute()).tostring()

        let vtt_time = time1str + ' --> ' + time2 + '\n' + descriptions[i] + '\n\n';
        vtt.push(vtt_time)
    }
    document.getElementById("target").innerHTML = result + vtt.join('');
}
