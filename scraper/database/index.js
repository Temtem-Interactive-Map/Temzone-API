import { config } from "dotenv";
import { readDBFile } from "../utils/database/index.js";
import { logError, logInfo, logSuccess } from "../utils/log/index.js";

try {
  config();

  const markers = [];
  const spawns = await readDBFile("spawns");
  const saipark = await readDBFile("saipark");

  Object.entries(spawns).forEach(([id, spawn]) => {
    markers.push({
      id,
      type: "spawn",
      title: spawn.title,
      subtitle: spawn.subtitle,
    });
  });

  Object.entries(saipark).forEach(([id, saipark]) => {
    markers.push({
      id,
      type: "saipark",
      title: saipark.title,
      subtitle: saipark.subtitle,
    });
  });

  const token = await fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
      process.env.FIREBASE_API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: process.env.FIREBASE_USER_EMAIL,
        password: process.env.FIREBASE_USER_PASSWORD,
        returnSecureToken: true,
      }),
    },
  )
    .then((response) => response.json())
    .then((data) => data.idToken);

  let countMarkers = 0;
  while (markers.length > 0) {
    countMarkers += await fetch(process.env.TEMZONE_BASE_URL + "/markers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(markers.splice(0, 200)),
    })
      .then((response) => response.json())
      .then((markers) => markers.length);
  }

  logSuccess("Markers inserted successfully");
  logInfo("Inserted " + countMarkers + " markers");
} catch (error) {
  logError("Error inserting markers");
  logError(error);

  throw error;
}
