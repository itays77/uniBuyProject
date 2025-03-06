export type User = {
  _id: string;
  email: string;
  name: string;
}

export enum ItemCountry {
  England = 'England',
  Spain = 'Spain',
  Germany = 'Germany',
  Italy = 'Italy',
  Brazil = 'Brazil',
  Argentina = 'Argentina',
  France = 'France',
  Portugal = 'Portugal',
  Netherlands = 'Netherlands',
  Belgium = 'Belgium',
  Israel = 'Israel',
}

export enum KitType {
  Home = 'Home',
  Away = 'Away',
  Third = 'Third',
}

export type Item = {
  itemNumber: string;
  name: string;
  price: number;
  description?: string;
  country: ItemCountry;
  kitType: KitType;
  season: string;
};