
export const ComponentLookupRegistry: Map<string, any> = new Map();

export const ComponentLookup = (key: string): any => {
    return (cls) => {
        ComponentLookupRegistry.set(key, cls);
    };
};