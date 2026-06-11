import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import { initWebSocketGateway } from "./real-time/gateway.js";

dotenv.config();

const app = express();
app.use(express.json());

const httpServer = createServer(app);

initWebSocketGateway(httpServer);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Fleet Core Ingestion Engine running on port ${PORT}`);
});