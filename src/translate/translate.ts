import { LanguageType } from './types';

const base = "https://translate.googleapis.com/translate_a/single";
const engine = {
    fetch: ({ from, to, text }) => `${base}?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
    parse: res => res.json().then(body => {
        body = body && body[0] && body[0][0] && body[0].map(s => s[0]).join("");
        if (!body) throw new Error("Invalid Translation!");
        return body;
    })
};

if (typeof fetch === "undefined") {
    try {
      global.fetch = require("node-fetch");
    } catch (error) {
      console.warn("Please make sure node-fetch is available");
    }
}

export default async function translate(text: string, { fromLang, toLang }: LanguageType) {
    const url = engine.fetch({
        text,
        from: fromLang, 
        to: toLang, 
    });
    return await fetch(url).then(engine.parse)
};