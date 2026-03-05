import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import {PaymentService} from './payment.service';
import {CreatePaymentDto} from './dto/create-payment.dto';
import {UpdatePaymentDto} from './dto/update-payment.dto';
import {CommandBus, EventBus, QueryBus} from '@nestjs/cqrs';
import {CreatePaymentCommand} from './commands/create-payment.command';
import {GetPaymentsQuery} from './queries/get-payments.query';
import {UpdatePaymentCommand} from './commands/update-payment.command';
import {AuthGuard} from 'src/common/decorators/auth-guard';
import {User} from 'src/user/entities/user.entity';
import {CurrentUser} from "../common/decorators/current-user";
import {CalculatePaymentQuery} from "./queries/calculate-payment.query";
import {YoukassaService} from "../youkassa/youkassa.service";
import {PAYMENT_STATUS, YookassaWebhookPayload} from "./types";
import {CapturePaymentCommand} from "./commands/capture-payment.command";
import {PaymentPaid} from "./events/payment-paid.event";

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly youkassaService: YoukassaService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private eventBus: EventBus,
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
    
 
    return this.commandBus.execute(new CreatePaymentCommand(Number(user.id), {...createPaymentDto}, totalPrice.amount, idempotencyKey))
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() dto: YookassaWebhookPayload, @Ip() ip: string) {
    this.youkassaService.verifyWebhook(ip)

    switch (dto.event) {
      case 'payment.waiting_for_capture':
        console.log(JSON.stringify(dto));
        await this.commandBus.execute(new CapturePaymentCommand(dto));
        //await this.commandBus.execute(new CreatePaymentCommand(Number(user.id), {...createPaymentDto}, totalPrice.amount, idempotencyKey))
        break;
      case 'payment.succeeded':
        await this.commandBus.execute(new UpdatePaymentCommand({externalPaymentId: dto?.object?.metadata?.paymentId, status: PAYMENT_STATUS.PAID}))

        this.eventBus.publish(new PaymentPaid(Number(dto.object?.metadata?.userId), Number(dto.object?.metadata?.lessons_count)))
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.commandBus.execute(new UpdatePaymentCommand({id: +id, ...updatePaymentDto}))
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
