CREATE TABLE
  markers_users (
    marker_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    CONSTRAINT markers_users_pk PRIMARY KEY (marker_id, user_id),
    CONSTRAINT markers_users_marker_id_fk FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE ON UPDATE CASCADE
  );
