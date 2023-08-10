export const get = <T extends string>(name: string) =>
  new URL(window.location.href).searchParams.get(name) as unknown as T;
