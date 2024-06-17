import { IsNotEmpty, IsString, NotContains } from "class-validator";

export class ChangePasswordDto {
	@IsNotEmpty({ message: "Senha não pode ser vazio" })
	@IsString({ message: "Senha fornecida deve ser uma string" })
	@NotContains(" ", { message: "Senha não pode conter espaços" })
	previousPassword: string;

	@IsNotEmpty({ message: "Senha não pode ser vazio" })
	@IsString({ message: "Senha fornecida deve ser uma string" })
	@NotContains(" ", { message: "Senha não pode conter espaços" })
	newPassword: string;
}
