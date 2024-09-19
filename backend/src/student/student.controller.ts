// src/student/student.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put,UseGuards, UnauthorizedException, Req,Patch } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LoginStudentDto } from './dto/loginstudent.dto';
import { Types } from 'mongoose';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Post('login')
  async login(@Body() loginStudentDto: LoginStudentDto) {
    return this.studentService.login(loginStudentDto);
  }

  @Get('/details')
  async getCurrentUser(@Req() request: Request) {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = authHeader.split(' ')[1]; 
    console.log(token);

    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }
    const user = await this.studentService.getUserFromToken(token);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  @Get()
  async findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
  @Patch(':id/paid-mentors')
  async addPaidMentor(@Param('id') id: string, @Body('mentorId') mentorId: string) {
    return this.studentService.addPaidMentor(id, mentorId);
  }
}
