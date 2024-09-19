// src/student/student.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LoginStudentDto } from './dto/loginstudent.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(@InjectModel(Student.name) private studentModel: Model<StudentDocument>) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
    const createdStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
    });
    return createdStudent.save();
  }

  async login(loginStudentDto: LoginStudentDto): Promise<any> {
    const student = await this.studentModel.findOne({ email: loginStudentDto.email }).exec();
    if (!student || !(await bcrypt.compare(loginStudentDto.password, student.password))) {
      throw new Error('Invalid credentials');
    }
    return { message: 'Login successful', student };
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(id: string): Promise<Student> {
    return this.studentModel.findById(id).exec();
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    if (updateStudentDto.password) {
      updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, 10);
    }
    return this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.studentModel.findByIdAndDelete(id).exec();
  }
}
