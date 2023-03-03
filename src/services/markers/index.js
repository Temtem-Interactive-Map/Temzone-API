export class MarkersService {
  constructor(markerDao, spawnDao, saiparkDao) {
    this.markerDao = markerDao;
    this.spawnDao = spawnDao;
    this.saiparkDao = saiparkDao;
  }

  configure(conn) {
    this.markerDao.configure(conn);
  }

  async getMarkers(types) {
    const markers = await this.markerDao.getMarkers(types);

    for (const marker of markers) {
      switch (marker.type) {
        case "spawn":
          marker.spawn = await this.spawnDao.findById(marker.id);
          break;
        case "saipark":
          marker.saipark = await this.saiparkDao.findById(marker.id);
          break;
      }
    }

    return markers;
  }
}
