import { IsEmail, IsNotEmpty, IsString, NotContains } from 'class-validator';

export class SignInAuthDto {
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
}
