import { Injectable } from '@nestjs/common';
import { CreateYoukassaDto } from './dto/create-youkassa.dto';
import { UpdateYoukassaDto } from './dto/update-youkassa.dto';
import {ICreatePayment, YooCheckout} from "@a2seven/yoo-checkout";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class YoukassaService {

  constructor(
      private configService: ConfigService,
  ) {
  }
  
  
  checkout = new YooCheckout({ shopId: this.configService.get('SHOP_ID'), secretKey: this.configService.get('SECRET_YOUKASSA_KEY') });
  
  async create(createYoukassaDto: CreateYoukassaDto) {
    
    console.log(createYoukassaDto);
    const createPayload: ICreatePayment = {
      amount: {
        value: `${createYoukassaDto.totalPrice}.00`,
        currency: 'RUB'
      },
      payment_method_data: {
        type: 'bank_card'
      },
      confirmation: {
        type: 'redirect',
        return_url: 'test'
      }
    };

    try {
      return  await this.checkout.createPayment(createPayload, createYoukassaDto.idempotencyKey);
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return `This action returns all youkassa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} youkassa`;
  }

  update(id: number, updateYoukassaDto: UpdateYoukassaDto) {
    return `This action updates a #${id} youkassa`;
  }

  remove(id: number) {
    return `This action removes a #${id} youkassa`;
  }
}
