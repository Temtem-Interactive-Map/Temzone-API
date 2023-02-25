import { PrismaClient } from "@prisma/client";
import command from "command-line-args";
import { config } from "dotenv";
import { readDBFile } from "../utils/database/index.js";
import { logError, logInfo, logSuccess } from "../utils/log/index.js";

const options = command([
  {
    name: "environment",
    type: String,
    defaultValue: "local",
    defaultOption: true,
  },
]);

switch (options.environment) {
  case "development":
    logInfo("Connecting to development database");
    config({ path: ".env.development", override: true });

    break;
  case "production":
    logInfo("Connecting to production database");
    config({ path: ".env.production", override: true });

    break;
  default:
    logInfo("Connecting to local database");

    break;
}

const markers = [];
const spawns = await readDBFile("spawns");
const saipark = await readDBFile("saipark");

Object.values(spawns).forEach((spawn) => {
  markers.push({
    id: spawn.id,
    type: "spawn",
    title: spawn.title,
    subtitle: spawn.subtitle,
    x: null,
    y: null,
  });
});

Object.values(saipark).forEach((saipark) => {
  markers.push({
    id: saipark.id,
    type: "saipark",
    title: saipark.title,
    subtitle: saipark.subtitle,
    x: null,
    y: null,
  });
});

const prisma = new PrismaClient();

try {
  const inserts = await prisma.marker.createMany({
    data: markers,
    skipDuplicates: true,
  });

  logSuccess("Markers inserted successfully");
  logInfo("Inserted " + inserts.count + " markers");
} catch (error) {
  logError("Error inserting markers");
  logError(error);
} finally {
  await prisma.$disconnect();
}
