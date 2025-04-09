import { Card } from "../api/model/card.mjs";
import assert from "node:assert";
import { type } from "node:os";
import { describe, it } from "node:test";

describe("Card Model", () => {
    let card = {};
    it("empty parameters", 
        () => {
            assert.throws(() => new Card(card),{
                name : 'Card Exception'
            })
        })
        const base = {
            id:"1",
            name:"name",
            image:"image",
            rarity:"common",
            type:"type",
            health:1,
            strenght:1
        }
    let test = null
    it("missing",
        ()=>{
            Object.keys(base).forEach((key) => {
                test = Object.assign({}, base)
                delete test[key]
                assert.throws(()=>new Card(test),{
                    name : 'Card Exception'
                })
            })
        })
    
    
    })
    