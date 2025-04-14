'use strict'

export const CARD_RARITY = {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    SUPER_RARE: 3
}

export const getRarity = (bias = 0) => {
    const value = Math.random() + bias
    if (value < 0.6)
        return CARD_RARITY.COMMON
    if (value < 0.8)
        return CARD_RARITY.UNCOMMON
    if (value < 0.96)
        return CARD_RARITY.RARE
    else
        return CARD_RARITY.SUPER_RARE
}

const requiredProperties = new Map([
    ["id", "number"],
    ["name", "string"],
    ["image", "string"],
    ["rarity", "number"],
    ["type", "string"]
])

class CardException extends Error {
    constructor(message) {
        super(message)
        this.name = "CardException"
    }
}

/**
 * Represents a trading-card.
 * @class
 */
class Card {
    /**
     * @param {Number} id
     * The Identifier for this card.
     */
    id
    /**
     * @param {string} name
     * The Name of this card.
     */
    name
    /**
     * @param {string} image
     * The URL path to the card's image ressource.
     */
    image
    /**
     * @param {Number} rarity
     * A number between 1 and 4 representing its rarity.
     */
    rarity
    /**
     * @param {string} type
     * A type for this card.
     */
    type

    static existingCards = 0

    /**
     * @param {Object} card 
     * Stores an object with all the propreties of a card.
     */
    constructor(card) {
        const cardProperties = new Map(Object.entries(card).map(([key, value]) =>
            [key, typeof value]
        ))
        if (requiredProperties.size !== cardProperties.size) {
            throw new CardException("The card has an incorrect number of properties.")
        }
        requiredProperties.forEach((propertyType, property) => {
            if (cardProperties.get(property) !== propertyType) {
                throw new CardException("A property of the given object is incorrect.");
            }
        })
        if (card.rarity < 0 || card.rarity > 3) {
            throw new CardException("The rarity is invalid. A rarity must be between 0 and 3 (included).")
        }
        Object.assign(this, card)
    }
}

export default Card