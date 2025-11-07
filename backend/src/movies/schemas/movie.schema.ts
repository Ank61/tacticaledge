import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, min: 1800, max: 2999 })
  publishingYear: number;

  @Prop({ default: '' })
  poster: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
