"use client";

import type { MealDealData } from "@/data/dataStructure";
import { castVote, useLastVoted } from "@/lib/state";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import MainContainer from "./MainContainer";
import ShopSelector from "./ShopSelector";
import SectionSelector from "./SectionSelector";

function SubmitVote({ drinkId, snackId, mainId }: { drinkId: string, snackId: string, mainId: string }) {
    const [submitOk, setSubmitOk] = useState<boolean | null>(null);

    useEffect(() => {
        let active = true;
        castVote(drinkId, snackId, mainId).then(() => {
            if (active) {
                setSubmitOk(true);
            }
        }).catch((e) => {
            if (active) {
                setSubmitOk(false);
            }
            console.error(e);
        });
        return () => {
            active = false;
        };
    }, []);

    if (submitOk === null) {
        return <Loading />;
    }

    if (submitOk) {
        return (
            <>
                <h1 className="text-center text-2xl">Vote submitted!</h1>
                <p className="text-center mt-2">
                    Thank you for voting!
                </p>
            </>
        );
    }
    
    return (
        <>
            <h1 className="text-center text-2xl">Vote failed!</h1>
            <p className="text-center mt-2">
                Please try again.
            </p>
        </>
    );
}

type Props = {
    shopData: {
        [shop: string]: MealDealData;
    };
};

function Flow({ shopData }: Props) {
    const [shop, setShop] = useState<string | null>(null);
    const [drinkId, setDrinkId] = useState<string | null>(null);
    const [snackId, setSnackId] = useState<string | null>(null);
    const [mainId, setMainId] = useState<string | null>(null);

    if (!shop) return <ShopSelector keys={Object.keys(shopData)} onSelect={setShop} />;

    if (!drinkId) {
        return (
            <SectionSelector
                section={shopData[shop].drinks}
                title="Drink"
                description="Select a drink for your meal deal:"
                onSelect={setDrinkId}
            />
        );
    }

    if (!snackId) {
        return (
            <SectionSelector
                section={shopData[shop].snacks}
                title="Snack"
                description="Select a snack for your meal deal:"
                onSelect={setSnackId}
            />
        );
    }

    if (!mainId) {
        return (
            <SectionSelector
                section={shopData[shop].mains}
                title="Main"
                description="Select a main for your meal deal:"
                onSelect={setMainId}
            />
        );
    }

    return <SubmitVote drinkId={drinkId} snackId={snackId} mainId={mainId} />;
}

function Content({ lastVoted, shopData }: Props & { lastVoted: Date }) {
    const lastVoteLastRender = useRef(lastVoted);

    if (lastVoteLastRender.current.getTime() > Date.now() - 1000 * 60 * 60 * 24) {
        return (
            <>
                <h1 className="text-center text-2xl">You can vote again soon!</h1>
                <p className="text-center mt-2">
                    You can vote again in {Math.ceil((lastVoteLastRender.current.getTime() + 1000 * 60 * 60 * 24 - Date.now()) / (1000 * 60 * 60))} hours.
                </p>
            </>
        );
    }

    return <Flow shopData={shopData} />;
}

export default function FullPageVoteCaster({ shopData }: Props) {
    const lastVoted = useLastVoted();

    useEffect(() => {
        if (lastVoted === null) {
            redirect("/");
        }
    }, [lastVoted]);

    if (!lastVoted) {
        return (
            <MainContainer>
                <Loading />
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <Content lastVoted={lastVoted} shopData={shopData} />
        </MainContainer>
    );
}
