// src/colleges/college.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollegeDocument = College & Document;

@Schema()
export class College {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  district: string;

  @Prop()
  description: string;

  @Prop()
  howToGetAdmission: string;

  @Prop({ required: false })
  cutoff?: string;

  @Prop()
  imageUrl: string;

  @Prop()
  address: string; 
}

export const CollegeSchema = SchemaFactory.createForClass(College);
