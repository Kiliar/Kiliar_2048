export const getFilledArray = <T>(s:number, mapFn: () => T) =>
    Array.from<T, T>({length: s}, mapFn);

export const RandomInt = (max:number) => Math.floor(Math.random() * max);