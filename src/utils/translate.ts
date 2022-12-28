/** 
 * Imports 
 * @param translate: The main Asynchronous translate function.
 * @param LanguageNames: The main list of language names
 */
import translate from "../../modified/translate";
import LanguageNames from '../../modified/translate/src/languages/names'

type Serializable = string | number | boolean | null | {
    [key: string | number]: Serializable;
} | Serializable[];

type LanguageType = {
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
async function string(text: string, { fromLang = 'detect', toLang = 'english' }: LanguageType, cancel?: boolean): Promise<string> {
    /**
     * Returns the original string early if @arg cancel is @arg true.
     */
    return cancel
        ? text
        : await translate(text, {
            from: LanguageNames[fromLang],
            to: LanguageNames[toLang]
        })
}

export default 
{
    string
}