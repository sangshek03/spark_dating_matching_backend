import { Injectable, NotFoundException } from '@nestjs/common';
import { MemoryStoreService } from '../common/memory-store/memory-store.service';
import { GeohashService } from '../common/geohash/geohash.service';
import { Profile } from 'src/v1/interfaces/profiles.interface';
import { MatchmakingService } from 'src/v1/match_making/match_making.service';

@Injectable()
export class ProfilesService {
  constructor(
    private memoryStore: MemoryStoreService,
    private geohashService: GeohashService,
    private matchmakingService: MatchmakingService,
  ) {}

  create(profileData: Omit<Profile, 'id'>): Profile {
    // Generate a UUID for the profile
    const id = this.generateUUID();
    const profile: Profile = { ...profileData, id };

    // Store the profile
    this.memoryStore.addProfile(profile);

    // Get quadrant for user location
    const quadrant = this.geohashService.encodeGeohash(
      profile.location.lat,
      profile.location.lon,
    );

    // Add to quadrant index
    this.memoryStore.addToQuadrant(quadrant, profile.id);

    // Trigger precomputation of match scores
    this.matchmakingService.precomputeMatchesForUser(profile.id);

    return profile;
  }

  findOne(id: string): Profile {
    const profile = this.memoryStore.getProfile(id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  findAll(): Profile[] {
    return this.memoryStore.getAllProfiles();
  }

  update(id: string, updates: Partial<Profile>): Profile {
    const updated = this.memoryStore.updateProfile(id, updates);

    if (!updated) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    // If location changed, update quadrant
    if (updates.location) {
      const quadrant = this.geohashService.encodeGeohash(
        updated.location.lat,
        updated.location.lon,
      );
      this.memoryStore.addToQuadrant(quadrant, id);
    }

    // Re-compute matches for this user
    this.matchmakingService.precomputeMatchesForUser(id);

    return updated;
  }

  addExclusion(
    userId: string,
    excludedId: string,
    type: 'matched' | 'blocked' | 'disliked',
  ): void {
    this.memoryStore.addExclusion(userId, excludedId, type);
  }

  private generateUUID(): string {
    // Simple UUID generator for demo purposes
    return 'user-' + Math.random().toString(36).substring(2, 15);
  }
}
