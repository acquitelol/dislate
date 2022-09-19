import translate from "translate";

const translateString = async (text: string, fromLang, toLang) => {
    let res = await translate(text, { 
        from: fromLang,
        to: toLang
    })
    return res
}

export { translateString };