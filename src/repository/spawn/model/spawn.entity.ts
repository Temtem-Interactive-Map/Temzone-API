export interface SpawnEntity {
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
