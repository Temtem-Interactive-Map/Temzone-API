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

describe("Testing '/markers' route", () => {
  let worker;

  beforeAll(async () => {
    worker = await unstableDev("src/index.js", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  const markerProperties = [{ name: "id", type: "number" }];

  it("should return marker props", async () => {
    const response = await worker.fetch("/markers");

    expect(response).toBeDefined();
    expect(response.status).toBe(200);

    const data = await response.json();

    data.forEach((endpoint) => checkProperties(endpoint, markerProperties));
  });
});
