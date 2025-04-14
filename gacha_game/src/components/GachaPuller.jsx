'use client'
import { useState, useEffect } from "react";
import Card from "./Card";
import { openBooster } from "../util/serverRequests";

export default function GachaPuller({ token }) {
    const [cards, setCards] = useState([]);
    const [revealedPack, setRevealedPack] = useState([]);
    const [firstPull, setPulling] = useState(true);
    const [pulledCats, setPulledCats] = useState([]);
    const [lastCard, setLast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const data = await openBooster(token);
                console.log(data)
                setCards(data);
                setPulledCats(data.slice(0, 1));
                setRevealedPack(Array(data.length).fill(false));
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    useEffect(() => {
        if (!firstPull && pulledCats.length === cards.length) {
            setRevealedPack(Array(cards.length).fill(true));
        }
    }, [firstPull, pulledCats]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const startPull = () => {
        const nextCount = pulledCats.length + 1;
        setPulledCats(cards.slice(0, nextCount));
        if (!revealedPack.some(revealed => !revealed)) {
            setLast(true);
        }
    };

    const skipPull = () => {
        setPulledCats(cards);
        setPulling(false);
        setLast(true);
        setRevealedPack(Array(cards.length).fill(true));
    };

    if (loading) return <p className="text-center mt-20 text-xl">Loading cards...</p>;
    if (error) return <p className="text-center mt-20 text-xl text-red-500">Error: {error}</p>;

    return (
        <div>
            {revealedPack.some(revealed => !revealed) && (
                <button
                    className="absolute top-4 right-4 text-white p-2 rounded-lg text-lg cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed mb-4 transition-colors duration-300 hover:bg-gray-600"
                    onClick={skipPull}
                    disabled={pulledCats.length === cards.length}
                >
                    Skip
                </button>
            )}

            {
                !firstPull ? (
                    <>
                        {(revealedPack.every(revealed => revealed) && lastCard) ? (
                            <div className="flex justify-center items-center min-h-screen w-full">
                                <button
                                    className="absolute top-4 right-4 text-white p-2 rounded-lg text-lg cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed mb-4 transition-colors duration-300 hover:bg-gray-600"
                                    onClick={() => { window.location.href = "/gacha" }}
                                >
                                    Back
                                </button>
                                <div className="grid grid-cols-3 grid-rows-2 gap-3">
                                    {pulledCats.map((cat, index) => (
                                        <Card
                                            key={index}
                                            artwork={cat.image}
                                            name={cat.name}
                                            rarity={cat.rarity}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center min-h-screen w-full">
                                <Card
                                    artwork={pulledCats.at(-1).image}
                                    name={pulledCats.at(-1).name}
                                    rarity={pulledCats.at(-1).rarity}
                                    onClick={startPull}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <video
                        className="absolute top-0 left-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        playsInline
                        src="./pull_animation.mp4"
                        onClick={() => setPulling(false)}
                    />
                )
            }
        </div>
    );
}
