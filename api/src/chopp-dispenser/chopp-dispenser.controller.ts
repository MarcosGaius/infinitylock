import { Body, Controller, Post } from '@nestjs/common';
import { TriggerDispenserDto } from './dto/trigger-dispenser.dto';
import { ChoppDispenserService } from './chopp-dispenser.service';

@Controller('chopp-dispenser')
export class ChoppDispenserController {
  constructor(private readonly choppDispenserService: ChoppDispenserService) {}

  @Post()
  trigger(@Body() triggerDto: TriggerDispenserDto) {
    return this.choppDispenserService.trigger(triggerDto);
  }
}
