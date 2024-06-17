import {
  IsEmail,
  IsNotEmpty,
  IsString,
  NotContains,
  IsBase64,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome não pode ser vazio' })
  @IsString({ message: 'Nome deve ser uma string' })
  firstName: string;

  @IsNotEmpty({ message: 'Sobrenome não pode ser vazio' })
  @IsString({ message: 'Sobrenome deve ser uma string' })
  lastName: string;

  @IsNotEmpty({ message: 'Email não pode ser vazio' })
  @IsEmail(
    {},
    {
      message: 'Email fornecido deve ser válido',
    },
  )
  email: string;

  @IsNotEmpty({ message: 'Senha não pode ser vazio' })
  @IsString({ message: 'Senha fornecida deve ser uma string' })
  @NotContains(' ', { message: 'Senha não pode conter espaços' })
  password: string;

  @IsBase64({ urlSafe: false }, { message: 'Face deve ser uma imagem' })
  @IsNotEmpty({ message: 'Face não pode ser vazio' })
  face: string;

  @IsNotEmpty({ message: 'Endereço não pode ser vazio' })
  @IsString()
  address: string;
}
