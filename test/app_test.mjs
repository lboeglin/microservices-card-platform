"use strict"

import { describe, it, before, beforeEach, after } from "node:test";
import supertest from "supertest";
import server from "../server.mjs";
import { mongoose } from "mongoose";
import assert from "node:assert";

let mongodb = null;
let myConnection = null;
const requestWithSupertest = supertest(server);
const APIPATH = process.env.API_PATH || "/api/v0";

