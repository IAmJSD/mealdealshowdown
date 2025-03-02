import { getAllFoodItems } from "@/lib/database";
import FullPageVoteCaster from "@/components/FullPageVoteCaster";

export const runtime = "edge";

// Revalidate every 30 minutes
export const revalidate = 1800;

export default async function VotePage() {
    const items = await getAllFoodItems();
    return <FullPageVoteCaster shopData={items} />;
}
