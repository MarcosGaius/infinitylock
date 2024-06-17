import { BadRequestException, Injectable } from '@nestjs/common';
import { TriggerDispenserDto } from './dto/trigger-dispenser.dto';
import { CartesiService } from 'src/cartesi/cartesi.service';
import { providers, Contract } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { abi } from 'src/config/abi';
import { MqttService } from 'src/mqtt/mqtt.service';
import { hexToText } from 'src/utils/hex2text';

@Injectable()
export class ChoppDispenserService {
  private provider: providers.Provider;
  private contract: Contract;

  constructor(
    private cartesiService: CartesiService,
    private configService: ConfigService,
    private mqttService: MqttService,
  ) {
    const contractAddress = this.configService.getOrThrow('CONTRACT_ADDRESS');
    this.provider = new providers.AlchemyProvider(
      {
        name: 'matic',
        chainId: 137,
      },
      this.configService.getOrThrow('ALCHEMY_API_KEY'),
    );
    this.contract = new Contract(contractAddress, abi, this.provider);
  }

  async trigger({ face }: TriggerDispenserDto) {
    const processRes = await this.cartesiService.detectFace(face);
    const processedFace = JSON.parse(hexToText(processRes.toString()));
    if (!processedFace || !processedFace.match)
      throw new BadRequestException('Face não detectada');

    // const balance = await this.getBalanceOf(processedFace?.match?.wallet);
    // if (!balance || balance < 1)
    //   throw new ForbiddenException('Você não possui o token de acesso');

    this.cartesiService.registerBeerDispense(processedFace.embedding);
    // const result = JSON.parse(hexToText(dispense.reports[0].payload));

    return this.mqttService.publishOnOff(
      this.configService.get('MQTT_CHOPP_TOPIC'),
      this.configService.get('CHOPP_VALVE_MS'),
    );
  }

  async getBalanceOf(address: string): Promise<number> {
    const balance = await this.contract.balanceOf(address);
    return balance.toNumber();
  }
}
