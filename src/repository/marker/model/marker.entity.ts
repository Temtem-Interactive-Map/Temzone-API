export interface MarkerEntity {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  condition: string | null;
  x: number | null;
  y: number | null;
}
