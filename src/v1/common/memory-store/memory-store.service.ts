import { Injectable } from '@nestjs/common';
import { MatchScore } from 'src/v1/interfaces/match_making.interface';
import { Profile } from 'src/v1/interfaces/profiles.interface';
import { PriorityQueue } from '../utils/priority_queue';

@Injectable()
export class MemoryStoreService {
  private profiles: Map<string, Profile> = new Map();
  private quadrantIndex: Map<string, Set<string>> = new Map();
  private matchScores: Map<string, PriorityQueue<MatchScore>> = new Map();
  private exclusions: Map<
    string,
    {
      matched: Set<string>;
      blocked: Set<string>;
      disliked: Set<string>;
    }
  > = new Map();

  // Profile operations
  addProfile(profile: Profile): void {
    this.profiles.set(profile.id, profile);

    // Initialize exclusions
    if (!this.exclusions.has(profile.id)) {
      this.exclusions.set(profile.id, {
        matched: new Set<string>(),
        blocked: new Set<string>(),
        disliked: new Set<string>(),
      });
    }

    // Initialize match scores queue
    if (!this.matchScores.has(profile.id)) {
      this.matchScores.set(profile.id, new PriorityQueue<MatchScore>(20));
    }

    // Add existing exclusions if provided
    if (profile.exclusions) {
      const userExclusions = this.exclusions.get(profile.id);
      if (profile.exclusions.matched) {
        profile.exclusions.matched.forEach((id) =>
          userExclusions?.matched.add(id),
        );
      }
      if (profile.exclusions.blocked) {
        profile.exclusions.blocked.forEach((id) =>
          userExclusions?.blocked.add(id),
        );
      }
      if (profile.exclusions.disliked) {
        profile.exclusions.disliked.forEach((id) =>
          userExclusions?.disliked.add(id),
        );
      }
    }
  }

  getProfile(id: string): Profile | undefined {
    return this.profiles.get(id);
  }

  getAllProfiles(): Profile[] {
    return Array.from(this.profiles.values());
  }

  updateProfile(id: string, updates: Partial<Profile>): Profile | undefined {
    const profile = this.profiles.get(id);
    if (!profile) return undefined;

    const updatedProfile = { ...profile, ...updates };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  removeProfile(id: string): boolean {
    if (!this.profiles.has(id)) return false;

    // Remove from profiles
    this.profiles.delete(id);

    // Remove from all quadrants
    for (const [quadrant, users] of this.quadrantIndex.entries()) {
      if (users.has(id)) {
        users.delete(id);
      }
    }

    // Remove from match scores
    this.matchScores.delete(id);

    // Remove from exclusions
    this.exclusions.delete(id);

    // Remove this user from other users' match scores
    for (const queue of this.matchScores.values()) {
      queue.remove((match) => match.userId === id);
    }

    return true;
  }

  // Quadrant operations
  addToQuadrant(quadrant: string, userId: string): void {
    if (!this.quadrantIndex.has(quadrant)) {
      this.quadrantIndex.set(quadrant, new Set<string>());
    }
    this.quadrantIndex.get(quadrant)?.add(userId);
  }

  getUsersInQuadrants(quadrants: string[]): string[] {
    const userIds = new Set<string>();

    quadrants.forEach((quadrant) => {
      const users = this.quadrantIndex.get(quadrant);
      if (users) {
        users.forEach((userId) => userIds.add(userId));
      }
    });

    return Array.from(userIds);
  }

  // Match score operations
  addMatchScore(userId: string, matchId: string, score: number): void {
    if (!this.matchScores.has(userId)) {
      this.matchScores.set(userId, new PriorityQueue<MatchScore>(20));
    }

    this.matchScores.get(userId)?.enqueue({ userId: matchId, score }, score);
  }

  getTopMatches(userId: string, count: number): MatchScore[] {
    const queue = this.matchScores.get(userId);
    if (!queue) return [];

    return queue.getTopN(count);
  }

  addExclusion(
    userId: string,
    excludedId: string,
    type: 'matched' | 'blocked' | 'disliked',
  ): void {
    if (!this.exclusions.has(userId)) {
      this.exclusions.set(userId, {
        matched: new Set<string>(),
        blocked: new Set<string>(),
        disliked: new Set<string>(),
      });
    }

    const userExclusions = this.exclusions.get(userId);
    if (userExclusions) {
      userExclusions[type].add(excludedId);
    }
  }

  isExcluded(userId: string, potentialMatchId: string): boolean {
    const exclusions = this.exclusions.get(userId);
    if (!exclusions) return false;

    return (
      exclusions.matched.has(potentialMatchId) ||
      exclusions.blocked.has(potentialMatchId) ||
      exclusions.disliked.has(potentialMatchId)
    );
  }

  getExclusions(userId: string): Set<string> {
    const result = new Set<string>();
    const exclusions = this.exclusions.get(userId);

    if (!exclusions) return result;

    // Combine all exclusion types
    exclusions.matched.forEach((id) => result.add(id));
    exclusions.blocked.forEach((id) => result.add(id));
    exclusions.disliked.forEach((id) => result.add(id));

    return result;
  }
}
