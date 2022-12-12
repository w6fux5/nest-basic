import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  async changeApproval({ reportID, approve }) {
    const report = await this.repo.findOne({
      where: { id: parseInt(reportID) },
    });

    if (!report) {
      throw new NotFoundException('report not found');
    }

    report.approved = approve;
    return this.repo.save(report);
  }

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return (
      this.repo
        .createQueryBuilder()
        // .select('*')
        .select('AVG(price)', 'price')
        .where('make = :make', { make })
        .andWhere('model = :model', { model })
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        .andWhere('approved IS TRUE')
        // orderBy第二個參數不是變量，因此要用 .setParameters來帶入變量 mileage
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        // .orderBy('mileage', 'DESC')
        .setParameters({ mileage })
        .limit(5)
        .getRawOne()
      // .getRawMany()
    );
  }
}
