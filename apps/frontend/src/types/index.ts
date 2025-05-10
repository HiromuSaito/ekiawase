export type Station = {
  code: string;
  name: string;
  lon: number;
  lat: number;
  lines: string[];
};

export type SelectItem = {
  id: string;
  label: string;
  description?: string;
};
