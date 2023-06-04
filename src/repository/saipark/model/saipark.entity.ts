import { Area } from "model/area";

export interface SaiparkEntity {
  id: string;
  title: string;
  subtitle: string;
  areas: Area[];
}
