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
    temtemRepository: TemtemRepository,
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
      }),
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

  async getMarkers(limit: number, offset: number): Promise<Page<Marker>> {
    const { items, next, prev } = await this.markerRepository.getPage(
      limit,
      offset,
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

  async search(
    query: string,
    limit: number,
    offset: number,
  ): Promise<Page<Marker>> {
    const { items, next, prev } = await this.searchRepository.search(
      query,
      limit,
      offset,
    );

    return {
      items: items.map((item) => {
        return {
          id: item.id,
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          coordinates: {
            x: item.x,
            y: item.y,
          },
        };
      }),
      next,
      prev,
    };
  }

  async getSpawn(id: string, baseUrl: string): Promise<MarkerSpawnDetails> {
    try {
      const marker = await this.markerRepository.findById(id);
      const spawn = this.spawnRepository.findById(id);
      const temtem = this.temtemRepository.findById(spawn.temtemId);

      return {
        id: spawn.id,
        rate: spawn.rate,
        level: spawn.level,
        condition: marker.condition,
        image: {
          url: baseUrl + "/" + spawn.image,
        },
        temtem: {
          id: temtem.tempediaId,
          name: temtem.name,
          description: temtem.description,
          types: temtem.types.map((type) => {
            return {
              name: type.name,
              image: {
                url: baseUrl + "/" + type.image,
              },
            };
          }),
          traits: temtem.traits,
          gender: temtem.gender,
          stats: temtem.stats,
          tvs: temtem.tvs,
          catchRate: temtem.catchRate,
          height: temtem.height,
          weight: temtem.weight,
          evolutions: temtem.evolutions.map((evolution) => {
            return {
              name: evolution.name,
              traits: evolution.traits,
              condition: evolution.condition,
              image: {
                url: baseUrl + "/" + evolution.image,
              },
            };
          }),
          image: {
            url: baseUrl + "/" + temtem.image,
          },
        },
      };
    } catch (error) {
      if (error instanceof NoResultError || error instanceof Error) {
        throw new NotFoundError("spawn");
      }

      throw error;
    }
  }

  async updateSpawn(id: string, spawn: MarkerSpawn): Promise<void> {
    try {
      const marker = await this.markerRepository.updateSpawn(
        id,
        spawn.subtitle as string,
        spawn.condition,
        (spawn.coordinates as Coordinates).x as number,
        (spawn.coordinates as Coordinates).y as number,
      );

      await this.searchRepository.update({
        id: marker.id,
        type: marker.type,
        title: marker.title,
        subtitle: marker.subtitle,
        x: marker.x as number,
        y: marker.y as number,
      });
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new NotFoundError("spawn");
      }

      throw error;
    }
  }

  async getSaipark(id: string, baseUrl: string): Promise<MarkerSaiparkDetails> {
    try {
      const saipark = this.saiparkRepository.findById(id);

      return {
        id: saipark.id,
        areas: saipark.areas.map((area) => {
          const temtem = this.temtemRepository.findById(area.temtemId);

          return {
            name: area.name,
            rate: area.rate,
            lumaRate: area.lumaRate,
            minSVs: area.minSVs,
            eggMoves: area.eggMoves,
            temtem: {
              id: temtem.tempediaId,
              name: temtem.name,
              types: temtem.types.map((type) => {
                return {
                  name: type.name,
                  image: {
                    url: baseUrl + "/" + type.image,
                  },
                };
              }),
              image: {
                url: baseUrl + "/" + temtem.image,
              },
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

  async updateSaipark(id: string, saipark: MarkerSaipark): Promise<void> {
    try {
      const marker = await this.markerRepository.updateSaipark(
        id,
        (saipark.coordinates as Coordinates).x as number,
        (saipark.coordinates as Coordinates).y as number,
      );

      await this.searchRepository.update({
        id: marker.id,
        type: marker.type,
        title: marker.title,
        subtitle: marker.subtitle,
        x: marker.x as number,
        y: marker.y as number,
      });
    } catch (error) {
      if (error instanceof NoResultError) {
        throw new NotFoundError("saipark");
      }

      throw error;
    }
  }
}
