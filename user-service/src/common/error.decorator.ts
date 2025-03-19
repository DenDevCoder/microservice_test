import { handleError } from './error-handler';

export function CatchError(errorMessage: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        handleError(error, errorMessage);
      }
    };
    return descriptor;
  };
}
