import { route as markersRoute } from "controller/marker.controller";
import { route as searchRoute } from "controller/search.controller";
import { route as staticRoute } from "controller/static.controller";
import { route as userRoute } from "controller/user.controller";

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
  {
    path: "/user",
    route: userRoute,
  },
];
