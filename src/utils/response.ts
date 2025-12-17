export function success(data: any = {}) {
  return {
    ...data,
    IsError: false,
    ErrorMessage: null,
  };
}
