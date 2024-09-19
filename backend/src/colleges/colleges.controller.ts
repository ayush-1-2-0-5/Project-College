import { Body, Controller, Get, Post, Param, NotFoundException } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { College } from './college.schema';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get()
  async getAllColleges(): Promise<College[]> {
    return this.collegeService.getAllColleges();
  }

  @Post()
  async createCollege(@Body() createCollegeDto: CreateCollegeDto): Promise<College> {
    return this.collegeService.createCollege(createCollegeDto);
  }

  @Get(':id')
  async getCollegeById(@Param('id') id: string): Promise<College> {
    const college = await this.collegeService.getCollegeById(id);
    if (!college) {
      throw new NotFoundException('College not found');
    }
    return college;
  }

  @Get('name/:name')
  async getCollegeByName(@Param('name') name: string): Promise<College> {
    const college = await this.collegeService.getCollegeByName(name);
    if (!college) {
      throw new NotFoundException('College not found');
    }
    return college;
  }

  @Get('state/:state/district/:district')
  async getCollegesByStateAndDistrict(
    @Param('state') state: string,
    @Param('district') district: string,
  ): Promise<College[]> {
    return this.collegeService.getCollegesByStateAndDistrict(state, district);
  }
}
