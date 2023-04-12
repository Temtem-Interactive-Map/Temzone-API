import { NoResultError } from "kysely";
import { Page } from "model/page";
import { MarkerUserRepository } from "repository/marker-user/marker-user.repository";
import { MarkerRepository } from "repository/marker/marker.repository";
import { SaiparkRepository } from "repository/saipark/saipark.repository";
import { SearchRepository } from "repository/search/search.repository";
import { SpawnRepository } from "repository/spawn/spawn.repository";
import { TemtemRepository } from "repository/temtem/temtem.repository";
import { InternalServerError } from "service/error/internal-server.error";
import { NotFoundError } from "service/error/not-found.error";
import { MarkerService } from "service/marker/marker.service";
import { Coordinates, Marker } from "service/marker/model/marker";
import { SaiparkMarker } from "service/marker/model/saipark.marker";
import { SpawnMarker } from "service/marker/model/spawn.marker";
import { UserMarker } from "./model/user.marker";

export class MarkerImplService implements MarkerService {
  private readonly markerRepository: MarkerRepository;
  private readonly markerUserRepository: MarkerUserRepository;
  private readonly spawnRepository: SpawnRepository;
  private readonly saiparkRepository: SaiparkRepository;
  private readonly searchRepository: SearchRepository;
  private readonly temtemRepository: TemtemRepository;

  constructor(
    markerRepository: MarkerRepository,
    markerUserRepository: MarkerUserRepository,
    spawnRepository: SpawnRepository,
    saiparkRepository: SaiparkRepository,
    searchRepository: SearchRepository,
    temtemRepository: TemtemRepository
  ) {
    this.markerRepository = markerRepository;
    this.markerUserRepository = markerUserRepository;
    this.spawnRepository = spawnRepository;
    this.saiparkRepository = saiparkRepository;
    this.searchRepository = searchRepository;
    this.temtemRepository = temtemRepository;
  }

  async insertMany(markers: Marker[]): Promise<Marker[]> {
    const newMarkers = await this.markerRepository.insertMany(
      markers.map((marker) => {
        return {
          id: marker.id,
          type: marker.type,
          title: marker.title,
          subtitle: marker.subtitle as string,
          condition: null,
          x: null,
          y: null,
        };
      })
    );

    return newMarkers.map((marker) => {
      return {
        id: marker.id,
        type: marker.type,
        title: marker.title,
        subtitle: {
          current: marker.subtitle,
          original: marker.subtitle,
        },
        condition: null,
        coordinates: null,
      };
    });
  }

  async updateSpawnMarker(id: string, spawn: SpawnMarker): Promise<void> {
    try {
      const marker = await this.markerRepository.updateSpawn(
        id,
        spawn.subtitle as string,
        spawn.condition,
        (spawn.coordinates as Coordinates).x as number,
        (spawn.coordinates as Coordinates).y as number
      );

      await this.searchRepository.update({
        id: marker.id,
        title: marker.title,
        subtitle: marker.subtitle,
      });
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new NotFoundError("spawn");
      }

      throw error;
    }
  }

  async updateSaiparkMarker(id: string, saipark: SaiparkMarker): Promise<void> {
    try {
      const marker = await this.markerRepository.updateSaipark(
        id,
        (saipark.coordinates as Coordinates).x as number,
        (saipark.coordinates as Coordinates).y as number
      );

      await this.searchRepository.update({
        id: marker.id,
        title: marker.title,
        subtitle: marker.subtitle,
      });
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new NotFoundError("saipark");
      }

      throw error;
    }
  }

  async markTemtemObtained(userId: string, temtemId: string): Promise<void> {
    const markerIds = await this.markerRepository.getByIds(
      this.spawnRepository.getByTemtemId(temtemId).map((spawn) => spawn.id)
    );

    if (markerIds.length === 0) {
      throw new NotFoundError("temtem");
    }

    await this.markerUserRepository.updateMany(
      userId,
      markerIds.map((marker) => marker.id)
    );
  }

  async search(
    query: string,
    limit: number,
    offset: number
  ): Promise<Page<Marker>> {
    const { items, next, prev } = await this.searchRepository.search(
      query,
      limit,
      offset
    );

    const markers = [];
    for (const item of items) {
      const marker = await this.markerRepository.findById(item.id);

      markers.push({
        id: marker.id,
        type: marker.type,
        title: marker.title,
        subtitle: marker.subtitle,
        coordinates:
          marker.x !== null && marker.y !== null
            ? { x: marker.x, y: marker.y }
            : null,
      });
    }

    return {
      items: markers,
      next,
      prev,
    };
  }

  async getPage(limit: number, offset: number): Promise<Page<Marker>> {
    const { items, next, prev } = await this.markerRepository.getPage(
      limit,
      offset
    );

    const markers = items.map((marker) => {
      switch (marker.type) {
        case "spawn": {
          const spawn = this.spawnRepository.findById(marker.id);

          return {
            id: marker.id,
            type: marker.type,
            title: marker.title,
            subtitle: {
              current: marker.subtitle,
              original: spawn.subtitle,
            },
            condition: marker.condition,
            coordinates:
              marker.x !== null && marker.y !== null
                ? { x: marker.x, y: marker.y }
                : null,
          };
        }
        case "saipark": {
          const saipark = this.saiparkRepository.findById(marker.id);

          return {
            id: marker.id,
            type: marker.type,
            title: marker.title,
            subtitle: {
              current: marker.subtitle,
              original: saipark.subtitle,
            },
            coordinates:
              marker.x !== null && marker.y !== null
                ? { x: marker.x, y: marker.y }
                : null,
          };
        }
        default:
          throw new InternalServerError("Unknown marker type: " + marker.type);
      }
    });

    return {
      items: markers,
      next,
      prev,
    };
  }

  async getUserPage(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Page<UserMarker>> {
    const { items, next, prev } = await this.markerUserRepository.getPage(
      userId,
      limit,
      offset
    );

    const markers = items.map((marker) => {
      return {
        id: marker.id,
        type: marker.type,
        title: marker.title,
        subtitle: marker.subtitle,
        coordinates: {
          x: marker.x as number,
          y: marker.y as number,
        },
        obtained: marker.user_id !== null,
      };
    });

    return {
      items: markers,
      next,
      prev,
    };
  }
}
