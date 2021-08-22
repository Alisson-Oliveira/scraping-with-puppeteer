"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes = express_1.Router();
const CovidControllers_1 = __importDefault(require("./controllers/CovidControllers"));
routes.get('/covid/jardim', CovidControllers_1.default.index);
exports.default = routes;
