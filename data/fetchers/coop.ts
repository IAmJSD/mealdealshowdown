import htmlParser, { type HTMLElement } from "node-html-parser";
import type { MealDealData, MealDealItem } from "../dataStructure";

function articlesToProducts(articles: HTMLElement[]): MealDealItem[] {
    return articles.map(article => {
        const image = article.querySelector("img");
        if (!image) {
            throw new Error("No image found");
        }
        let url = image.getAttribute("src");
        if (url?.startsWith("//")) {
            url = `https:${url}`;
        }
        const id = article.children[0].getAttribute("href")!.split("/").pop()!;
        return {
            id,
            name: article.querySelector("h3")!.textContent!,
            image: url!,
        }
    });
}

function loadUniques(s: Set<string>, mealDealData: MealDealData, html: string) {
    const root = htmlParser.parse(html);

    const drinksSection = root.getElementById("drinks");
    if (!drinksSection) {
        throw new Error("No drinks section found");
    }
    const drinks = articlesToProducts(drinksSection.querySelectorAll("article"));
    for (const drink of drinks) {
        if (!s.has(drink.id)) {
            s.add(drink.id);
            mealDealData.drinks.push(drink);
        }
    }

    const mainsSection = root.getElementById("mains");
    if (!mainsSection) {
        throw new Error("No mains section found");
    }
    const mains = articlesToProducts(mainsSection.querySelectorAll("article"));
    for (const main of mains) {
        if (!s.has(main.id)) {
            s.add(main.id);
            mealDealData.mains.push(main);
        }
    }

    const sidesSelection = root.getElementById("sides-") || root.getElementById("sides");
    if (!sidesSelection) {
        throw new Error("No sides selection found");
    }
    const sides = articlesToProducts(sidesSelection.querySelectorAll("article"));
    for (const side of sides) {
        if (!s.has(side.id)) {
            s.add(side.id);
            mealDealData.snacks.push(side);
        }
    }
}

export async function getCoopMealDealData(): Promise<MealDealData> {
    const s = new Set<string>();
    const htmls = await Promise.all([
        fetch("https://www.coop.co.uk/products/deals/lunchtime-meal-deal").then(res => res.text()),
        fetch("https://www.coop.co.uk/products/deals/premium-meal-deal").then(res => res.text()),
    ]);
    const mealDealData: MealDealData = {
        mains: [],
        snacks: [],
        drinks: [],
    };
    for (const html of htmls) {
        loadUniques(s, mealDealData, html);
    }
    return mealDealData;
}
