import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PsychologyPackService } from './psychology-pack.service';
import { CreatePsychologyPackDto } from './dto/create-psychology-pack.dto';
import { UpdatePsychologyPackDto } from './dto/update-psychology-pack.dto';
import {QueryBus} from "@nestjs/cqrs";
import {GetPsychologyPacksQuery} from "./queries/get-psychology-packs.query";

@Controller('psychology-pack')
export class PsychologyPackController {
  constructor(
      private readonly psychologyPackService: PsychologyPackService,
      private queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() createPsychologyPackDto: CreatePsychologyPackDto) {
    return this.psychologyPackService.create(createPsychologyPackDto);
  }

  @Get()
  findAll() {
    return this.queryBus.execute(new GetPsychologyPacksQuery())
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.psychologyPackService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePsychologyPackDto: UpdatePsychologyPackDto) {
    return this.psychologyPackService.update(+id, updatePsychologyPackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.psychologyPackService.remove(+id);
  }
}
