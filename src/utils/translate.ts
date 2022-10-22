import translate from "translate";
import langNames from 'translate/src/languages/names'

// async function to translate text
async function translateString(text: string, fromLang, toLang) {
    if (!fromLang) {
        let res = await translate(text, langNames[toLang])
        return res
    } else {
        let res = await translate(text, { 
            from: langNames[fromLang],
            to: langNames[toLang]
        })
        return res
    }
    
}

export { translateString };