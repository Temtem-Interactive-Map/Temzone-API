import { Miniflare } from "miniflare";
import { beforeAll, describe, expect, it } from "vitest";

describe("Testing routes", () => {
  let userToken;
  let adminToken;
  let miniflare;

  function signInWithPassword(email, password) {
    return fetch(
      "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=dummy",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  beforeAll(async () => {
    userToken = await signInWithPassword("user@test.com", "user-password");
    adminToken = await signInWithPassword("admin@test.com", "admin-password");
    miniflare = new Miniflare({
      modules: true,
      scriptPath: "dist/index.mjs",
      bindings: {
        FIREBASE_EMULATOR: true,
      },
      wranglerConfigPath: true,
      buildCommand: undefined,
    });
  });

  async function request(path, options) {
    const url = new URL(path, "http://127.0.0.1:8787").href;

    return miniflare.dispatchFetch(url, options);
  }

  const errorProperties = [
    { name: "status", type: "number" },
    { name: "message", type: "string" },
  ];

  const markerProperties = [
    { name: "id", type: "string" },
    { name: "type", type: "string" },
    { name: "title", type: "string" },
    { name: "subtitle", type: "string" },
    { name: "coordinates", type: "object" },
  ];

  const coordinatesProperties = [
    { name: "x", type: "number" },
    { name: "y", type: "number" },
  ];

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

  it("route '/' should return 404 Not Found", async () => {
    const response = await request("/", {
      method: "GET",
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(404);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("route '/' should return 404 Not Found with user token", async () => {
    const response = await request("/", {
      method: "GET",
      headers: { Authorization: "Bearer " + userToken },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(404);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("route '/' should return 404 Not Found with admin token", async () => {
    const response = await request("/", {
      method: "GET",
      headers: { Authorization: "Bearer " + adminToken },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(404);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("route '/static/types/crystal.png' should return 401 Unauthorized", async () => {
    const response = await request("/static/types/crystal.png", {
      method: "GET",
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("route '/static/types/crystal.png' should return 200 Ok with user token", async () => {
    const response = await request("/static/types/crystal.png", {
      method: "GET",
      headers: { Authorization: "Bearer " + userToken },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("route '/static/types/crystal.png' should return 200 Ok with admin token", async () => {
    const response = await request("/static/types/crystal.png", {
      method: "GET",
      headers: { Authorization: "Bearer " + adminToken },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("route '/markers' should return 200 Ok with admin token", async () => {
    const response = await request("/markers?type=spawn", {
      method: "GET",
      headers: { Authorization: "Bearer " + userToken },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const data = await response.json();

    data.items.forEach((marker) => {
      checkProperties(marker, markerProperties);
      checkProperties(marker.coordinates, coordinatesProperties);
    });
  });
});
