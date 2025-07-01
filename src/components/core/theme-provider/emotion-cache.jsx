"use client";

import React, { useState } from "react";
import createCache from "@emotion/cache";
import { CacheProvider as DefaultCacheProvider } from "@emotion/react";

export default function EmotionCacheProvider({
  options,
  CacheProvider = DefaultCacheProvider,
  children,
}) {
  const [registry] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;

    const prevInsert = cache.insert;
    let inserted = [];

    cache.insert = (...args) => {
      const [selector, serialized] = args;

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, isGlobal: !selector });
      }

      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };

    return { cache, flush };
  });

  React.useEffect(() => {
    const inserted = registry.flush();

    if (inserted.length === 0) {
      return;
    }

    let styles = "";
    let dataEmotionAttribute = registry.cache.key;

    const globals = [];

    inserted.forEach(({ name, isGlobal }) => {
      const style = registry.cache.inserted[name];

      if (typeof style !== "boolean") {
        if (isGlobal) {
          globals.push({ name, style });
        } else {
          styles += style;
          dataEmotionAttribute += ` ${name}`;
        }
      }
    });

    if (globals.length > 0 || styles) {
      const styleElement = document.createElement("style");
      styleElement.setAttribute("data-emotion", dataEmotionAttribute);

      if (styles) {
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
      }

      globals.forEach(({ name, style }) => {
        const globalStyleElement = document.createElement("style");
        globalStyleElement.setAttribute(
          "data-emotion",
          `${registry.cache.key}-global ${name}`
        );
        globalStyleElement.textContent = style;
        document.head.appendChild(globalStyleElement);
      });
    }
  }, [registry]);

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
