import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './DTO/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.services';

@Injectable()
export class UserService {

  private otpCache: Map<string, { otp: string; expires: number }> = new Map();

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async sendOtp(email: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; 
    this.otpCache.set(email, { otp, expires });
    await this.emailService.sendOtpEmail(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    console.log(`Verifying OTP for email: ${email}`);

    const otpData = this.otpCache.get(email);
    if (!otpData) {
      console.log("OTP not generated for email:", email);
      throw new UnauthorizedException('OTP not generated');
    }
    if (Date.now() > otpData.expires) {
      console.log("OTP expired for email:", email);
      this.otpCache.delete(email);
      throw new UnauthorizedException('OTP expired');
    }
    if (otp !== otpData.otp) {
      console.log("Invalid OTP provided for email:", email);
      throw new UnauthorizedException('Invalid OTP');
    }
    this.otpCache.delete(email);
    return true;
  }

  async getUsersByCollege(college: string): Promise<User[]> {
    const users = await this.userModel.find({ college }).exec();
    if (users.length === 0) {
        throw new NotFoundException('No users found for this college');
    }
    return users;
}


  async getUserDetails(college: string, username: string): Promise<User> {
    const user = await this.userModel.findOne({ college, username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUserDetails(college: string, username: string, createUserDto: CreateUserDto): Promise<User> {
    const existingUserByUsername = await this.userModel.findOne({ college, username }).exec();
    const existingUserByEmail = await this.userModel.findOne({ email: createUserDto.email }).exec();

    if (existingUserByUsername || existingUserByEmail) {
      throw new ConflictException('User with this username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      college,
      username,
      password: hashedPassword,
      emailVerified: createUserDto.emailVerified || false,
    });
    return createdUser.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email };
    try {
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } catch (error) {
      console.error('Error signing JWT:', error);
      throw new UnauthorizedException('Error signing JWT');
    }
  }

  async getUserFromToken(token: string): Promise<User> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findOne({ email: decoded.email }).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Invalid or expired token:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getUserDetailsByUserId(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  
}
