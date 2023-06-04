import { TemtemRepository } from "repository/temtem/temtem.repository";
import { TemtemRepositoryJson } from "repository/temtem/temtem.repository.json";

export function getTemtemRepository(): TemtemRepository {
  const temtemRepositoryJson = new TemtemRepositoryJson();

  return temtemRepositoryJson;
}
