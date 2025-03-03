"use client";

import type { MealDealData, MealDealItem } from "@/data/dataStructure";
import { castVote, useLastVoted } from "@/lib/state";
import { redirect } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import MainContainer from "./MainContainer";
import ShopSelector from "./ShopSelector";
import SectionSelector from "./SectionSelector";

function SubmitVote({
    drinkId,
    snackId,
    mainId,
}: {
    drinkId: string;
    snackId: string;
    mainId: string;
}) {
    const [submitOk, setSubmitOk] = useState<boolean | null>(null);
    const promiseRef = useRef<Promise<void> | null>(null);

    useEffect(() => {
        if (!promiseRef.current) {
            promiseRef.current = castVote(drinkId, snackId, mainId);
        }
        let active = true;
        promiseRef.current
            .then(() => {
                if (active) {
                    setSubmitOk(true);
                }
            })
            .catch((e) => {
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
                <p className="text-center mt-2">Thank you for voting!</p>
            </>
        );
    }

    return (
        <>
            <h1 className="text-center text-2xl">Vote failed!</h1>
            <p className="text-center mt-2">Please try again.</p>
        </>
    );
}

type ConfirmVoteProps = {
    drink: MealDealItem;
    snack: MealDealItem;
    main: MealDealItem;
    setConfirm: (confirm: boolean) => void;
};

function ConfirmVote({ drink, snack, main, setConfirm }: ConfirmVoteProps) {
    return (
        <>
            <h1 className="text-center text-2xl">Confirm your vote</h1>
            <p className="text-center mt-2">
                Are you sure you want to vote for the following meal deal:{" "}
                <code>{drink.name}</code> + <code>{snack.name}</code> +{" "}
                <code>{main.name}</code>?
            </p>
            <button
                className="text-center mt-2 dark:bg-gray-800 bg-gray-100 rounded-md p-2 cursor-pointer"
                onClick={() => setConfirm(true)}
            >
                Confirm
            </button>
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
    const [drink, setDrink] = useState<MealDealItem | null>(null);
    const [snack, setSnack] = useState<MealDealItem | null>(null);
    const [main, setMain] = useState<MealDealItem | null>(null);
    const [confirm, setConfirm] = useState<boolean>(false);

    if (!shop)
        return <ShopSelector keys={Object.keys(shopData)} onSelect={setShop} />;

    if (!drink) {
        return (
            <SectionSelector
                section={shopData[shop].drinks}
                title="Drink"
                description="Select a drink for your meal deal:"
                onSelect={setDrink}
            />
        );
    }

    if (!snack) {
        return (
            <SectionSelector
                section={shopData[shop].snacks}
                title="Snack"
                description="Select a snack for your meal deal:"
                onSelect={setSnack}
            />
        );
    }

    if (!main) {
        return (
            <SectionSelector
                section={shopData[shop].mains}
                title="Main"
                description="Select a main for your meal deal:"
                onSelect={setMain}
            />
        );
    }

    if (!confirm)
        return (
            <ConfirmVote
                drink={drink}
                snack={snack}
                main={main}
                setConfirm={setConfirm}
            />
        );

    return (
        <SubmitVote drinkId={drink.id} snackId={snack.id} mainId={main.id} />
    );
}

function Content({ lastVoted, shopData }: Props & { lastVoted: Date }) {
    const lastVoteLastRender = useRef(lastVoted);

    if (
        lastVoteLastRender.current.getTime() >
        Date.now() - 1000 * 60 * 60 * 24
    ) {
        return (
            <>
                <h1 className="text-center text-2xl">
                    You can vote again soon!
                </h1>
                <p className="text-center mt-2">
                    You can vote again in{" "}
                    {Math.ceil(
                        (lastVoteLastRender.current.getTime() +
                            1000 * 60 * 60 * 24 -
                            Date.now()) /
                            (1000 * 60 * 60),
                    )}{" "}
                    hours.
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
