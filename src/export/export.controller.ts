import {
  Controller,
  Get,
  Inject,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(
    @Inject(ExportService)
    private readonly exportService: ExportService,
  ) {}

  @Get()
  async exportData(
    @Query() filters: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const csvStream = await this.exportService.exportData(filters);

    return new StreamableFile(csvStream, {
      type: 'text/csv',
    });
  }
}
