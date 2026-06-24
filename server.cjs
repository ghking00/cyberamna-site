var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_firebase_admin = __toESM(require("firebase-admin"), 1);
var import_meta = {};
var __dirname = import_path.default.dirname((0, import_url.fileURLToPath)(import_meta.url));
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    import_firebase_admin.default.initializeApp({
      credential: import_firebase_admin.default.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set. Push notifications will not work.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/send-notification", async (req, res) => {
    try {
      const { token, title, body, data } = req.body;
      if (!token) {
        return res.status(400).json({ error: "FCM token is required" });
      }
      if (!import_firebase_admin.default.apps.length) {
        return res.status(503).json({ error: "Firebase Admin not initialized. Please set FIREBASE_SERVICE_ACCOUNT." });
      }
      const message = {
        notification: {
          title,
          body
        },
        data: data || {},
        token
      };
      const response = await import_firebase_admin.default.messaging().send(message);
      res.json({ success: true, messageId: response });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
