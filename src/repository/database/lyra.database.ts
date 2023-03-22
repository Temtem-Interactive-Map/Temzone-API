import { PropertiesSchema, PropertyType } from "@lyrasearch/lyra";

export interface SearchSchema extends PropertiesSchema {
  id: PropertyType;
  title: PropertyType;
  subtitle: PropertyType;
}
