
export function readonlyProxy(proxied: string) {
    return {
        get(target, key) {
            return key in target[proxied] ? target[proxied][key] : (key in target ? target[key] : undefined);
        },
    };
}
