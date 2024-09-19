// src/colleges/college.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { College, CollegeDocument } from './college.schema';
import { CreateCollegeDto } from './dto/create-college.dto';

@Injectable()
export class CollegeService {
  constructor(
    @InjectModel(College.name) private readonly collegeModel: Model<CollegeDocument>,
  ) {}

  async getAllColleges(): Promise<College[]> {
    return this.collegeModel.find().exec();
  }

  async createCollege(createCollegeDto: CreateCollegeDto): Promise<College> {
    const newCollege = new this.collegeModel(createCollegeDto);
    return newCollege.save();
  }

  async getCollegeById(id: string): Promise<College> {
    const college = await this.collegeModel.findById(id).exec();
    if (!college) {
      throw new NotFoundException('College not found');
    }
    return college;
  }

  async getCollegeByName(name: string): Promise<College> {
    const college = await this.collegeModel.findOne({ name }).exec();
    if (!college) {
      throw new NotFoundException('College not found');
    }
    return college;
  }

  async getCollegesByStateAndDistrict(state: string, district: string): Promise<College[]> {
    return this.collegeModel.find({ state, district }).exec();
  }
}
