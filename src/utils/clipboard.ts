// imports needed to use
import { getIDByName } from "enmity/api/assets";
import { Toasts } from "enmity/metro/common";

// open a toast with whatever type is required
const clipboardToast = (source: string) => {
    Toasts.open({ content: `Copied ${source} to clipboard.`, source: getIDByName('pending-alert') });
}

export { clipboardToast }