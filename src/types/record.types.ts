export type TTasks = {
  id?: string;
  year: number;
  month: number;
  week: 1 | 2 | 3 | 4 | 5 | 6;
  type: 'challenge' | 'accomplishment';
  description: string;
};

export type TRoadmap = {
  id?: string;
  title: string;
};

export type TSendStarData = {
  name: string;
  image: string;
  achievements: string[];
};

export type TStars = TSendStarData & {
  id?: string;
  year: number;
  month: number;
  name: string;
  accomplishment: string[];
};

export type TCharts = {
  id?: string;
  year: number;
  month: number;
  json: string;
};
