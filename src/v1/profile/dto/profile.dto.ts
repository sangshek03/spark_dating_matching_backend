import {
  IsString,
  IsNumber,
  IsArray,
  IsObject,
  ValidateNested,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  age: number;

  @IsString()
  gender: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @IsArray()
  @IsString({ each: true })
  lookingFor?: string[];
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
