import translate from "translate";

// async function to translate text
async function translateString(text: string, fromLang, toLang) {
    if (!fromLang) {
        let res = await translate(text, toLang)
        return res
    } else {
        let res = await translate(text, { 
            from: fromLang,
            to: toLang
        })
        return res
    }
    
}

export { translateString };