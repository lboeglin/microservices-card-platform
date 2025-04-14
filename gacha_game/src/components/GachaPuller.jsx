'use client'
import { useState, useEffect } from "react";
import Card from "./Card";
import Button from "./Button";

export default function GachaPuller({ cards }) {
    const [pulling, setPulling] = useState(false)
    const [currentCard, setCurrentCard] = useState(0)

    const startPull = () => {
        setPulling(true)
    };

    const skipPull = () => {
        setCurrentCard(cards.length)
    };

    if (pulling) {
        if (currentCard !== cards.length)
            return (
                <div className="flex flex-col gap-4 w-full h-screen justify-center items-center">
                    <Card
                        name={cards[currentCard].name}
                        artwork={cards[currentCard].image}
                        rarity={cards[currentCard].rarity}
                        onClick={() => { setCurrentCard(currentCard + 1) }}
                    />
                    <p className="text-black/75">Cliquez sur la carte pour continuer</p>
                <Button
                    action="/gacha"
                    className="absolute top-4 right-4"
                    onClick={skipPull}>
                    Passer l'animation
                </Button>
                </div>
            )
        else
            return (
                <div className="flex flex-col h-screen gap-4 justify-center items-center">
                    <div className="flex flex-row gap-2 w-full justify-center">
                        {
                            cards.map((card) => {
                                return <Card
                                    name={card.name}
                                    artwork={card.image}
                                    rarity={card.rarity}
                                />
                            })
                        }
                    </div>
                    <Button className="inline-block" action="/gacha">
                        Retourner au gacha
                    </Button>
                </div>
            )
    }
    else {
        return (
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                src="/pull_animation.mp4"
                onEnded={startPull}
            />
        );
    }
}
