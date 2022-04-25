import Joi from "joi";

export type TCreate = {
    username: string,
    name: string,
    profileBanner: string,
    avatar: string,
    isPrivate?: boolean
}

export const createSchema = Joi.object({
    username: Joi.string().max(255).pattern(/[a-zA-Z0-9_]+/).required(),
    name: Joi.string().max(255).required(),
    profileBanner: Joi.string().max(255).required(),
    avatar: Joi.string().max(255).required(),
    isPrivate: Joi.boolean().optional()
});