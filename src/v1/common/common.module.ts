import { Module } from '@nestjs/common';
import { GeohashService } from './geohash/geohash.service';
import { MemoryStoreService } from './memory-store/memory-store.service';

@Module({
  providers: [GeohashService, MemoryStoreService],
  exports: [GeohashService, MemoryStoreService]
})
export class CommonModule {}