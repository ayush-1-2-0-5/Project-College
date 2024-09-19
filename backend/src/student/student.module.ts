// src/student/student.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './student.schema';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    ConfigModule.forRoot({ isGlobal: true }), // Ensure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Use environment variable for secret
        signOptions: { expiresIn: '1h' }, // Adjust token expiration as needed
      }),
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService], // Export StudentService if needed by other modules
})
export class StudentModule {}
