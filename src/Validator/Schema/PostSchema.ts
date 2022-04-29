import Joi from "joi";

export type TCreate = {
    text: string,
    hashtags: string[],
    images: string[],
    profileMarks: string[]
}

export const createSchema = Joi.object({
    text: Joi.string().required(),
    hashtags: Joi.array().items(Joi.string().max(255).pattern(/[a-zA-Z0-9_]+/)).optional().default([]),
    images: Joi.array().items(Joi.string()).optional().default([]),
    profileMarks: Joi.array().items(Joi.string().max(255).pattern(/[a-zA-Z0-9_]+/)).optional().default([]),
});