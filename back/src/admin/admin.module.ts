import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CreateAdminHandler } from './handlers/craete-admin.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';


const handlers = [
  CreateAdminHandler
];

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, ...handlers],
})
export class AdminModule {}
