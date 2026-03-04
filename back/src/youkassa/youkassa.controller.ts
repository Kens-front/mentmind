import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { YoukassaService } from './youkassa.service';
import { CreateYoukassaDto } from './dto/create-youkassa.dto';
import { UpdateYoukassaDto } from './dto/update-youkassa.dto';

@Controller('youkassa')
export class YoukassaController {
  constructor(private readonly youkassaService: YoukassaService) {}

  @Post()
  create(@Body() createYoukassaDto: CreateYoukassaDto) {
    return this.youkassaService.create(createYoukassaDto);
  }

  @Get()
  findAll() {
    return this.youkassaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.youkassaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYoukassaDto: UpdateYoukassaDto) {
    return this.youkassaService.update(+id, updateYoukassaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.youkassaService.remove(+id);
  }
}
