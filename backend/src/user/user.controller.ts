import { Controller, Get, Post, Body, Param, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyOtpResponseDto } from './dto/verify-otp-response.dto'; // Import the new response DTO
import { User } from './user.schema';
import { UserService } from './user.service';
import { Request } from 'express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/details')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User details retrieved successfully', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized access' })
  async getCurrentUser(@Req() request: Request): Promise<User> {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const user = await this.userService.getUserFromToken(authHeader);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }


  @Get('user/:id')
  @ApiResponse({ status: 200, description: 'User details retrieved successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserDetailsById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserDetailsByUserId(id);
  }

  @Post(':college/:username')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async createUserDetails(
    @Param('college') college: string,
    @Param('username') username: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.createUserDetails(college, username, createUserDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const { accessToken } = await this.userService.login(loginDto.email, loginDto.password);
    return { accessToken };
  }

  @Post('send-otp')
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 204, description: 'OTP sent successfully' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<void> {
    await this.userService.sendOtp(sendOtpDto.email);
  }

  @Post('verify-otp')
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully', type: VerifyOtpResponseDto }) // Use the new response DTO
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    const isValid = await this.userService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
    return { verified: isValid }; // Return the verification result
  }

  @Get(':college')
@ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [User] })
@ApiResponse({ status: 404, description: 'No users found for this college' })
async getUsersByCollege(@Param('college') college: string): Promise<User[]> {
    return this.userService.getUsersByCollege(college);
}



  
}
