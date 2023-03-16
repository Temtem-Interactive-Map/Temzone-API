import { TemtemJsonRepository } from "repository/temtem/temtem.json.repository";
import { TemtemRepository } from "repository/temtem/temtem.repository";

export function getTemtemRepository(): TemtemRepository {
  const temtemJsonRepository = new TemtemJsonRepository();

  return temtemJsonRepository;
}
