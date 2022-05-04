import Joi from "joi";

export type TCreate = {
    text: string,
    replyTo?: string
}

export const createSchema = Joi.object({
    text: Joi.string().required(),
    replyTo: Joi.string().max(255).pattern(/[a-zA-Z0-9_]+/).optional()
});