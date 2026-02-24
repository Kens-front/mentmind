import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetrikaService } from './metrika.service';
import { CreateMetrikaDto } from './dto/create-metrika.dto';
import { UpdateMetrikaDto } from './dto/update-metrika.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateMetrikData } from './commands/create-metrik-data.command';

@Controller('metrika')
export class MetrikaController {
  constructor(
    private readonly metrikaService: MetrikaService,
    private readonly commandBus: CommandBus
  ) {}

  @Post()
  create(@Body() createMetrikaDto: CreateMetrikaDto) {
    return this.commandBus.execute(new CreateMetrikData(createMetrikaDto))
  }

  @Get()
  findAll() {
    return this.metrikaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metrikaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetrikaDto: UpdateMetrikaDto) {
    return this.metrikaService.update(+id, updateMetrikaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metrikaService.remove(+id);
  }
}
