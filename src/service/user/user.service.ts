import { Page } from "model/page";
import { UserMarker } from "service/user/model/user.marker";

export interface UserService {
  getMarkers(
    userId: string,
    limit: number,
    offset: number
  ): Promise<Page<UserMarker>>;
  markTemtemAsObtained(userId: string, temtemId: string): Promise<void>;
}
