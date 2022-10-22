// imports needed to use
import { Toasts } from "enmity/metro/common";
import { Icons } from "./icons";

// open a toast with whatever type is required
const clipboard_toast = (source: string) => {
    Toasts.open({ content: `Copied ${source} to clipboard.`, source: Icons.Clipboard });
}

export { clipboard_toast }