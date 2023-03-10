import { route as markersRoute } from "controllers/markers";
import { route as searchRoute } from "controllers/search";
import { route as staticRoute } from "controllers/static";

export const controllers = [
  {
    path: "/markers",
    route: markersRoute,
  },
  {
    path: "/search",
    route: searchRoute,
  },
  {
    path: "/static",
    route: staticRoute,
  },
];
