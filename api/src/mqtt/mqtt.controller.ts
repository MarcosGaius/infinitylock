import { Controller, Post } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  constructor(private readonly mqttService: MqttService) {}

  @Post()
  publish() {
    return this.mqttService.publishOnOff(process.env.MQTT_TOPIC);
  }
}
