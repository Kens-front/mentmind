import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analitics.service';
import { AuthGuard } from 'src/common/decorators/auth-guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getMentorAnalytics(@Req() req) {
    return this.analyticsService.getSummary({id: Number(req.user.id), role: req.user.role})
  }
 
}
