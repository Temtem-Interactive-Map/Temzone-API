import { Page } from "model/page";
import { MarkerUserModel } from "repository/marker-user/model/marker-user.model";

export interface MarkerUserRepository {
  updateMany(userId: string, markerIds: string[]): Promise<void>;
  getPage(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Page<MarkerUserModel>>;
}
