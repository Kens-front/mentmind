import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Headers,
  HttpException, HttpStatus, HttpCode, Ip
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from './commands/create-payment.command';
import { GetPaymentsQuery } from './queries/get-payments.query';
import { UpdatePaymentCommand } from './commands/update-payment.command';
import { AuthGuard } from 'src/common/decorators/auth-guard';
import { User } from 'src/user/entities/user.entity';
import {CurrentUser} from "../common/decorators/current-user";
import {query} from "express";
import {CalculatePaymentQuery} from "./queries/calculate-payment.query";
import {YoukassaService} from "../youkassa/youkassa.service";

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly youkassaService: YoukassaService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
      @CurrentUser() user: User,
      @Body() createPaymentDto: CreatePaymentDto,
      @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    const {lesson_duration, lessons_count} = createPaymentDto;
    
    if (!idempotencyKey) {
      throw new HttpException('idempotency-key', HttpStatus.NOT_FOUND);
    }
    
    const totalPrice = await this.queryBus.execute(new CalculatePaymentQuery({duration: lesson_duration, lessonCount: lessons_count, user}))
    
    
    return this.youkassaService.create({idempotencyKey, totalPrice: totalPrice.amount, createPaymentDto})
    //return this.commandBus.execute(new CreatePaymentCommand(Number(user.id), {...createPaymentDto}, totalPrice.amount, idempotencyKey))
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(dto: any, @Ip() ip: string) {
    this.youkassaService.verifyWebhook(ip)

    switch (dto.event) {
      case 'payment.waiting_for_capture':
        console.log(JSON.stringify(dto));
        //await this.commandBus.execute(new CreatePaymentCommand(Number(user.id), {...createPaymentDto}, totalPrice.amount, idempotencyKey))
        break;
      case 'payment.succeeded':
        console.log(JSON.stringify(dto));
        break;
    }
  }
  @Get()
  @UseGuards(AuthGuard)
  findAll(
      @Req() req,
      @Query() query
  ) {
    const user: User | undefined = req.user;
    return this.queryBus.execute(new GetPaymentsQuery(user, query));
  }
  
  @Get('/calculate')
  @UseGuards(AuthGuard)
  calculatePayment(
      @Query('duration') duration: string,
      @Query('lessonCount') lessonCount: string,
      @CurrentUser() user: User
  ) {
    return this.queryBus.execute(new CalculatePaymentQuery({duration: Number(duration), lessonCount: Number(lessonCount), user}));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.commandBus.execute(new UpdatePaymentCommand({id: +id, ...updatePaymentDto}))
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
