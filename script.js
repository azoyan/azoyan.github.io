
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function copy() {
    var copyText = document.getElementById("target");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}


function translate() {
    var str = document.getElementById("source").value;
    let lines = str.split(/\r?\n/);

    let result = 'WEBVTT\nKind: captions\nLanguage: en\n\n'

    let timecodes = []
    let descriptions = []
    for (let i = 0; i < lines.length; ++i) {
        let splitted_line = lines[i].split('➡️')
        console.log(splitted_line)
        if (splitted_line.length > 1) {
            timecodes.push(splitted_line[0].replace(/(^[\s]+|[\s]+$)/g, ''))
            descriptions.push(splitted_line[1].replace(/(^[\s]+|[\s]+$)/g, ''))
        }
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
