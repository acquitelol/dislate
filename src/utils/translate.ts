/** Imports 
 * @param translate: The main Asynchronous translate function.
 * @param lang_names: The main list of language names
 */
import translate from "../../modified/translate";
import lang_names from '../../modified/translate/src/languages/names'

/** Translates text to a language provided in iso.
 * @param text: The text to translate.
 * @param fromLang: The language to translate from.
 * @param toLang: The language to translate to.
 * @param cancel: Toggles translation. If false will return untranslated text.
 * @returns {string text}
 */
async function translate_string(text: string, fromLang: any, toLang: any, cancel?: boolean) {
    if (cancel) return text
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