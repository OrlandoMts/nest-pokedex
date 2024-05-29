import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonItf } from './interfaces/pokemon.interface';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly httpSrv: HttpService,
    private readonly pokemonSrv: PokemonService,
  ) {}

  async executeSeed(): Promise<any> {
    const { data } = await firstValueFrom(
      this.httpSrv
        .get<PokemonItf>('https://pokeapi.co/api/v2/pokemon?limit=10')
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      const body = { name, no };
      try {
        await this.pokemonSrv.create(body);
      } catch (error: any) {
        throw new InternalServerErrorException(
          `Cant create Pokemon - Check server logs`,
        );
      }
    });
    return { ok: true, msg: 'Se insertaron correctamente' };
  }
}
