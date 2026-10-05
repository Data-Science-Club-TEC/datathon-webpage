// Convierte un string de snake a camel
type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

//<S extends string> means SnakeToCamelCase takes a parameter S that is always a string
//S extends means `${infer T}_${infer U}` tells TS to try and match the S text to a X_X pattern.
//If it succeds, TS saves the string before the _ in the T variable and the one after ir in the U variable
//And then runs `${T}${Capitalize<SnakeToCamelCase<U>>}` which first accesses T and leaves it in lower case
//Then uses Capitalize<> which capitalizes the first letter of the string it gets passed
//We call SnakeToCamelCase<U> again to repeat until the whole string is covered

// Transforma COMPLETAMENTE cualquier objeto/interfaz de snake a camel
export type AutoCamelCase<T> = {
  [K in keyof T as SnakeToCamelCase<K & string>]: T[K];
};
