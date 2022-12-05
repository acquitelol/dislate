/** 
 * Imports 
 * @param translate: The main Asynchronous translate function.
 * @param language_names: The main list of language names
 */
import translate from "../../modified/translate";
import language_names from '../../modified/translate/src/languages/names'

type Serializable = string | number | boolean | null | {
    [key: string | number]: Serializable;
} | Serializable[];

interface languageType {
    fromLang: Serializable;
    toLang: Serializable;
}

/** 
 * Translates text to a language provided in iso.
 * @param {string} text: The text to translate.
 * @param {string} fromLang: The language to translate from.
 * @param {string} toLang: The language to translate to.
 * @param {boolean} cancel: Toggles translation. If false will return untranslated text.
 * @returns {string text}
 */
async function translate_string(text: string, { fromLang = 'detect', toLang = 'english' }: languageType, cancel?: boolean): Promise<string> {
    /**
     * Returns the original string early if @arg cancel is @arg true.
     */
    return cancel
        ? text
        : await translate(text, {
            from: language_names[fromLang],
            to: language_names[toLang]
        })
}

export { translate_string };