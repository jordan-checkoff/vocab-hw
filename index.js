const getWord = async (word) => {
    let res = await fetch(`https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=5a5e7aff-a02f-401b-b646-bd2ecaad3417`)
    let output = await res.json()
    console.log(output)
    let options = []
    for (let i=0; i < output.length; i++) {
        let syn = output[i].meta ? (output[i].meta.syns[0] ? output[i].meta.syns[0][0] : null) : null
        let ant = output[i].meta ? (output[i].meta.ants[0] ? output[i].meta.ants[0][0] : null) : null
        let def = output[i].shortdef[0]
        let pos = output[i].fl
        options.push({word, def, pos, syn, ant})
    }
    return options
}

const getWords = async (words) => {
    let output = []
    for (let i=0; i < words.length; i++) {
        let single = await getWord(words[i])
        output.push(single)
    }
    return output
}

const readInputs = async () => {
    let words = input.value.split("\n")
    let defs = await getWords(words)
    defset = makeDefSet(defs)
    defset.display()
}

const makeDefSet = (defs) => {

    return {
        defs: defs,
        curr: Array.from({length: defs.length}, (_, i) => 0),
        arrows: true,
        display: function() {
            while (defTable.hasChildNodes()) {
                defTable.removeChild(defTable.firstChild)
            }
            for (let i=this.defs.length - 1; i >= 0; i--) {
                let row = defTable.insertRow(0);
                let defCell = row.insertCell(0)
                let posCell = row.insertCell(1)
                let synCell = row.insertCell(2)
                let antCell = row.insertCell(3)
                let wordCell = row.insertCell(0)
                defCell.innerHTML = this.defs[i][this.curr[i]].def
                posCell.innerHTML = this.defs[i][this.curr[i]].pos
                synCell.innerHTML = this.defs[i][this.curr[i]].syn
                antCell.innerHTML = this.defs[i][this.curr[i]].ant
                wordCell.innerHTML = this.defs[i][this.curr[i]].word
                if (this.arrows) {
                    let leftCell = row.insertCell(0)
                    let rightCell = row.insertCell(6)
                    leftCell.style.border = "none";
                    rightCell.style.border = "none";
                    if (this.defs[i].length > 1) {
                        leftCell.innerHTML = "&#8592"
                        rightCell.innerHTML = "&#8594;"
                    } else {
                        leftCell.innerHTML = "&nbsp;"
                        rightCell.innerHTML = "&nbsp;"
                    }
                    leftCell.addEventListener("click", () => this.prev(i))
                    rightCell.addEventListener("click", () => this.next(i))
                }
            }
            let row = defTable.insertRow(0);
            let defCell = row.insertCell(0)
            let posCell = row.insertCell(1)
            let synCell = row.insertCell(2)
            let antCell = row.insertCell(3)
            let wordCell = row.insertCell(0)
            defCell.innerHTML = "Definition"
            posCell.innerHTML = "Part of Speech"
            synCell.innerHTML = "Synonym"
            antCell.innerHTML = "Antonym"
            wordCell.innerHTML = "Word"
            if (this.arrows) {
                row.insertCell(0).style.border = "none"
                row.insertCell(6).style.border = "none"
            }
        },
        next: function(i) {
            this.curr[i] = (this.curr[i] + 1) % this.defs[i].length
            this.display()
        },
        prev: function(i) {
            if (this.curr[i] - 1 < 0) {
                this.curr[i] = this.defs[i].length - 1
            } else {
                this.curr[i] -= 1
            }
            this.display()
        },
        changeArrows: function() {
            this.arrows = !this.arrows;
            this.display()
        }
    }
}


let defset = makeDefSet([])

let input = document.getElementById("input")
let submit = document.getElementById("submit")
let arrows = document.getElementById("arrows")
let defTable = document.getElementById("defs")

submit.addEventListener("click", readInputs)
arrows.addEventListener("click", () => defset.changeArrows())