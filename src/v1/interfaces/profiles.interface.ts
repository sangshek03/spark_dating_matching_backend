export interface Location {
    lat: number;
    lon: number;
  }
  
  export interface Profile {
    id: string;
    age: number;
    gender: string;
    location: Location;
    interests: string[];
    // Optional bonus fields
    lookingFor?: string[];
    exclusions?: {
      matched?: string[];
      blocked?: string[];
      disliked?: string[];
    };
  }