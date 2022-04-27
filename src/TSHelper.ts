export function hasProperty<P extends {}, T extends {}>(obj: T, prop: keyof P): obj is T & P {
    if (obj.hasOwnProperty(prop)) return true;
    return false;
}