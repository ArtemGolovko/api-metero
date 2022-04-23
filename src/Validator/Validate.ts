import Joi from "joi";
import { BadRequest, CODES } from "../Exception/BadRequest";

const validate = (schema: Joi.Schema, body: any) => {
    const { value, error } = schema.validate(body);
    if (error !== undefined) throw new BadRequest({
        code: CODES.Validation,
        message: error.message
    });

    return value;
}

export default validate;