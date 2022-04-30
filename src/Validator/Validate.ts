import Joi from "joi";
import BadRequest, { CODE } from "../Exception/BadRequest";

const validate = <T>(schema: Joi.Schema, body: any): T|never => {
    const { value, error } = schema.validate(body);
    if (error !== undefined) throw new BadRequest({
        code: CODE.Validation,
        message: error.message
    });

    return value;
}

export default validate;