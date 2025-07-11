import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get('countReportSuperAdmin')
  async countReportSuperAdmin() {
    return this.reportService.countReportSuperAdmin();
  }

  @Get('countReportAdmin')
  async countReportAdmin(
    @Query('companyId') companyId: string,
    @Query('vendorId') vendorId: string,
  ) {
    return this.reportService.countReportAdmin(companyId, vendorId);
  }

  @Get('countReportDistributor')
  async countReportDistributor(@Query('vendorId') vendorId: string) {
    return this.reportService.countReportDistributor(vendorId);
  }
}
