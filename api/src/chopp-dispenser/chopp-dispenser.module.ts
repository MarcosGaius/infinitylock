import { Module } from '@nestjs/common';
import { ChoppDispenserService } from './chopp-dispenser.service';
import { ChoppDispenserController } from './chopp-dispenser.controller';
import { CartesiModule } from 'src/cartesi/cartesi.module';
import { MqttModule } from 'src/mqtt/mqtt.module';

@Module({
  providers: [ChoppDispenserService],
  controllers: [ChoppDispenserController],
  imports: [CartesiModule, MqttModule],
})
export class ChoppDispenserModule {}
