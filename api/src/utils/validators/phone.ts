import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function isValidPhone(value: string): boolean {
  // Telefone com DDD e com o formato 99999999999. Nada além de números, sem espaço.
  return /^(?:([1-9][0-9]))(?:((?:9\d)\d{3})(\d{4}))$/.test(value);
}

/**
 * Validate CPF or CPNJ document.
 * @ If `validationOptions.type` is not provided, it will be read from the documentType property. Defaults to 'cpf'.
 * @param ValidationOptions type: DocumentType ('cpf' | 'cnpj')
 *
 */
export function IsPhone(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'isPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          return isValidPhone(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a phone number with format 99999999999`;
        },
      },
    });
  };
}
