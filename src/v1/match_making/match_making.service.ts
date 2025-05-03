import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryStoreService } from '../common/memory-store/memory-store.service';
import { GeohashService } from '../common/geohash/geohash.service';
import { MatchResult } from 'src/v1/interfaces/match_making.interface';
import { Profile } from 'src/v1/interfaces/profiles.interface';

@Injectable()
export class MatchmakingService {
  constructor(
    private memoryStore: MemoryStoreService,
    private geohashService: GeohashService,
  ) {}

  findMatches(userId: string, count: number = 5): MatchResult[] {
    const user = this.memoryStore.getProfile(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Get precomputed top matches
    const topMatches = this.memoryStore.getTopMatches(userId, 20);

    // Filter out excluded matches
    const exclusions = this.memoryStore.getExclusions(userId);
    const filteredMatches = topMatches.filter(
      (match) => !exclusions.has(match.userId),
    );

    // Get the top N matches after filtering
    const limitedMatches = filteredMatches.slice(0, count);

    // Get full profiles for these matches
    return limitedMatches.map((match) => {
      const profile = this.memoryStore.getProfile(match.userId);
      return {
        userId: match.userId,
        score: match.score,
        profile: profile,
      };
    });
  }

  precomputeMatchesForUser(userId: string): void {
    const user = this.memoryStore.getProfile(userId);
    if (!user) return;

    // Get user's quadrant
    const quadrant = this.geohashService.encodeGeohash(
      user.location.lat,
      user.location.lon,
    );

    // Get adjacent quadrants
    const quadrants = this.geohashService.getAdjacentQuadrants(quadrant);

    // Get users in these quadrants
    const nearbyUserIds = this.memoryStore.getUsersInQuadrants(quadrants);

    // Calculate match scores for nearby users
    for (const nearbyUserId of nearbyUserIds) {
      // Skip self
      if (nearbyUserId === userId) continue;

      const nearbyUser = this.memoryStore.getProfile(nearbyUserId);
      if (!nearbyUser) continue;

      // Calculate bidirectional match scores
      const score = this.calculateMatchScore(user, nearbyUser);

      // Store the score for the new user
      this.memoryStore.addMatchScore(userId, nearbyUserId, score);

      // Also update the score for the nearby user
      this.memoryStore.addMatchScore(nearbyUserId, userId, score);
    }
  }

  calculateMatchScore(user1: Profile, user2: Profile): number {
    // Calculate individual component scores
    const ageScore = this.scoreAge(user1.age, user2.age);
    const interestsScore = this.scoreInterests(
      user1.interests,
      user2.interests,
    );
    const locationScore = this.scoreLocation(
      user1.location.lat,
      user1.location.lon,
      user2.location.lat,
      user2.location.lon,
    );

    // Optional: gender preference (if implemented)
    // const preferenceScore = this.scoreGenderPreference(user1, user2);

    // Weighted combination of scores (weights can be adjusted)
    const totalScore =
      0.25 * ageScore + 0.35 * interestsScore + 0.4 * locationScore;
    // + 0.15 * preferenceScore (if implemented)

    return totalScore;
  }

  // Helper methods for scoring components
  private scoreAge(age1: number, age2: number): number {
    // Lower score for larger age differences
    const ageDiff = Math.abs(age1 - age2);

    // Normalize: 0 years diff = 1.0, 10+ years diff = 0.0
    return Math.max(0, 1 - ageDiff / 10);
  }

  private scoreInterests(interests1: string[], interests2: string[]): number {
    if (!interests1.length || !interests2.length) return 0;

    // Count common interests
    const interest1Set = new Set(interests1);
    const commonInterests = interests2.filter((interest) =>
      interest1Set.has(interest),
    );

    // Calculate Jaccard similarity: |A ∩ B| / |A ∪ B|
    const unionSize = new Set([...interests1, ...interests2]).size;
    return commonInterests.length / unionSize;
  }

  private scoreLocation(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const distance = this.geohashService.calculateDistance(
      lat1,
      lon1,
      lat2,
      lon2,
    );

    // Normalize: 0km = 1.0, 50km+ = 0.0
    return Math.max(0, 1 - distance / 50);
  }
}
