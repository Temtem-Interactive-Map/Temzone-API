export class MarkerDao {
  configure(conn) {
    this.conn = conn;
  }

  async getMarkers(types) {
    const results = await this.conn.execute(
      "select * from markers where type in (:types)",
      { types: types.join(",") }
    );

    return results;
  }
}
