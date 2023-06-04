import temtemJSON from "database/temtem.json";
import { TemtemEntity } from "repository/temtem/model/temtem.entity";
import { TemtemRepository } from "repository/temtem/temtem.repository";

export class TemtemRepositoryJson implements TemtemRepository {
  findById(id: string): TemtemEntity {
    const temtem = (temtemJSON as Record<string, unknown>)[id];

    if (!temtem) {
      throw new Error("Temtem with id " + id + " not found");
    }

    return { id, ...temtem } as TemtemEntity;
  }
}
