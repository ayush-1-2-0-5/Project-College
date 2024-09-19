import { Injectable, UnauthorizedException, NotFoundException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { LoginStudentDto } from './dto/loginstudent.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private readonly jwtService: JwtService,
  ) {}

  
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
    const createdStudent = new this.studentModel({
      ...createStudentDto,
      password: hashedPassword,
    });
    return createdStudent.save();
  }

  async login(loginStudentDto: LoginStudentDto): Promise<{ accessToken: string }> {
    const student = await this.studentModel.findOne({ email: loginStudentDto.email }).exec();

    if (!student || !(await bcrypt.compare(loginStudentDto.password, student.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: student.email }; // Create JWT payload
    const accessToken = this.jwtService.sign(payload); // Generate JWT token

    return { accessToken };
  }

  async findAll(): Promise<Student[]> {
    return this.studentModel.find().exec();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    if (updateStudentDto.password) {
      updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, 10);
    }
    const updatedStudent = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).exec();
    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }
    return updatedStudent;
  }

  
  async remove(id: string): Promise<Student> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();
    if (!deletedStudent) {
      throw new NotFoundException('Student not found');
    }
    return deletedStudent;
  }

  async getUserFromToken(token: string): Promise<Student> {
    try {
      const decoded = this.jwtService.verify(token);
      // console.log('Decoded JWT:', decoded); 

      const email = decoded.email; // Extract the email or appropriate identifier
      if (!email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.studentModel.findOne({ email }).exec(); // Find user by email
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      // console.error('Error verifying token:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }


  async addPaidMentor(studentId: string, mentorId: string): Promise<Student> {
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
  
    if (!student.paidMentorIds.includes(mentorId)) {
      student.paidMentorIds.push(mentorId);
      await student.save();
    }
  
    return student;
  }
  
}
