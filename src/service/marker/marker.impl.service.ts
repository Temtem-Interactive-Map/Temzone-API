import { NoResultError } from "kysely";
import { Page } from "model/page";
import { MarkerRepository } from "repository/marker/marker.repository";
import { SaiparkRepository } from "repository/saipark/saipark.repository";
import { SearchRepository } from "repository/search/search.repository";
import { SpawnRepository } from "repository/spawn/spawn.repository";
import { TemtemRepository } from "repository/temtem/temtem.repository";
import { InternalServerError } from "service/error/internal-server.error";
import { NotFoundError } from "service/error/not-found.error";
import { MarkerService } from "service/marker/marker.service";
import { Marker } from "service/marker/model/marker";
import { SpawnMarker } from "service/marker/model/spawn.marker";
import { SaiparkMarker } from "./model/saipark.marker";

export class MarkerImplService implements MarkerService {
  private readonly markerRepository: MarkerRepository;
  private readonly spawnRepository: SpawnRepository;
  private readonly saiparkRepository: SaiparkRepository;
  private readonly searchRepository: SearchRepository;
  private readonly temtemRepository: TemtemRepository;

  constructor(
    markerRepository: MarkerRepository,
    spawnRepository: SpawnRepository,
    saiparkRepository: SaiparkRepository,
    searchRepository: SearchRepository,
    temtemRepository: TemtemRepository
  ) {
    this.markerRepository = markerRepository;
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

    await this.searchRepository.insertMany(
      newMarkers.map((marker) => {
        return {
          id: marker.id,
          title: marker.title,
          subtitle: marker.subtitle,
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
        spawn.coordinates?.x as number,
        spawn.coordinates?.y as number
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
      await this.markerRepository.updateSaipark(
        id,
        saipark.coordinates?.x as number,
        saipark.coordinates?.y as number
      );
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new NotFoundError("saipark");
      }

      throw error;
    }
  }

  async findByTypes(types: string[]): Promise<Marker[]> {
    const markers = await this.markerRepository.findByTypes(types);

    return markers.map((marker) => {
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

    const markers = await this.markerRepository.findByIds(
      items.map((item) => item.id)
    );

    return {
      items: markers.map((marker) => {
        return {
          id: marker.id,
          type: marker.type,
          title: marker.title,
          subtitle: marker.subtitle,
          coordinates:
            marker.x !== null && marker.y !== null
              ? { x: marker.x, y: marker.y }
              : null,
        };
      }),
      next,
      prev,
    };
  }
}
