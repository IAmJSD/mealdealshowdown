import { MealDealData } from "../dataStructure";
import { readFile } from "fs/promises";

const gql = readFile(`${__dirname}/tesco.gql`, "utf-8");

type PageInformation = {
    totalCount: number;
    pageSize: number;
    pageNumber: number;
    totalPages: number;
};

type Result = {
    node: {
        id: string;
        title: string;
        isForSale: boolean;
        defaultImageUrl: string;
        restrictedDelivery: string | null;
    };
};

type TescoData = {
    data: {
        category: {
            pageInformation: PageInformation;
            results: Result[];
        };
    };
};

async function loadTescoPage(pageNumber: number) {
    return fetch(
        "https://api.tesco.com/shoppingexperience",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Apikey": "TvOSZJHlEk0pjniDGQFAc9Q59WGAR4dA",
                "Origin": "https://www.tesco.com",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            },
            body: JSON.stringify([
                {
                    operationName: "GetCategoryProducts",
                    extensions: {
                        mfeName: "unknown",
                    },
                    query: await gql,
                    variables: {
                        page: pageNumber,
                        count: 300,
                        filterCriteria: [
                            { name: "productSource", values: ["GhsAndMarketplace"] },
                        ],
                        facet: "b;RnJlc2glMjBGb29kJTdDQ2hpbGxlZCUyMFNvdXAsJTIwU2FuZHdpY2hlcyUyMCYlMjBTYWxhZCUyMFBvdHMlN0NMdW5jaCUyME1lYWwlMjBEZWFscw==",
                        sortBy: "relevance",
                    },
                },
            ]),
        }
    ).then(async res => {
        if (!res.ok) {
            throw new Error(`Failed to fetch tesco meal deal data: ${res.status} ${await res.text()}`);
        }
        return (await res.json() as [TescoData])[0].data.category;
    });
}

export async function getTescoMealDealData(): Promise<MealDealData> {
    const p1 = await loadTescoPage(1);
    const allPages = [];
    while (p1.pageInformation.totalCount > (allPages.length * 300)) {
        allPages.length === 0 ? allPages.push(p1) : allPages.push(await loadTescoPage(allPages.length + 1));
    }
    const allProducts = allPages.flatMap(p => p.results.map(x => x.node));
    const data: MealDealData = {
        mains: [],
        snacks: [],
        drinks: [],
    };
    for (const product of allProducts) {
        if (!product.isForSale || !product.restrictedDelivery) continue;
        const arr = product.restrictedDelivery === "Main" ? data.mains :
            product.restrictedDelivery === "Snack" ? data.snacks : data.drinks;
        arr.push({
            id: product.id,
            name: product.title,
            image: product.defaultImageUrl,
        });
    }
    return data;
}
