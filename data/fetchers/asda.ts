import type { MealDealData, MealDealItem } from "../dataStructure";

const payload = `{"requestorigin":"gi","contract":"web/cms/taxonomy-page","variables":{"user_segments":["wapp"],"is_eat_and_collect":false,"store_id":"4565","type":"content","page_size":200000,"page":1,"request_origin":"gi","ship_date":1740787200000,"payload":{"page_type":"shelf","hierarchy_id":"1215660378320-1215661252829-1215663358571-1215685991109","filter_query":[],"cart_contents":[],"page_meta_info":true}}}`;

type Product = {
    item_id: string;
    item: {
        name: string;
        images: {
            scene7_host: string;
            scene7_id: string;
        };
    };
};

type Zone = {
    configs?: {
        title?: string;
        products?: {
            items: Product[];
        };
    };
};

type ASDAData = {
    data: {
        tempo_cms_content: {
            zones: Zone[];
        };
    };
};

const SNACK_ZONES = ["Snacks", "Sweet Treats"];

export async function getAsdaMealDealData(): Promise<MealDealData> {
    const response = await fetch("https://groceries.asda.com/api/bff/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Request-Origin": "gi",
        },
        body: payload,
    });
    const data = (await response.json()) as ASDAData;
    const resolvedData = {
        mains: [] as MealDealItem[],
        snacks: [] as MealDealItem[],
        drinks: [] as MealDealItem[],
    } satisfies MealDealData;
    for (const zone of data.data.tempo_cms_content.zones) {
        if (zone.configs?.title && zone.configs?.products) {
            const arr =
                zone.configs.title === "Drinks"
                    ? resolvedData.drinks
                    : SNACK_ZONES.includes(zone.configs.title)
                      ? resolvedData.snacks
                      : resolvedData.mains;
            for (const product of zone.configs.products.items) {
                arr.push({
                    name: product.item.name,
                    image:
                        product.item.images.scene7_host +
                        "asdagroceries/" +
                        product.item.images.scene7_id,
                    id: product.item_id,
                });
            }
        }
    }
    return resolvedData;
}
