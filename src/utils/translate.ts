/** 
 * Imports 
 * @param translate: The main Asynchronous translate function.
 * @param language_names: The main list of language names
 */
import translate from "../../modified/translate";
import language_names from '../../modified/translate/src/languages/names'

/** 
 * Translates text to a language provided in iso.
 * @param text: The text to translate.
 * @param fromLang: The language to translate from.
 * @param toLang: The language to translate to.
 * @param cancel: Toggles translation. If false will return untranslated text.
 * @returns {string text}
 */
async function translate_string(text: string, fromLang: any, toLang: any, cancel?: boolean): Promise<string> {
    if (cancel) return text

    const options = fromLang
        ? language_names[toLang]
        : {
            from: language_names[fromLang],
            to: language_names[toLang]
        }

    return await translate(text, options)
}

export { translate_string };