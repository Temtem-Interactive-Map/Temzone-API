import { Page } from "model/page";
import { UserMarker } from "service/user/model/user.marker";

export interface UserService {
  getMarkers(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Page<UserMarker>>;
  setTemtemObtained(userId: string, tempediaId: number): Promise<void>;
}
