import { createServer } from "http";
import { app } from "./server";

const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log("🔥 Socket server rodando na porta", PORT);
});
