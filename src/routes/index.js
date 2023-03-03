import { route as markersRoute } from "routes/markers";
import { route as staticRoute } from "routes/static";

export const routes = [
  {
    path: "/markers",
    route: markersRoute,
  },
  {
    path: "/static",
    route: staticRoute,
  },
];
