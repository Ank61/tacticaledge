import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
    private readonly config: ConfigService,
  ) { }

  create(dto: CreateMovieDto, userId: string) {
    return this.movieModel.create({ ...dto, userId });
  }

  async findAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    console.log("userId", userId)
    const test = await this.movieModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const data = test.map((item: any) => {
      return {
        ...item?._doc,
        poster: item.poster ? `${this.config.get('PUBLIC_BASE_URL')}${item.poster}` : null,
      };
    });
    return data;
  }

  async count(userId: string) {
    return this.movieModel.countDocuments({ userId }).exec();
  }

  async findOne(id: string, userId: string) {
    const doc = await this.movieModel.findOne({ _id: id, userId }).exec();
    if (!doc) throw new NotFoundException('Movie not found');
    return doc;
  }

  async update(id: string, userId: string, dto: UpdateMovieDto) {
    const doc = await this.movieModel
      .findOneAndUpdate({ _id: id, userId }, dto, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Movie not found');
    return doc;
  }

  async remove(id: string, userId: string) {
    const res = await this.movieModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!res) throw new NotFoundException('Movie not found');
    return { deleted: true };
  }
}
