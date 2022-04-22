export type THeaders = { [Property in string]: string|string[] };

export type TBody = {
    code: string,
    message: string,
    hint: string
}

export default abstract class AbstractException {
    public abstract body(): TBody;
    public abstract statusCode(): number;
    public headers(): THeaders|null {
        return null;
    };
}