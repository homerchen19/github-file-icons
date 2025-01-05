declare type Customizer = (value: any, valueType: string) => unknown;
declare type Options = Customizer | { customizer: Customizer };
declare function deepcopy<T>(value: T, options?: Options): T;
export = deepcopy;
