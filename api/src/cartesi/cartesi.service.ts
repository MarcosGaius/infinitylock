import { Injectable } from '@nestjs/common';
import { Signer, Wallet, providers } from 'ethers';
import { advanceInput, inspect } from 'cartesi-client';
import { ConfigService } from '@nestjs/config';
import { BeerTapOperations } from './enums';

@Injectable()
export class CartesiService {
  private provider: providers.Provider;
  private signer: Signer;
  private dappAddress: string;

  // - CARTESI LOCAL INFO:
  // rpc url http://127.0.0.1:8545
  // mnemonic test test test test test test test test test test test junk
  // acc address 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
  // dapp 0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e

  constructor(private configService: ConfigService) {
    const isDev = configService.getOrThrow('NODE_ENV') === 'development';

    const { AlchemyProvider, JsonRpcProvider } = providers;

    const privateKey = isDev
      ? Wallet.fromMnemonic(
          'test test test test test test test test test test test junk',
        ).privateKey
      : this.configService.getOrThrow('WALLET_PRIVATE_KEY');

    this.provider = isDev
      ? new JsonRpcProvider('http://127.0.0.1:8545')
      : new AlchemyProvider(
          {
            name: 'matic',
            chainId: 137,
          },
          this.configService.getOrThrow('ALCHEMY_API_KEY'),
        );
    this.signer = new Wallet(privateKey, this.provider);

    this.dappAddress = this.configService.getOrThrow('DAPP_ADDRESS');
  }

  async registerFace(image: any, wallet: string) {
    const res = await advanceInput(
      this.signer,
      this.dappAddress,
      JSON.stringify({
        op: BeerTapOperations.REGISTER_FACE,
        embedding: image,
        init_balance: 9999999,
        wallet,
      }),
      {
        sync: false,
      },
    );

    return res;
  }

  async detectFace(image: string) {
    const res = await inspect(
      JSON.stringify({
        op: BeerTapOperations.DETECTFACE,
        image,
      }),
      {
        method: 'POST',
        cartesiNodeUrl: process.env.CARTESI_URL,
      },
    );

    return res;
  }

  // tratar erros:
  // status = {"status": "error", "msg": "Insufficient funds."}
  // status = {"status": "error", "msg": "No matches found."}
  async registerBeerDispense(image: string) {
    const res = await advanceInput(
      this.signer,
      this.dappAddress,
      JSON.stringify({
        op: BeerTapOperations.DISPENSE_BEER,
        embedding: image,
      }),
    );

    return res;
  }
}
