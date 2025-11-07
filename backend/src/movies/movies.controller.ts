import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gaurd';
import { CurrentUser } from 'src/auth/current-user.decorator';

@ApiTags('movies')
@ApiCookieAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (
          _req: any,
          file: Express.Multer.File,
          cb: (e: any, filename: string) => void,
        ) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname) || '.jpg';
          cb(null, `${unique}${ext}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMovieDto: CreateMovieDto,
    @CurrentUser() user: any,
  ) {
    const poster = file
      ? `/uploads/${file.filename}`
      : createMovieDto.poster;
    return this.moviesService.create({ ...createMovieDto, poster }, user.sub);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @CurrentUser() user: any,
  ) {
    return this.moviesService.findAll(user.sub, Number(page), Number(limit));
  }

  @Get('count')
  count(@CurrentUser() user: any) {
    return this.moviesService.count(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.moviesService.findOne(id, user.sub);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (
          _req: any,
          file: Express.Multer.File,
          cb: (e: any, filename: string) => void,
        ) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname) || '.jpg';
          cb(null, `${unique}${ext}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMovieDto: UpdateMovieDto,
    @CurrentUser() user: any,
  ) {
    const patch = file
      ? { ...updateMovieDto, poster: `/uploads/${file.filename}` }
      : updateMovieDto;
    return this.moviesService.update(id, user.sub, patch);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.moviesService.remove(id, user.sub);
  }
}
