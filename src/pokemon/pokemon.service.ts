import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonMod: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonMod.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon already exists`);
      }
      throw new InternalServerErrorException(
        `Cant create Pokemon - Check server logs`,
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonMod.findOne({ no: term });
    }

    // mongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonMod.findById(term);
    }

    // string
    if (
      !pokemon &&
      !isValidObjectId(term) &&
      isNaN(+term) &&
      typeof term === 'string'
    ) {
      pokemon = await this.pokemonMod.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon)
      throw new NotFoundException(`Not found pokemon with that term`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonToUpdate = await this.findOne(term);
    updatePokemonDto?.name && updatePokemonDto?.name.toLowerCase();
    try {
      // await pokemonToUpdate.updateOne(updatePokemonDto, { new: true });
      await pokemonToUpdate.updateOne(updatePokemonDto);

      // Sobreescribe las propiedades del modelo con el dto
      // (Solo sirve para mostrar como respuesta de json, la actualizacion la hace el updateOne)
      return { ...pokemonToUpdate.toJSON(), ...pokemonToUpdate };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon already exists`);
      }
      throw new InternalServerErrorException(
        `Cant update Pokemon - Check server logs`,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
