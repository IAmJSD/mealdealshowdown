import path from "path";
import { rmSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

import { getAsdaMealDealData } from "./fetchers/asda";
import { getCoopMealDealData } from "./fetchers/coop";

const files = {
    "asda.json": getAsdaMealDealData,
    "coop.json": getCoopMealDealData,
}

const fp = path.join(__dirname, "json");

try {
    rmSync(fp, { recursive: true });
} catch {}
mkdirSync(fp);

(async () => {
    for (const [filename, fetcher] of Object.entries(files)) {
        if (process.env.FILENAME_LIMITER && filename !== process.env.FILENAME_LIMITER) continue;
        console.log(`Fetching json/${filename}`);
        const data = await fetcher();
        await writeFile(`${fp}/${filename}`, JSON.stringify(data, null, 4));
        console.log(`Wrote json/${filename}`);
    }    
})();
