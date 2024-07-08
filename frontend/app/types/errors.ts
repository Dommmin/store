type FieldError = string | null;

export interface Errors {
   [key: string]: FieldError[];
}
