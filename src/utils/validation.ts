import { BaseSchema, safeParse } from 'valibot';
import { APIError } from '../lib/error';
import { StatusCode } from '../enums/status-code';

export class ValidationError extends APIError {
    constructor(errors: any[]) {
        super("Validation error", StatusCode.BadRequest, errors)
    }
}

export function validation<TInput, TOutput>(schema: BaseSchema<TInput, TOutput, any>, input: any): TOutput {
    const result = safeParse(schema, input);
    if (!result.success) throw new ValidationError(result.issues)
    return result.output;
}