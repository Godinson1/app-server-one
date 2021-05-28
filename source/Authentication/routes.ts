import express from "express";
const router = express.Router();

router.get("/", () => console.log("all auth"));

export { router };
