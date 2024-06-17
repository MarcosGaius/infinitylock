import { IsEmail, IsNotEmpty } from "class-validator";

export class OnboardDto {
  @IsNotEmpty({ message: "Email não pode ser vazio" })
  @IsEmail(
    {},
    {
      message: "Email fornecido deve ser válido",
    }
  )
  email: string;
}
