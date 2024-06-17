import { IsNotEmpty, IsString, NotContains } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({ message: "Token não pode ser vazio" })
  token: string;

  @IsNotEmpty({ message: "Senha não pode ser vazio" })
  @IsString({ message: "Senha fornecida deve ser uma string" })
  @NotContains(" ", { message: "Senha não pode conter espaços" })
  password: string;
}
