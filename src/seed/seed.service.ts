import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonItf } from './interfaces/pokemon.interface';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly httpSrv: AxiosAdapter,
    private readonly pokemonSrv: PokemonService,
  ) {}

  async executeSeed(): Promise<any> {
    await this.pokemonSrv.deleteMany();
    const pokemonToInsert: CreatePokemonDto[] = [];

    try {
      const data = await this.httpSrv.get<PokemonItf>(
        'https://pokeapi.co/api/v2/pokemon?limit=350',
      );
      data.results.forEach(async ({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
        pokemonToInsert.push({ name, no });
      });
    } catch (error) {
      this.logger.error('Error fetching data from API', error);
      throw new InternalServerErrorException(`Error fetch - Check server logs`);
    }

    try {
      await this.pokemonSrv.createMany(pokemonToInsert);
    } catch (error: any) {
      this.logger.error('Error inserting data into database', error);
      throw new InternalServerErrorException(
        `Cant create Pokemon - Check server logs`,
      );
    }
    return { ok: true, msg: 'Pokémon inserted successfully' };
  }
}
