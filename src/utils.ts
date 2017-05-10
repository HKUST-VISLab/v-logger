// import { logger } from "./logger";

// export function proxify<P, S>(proxy: P, source: S) : P & S {
//     for (let id in source) {
//         if (proxy.hasOwnProperty(id)) {
//             logger.warn(`proxy object already has property "${id}"; skip proxifying the property!`);
//             continue;
//         }
//         (<any> proxy)[id] = source[id];
//     }
//     return <P & S>proxy;
// }

// export type Readonly<T> = {
//     [P in keyof T]: { get(): T[P] }
// };

export function readonlyProxy(proxied: string) {
    return {
        get(target, key) {
            return key in target[proxied] ? target[proxied][key] : (key in target ? target[key] : undefined);
        },
    };
}
