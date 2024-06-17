import { Module } from '@nestjs/common';
import { CartesiController } from './cartesi.controller';
import { CartesiService } from './cartesi.service';

@Module({
  controllers: [CartesiController],
  providers: [CartesiService],
  exports: [CartesiService],
})
export class CartesiModule {}
