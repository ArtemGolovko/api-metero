import Joi from "joi";

export type TCreate = {
    text: string,
    hashtags: string[],
    images: string[],
    profileMarks: string[]
};

export const createSchema = Joi.object({
    text: Joi.string().required(),
    hashtags: Joi.array().items(Joi.string().max(255).pattern(/^[a-zA-Z0-9_]+$/)).optional().default([]),
    images: Joi.array().items(Joi.string()).optional().default([]),
    profileMarks: Joi.array().items(Joi.string().max(255).pattern(/^[a-zA-Z0-9_]+$/)).optional().default([]),
});

export type TUpdate = {
    text?: string,
    hashtags?: string[],
    profileMarks?: string[],
    images?: string[]
};

export const updateSchema = Joi.object({
    text: Joi.string().optional(),
    hashtags: Joi.array().items(Joi.string().max(255)).optional(),
    profileMarks: Joi.array().items(Joi.string().max(255).pattern(/^[a-zA-Z0-9_]+$/)).optional(),
    images: Joi.array().items(Joi.string()).optional()
}).required().min(1);