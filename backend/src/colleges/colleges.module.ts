// src/colleges/colleges.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { College, CollegeSchema } from './college.schema';
import { CollegeService } from './college.service';
import { CollegesController } from './colleges.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: College.name, schema: CollegeSchema }]),
  ],
  providers: [CollegeService],
  controllers: [CollegesController],
  exports: [CollegeService], // Export if needed in other modules
})
export class CollegesModule {}
