import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { seedDatabase } from "./seed";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

if (process.env.REPLIT_DEPLOYMENT) {
  app.use((req, res, next) => {
    if (req.path === "/health") return next();
    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BarterConnect — Coming Soon</title>
  <meta name="description" content="BarterConnect — Trade skills, not cash. A skill-based networking platform. Coming soon.">
  <meta property="og:title" content="BarterConnect — Coming Soon">
  <meta property="og:description" content="Trade skills, not cash. A skill-based networking platform launching soon.">
  <meta property="og:type" content="website">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: hsl(270, 40%, 92%);
      font-family: 'Open Sans', system-ui, sans-serif;
      color: hsl(270, 45%, 22%);
      text-align: center;
      padding: 2rem;
    }
    img { max-width: 320px; width: 100%; height: auto; margin-bottom: 2rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; }
    p { font-size: 1.1rem; color: hsl(270, 20%, 45%); max-width: 480px; line-height: 1.6; }
    .tagline { color: hsl(25, 85%, 50%); font-weight: 600; margin-top: 1.5rem; font-size: 1.2rem; }
  </style>
</head>
<body>
  <img src="https://barterconnect.app/assets/BarterConnect_Logo_cropped-DJn8VxJL.png" alt="BarterConnect" onerror="this.style.display='none'" />
  <h1>Coming Soon</h1>
  <p>We're building something great — a community where people trade skills instead of dollars.</p>
  <p class="tagline">Trade skills, not cash.</p>
</body>
</html>`);
  });
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    await registerRoutes(httpServer, app);
  } catch (err) {
    console.error("Route registration error (non-fatal):", err);
  }

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);

      seedWithRetry();
    },
  );
})();

async function seedWithRetry(attempts = 0) {
  const MAX_ATTEMPTS = 5;
  try {
    await seedDatabase();
  } catch (err) {
    if (attempts < MAX_ATTEMPTS) {
      const delay = Math.min(2000 * Math.pow(2, attempts), 30000);
      console.error(`Seed attempt ${attempts + 1} failed, retrying in ${delay}ms...`);
      setTimeout(() => seedWithRetry(attempts + 1), delay);
    } else {
      console.error("Seed failed after all retries (non-fatal):", err);
    }
  }
}
