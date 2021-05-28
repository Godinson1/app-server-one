import express from "express";
import { getAllUser } from "./index";
const router = express.Router();

router.get("/", getAllUser);

export { router };
