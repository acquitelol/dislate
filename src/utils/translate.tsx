import translate from "translate";

// async function to translate text
async function translateString(text: string, fromLang, toLang) {
    let res = await translate(text, { 
        from: fromLang,
        to: toLang
    })
    return res
}

export { translateString };