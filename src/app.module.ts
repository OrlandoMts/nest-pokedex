import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './config/configuration';
import { PokemonModule } from './pokemon/pokemon.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [EnvConfiguration] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/browser'),
    }),
    MongooseModule.forRoot(process.env.MONGODB, { dbName: 'pokemon-nest' }),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {}
