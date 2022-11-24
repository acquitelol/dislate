/** Imports 
 * @param {function} Toasts: The function to open a toast on the screen
 * @param {object} Icons: The icons exported in ./Icons
 */
import { Toasts } from "enmity/metro/common";
import { Icons } from "./icons";

/** Open a toast with the text provided saying it has been copied to clipboard
 * @param {string} source: The text provided
 * @returns {void}
 */
const clipboard_toast = (source: string): void => {
    Toasts.open({ content: `Copied ${source} to clipboard.`, source: Icons.Clipboard });
}

export { clipboard_toast }