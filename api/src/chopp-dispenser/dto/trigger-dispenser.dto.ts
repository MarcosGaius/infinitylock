import { IsBase64, IsNotEmpty } from 'class-validator';

export class TriggerDispenserDto {
  @IsNotEmpty({ message: 'Face is required' })
  @IsBase64()
  face: string;
}
