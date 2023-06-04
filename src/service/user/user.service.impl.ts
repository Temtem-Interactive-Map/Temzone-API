import { Page } from "model/page";
import { MarkerUserRepository } from "repository/marker-user/marker-user.repository";
import { MarkerRepository } from "repository/marker/marker.repository";
import { SpawnRepository } from "repository/spawn/spawn.repository";
import { NotFoundError } from "service/error/not-found.error";
import { UserMarker } from "service/user/model/user.marker";
import { UserService } from "service/user/user.service";

export class UserServiceImpl implements UserService {
  private readonly markerRepository: MarkerRepository;
  private readonly markerUserRepository: MarkerUserRepository;
  private readonly spawnRepository: SpawnRepository;

  constructor(
    markerRepository: MarkerRepository,
    markerUserRepository: MarkerUserRepository,
    spawnRepository: SpawnRepository
  ) {
    this.markerRepository = markerRepository;
    this.markerUserRepository = markerUserRepository;
    this.spawnRepository = spawnRepository;
  }

  async getMarkers(
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

  async setTemtemObtained(userId: string, temtemId: string): Promise<void> {
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
}
