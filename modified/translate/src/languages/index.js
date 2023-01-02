import iso from "./iso";
import iso2 from "./iso2";
import languageNames from "./names";

/** Language parser
 * @param language: A language string to be parsed
 * @returns {~ normalized language}
 */
export default language => {
  // make sure the name is a string
  if (typeof language !== "string") {
    throw new Error(`The "language" must be a string, received ${typeof language}`);
  }

  // make sure the name isnt too long
  if (language.length > 100) {
    throw new Error(`The "language" is too long at ${language.length} characters`);
  }

  // make the language lowercase and try to find if it exists in any of the ISO lists by mapping
  language = language.toLowerCase();
  language = languageNames[language] || iso2[language] || language;

  // if the language isnt included in the generic iso then throw
  if (!iso.includes(language)) {
    throw new Error(`The language "${language}" is not part of the ISO 639-1`);
  }

  // otherwise return the language
  return language;
};
