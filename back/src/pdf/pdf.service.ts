import { Injectable } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import {type PDFData, template} from "./constants/template";
// src/pdf-generator.js
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class PDFGenerator {
  static async generateInvoice(payment: PDFData) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
 
 
      await page.setContent(template(payment), { waitUntil: 'networkidle0' });

      const fileName = `invoice_${payment.paymentId}.pdf`;
      const filePath = path.join('uploads/pdf', fileName);

      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
      });

      return filePath;
    } finally {
      await browser.close();
    }
  }
}

 
@Injectable()
export class PdfService {
  async create(createPdfDto: PDFData) {
    try {
      const pdfPath = await PDFGenerator.generateInvoice(createPdfDto);
      console.log(`✅ PDF создан: ${pdfPath}`);
      return pdfPath;

      // Здесь можно сохранить путь в БД и/или отправить письмо
    } catch (err) {
      console.error('❌ Ошибка генерации PDF:', err);
    }
  }

  findAll() {
    return `This action returns all pdf`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pdf`;
  }

  update(id: number, updatePdfDto: UpdatePdfDto) {
    return `This action updates a #${id} pdf`;
  }

  remove(id: number) {
    return `This action removes a #${id} pdf`;
  }
}
