import Joi from "joi";

export type TCreate = {
    text: string
};

export const createSchema = Joi.object({
    text: Joi.string().required()
});

export type TUpdate = TCreate;

export const updateSchema = createSchema;