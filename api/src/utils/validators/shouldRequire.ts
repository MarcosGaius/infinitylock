import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class ShouldRequireConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [callback] = args.constraints;
    const isRequired = callback(args.object);
    if (isRequired) {
      // If the callback returns true, the value should not be null or undefined
      return value !== undefined && value !== null && value !== '';
    }
    return true; // If the callback returns false, allow empty
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is required based on the provided condition.`;
  }
}

export function ShouldRequire(
  callback: (object: any) => boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [callback],
      validator: ShouldRequireConstraint,
    });
  };
}
