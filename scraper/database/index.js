import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { readDBFile } from "../utils/database/index.js";
import { logError, logInfo, logSuccess } from "../utils/log/index.js";

config();

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
