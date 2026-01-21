const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");
const propertyRoutes = require("./property/property.route");
const favoriteRoutes = require("./favorite/favorite.route");
const userRoutes = require("./user/user.route");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/properties", propertyRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/users", userRoutes);

const port = Number(process.env.PORT) || 4000;

// Initialize database and start server
async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to MongoDB");

    const server = app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`);
    });

    server.on("error", (err) => {
      if (err && err.code === "EADDRINUSE") {
        console.error(
          `Port ${port} is already in use. Stop the other process or run with PORT=<otherPort> yarn dev:api`
        );
        process.exit(1);
      }
      console.error("API server error:", err);
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
