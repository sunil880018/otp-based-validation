import express from "express";
import { dbConnection } from "./database/db.js";
import bodyParser from "body-parser";
import { apiRequestLimiter } from "./middleware/apiRateLimiter.js";
import { CONFIG } from "./config/config.js";
import { registerContoller } from "./controllers/registerController.js";
import { verifyController } from "./controllers/verifyController.js";

dbConnection();
const app = express();
const PORT = CONFIG.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(apiRequestLimiter);

app.post("/signup", registerContoller);

app.post("/signup/verify", verifyController);
app.listen(PORT, () => {
  console.log(`server run at ${PORT}`);
});
