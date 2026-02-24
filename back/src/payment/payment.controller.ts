import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from './commands/create-payment.command';
import { GetPaymentsQuery } from './queries/get-payments.query';
import { UpdatePaymentCommand } from './commands/update-payment.command';
import { AuthGuard } from 'src/common/decorators/auth-guard';
import { User } from 'src/user/entities/user.entity';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createPaymentDto: CreatePaymentDto) {
    const id = req.user?.id || 0;
    return this.commandBus.execute(new CreatePaymentCommand(Number(id), createPaymentDto));
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
