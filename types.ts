export interface StarData {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  memory: string;
  timestamp: number;
  photo?: string; // base64 data URL
  year?: number;  // year the photo was taken
}

export interface Coordinates {
  x: number;
  y: number;
}
