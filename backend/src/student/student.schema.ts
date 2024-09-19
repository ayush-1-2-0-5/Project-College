// src/student/student.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocument = Student & Document;

@Schema()
export class Student {
  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  description?: string;

  @Prop([String])
  interests: string[];

  @Prop()
  current_state?: string;

  @Prop()
  current_city?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] }) 
  paidMentorIds: string[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
