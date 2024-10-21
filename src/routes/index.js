import chatRouter from "./chat.js"
import authRouter from "./auth.js"

function route(app) {
  app.use("/api/chat", chatRouter);
  app.use("/api/auth", authRouter);
}

export default route;
