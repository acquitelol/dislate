import languages from "./languages/index.js";
import engines from "./engines/index.js";

if (typeof fetch === "undefined") {
  try {
    global.fetch = require("node-fetch");
  } catch (error) {
    console.warn("Please make sure node-fetch is available");
  }
}

const Translate = function(options = {}) {
  if (!(this instanceof Translate)) {
    return new Translate(options);
  }

  const defaults = {
    from: "auto",
    to: "en",
    languages: languages,
    engines: engines,
    engine: "google",
  };

  const translate = (text, opts = {}) => {
    if (typeof opts === "string") opts = { to: opts };

    opts.text = text;
    opts.from = languages(opts.from || translate.from);
    opts.to = languages(opts.to || translate.to);
    opts.engines = opts.engines || {};
    opts.engine = opts.engine || translate.engine;
    opts.url = opts.url || translate.url;
    opts.id = opts.id || `${opts.url}:${opts.from}:${opts.to}:${opts.engine}:${opts.text}`;
    const engine = opts.engines[opts.engine] || translate.engines[opts.engine];

    // Target is the same as origin, just return the string
    if (opts.to === opts.from) {
      return Promise.resolve(opts.text);
    }

    const fetchOpts = engine.fetch(opts);
    return fetch(...fetchOpts).then(engine.parse)
  };

  for (let key in defaults) {
    translate[key] =
      typeof options[key] === "undefined" ? defaults[key] : options[key];
  }
  return translate;
};

const exp = new Translate();
exp.Translate = Translate;
export default exp;
