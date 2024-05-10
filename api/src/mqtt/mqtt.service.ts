import mqtt from 'mqtt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttService {
  private options: mqtt.IClientOptions;
  private DELAY_MS = 5000;
  private OPEN_MESSAGE = '{"Acao":"On"}';
  private CLOSE_MESSAGE = '{"Acao":"Off"}';
  constructor() {
    this.options = {
      clientId: process.env.MQTT_CLIENT_ID!,
      protocol: 'mqtt',
      rejectUnauthorized: false,
      username: process.env.MQTT_USERNAME!,
      password: process.env.MQTT_PASSWORD!,
    };
  }

  getClient() {
    const client = mqtt.connect(process.env.MQTT_BROKER_URL!, this.options);
    return client;
  }

  async publish(topic: string, message: string) {
    const client = this.getClient();
    await client.publishAsync(topic, message);
    await client.endAsync();
    return 'ok';
  }

  async publishOnOff(topic: string, delayMs?: number) {
    const client = this.getClient();
    await client.publishAsync(topic, this.OPEN_MESSAGE);
    setTimeout(async () => {
      await client.publishAsync(topic, this.CLOSE_MESSAGE);
      await client.endAsync();
    }, delayMs || this.DELAY_MS);
    return 'ok';
  }
}
