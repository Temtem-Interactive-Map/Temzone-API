import temtem from "database/temtem.json";
import { TemtemEntity } from "repository/temtem/model/temtem.entity";
import { TemtemRepository } from "repository/temtem/temtem.repository";

export class TemtemJsonRepository implements TemtemRepository {
  findById(id: string): TemtemEntity {
    const marker = (temtem as Record<string, TemtemEntity>)[id];

    if (!marker) {
      throw new Error("Temtem with id " + id + " not found");
    }

    return marker;
  }
}
