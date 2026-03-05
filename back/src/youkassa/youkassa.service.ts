import {Injectable, UnauthorizedException} from '@nestjs/common';
import { CreateYoukassaDto } from './dto/create-youkassa.dto';
import { UpdateYoukassaDto } from './dto/update-youkassa.dto';
import {ICapturePayment, ICreatePayment, Payment, YooCheckout} from "@a2seven/yoo-checkout";
import {ConfigService} from "@nestjs/config";
import Cidr from 'ip-cidr'
import {YookassaWebhookPayload} from "../payment/types";
@Injectable()
export class YoukassaService {

  constructor(
      private configService: ConfigService,
  ) {
  }
  
  private readonly ALLOWED_IPS = [
    '185.71.76.0/27',
    '185.71.77.0/27',
    '77.75.153.0/25',
    '77.75.156.11',
    '77.75.156.35',
    '77.75.154.128/25',
    '2a02:5180::/32'
  ];
  
  checkout = new YooCheckout({ shopId: this.configService.get('SHOP_ID'), secretKey: this.configService.get('SECRET_YOUKASSA_KEY') });
  
  async create(createYoukassaDto: CreateYoukassaDto) {
    
 
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
        return_url: 'https://mentmind.ru/dashboard'
      },
    };

    try {
      return  await this.checkout.createPayment(createPayload, createYoukassaDto.idempotencyKey);
    } catch (error) {
      console.error(error);
    }
  }
  
  verifyWebhook(ip: string) {
    for(const range of this.ALLOWED_IPS) {
      if (range.includes('/')) {
        const cidr = new Cidr(range);
        
        if (cidr.contains(ip)) {
          return cidr;
        }
      } else if (ip === range) return
    }
    
    throw new UnauthorizedException("Запретный IP");
  }
  
  handleWebhook(dto: any, ip: string) {
    this.verifyWebhook(ip);
    
    switch (dto.event) {
      case 'payment.waiting_for_capture':
        break;
      case 'payment.succeeded':
        break;
    }
  }
  
  async capturePayment(aPayment: YookassaWebhookPayload, idempotencyKey: string) {
    try {
      const capturePayload: ICapturePayment = {
        amount: {...aPayment.object?.amount}
      };
      
      const payment = await this.checkout.capturePayment(aPayment.object?.id, capturePayload, idempotencyKey);
      console.log(payment)
      return payment;
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
