export interface Page<T> {
  items: T[];
  next: number | null;
  prev: number | null;
}
