# Spark Dating Matchmaking Backend

A high-performance, in-memory backend service for a dating app, built with NestJS. It supports user registration, geolocation-based matchmaking, and compatibility scoring — all versioned under /api/v1

## Features

- In-memory profile storage with fast O(1) lookups
- Geohash-based spatial indexing for location proximity matching
- Precomputed match scores for constant-time match retrieval
- Matching algorithm based on age, interests, and location
- Support for exclusions (matched, blocked, disliked users)
- Seeding endpoint for generating test data

## Architecture

### Data Structures

- **User Profiles**: Stored in a Map with user IDs as keys for O(1) lookups
- **Quadrant Index**: Geohash-based spatial index using a Map with geohash prefixes as keys
- **Match Scores**: Each user has a priority queue of potential matches, sorted by score
- **Exclusions**: Sets of excluded user IDs for constant-time exclusion checks

### Precomputation Strategy

When a new user registers or updates their profile:
1. Calculate their geohash to determine their quadrant
2. Find users in the same and adjacent quadrants
3. Calculate match scores with these nearby users
4. Store the best matches in priority queues for both users
5. Apply exclusion filters when retrieving matches

This approach ensures that match retrieval is nearly constant-time O(1), as we're simply retrieving a pre-sorted list and applying exclusion filters.

## PostMan Collection

- Not using real DB, So you need to seed data 1st to get match.
- 1st Generate/Seed data by hiting endpoint -> {{base_url}}/api/v1/seed?count=20, (count is for how many user you want to seed in)
- Now onwards you can create user profile by hitting -> {{base_url}}/api/v1/profiles (providing correct payload)
- Now you can get top 5 matches by hitting -> {{base_url}}/api/v1/match/:user_id?count=4 (max can get 5, if u give 8 then it give max 5 users)

link: https://abc777-2596.postman.co/workspace/Abhishek~f4c785a7-01d0-4635-b7db-8706850e9264/collection/30890660-2214b394-e359-45af-84b5-5e8bc4fba9bd?action=share&creator=30890660&active-environment=30890660-b5e53170-d3b0-418c-a199-135a2d64d732


## Optional Add On in comming 24 hrs:
- unit tests for geohash logic, exclusions, and match scoring
- Gender prefrence
- Pagination
- User Update Endpoints

### Installation

```bash
# Install dependencies
npm install

# Start the application
npm run start

# Start in development mode
npm run start:dev