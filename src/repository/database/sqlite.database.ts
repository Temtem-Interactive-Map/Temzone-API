import { MarkerUserEntity } from "repository/marker-user/model/marker-user.entity";
import { MarkerEntity } from "repository/marker/model/marker.entity";

export interface TemzoneDatabase {
  markers: MarkerEntity;
  markers_users: MarkerUserEntity;
}
