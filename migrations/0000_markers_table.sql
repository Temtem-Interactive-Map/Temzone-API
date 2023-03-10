CREATE TABLE
  markers (
    id TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    condition TEXT,
    x INTEGER,
    y INTEGER,
    CONSTRAINT markers_pk PRIMARY KEY (id)
  );
