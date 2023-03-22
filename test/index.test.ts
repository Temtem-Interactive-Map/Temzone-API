import { getByID } from "@lyrasearch/lyra";
import { getSqliteDatabase } from "config/repository/database/kysely.database";
import { getLyraDatabase } from "config/repository/database/lyra.database";
import app from "index";
import { t } from "locales";
import { Page } from "model/page";
import { MarkerEntity } from "repository/marker/model/marker.entity";
import { SearchEntity } from "repository/search/model/search.entity";
import { Coordinates, Marker, Subtitle } from "service/marker/model/marker";
import { SaiparkMarker } from "service/marker/model/saipark.marker";
import { SpawnMarker } from "service/marker/model/spawn.marker";
import { populateDatabase, restoreDatabase } from "test/database";
import { adminToken, userToken } from "test/firebase";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

interface RequestOptions {
  method: string;
  token?: string;
  query?: Record<string, string | string> | undefined;
  body?: unknown;
}

interface Error {
  status: number;
  message: string;
}

describe("Testing routes", async () => {
  vi.mock("config/repository/database/kysely.database");
  vi.mock("config/repository/marker.repository");
  vi.mock("config/repository/search.repository");
  vi.mock("controller/static.controller.ts");
  vi.mock("middleware/auth.middleware");

  beforeEach(async () => {
    const sqliteDB = getSqliteDatabase();
    const lyraDB = getLyraDatabase();

    await populateDatabase(sqliteDB, lyraDB);
  });

  afterEach(async () => {
    const sqliteDB = getSqliteDatabase();
    const lyraDB = getLyraDatabase();

    await restoreDatabase(sqliteDB, lyraDB);
  });

  async function request(path: string, options: RequestOptions) {
    return app.request(
      options.query ? path + "?" + new URLSearchParams(options.query) : path,
      {
        method: options.method,
        headers: { Authorization: "Bearer " + options.token },
        body: JSON.stringify(options.body),
      }
    );
  }

  it("route '/' should return 404 Not Found", async () => {
    for (const method of ["GET", "POST", "PUT", "DELETE"]) {
      for (const token of ["", userToken, adminToken]) {
        const response = await request("/", {
          method,
          token,
        });

        expect(response).toBeDefined();
        expect(response.status).toBe(404);

        const data = (await response.json()) as Error;

        expect(data).toBeDefined();
        expect(data.status).toBe(404);
        expect(data.message).toBe(t("404", { request: "route" }));
      }
    }
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

    const data = (await response.json()) as Marker[];

    expect(data).toBeDefined();
    expect(data.length).toBe(3);

    const data1 = data[0] as SpawnMarker;
    expect(data1.id).toBe("5bd4650d-3105-5c0c-8a42-141a33180873");
    expect(data1.type).toBe("spawn");
    expect(data1.title).toBe("Ampling");
    expect((data1.subtitle as Subtitle).current).toBe("Iwaba, Area 2");
    expect((data1.subtitle as Subtitle).original).toBe("Iwaba, Area 2");
    expect(data1.condition).toBe("Requires Fishing Rod");
    expect(data1.coordinates).toBeNull();

    const data2 = data[1] as SaiparkMarker;
    expect(data2.id).toBe("31bf1631-972e-56e1-9838-ded1c799356f");
    expect(data2.type).toBe("saipark");
    expect(data2.title).toBe("Saipark");
    expect((data2.subtitle as Subtitle).current).toBe("West from Praise Coast");
    expect((data2.subtitle as Subtitle).original).toBe(
      "West from Praise Coast"
    );
    expect((data2.coordinates as Coordinates).x).toBe(100);
    expect((data2.coordinates as Coordinates).y).toBe(200);

    const data3 = data[2] as SpawnMarker;
    expect(data3.id).toBe("84181c19-eb7f-58c4-aba0-19e189154df2");
    expect(data3.type).toBe("spawn");
    expect(data3.title).toBe("Scarawatt");
    expect((data3.subtitle as Subtitle).current).toBe("Iwaba, Area 1");
    expect((data3.subtitle as Subtitle).original).toBe("Iwaba, Area 1");
    expect(data3.condition).toBeNull();
    expect(data3.coordinates).toBeNull();
  });

  it("route GET '/markers' should return 400 Bad Request", async () => {
    for (const query of [undefined, { types: "" }, { types: "unknown" }]) {
      const response = await request("/markers", {
        method: "GET",
        token: adminToken,
        query,
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(400);

      const data = (await response.json()) as Error;

      expect(data).toBeDefined();
      expect(data.status).toBe(400);
      expect(data.message).toBe(t("400", { param: "types" }));
    }
  });

  it("route GET '/markers' should return 403 Forbidden", async () => {
    const response = await request("/markers", {
      method: "GET",
      token: userToken,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(403);

    const data = (await response.json()) as Error;

    expect(data).toBeDefined();
    expect(data.status).toBe(403);
    expect(data.message).toBe(t("403"));
  });

  it("route POST '/markers' should return 200 Ok", async () => {
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
    expect(response.status).toBe(200);

    const data = (await response.json()) as SpawnMarker[];

    expect(data).toBeDefined();
    expect(data.length).toBe(1);

    const data1 = data[0];
    expect(data1.id).toBe("7f45ffbb-94ca-5144-80b5-167cbdc0472f");
    expect(data1.type).toBe("spawn");
    expect(data1.title).toBe("Mimit");
    expect((data1.subtitle as Subtitle).current).toBe("Iwaba, Area 3");
    expect((data1.subtitle as Subtitle).original).toBe("Iwaba, Area 3");
    expect(data1.condition).toBeNull();
    expect(data1.coordinates).toBeNull();

    const sqliteDB = getSqliteDatabase();
    const markers = await sqliteDB.selectFrom("markers").selectAll().execute();
    expect(markers).toBeDefined();
    expect(markers.length).toBe(4);
  });

  it("route POST '/markers' should return 400 Bad Request", async () => {
    for (const { param, body } of [
      {
        param: "id",
        body: [
          {
            id: "",
            type: "spawn",
            title: "Mimit",
            subtitle: "Iwaba, Area 3",
          },
        ],
      },
      {
        param: "type",
        body: [
          {
            id: "7f45ffbb-94ca-5144-80b5-167cbdc0472f",
            type: "unknown",
            title: "Mimit",
            subtitle: "Iwaba, Area 3",
          },
        ],
      },
      {
        param: "title",
        body: [
          {
            id: "7f45ffbb-94ca-5144-80b5-167cbdc0472f",
            type: "spawn",
            title: "TvH9S3x4dagDqsgO2Em7l2B3ipTeB44jimsVfY6eA",
            subtitle: "Iwaba, Area 3",
          },
        ],
      },
      {
        param: "subtitle",
        body: [
          {
            id: "7f45ffbb-94ca-5144-80b5-167cbdc0472f",
            type: "spawn",
            title: "Mimit",
            subtitle: "GnjzV6OTrapnsOYjoV0D0lGkbVELBJYaH2zUgCMNH",
          },
        ],
      },
    ]) {
      const response = await request("/markers", {
        method: "POST",
        token: adminToken,
        body,
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(400);

      const data = (await response.json()) as Error;

      expect(data).toBeDefined();
      expect(data.status).toBe(400);
      expect(data.message).toBe(t("400", { param }));
    }
  });

  it("route POST '/markers' should return 403 Forbidden", async () => {
    const response = await request("/markers", {
      method: "POST",
      token: userToken,
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(403);

    const data = (await response.json()) as Error;

    expect(data).toBeDefined();
    expect(data.status).toBe(403);
    expect(data.message).toBe(t("403"));
  });

  it("route PUT '/markers/spawns/:id' should return 204 No Content", async () => {
    const response = await request(
      "/markers/spawns/84181c19-eb7f-58c4-aba0-19e189154df2",
      {
        method: "PUT",
        token: adminToken,
        body: {
          subtitle: "Iwaba, Area 2",
          condition: "Requires Fishing Rod",
          coordinates: {
            x: 100,
            y: 200,
          },
        },
      }
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(204);

    const sqliteDB = getSqliteDatabase();
    const spawn = (await sqliteDB
      .selectFrom("markers")
      .selectAll()
      .where("id", "=", "84181c19-eb7f-58c4-aba0-19e189154df2")
      .executeTakeFirst()) as MarkerEntity;

    expect(spawn).toBeDefined();
    expect(spawn.id).toBe("84181c19-eb7f-58c4-aba0-19e189154df2");
    expect(spawn.type).toBe("spawn");
    expect(spawn.title).toBe("Scarawatt");
    expect(spawn.subtitle).toBe("Iwaba, Area 2");
    expect(spawn.condition).toBe("Requires Fishing Rod");
    expect(spawn.x).toBe(100);
    expect(spawn.y).toBe(200);

    const lyraDB = getLyraDatabase();
    const document = await getByID(
      lyraDB,
      "84181c19-eb7f-58c4-aba0-19e189154df2"
    );
    expect(document).toBeDefined();
    expect((document as SearchEntity).id).toBe(
      "84181c19-eb7f-58c4-aba0-19e189154df2"
    );
    expect((document as SearchEntity).title).toBe("Scarawatt");
    expect((document as SearchEntity).subtitle).toBe("Iwaba, Area 2");
  });

  it("route PUT '/markers/spawns/:id' should return 400 Bad Request", async () => {
    for (const { param, body } of [
      {
        param: "subtitle",
        body: {
          subtitle: "opEGutvRcWN1KzqRHx77A3ob770Nc7TSJ84vLgNka",
          condition: "Requires Fishing Rod",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      },
      {
        param: "condition",
        body: {
          subtitle: "Iwaba, Area 1",
          condition: "Ga5cuWXnG6SyDAKVKOYDGzQxaFgeqDWovXiDyWxNg",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      },
      {
        param: "coordinates",
        body: {
          subtitle: "Iwaba, Area 1",
          condition: "Requires Fishing Rod",
          coordinates: null,
        },
      },
      {
        param: "coordinates.x",
        body: {
          subtitle: "Iwaba, Area 1",
          condition: "Requires Fishing Rod",
          coordinates: {
            y: 0,
          },
        },
      },
      {
        param: "coordinates.y",
        body: {
          subtitle: "Iwaba, Area 1",
          condition: "Requires Fishing Rod",
          coordinates: {
            x: 0,
          },
        },
      },
    ]) {
      const response = await request(
        "/markers/spawns/84181c19-eb7f-58c4-aba0-19e189154df2",
        {
          method: "PUT",
          token: adminToken,
          body,
        }
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(400);

      const data = (await response.json()) as Error;

      expect(data).toBeDefined();
      expect(data.status).toBe(400);
      expect(data.message).toBe(t("400", { param }));
    }
  });

  it("route PUT '/markers/spawns/:id' should return 403 Forbidden", async () => {
    const response = await request(
      "/markers/spawns/84181c19-eb7f-58c4-aba0-19e189154df2",
      {
        method: "PUT",
        token: userToken,
      }
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(403);

    const data = (await response.json()) as Error;

    expect(data).toBeDefined();
    expect(data.status).toBe(403);
    expect(data.message).toBe(t("403"));
  });

  it("route PUT '/markers/spawns/:id' should return 404 Not Found", async () => {
    for (const id of [
      "8096c93b-7704-4482-a9d6-3fbff8cdaa39",
      "31bf1631-972e-56e1-9838-ded1c799356f",
    ]) {
      const response = await request("/markers/spawns/" + id, {
        method: "PUT",
        token: adminToken,
        body: {
          subtitle: "Iwaba, Area 1",
          condition: "Requires Fishing Rod",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(404);

      const data = (await response.json()) as Error;

      expect(data).toBeDefined();
      expect(data.status).toBe(404);
      expect(data.message).toBe(t("404", { request: "spawn" }));
    }
  });

  it("route PUT '/markers/saipark/:id' should return 204 No Content", async () => {
    const response = await request(
      "/markers/saipark/31bf1631-972e-56e1-9838-ded1c799356f",
      {
        method: "PUT",
        token: adminToken,
        body: {
          coordinates: {
            x: 200,
            y: 400,
          },
        },
      }
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(204);

    const sqliteDB = getSqliteDatabase();
    const saipark = (await sqliteDB
      .selectFrom("markers")
      .selectAll()
      .where("id", "=", "31bf1631-972e-56e1-9838-ded1c799356f")
      .executeTakeFirst()) as MarkerEntity;

    expect(saipark).toBeDefined();
    expect(saipark.id).toBe("31bf1631-972e-56e1-9838-ded1c799356f");
    expect(saipark.type).toBe("saipark");
    expect(saipark.title).toBe("Saipark");
    expect(saipark.subtitle).toBe("West from Praise Coast");
    expect(saipark.condition).toBeNull();
    expect(saipark.x).toBe(200);
    expect(saipark.y).toBe(400);

    const lyraDB = getLyraDatabase();
    const document = await getByID(
      lyraDB,
      "31bf1631-972e-56e1-9838-ded1c799356f"
    );
    expect(document).toBeDefined();
    expect((document as SearchEntity).id).toBe(
      "31bf1631-972e-56e1-9838-ded1c799356f"
    );
    expect((document as SearchEntity).title).toBe("Saipark");
    expect((document as SearchEntity).subtitle).toBe("West from Praise Coast");
  });

  it("route PUT '/markers/saipark/:id' should return 400 Bad Request", async () => {
    for (const { param, body } of [
      {
        param: "coordinates",
        body: {
          coordinates: null,
        },
      },
      {
        param: "coordinates.x",
        body: {
          coordinates: {
            y: 0,
          },
        },
      },
      {
        param: "coordinates.y",
        body: {
          coordinates: {
            x: 0,
          },
        },
      },
    ]) {
      const response = await request(
        "/markers/saipark/31bf1631-972e-56e1-9838-ded1c799356f",
        {
          method: "PUT",
          token: adminToken,
          body,
        }
      );

      expect(response).toBeDefined();
      expect(response.status).toBe(400);

      const data = (await response.json()) as Error;

      expect(data).toBeDefined();
      expect(data.status).toBe(400);
      expect(data.message).toBe(t("400", { param }));
    }
  });

  it("route PUT '/markers/saipark/:id' should return 403 Forbidden", async () => {
    const response = await request(
      "/markers/saipark/31bf1631-972e-56e1-9838-ded1c799356f",
      {
        method: "PUT",
        token: userToken,
      }
    );

    expect(response).toBeDefined();
    expect(response.status).toBe(403);

    const data = (await response.json()) as Error;

    expect(data).toBeDefined();
    expect(data.status).toBe(403);
    expect(data.message).toBe(t("403"));
  });

  it("route PUT '/markers/saipark/:id' should return 404 Not Found", async () => {
    for (const id of [
      "5bd4650d-3105-5c0c-8a42-141a33180873",
      "7f45ffbb-94ca-5144-80b5-167cbdc0472f",
    ]) {
      const response = await request("/markers/saipark/" + id, {
        method: "PUT",
        token: adminToken,
        body: {
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(404);

      const data = (await response.json()) as Error;

      expect(data).toBeDefined();
      expect(data.status).toBe(404);
      expect(data.message).toBe(t("404", { request: "saipark" }));
    }
  });

  it("route GET '/search' should return 200 Ok", async () => {
    for (const token of [userToken, adminToken]) {
      const response = await request("/search", {
        method: "GET",
        token,
        query: {
          query: "saipark",
          limit: "1",
          offset: "0",
        },
      });

      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const data = (await response.json()) as Page<Marker>;
      expect(data).toBeDefined();
      expect(data.items.length).toBe(1);
      expect(data.next).toBeNull();
      expect(data.prev).toBeNull();

      const data1 = data.items[0] as SaiparkMarker;
      expect(data1.id).toBe("31bf1631-972e-56e1-9838-ded1c799356f");
      expect(data1.type).toBe("saipark");
      expect(data1.title).toBe("Saipark");
      expect(data1.subtitle).toBe("West from Praise Coast");
      expect((data1.coordinates as Coordinates).x).toBe(100);
      expect((data1.coordinates as Coordinates).y).toBe(200);
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

      const data = (await response.json()) as Error;

      expect(data).toBeDefined();
      expect(data.status).toBe(400);
      expect(data.message).toBe(t("400", { param: "query" }));
    }
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

  it("route GET '/static/types/crystal.png' should return 401 Unauthorized", async () => {
    const response = await request("/static/types/crystal.png", {
      method: "GET",
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(401);

    const data = (await response.json()) as Error;

    expect(data).toBeDefined();
    expect(data.status).toBe(401);
    expect(data.message).toBe(t("401"));
  });
});
