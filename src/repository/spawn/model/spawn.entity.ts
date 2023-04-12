export interface SpawnEntity {
  id: string;
  title: string;
  subtitle: string;
  rate: number[];
  level: {
    min: number;
    max: number;
  };
  image: string;
  temtemId: string;
}
