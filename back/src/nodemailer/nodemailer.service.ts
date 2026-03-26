import { Injectable } from '@nestjs/common';
import { CreateNodemailerDto } from './dto/create-nodemailer.dto';
import { UpdateNodemailerDto } from './dto/update-nodemailer.dto';
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class NodemailerService {

  constructor(private mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
    });
  }
  
  create(createNodemailerDto: CreateNodemailerDto) {
    return 'This action adds a new nodemailer';
  }

  findAll() {
    return `This action returns all nodemailer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nodemailer`;
  }

  update(id: number, updateNodemailerDto: UpdateNodemailerDto) {
    return `This action updates a #${id} nodemailer`;
  }

  remove(id: number) {
    return `This action removes a #${id} nodemailer`;
  }
}
