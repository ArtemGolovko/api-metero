import Joi from "joi";

export type TCreate = {
    username: string,
    name: string|null,
    profileBanner: string|null,
    avatar: string,
    isPrivate: boolean,
    description: string
}

export const createSchema = Joi.object({
    username: Joi.string().max(255).pattern(/^[a-zA-Z0-9_]+$/).required(),
    name: Joi.string().max(255).required(),
    profileBanner: Joi.string().uri().max(255).allow(null).optional().default(null),
    avatar: Joi.string().uri().max(255).allow(null).optional().default(null),
    isPrivate: Joi.boolean().optional().default(false),
    description: Joi.string().optional().default('')
});


export type TUpdate = {
    name?: string,
    profileBanner?: string|null,
    avatar?: string|null,
    isPrivate?: boolean
    description?: string
}

export const updateSchema = Joi.object({
    name: Joi.string().max(255).optional(),
    profileBanner: Joi.string().uri().max(255).allow(null).optional(),
    avatar: Joi.string().uri().max(255).allow(null).optional(),
    isPrivate: Joi.boolean().optional(),
    description: Joi.string().optional()
}).required().min(1)