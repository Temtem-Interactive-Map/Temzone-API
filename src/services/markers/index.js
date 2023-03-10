import { LyraMarkerDAO } from "daos/lyra/markers";
import { SQLiteMarkerDAO } from "daos/sqlite/markers";
import { StaticSaiparkMarkerDAO } from "daos/static/markers/saipark";
import { StaticSpawnMarkerDAO } from "daos/static/markers/spawns";
import { InternalServerError } from "responses/errors";

function coordinates(marker) {
  return marker.x && marker.y ? { x: marker.x, y: marker.y } : null;
}

export class MarkerService {
  static async createMarkers(ctx, markers) {
    const documents = [];

    for (const marker of markers) {
      try {
        await SQLiteMarkerDAO.findById(ctx, marker.id);
      } catch {
        documents.push(marker);

        await SQLiteMarkerDAO.insert(ctx, marker);
      }
    }

    await LyraMarkerDAO.insertMany(ctx, documents);
  }

  static async getMarkers(ctx, types) {
    const markers = await SQLiteMarkerDAO.findByType(ctx, types);

    return markers.map((marker) => {
      switch (marker.type) {
        case "spawn": {
          const spawn = StaticSpawnMarkerDAO.findById(marker.id);

          return {
            id: marker.id,
            type: marker.type,
            title: marker.title,
            subtitle: {
              current: marker.subtitle,
              original: spawn.subtitle,
            },
            condition: marker.condition,
            coordinates: coordinates(marker),
          };
        }
        case "saipark": {
          const saipark = StaticSaiparkMarkerDAO.findById(marker.id);

          return {
            id: marker.id,
            type: marker.type,
            title: marker.title,
            subtitle: {
              current: marker.subtitle,
              original: saipark.subtitle,
            },
            coordinates: coordinates(marker),
          };
        }
        default: {
          throw new InternalServerError("Unknown marker type: " + marker.type);
        }
      }
    });
  }

  static async searchMarkers(ctx, query, limit, offset) {
    const markers = [];
    const { items, next, prev } = await LyraMarkerDAO.findLikeQuery(
      ctx,
      query,
      limit,
      offset
    );

    for (const item of items) {
      const marker = await SQLiteMarkerDAO.findById(ctx, item.id);

      markers.push({
        id: marker.id,
        type: marker.type,
        title: marker.title,
        subtitle: marker.subtitle,
        coordinates: coordinates(marker),
      });
    }

    return { items: markers, next, prev };
  }
}
