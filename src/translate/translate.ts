import { LanguageType } from '../def';
import { get } from 'enmity/api/settings';
import { name } from '../../manifest.json';

const base = "https://api-free.deepl.com/v2/translate";
const engine = {
    fetch: ({ from, to, text }) => `${base}?target_lang=${to}${from == 'AUTO' ? '' : `&source_lang=${from}`}&text=${encodeURIComponent(text)}`,
    parse: res => res.json().then(body => {
        if (!body.translations[0].text) throw new Error('Invalid Translation!');
        return body.translations[0].text
    })
};

if (typeof fetch === "undefined") {
    try {
      global.fetch = require("node-fetch");
    } catch (error) {
      console.warn("Please make sure node-fetch is available");
    }
}

export default async function translate(text: string, { fromLanguage, toLanguage }: LanguageType) {
    const url = engine.fetch({
        text,
        from: fromLanguage, 
        to: toLanguage, 
    });
    return await fetch(url, {
        method:'POST',
        headers: {
            "Authorization": `DeepL-Auth-Key ${get(name, "deeplApiKey")}`
        }
    }).then(engine.parse)
};