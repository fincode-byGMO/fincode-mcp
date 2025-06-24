import YAML from 'yamljs';
import type { OpenAPIDocument, OpenAPIPathItem } from '../../openapi/OpenAPIConsts.js';

export class FincodeAPIDocsSearchService {
    private readonly openAPIDocument: OpenAPIDocument;

    constructor(yamlFilePath: string) {
        this.openAPIDocument = YAML.load(yamlFilePath) as OpenAPIDocument;
    }

    searchByPath(pathAndMethod: string): OpenAPIPathItem {
        let path = pathAndMethod;
        let method = 'get';
        const uriParts = pathAndMethod.split('#');
        if (uriParts.length === 2) {
            path = uriParts[0];
            method = uriParts[1];
        }
        const path_doc = this.openAPIDocument.paths[path];
        if (path_doc === undefined) {
            throw new Error(`Path '${path}' is not found`);
        }
        const method_doc = path_doc[method as keyof typeof path_doc] as OpenAPIPathItem;
        if (method_doc === undefined) {
            throw new Error(`Method '${method}' not found for path '${path}'`);
        }
        this.resolveRefs(method_doc);
        return method_doc;
    }

    tags() {
        return this.openAPIDocument.tags;
    }

    // biome-ignore lint/suspicious/noExplicitAny: Handling dynamic OpenAPI document structure where types are determined at runtime
    private resolveRefs(obj: any) {
        if (obj === null || typeof obj !== 'object') {
            return;
        }
        if (Array.isArray(obj)) {
            obj.forEach((item, _) => {
                this.resolveRefs(item);
            });
            return;
        }
        for (const key of Object.keys(obj)) {
            // biome-ignore lint/suspicious/noExplicitAny: Property values have dynamic types that cannot be predetermined
            const value: any = obj[key] as any;
            if (key === '$ref' && typeof value === 'string') {
                obj[key] = this.searchByRef(value);
                this.resolveRefs(obj[key]);
            }
            this.resolveRefs(value);
        }
    }

    private searchByRef(refPath: string) {
        const pathParts = refPath.split('/');
        // biome-ignore lint/suspicious/noExplicitAny: Traversing dynamic OpenAPI document hierarchy where object types vary by path
        let currentTarget: any = this.openAPIDocument as any;
        for (const pathPart of pathParts) {
            if (pathPart === '#') {
                continue;
            }
            if (currentTarget[pathPart] == null) {
                return null;
            }
            // biome-ignore lint/suspicious/noExplicitAny: Object type changes dynamically during path traversal
            currentTarget = currentTarget[pathPart] as any;
        }
        if (currentTarget == null) {
            throw new Error(`${refPath} is not found`);
        }
        return currentTarget;
    }
}
