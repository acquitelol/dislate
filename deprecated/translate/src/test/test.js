import fs from 'fs';
import iso1 from "../languages/iso.js"
import iso2 from '../languages/names.js'

const main = async () => {
    iso1.forEach(async key => {
        const content = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${key}&dt=t&q=${encodeURI("testing and stuff")}`)
        if (content.status == 200) {
            fs.appendFileSync("out.txt", `${key}\n`)
        }
    })
}

const getOthers = () => {
    const iso2obj = []
    iso1.forEach(item1 => {
        Object.entries(iso2).forEach(items => {
            if (item1 == items[1]) {
                iso2obj.push(items[0])
            }
        })
    })
    // return Object.assign({}, ...iso2obj)
    return iso2obj
}

fs.writeFileSync("out.txt", JSON.stringify(getOthers()))
