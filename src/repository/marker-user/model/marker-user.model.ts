export interface MarkerUserModel {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  x: number | null;
  y: number | null;
  user_id: string | null;
}
