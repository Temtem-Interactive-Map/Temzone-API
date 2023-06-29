import { PropertiesSchema, PropertyType } from "@lyrasearch/lyra";

export interface SearchSchema extends PropertiesSchema {
  id: PropertyType;
  type: PropertyType;
  title: PropertyType;
  subtitle: PropertyType;
  x: PropertyType;
  y: PropertyType;
}
