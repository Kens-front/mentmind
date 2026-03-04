import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {YooCheckout, ICreatePayment, ICapturePayment} from '@a2seven/yoo-checkout';

const crypto = require('crypto');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Post()
  async createPayment() {
      const checkout = new YooCheckout({ shopId: '1292176', secretKey: 'test_DKGKLYhJyeDRBa9D4rV1fA6-PVhFm2FkjYPMh4T5k4U' });

      const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a7';

      const createPayload: ICreatePayment = {
          amount: {
              value: '2.00',
              currency: 'RUB'
          },
          payment_method_data: {
              type: 'bank_card'
          },
          confirmation: {
              type: 'redirect',
              return_url: 'https://mentmind.ru/dashboard'
          }
      };

      try {
          const payment = await checkout.createPayment(createPayload, idempotenceKey);
          console.log(payment)
      } catch (error) {
          console.error(error);
      }
  }
  
  @Get('info')
  async getInfo() {
      const checkout = new YooCheckout({
          shopId: '1292176',
          secretKey: 'test_DKGKLYhJyeDRBa9D4rV1fA6-PVhFm2FkjYPMh4T5k4U'
      });


      const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';


      const capturePayload: ICapturePayment = {
          amount: {
              value: '2.00',
              currency: 'RUB'
          }
      };

      try {
          const payment = await checkout.getPayment('3139bee7-000f-5000-b000-160004b21ff5');
          console.log(payment)
      } catch (error) {
          console.error(error);
      }
  }

    @Get('capture')
    async capturePayment() {
        const checkout = new YooCheckout({
            shopId: '1292176',
            secretKey: 'test_DKGKLYhJyeDRBa9D4rV1fA6-PVhFm2FkjYPMh4T5k4U'
        });


        const idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';


        const capturePayload: ICapturePayment = {
            amount: {
                value: '2.00',
                currency: 'RUB'
            }
        };

        try {
            const payment = await checkout.capturePayment('3139bee7-000f-5000-b000-160004b21ff5', capturePayload, idempotenceKey);
            console.log(payment)
        } catch (error) {
            console.error(error);
        }
    }
}
