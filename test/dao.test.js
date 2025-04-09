import mongoose from "mongoose";
import assert from "node:assert";
import { describe, it, before, beforeEach, after } from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import "../api/dao/catFetchDAO.mjs";

let mongodb = null;
let myConnection = null;

w