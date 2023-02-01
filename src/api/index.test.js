import { config } from "dotenv";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { unstable_dev as unstableDev } from "wrangler";

async function getFirebaseToken(email, password) {
  return fetch(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
      process.env.FIREBASE_API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => data.idToken);
}

function checkProperties(subject, schema) {
  schema.forEach(({ name, type }) => {
    expect(subject).toHaveProperty(name);

    if (type) {
      expect(
        subject[name],
        "Expected [" + name + "] property to be type: [" + type + "]"
      ).toBeTypeOf(type);
    }
  });
}

const errorProperties = [
  { name: "status", type: "number" },
  { name: "message", type: "string" },
];

const temtemMarkerProperties = [
  { name: "id", type: "number" },
  { name: "type", type: "string" },
  { name: "title", type: "string" },
  { name: "subtitle", type: "string" },
  { name: "coordinates", type: "object" },
];

describe("Testing routes", () => {
  let userToken;
  let adminToken;
  let worker;

  beforeAll(async () => {
    config();

    userToken = await getFirebaseToken(
      process.env.FIREBASE_USER_EMAIL,
      process.env.FIREBASE_USER_PASSWORD
    );
    adminToken = await getFirebaseToken(
      process.env.FIREBASE_ADMIN_EMAIL,
      process.env.FIREBASE_ADMIN_PASSWORD
    );
    worker = await unstableDev("src/api/index.js", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("route '/' should return 401 Unauthorized", async () => {
    const response = await worker.fetch("/", {
      method: "GET",
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("route '/' should return 404 Not Found with user token", async () => {
    const response = await worker.fetch("/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(404);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("route '/' should return 404 Not Found with admin token", async () => {
    const response = await worker.fetch("/", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + adminToken,
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(404);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("route '/markers' should return 200 Ok with temtem marker props", async () => {
    const response = await worker.fetch("/markers?type=temtem", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + userToken,
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const data = await response.json();

    data.items.forEach((marker) => {
      checkProperties(marker, temtemMarkerProperties);
    });
  });
});
