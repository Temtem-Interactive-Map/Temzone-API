import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { unstable_dev as unstableDev } from "wrangler";

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

describe("Testing '/markers' route", () => {
  let worker;

  beforeAll(async () => {
    worker = await unstableDev("src/api/index.js", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  const markerProperties = [
    { name: "id", type: "number" },
    { name: "type", type: "string" },
    { name: "title", type: "string" },
    { name: "subtitle", type: "string" },
    { name: "coordinates", type: "object" },
  ];

  const coordinatesProperties = [
    { name: "x", type: "number" },
    { name: "y", type: "number" },
  ];

  it("should", async () => {
    const response = await worker.fetch("/markers", {
      method: "GET",
      headers: {
        Authorization: "Bearer ",
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(400);

    const data = await response.json();

    checkProperties(data, errorProperties);
  });

  it("should return marker props", async () => {
    const response = await worker.fetch("/markers", {
      method: "GET",
      headers: {
        Authorization: "Bearer ",
      },
    });

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const data = await response.json();

    // data.forEach((endpoint) => checkProperties(endpoint, markerProperties));
  });
});
