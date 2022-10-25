import translate from "translate";
import lang_names from 'translate/src/languages/names'

// async function to translate text
async function translate_string(text: string, fromLang, toLang) {
    if (!fromLang) {
        let res = await translate(text, lang_names[toLang])
        return res
    } else {
        let res = await translate(text, { 
            from: lang_names[fromLang],
            to: lang_names[toLang]
        })
        return res
    }
    
}

export { translate_string };