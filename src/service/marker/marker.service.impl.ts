import { NoResultError } from "kysely";
import { Coordinates } from "model/coordinates";
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
import { MarkerSaipark } from "service/marker/model/marker.saipark";
import { MarkerSaiparkDetails } from "service/marker/model/marker.saipark.details";
import { MarkerSpawn } from "service/marker/model/marker.spawn";
import { MarkerSpawnDetails } from "service/marker/model/marker.spawn.details";

export class MarkerServiceImpl implements MarkerService {
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

  async insertMarkers(markers: Marker[]): Promise<Marker[]> {
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

  async getSpawnMarker(
    id: string,
    baseUrl: string
  ): Promise<MarkerSpawnDetails> {
    try {
      const marker = await this.markerRepository.findById(id);
      const spawn = this.spawnRepository.findById(id);
      const temtem = this.temtemRepository.findById(spawn.temtemId);

      return {
        id: spawn.id,
        rate: spawn.rate,
        level: spawn.level,
        condition: marker.condition,
        image: baseUrl + "/" + spawn.image,
        temtem: {
          id: temtem.tempediaId,
          name: temtem.name,
          description: temtem.description,
          types: temtem.types.map((type) => {
            return {
              name: type.name,
              image: baseUrl + "/" + type.image,
            };
          }),
          images: {
            png: baseUrl + "/" + temtem.images.png,
            gif: baseUrl + "/" + temtem.images.gif,
          },
          traits: temtem.traits,
          details: temtem.details,
          stats: temtem.stats,
          tvs: temtem.tvs,
          evolutions: temtem.evolutions.map((evolution) => {
            return {
              name: evolution.name,
              traits: evolution.traits,
              condition: evolution.condition,
              image: baseUrl + "/" + evolution.image,
            };
          }),
        },
      };
    } catch (error) {
      if (error instanceof NoResultError || error instanceof Error) {
        throw new NotFoundError("spawn");
      }

      throw error;
    }
  }

  async updateSpawnMarker(id: string, spawn: MarkerSpawn): Promise<void> {
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

  async getSaiparkMarker(
    id: string,
    baseUrl: string
  ): Promise<MarkerSaiparkDetails> {
    try {
      const saipark = this.saiparkRepository.findById(id);

      return {
        id: saipark.id,
        areas: saipark.areas.map((area) => {
          const temtem = this.temtemRepository.findById(area.temtemId);

          return {
            area: area.area,
            rate: area.rate,
            lumaRate: area.lumaRate,
            minSVs: area.minSVs,
            eggTech: area.eggTech,
            temtem: {
              id: temtem.tempediaId,
              name: temtem.name,
              types: temtem.types.map((type) => {
                return {
                  name: type.name,
                  image: baseUrl + "/" + type.image,
                };
              }),
              image: baseUrl + "/" + temtem.images.gif,
            },
          };
        }),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundError("saipark");
      }

      throw error;
    }
  }

  async updateSaiparkMarker(id: string, saipark: MarkerSaipark): Promise<void> {
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

  async getMarkers(limit: number, offset: number): Promise<Page<Marker>> {
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

  async searchMarkers(
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
        coordinates: {
          x: marker.x as number,
          y: marker.y as number,
        },
      });
    }

    return {
      items: markers,
      next,
      prev,
    };
  }
}
