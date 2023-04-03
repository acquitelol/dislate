import { Serializable, SettingsStore } from "enmity/api/settings";
import { Plugin } from "enmity/managers/plugins";
import manifest from "../manifest.json"
import LanguageNamesArray from "./translate/languages/names";
import ISO from "./translate/languages/iso";
import { React } from 'enmity/metro/common';

const LanguageNames = Object.assign({}, ...LanguageNamesArray.map((k, i) => ({ [k]: ISO[i] })));

export interface ActionSheetInformation {
    unpatch: () => void;
    data: {
       message: { [key: string]: any }
       res: any 
    }
}

export type DislatePlugin = Plugin & { 
    patchActionSheet: (info: ActionSheetInformation) => void;
    renderPage: (navigation: any, { pageName, pagePanel }: { pageName: string, pagePanel: any }) => any;
}

export type LanguageType = {
    fromLanguage: string;
    toLanguage: string;
}

export interface SectionWrapperProps {
    label: string;
    children?: any;
}

export interface SettingsProps {
    settings: SettingsStore;
    manifest: typeof manifest;
    languages: typeof LanguageNames;
    renderPage: DislatePlugin["renderPage"]
}

export interface CreditsProps {
    manifest: typeof manifest;
}

export interface LanguageRowProps {
    manifest: typeof manifest;
    renderPage: DislatePlugin["renderPage"];
    Navigation: any;
    languages: typeof LanguageNames;
    kind: "to" | "from" | string
}

export interface LanguagesProps {
    languages: typeof LanguageNames;
}

export interface LanguageItemProps {
    language: string;
    languages: typeof LanguageNames;
    selected: Serializable;
    setSelected: typeof React.Dispatch<React.SetStateAction<Serializable>>
}

export interface DebugProps {
    onConfirm: (debugInfo: any, type: string) => Promise<void> | void;
    type: "copy" | "send" | string
}

export interface DebugItemProps {
    option: string;
    parent: string;
    debugOptions: string[];
    onConfirm: DebugProps["onConfirm"]
}

export interface DialogProps {
    label: string;
    content: string;
    type: "floating" | "standard" | string;
}

export interface ActionSheetProps {
    onConfirm: DebugProps["onConfirm"];
    type: DebugProps["type"]
}