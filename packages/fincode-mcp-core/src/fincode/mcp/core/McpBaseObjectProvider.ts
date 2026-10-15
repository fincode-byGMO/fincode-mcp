import type { z } from 'zod';
import type { McpBaseObject } from './McpBaseObject.js';

export abstract class McpBaseObjectProvider<
    T extends McpBaseObject<z.ZodTypeAny, Response>,
    Response,
> {
    private targets: Array<T> = [] as T[];

    constructor(items: T[]) {
        for (const item of items) {
            this.targets.push(item);
        }
    }

    list(): T[] {
        return Array.from(this.targets.values()).filter((target) => target.enabled);
    }
}
