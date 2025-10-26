import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import rateLimiter from "./middleware/rateLimiter.js";
import job from "./config/cron.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
app.use(cors());
app.options("*", cors());
if (process.env.NODE_ENV === "production") job.start();
app.use(rateLimiter);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});
