import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [HttpModule, PokemonModule],
})
export class SeedModule {}
