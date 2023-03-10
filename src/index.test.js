import { insertBatch } from "@lyrasearch/lyra";
import { getDBClient as getLyraClient } from "daos/lyra";
import { getDBClient as getSQLiteClient } from "daos/sqlite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import app from "./index.js";

describe("Testing routes", async () => {
  vi.mock("controllers/static");
  vi.mock("middlewares/auth");
  vi.mock("daos/lyra");
  vi.mock("daos/sqlite");

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

  const userToken = await signInWithPassword("user@test.com", "user-password");
  const adminToken = await signInWithPassword(
    "admin@test.com",
    "admin-password"
  );

  async function request(path, options) {
    return app.request(
      options.query ? path + "?" + new URLSearchParams(options.query) : path,
      {
        method: options.method,
        headers: { Authorization: "Bearer " + options.token },
        body: JSON.stringify(options.body),
      }
    );
  }

  const errorProperties = [
    { name: "status", type: "number" },
    { name: "message", type: "string" },
  ];

  const pageProperties = [
    { name: "items", type: "object" },
    { name: "next", type: "number", nullable: true },
    { name: "prev", type: "number", nullable: true },
  ];

  const markerProperties = [
    { name: "id", type: "string" },
    { name: "type", type: "string" },
    { name: "title", type: "string" },
    { name: "subtitle", type: "string" },
    { name: "coordinates", type: "object", nullable: true },
  ];

  const spawnMarkerProperties = [
    { name: "id", type: "string" },
    { name: "type", type: "string" },
    { name: "title", type: "string" },
    { name: "subtitle", type: "object" },
    { name: "condition", type: "string", nullable: true },
    { name: "coordinates", type: "object", nullable: true },
  ];

  const saiparkMarkerProperties = [
    { name: "id", type: "string" },
    { name: "type", type: "string" },
    { name: "title", type: "string" },
    { name: "subtitle", type: "object" },
    { name: "coordinates", type: "object", nullable: true },
  ];

  const subtitleProperties = [
    { name: "current", type: "string" },
    { name: "original", type: "string" },
  ];

  const coordinatesProperties = [
    { name: "x", type: "number" },
    { name: "y", type: "number" },
  ];

  function checkProperties(subject, schema) {
    schema.forEach(({ name, type, nullable }) => {
      expect(subject).toHaveProperty(name);

      if (nullable) {
        if (subject[name] === null) {
          expect(
            subject[name],
            "Expected [" +
              name +
              "] property to be type : [" +
              type +
              " or null]"
          ).toBeNull();
        } else {
          expect(
            subject[name],
            "Expected [" +
              name +
              "] property to be type: [" +
              type +
              " or null]"
          ).toBeTypeOf(type);
        }
      } else {
        expect(
          subject[name],
          "Expected [" + name + "] property to be type: [" + type + "]"
        ).toBeTypeOf(type);
      }
    });
  }

  function checkErrorProperties(subject) {
    checkProperties(subject, errorProperties);
  }

  function checkPageProperties(subject) {
    checkProperties(subject, pageProperties);
  }

  function checkMarkerProperties(subject) {
    checkProperties(subject, markerProperties);
    checkProperties(subject.coordinates, coordinatesProperties);
  }

  function checkSpawnMarkerProperties(subject) {
    checkProperties(subject, spawnMarkerProperties);
    checkProperties(subject.subtitle, subtitleProperties);

    if (subject.coordinates !== null) {
      checkProperties(subject.coordinates, coordinatesProperties);
    }
  }

  function checkSaiparkMarkerProperties(subject) {
    checkProperties(subject, saiparkMarkerProperties);
    checkProperties(subject.subtitle, subtitleProperties);

    if (subject.coordinates !== null) {
      checkProperties(subject.coordinates, coordinatesProperties);
    }
  }

  beforeEach(async () => {
    const sqliteClient = getSQLiteClient();

    await sqliteClient.deleteFrom("markers").executeTakeFirst();
    await sqliteClient
      .insertInto("markers")
      .values({
        id: "84181c19-eb7f-58c4-aba0-19e189154df2",
        type: "spawn",
        title: "Scarawatt",
        subtitle: "Iwaba, Area 1",
      })
      .executeTakeFirstOrThrow();
    await sqliteClient
      .insertInto("markers")
      .values({
        id: "5bd4650d-3105-5c0c-8a42-141a33180873",
        type: "spawn",
        title: "Ampling",
        subtitle: "Iwaba, Area 2",
        condition: "Requires Fishing Rod",
      })
      .executeTakeFirstOrThrow();
    await sqliteClient
      .insertInto("markers")
      .values({
        id: "31bf1631-972e-56e1-9838-ded1c799356f",
        type: "saipark",
        title: "Saipark",
        subtitle: "West from Praise Coast",
        x: 100,
        y: 200,
      })
      .executeTakeFirstOrThrow();

    const lyraClient = await getLyraClient();

    await insertBatch(lyraClient, [
      {
        id: "84181c19-eb7f-58c4-aba0-19e189154df2",
        title: "Scarawatt",
        subtitle: "Iwaba, Area 1",
      },
      {
        id: "5bd4650d-3105-5c0c-8a42-141a33180873",
        title: "Ampling",
        subtitle: "Iwaba, Area 2",
      },
      {
        id: "31bf1631-972e-56e1-9838-ded1c799356f",
        title: "Saipark",
        subtitle: "West from Praise Coast",
      },
    ]);
  });

  it("route '/' should return 404 Not Found", async () => {
    for (const method of ["GET", "POST", "PUT", "DELETE"]) {
      for (const token of [null, userToken, adminToken]) {
        const response = await request("/", {
          method,
          token,
        });

        expect(response).toBeDefined();
        expect(response.status).toBe(404);

        const data = await response.json();

        checkErrorProperties(data);
      }
    }
  });

  it("route POST '/markers' should return 204 No Content", async () => {
    const response = await request("/markers", {
      method: "POST",
      token: adminToken,
      body: [
        {
          id: "7f45ffbb-94ca-5144-80b5-167cbdc0472f",
          type: "spawn",
          title: "Mimit",
          subtitle: "Iwaba, Area 3",
        },
      ],
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(204);
  });

  it("route POST '/markers' should return 400 Bad Request", async () => {
    for (const body of [
      [
        {
          id: "7f45ffbb-94ca-5144-80b5-167cbdc0472f",
          type: "unknown",
          title: "Mimit",
          subtitle: "Iwaba, Area 3",
        },
      ],
      [
        {
          id: "31bf1631-972e-56e1-9838-ded1c799356f",
          type: "saipark",
          title: "Saipark",
          subtitle: "West from Praise Coast",
        },
        {
          id: "7f45ffbb-94ca-5144-80b5-167cbdc0472f",
          type: "unknown",
          title: "Mimit",
          subtitle: "Iwaba, Area 3",
        },
      ],
    ]) {
      const response = await request("/markers", {
        method: "POST",
        token: adminToken,
        body,
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(400);

      const data = await response.json();

      checkErrorProperties(data);
    }
  });

  it("route POST '/markers' should return 403 Forbidden", async () => {
    const response = await request("/markers", {
      method: "POST",
      token: userToken,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(403);

    const data = await response.json();

    checkErrorProperties(data);
  });

  it("route GET '/markers' should return 200 Ok", async () => {
    const response = await request("/markers", {
      method: "GET",
      token: adminToken,
      query: {
        types: "spawn,saipark",
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const data = await response.json();

    data.forEach((marker) => {
      switch (marker.type) {
        case "spawn":
          checkSpawnMarkerProperties(marker);
          break;
        case "saipark":
          checkSaiparkMarkerProperties(marker);
          break;
      }
    });
  });

  it("route GET '/markers' should return 400 Bad Request", async () => {
    for (const query of [{}, { types: "" }, { types: "unknown" }]) {
      const response = await request("/markers", {
        method: "GET",
        token: adminToken,
        query,
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(400);

      const data = await response.json();

      checkErrorProperties(data);
    }
  });

  it("route GET '/markers' should return 403 Forbidden", async () => {
    const response = await request("/markers", {
      method: "GET",
      token: userToken,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(403);

    const data = await response.json();

    checkErrorProperties(data);
  });

  it("route GET '/search' should return 200 Ok", async () => {
    for (const token of [userToken, adminToken]) {
      const response = await request("/search", {
        method: "GET",
        token,
        query: {
          query: "saipark",
          limit: 1,
          offset: 0,
        },
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const data = await response.json();

      checkPageProperties(data);

      expect(data.items.length).toBe(1);
      expect(data.next).toBeNull();
      expect(data.prev).toBeNull();

      data.items.forEach((marker) => {
        checkMarkerProperties(marker);
      });
    }
  });

  it("route GET '/search' should return 400 Bad Request", async () => {
    for (const token of [userToken, adminToken]) {
      const response = await request("/search", {
        method: "GET",
        token,
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(400);

      const data = await response.json();

      checkErrorProperties(data);
    }
  });

  it("route GET '/static/types/crystal.png' should return 401 Unauthorized", async () => {
    const response = await request("/static/types/crystal.png", {
      method: "GET",
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);

    const data = await response.json();

    checkErrorProperties(data);
  });

  it("route GET '/static/types/crystal.png' should return 200 Ok", async () => {
    for (const token of [userToken, adminToken]) {
      const response = await request("/static/types/crystal.png", {
        method: "GET",
        token,
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(200);
    }
  });
});
