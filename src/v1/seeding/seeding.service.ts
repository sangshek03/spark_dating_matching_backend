import { Injectable } from '@nestjs/common';
import { Profile } from 'src/v1/interfaces/profiles.interface';
import { ProfilesService } from 'src/v1/profile/profile.service';

@Injectable()
export class SeedingService {
  constructor(private profilesService: ProfilesService) {}

  seedUsers(count: number): void {
    for (let i = 0; i < count; i++) {
      const profile = this.generateRandomProfile();
      this.profilesService.create(profile);
    }
  }

  private generateRandomProfile(): Profile {
    // Generate a random user ID
    const id = `user-${Math.floor(Math.random() * 10000)}`;

    // Generate random age between 18 and 65
    const age = Math.floor(Math.random() * 47) + 18;

    // Random gender
    const genders = ['M', 'F', 'NB'];
    const gender = genders[Math.floor(Math.random() * genders.length)];

    // Random location around Bangkok (for demo purposes)
    // Bangkok coordinates: 13.7563, 100.5018
    const lat = 13.7563 + (Math.random() - 0.5) * 0.2; // approx +/- 10km
    const lon = 100.5018 + (Math.random() - 0.5) * 0.2;

    // Random interests
    const allInterests = [
      'music',
      'art',
      'travel',
      'food',
      'movies',
      'books',
      'sports',
      'technology',
      'gaming',
      'fitness',
      'photography',
      'dancing',
      'hiking',
      'cooking',
      'writing',
      'yoga',
      'fashion',
      'pets',
    ];

    // Select 2-5 random interests
    const interestCount = Math.floor(Math.random() * 4) + 2;
    const interests: string[] = [];

    while (interests.length < interestCount) {
      const interest =
        allInterests[Math.floor(Math.random() * allInterests.length)];
      if (!interests.includes(interest)) {
        interests.push(interest);
      }
    }

    return {
      id,
      age,
      gender,
      location: { lat, lon },
      interests,
      // Optional gender preference
      lookingFor: this.generateRandomPreference(gender),
    };
  }

  private generateRandomPreference(gender: string): string[] {
    // Simple logic to generate gender preferences
    const preferences: string[] = []; // Explicitly type as string array
    const coinFlip = Math.random();

    if (gender === 'M') {
      if (coinFlip < 0.8) preferences.push('F');
      if (coinFlip > 0.2) preferences.push('M');
      if (coinFlip > 0.7) preferences.push('NB');
    } else if (gender === 'F') {
      if (coinFlip < 0.8) preferences.push('M');
      if (coinFlip > 0.2) preferences.push('F');
      if (coinFlip > 0.7) preferences.push('NB');
    } else {
      // NB
      if (coinFlip < 0.6) preferences.push('M');
      if (coinFlip < 0.7) preferences.push('F');
      if (coinFlip < 0.8) preferences.push('NB');
    }

    return preferences;
  }
}
