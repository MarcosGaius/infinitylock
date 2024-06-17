import { Controller } from '@nestjs/common';
import { CartesiService } from './cartesi.service';

@Controller('cartesi')
export class CartesiController {
  constructor(private cartesiService: CartesiService) {}

  // @Get()
  // test(): Promise<any> {
  //   return this.cartesiService.registerFace();
  // }
}
