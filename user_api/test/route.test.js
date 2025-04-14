"use strict"
import { describe, it, before, beforeEach, after } from "node:test"
import supertest from "supertest"
import server from "../server.mjs";
import { mongoose } from "mongoose";
import assert from "node:assert";

let mongod = null
let maConnexion = null
const requestWithSupertest = supertest(server)
let accessToken = null


//Utilise l'environnement du serveur (TEST, DEV, PROD)
describe("Test de l'application", function () {
    before(async () => {
        await mongoose.connection.close()
        const { MongoMemoryServer } = await import('mongodb-memory-server')
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        maConnexion = await mongoose.connect(uri)
    })

    after(async () => {
        await mongod.stop()
        maConnexion.disconnect()
    })

    it("POST /user/register add a valid user", async () => {
        let res = await requestWithSupertest.post("/user-api/user/register")
            .set('Content-type', 'application/json')
            .send({ name: 'JoJo', password: 'pass' })
        assert.equal(res.status, 201)
        assert.deepEqual(res.body, { message: "User created" })

    })

    it("POST /user/register add an invalid user", async () => {
        const response = await requestWithSupertest.post("/user-api/user/register")
            .set('Content-type', 'application/json')
            .send({ name: 'JoJo', password: 'pass' })
        assert.equal(response.status, 409)
        assert.deepEqual(response.body, { message: "Username already taken or failed to register" })
    })

    it("POST /user/login login as a valid user", async () => {
        const response = await requestWithSupertest.post("/user-api/user/login")
            .set('Content-type', 'application/json')
            .send({ name: 'JoJo', password: 'pass' })

        assert.equal(response.status, 200)
        assert.ok(response.body.accessToken, "Missing accessToken in response")
        assert.ok(response.body.refreshToken, "Missing refreshToken in response")

        accessToken = response.body.accessToken
    })
    it("POST /user/login login as an invalid user", async () => {
        const response = await requestWithSupertest.post("/user-api/user/login")
            .set('Content-type', 'application/json')
            .send({ name: 'None liike this', password: 'pass' })

        assert.equal(response.status, 500)
        assert.deepEqual(response.body, { message: "No fucking user named : None liike this " })

    })

    it("POST /user/refresh-tokens should refresh tokens", async () => {
        const loginRes = await requestWithSupertest.post("/user-api/user/login")
            .send({ name: "JoJo", password: "pass" })

        const refreshToken = loginRes.body.refreshToken

        const res = await requestWithSupertest.post("/user-api/user/refresh-tokens")
            .set('Authorization', `Bearer ${refreshToken}`)

        assert.equal(res.status, 200)
        assert.ok(res.body.accessToken)
        assert.ok(res.body.refreshToken)
    })


    it("GET /user get info from a valid token", async () => {
        const response = await requestWithSupertest.get("/user-api/user")
            .set('Authorization', `Bearer ${accessToken}`)

        assert.equal(response.status, 200)

        const { lastBooster, ...responseWithoutLastBooster } = response.body
        const { boosters, ...responseWithoutBoosters } = responseWithoutLastBooster
        assert.deepEqual(responseWithoutBoosters, {
            name: "JoJo",
            password: "XXXXXXXXXX",
            salt: "XXXXXXXXX",
            coins: 10,
            collection: [],
        })
    })

    it("GET /user get info from a invalid token", async () => {
        const response = await requestWithSupertest.get("/user-api/user")
            .set('Authorization', `Bearer ${"Not a token"}`)

        assert.equal(response.status, 500)
        assert.deepEqual(response.body, { message: 'Invalid token' })
    })

    it("PUT /booster get available free booster", async () => {
        const response = await requestWithSupertest.put("/user-api/booster")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.deepEqual(response.body, 2)
    })

    it("PUT /booster/use with a user with 2 boosters", async () => {
        const response = await requestWithSupertest.put("/user-api/booster/use")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 200)
        assert.deepEqual(response.body, 1)
    })
    it("PUT /booster/use with a user with 1 boosters", async () => {
        const response = await requestWithSupertest.put("/user-api/booster/use")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 200)
        assert.deepEqual(response.body, 0)
    })

    it("PUT /booster/use with a user with 0 boosters", async () => {
        const response = await requestWithSupertest.put("/user-api/booster/use")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 400)
        assert.deepEqual(response.body, { message: 'No booster ready to be opened' })
    })

    it("PUT /booster get available free booster", async () => {
        const response = await requestWithSupertest.put("/user-api/booster")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.deepEqual(response.body, 0)
    })


    it("GET /user/collection", async () => {
        const response = await requestWithSupertest.get("/user-api/user/collection")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 200)
        assert.deepEqual(response.body, [])
    })

    it("PUT /addCard add valid array of id", async () => {
        const response = await requestWithSupertest.put("/user-api/addCard")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ 'cards': [1, 2, 3] })
        assert.equal(response.status, 200)
        assert.deepEqual(response.body, { message: 'Cards added' })
    })

    it("GET /user/collection check collection of a valid user", async () => {
        const response = await requestWithSupertest.get("/user-api/user/collection")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 200)
        assert.deepEqual(response.body, [1, 2, 3])
    })

    it("PUT /booster/buy/1 buy a booster", async () => {
        const response = await requestWithSupertest.put("/user-api/booster/buy/1")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 200)
        assert.deepEqual(response.body, { message: 'Booster bought successfully', coins: 9 })
    })

    it("PUT /user/sell-card/1 sell an existing card", async () => {
        const response = await requestWithSupertest.put("/user-api/user/sell-card/1")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 200)
        assert.deepEqual(response.body, { message: 'Card sold successfully', coins: 10 })
    })

    it("PUT /user/sell-card/1 sell an unexisting card", async () => {
        const response = await requestWithSupertest.put("/user-api/user/sell-card/1")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(response.status, 500)
        assert.deepEqual(response.body, { message: 'The user does not have this card' })
    })

    it("PUT /user/password should update user password", async () => {
        const res = await requestWithSupertest.put("/user-api/user/password")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ currentPassword: "pass", newPassword: "newpass" })

        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { message: "Password updated" })
    })

    it("POST /user/login login with an updated password", async () => {
        const response = await requestWithSupertest.post("/user-api/user/login")
            .set('Content-type', 'application/json')
            .send({ name: 'JoJo', password: 'newpass' })

        assert.equal(response.status, 200)
        assert.ok(response.body.accessToken)
        assert.ok(response.body.refreshToken)
    })

    it("PUT /user update the user name", async () => {
        const res = await requestWithSupertest.put("/user-api/user")
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ newName: "JoJoNew" })

        assert.equal(res.status, 200)
        assert.equal(res.body.user.name, "JoJoNew")
        assert.ok(res.body.accessToken)
        assert.ok(res.body.refreshToken)

        accessToken = res.body.accessToken
    })

    it("GET /user get info from an updated token", async () => {
        const response = await requestWithSupertest.get("/user-api/user")
            .set('Authorization', `Bearer ${accessToken}`)

        const { lastBooster, ...responseWithoutLastBooster } = response.body
        const { boosters, ...responseWithoutBoosters } = responseWithoutLastBooster
        assert.deepEqual(responseWithoutBoosters, {
            name: "JoJoNew",
            password: "XXXXXXXXXX",
            salt: "XXXXXXXXX",
            coins: 10,
            collection: [2, 3],
        })
    })

    it("DELETE /user delete the authenticated user", async () => {
        const res = await requestWithSupertest.delete("/user-api/user")
            .set('Authorization', `Bearer ${accessToken}`)
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { message: "User deleted" })
    })

    it("POST /user/login login as a deleted user", async () => {
        const response = await requestWithSupertest.post("/user-api/user/login")
            .set('Content-type', 'application/json')
            .send({ name: 'JoJo', password: 'newpass' })

        assert.equal(response.status, 500)
        assert.deepEqual(response.body, { message: "No fucking user named : JoJo " })

    })

    it("DELETE /user delete an unexisting user", async () => {
        const response = await requestWithSupertest.delete("/user-api/user")
            .set('Authorization', `Bearer ${accessToken}`);
        
        assert.equal(response.status, 500);
        assert.deepEqual(response.body, { message: "User not found" });
    });
    
});

