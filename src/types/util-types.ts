// @see https://github.com/piotrwitek/utility-types#promisetypet
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;
