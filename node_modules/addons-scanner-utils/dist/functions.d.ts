/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import fs from 'fs';
import { Request, RequestHandler } from 'express';
import fetch from 'node-fetch';
type ApiError = Error & {
    extraInfo?: string;
    status?: number;
};
type CreateApiErrorParams = {
    message: string;
    extraInfo?: string;
    status?: number;
};
export declare const createApiError: ({ message, extraInfo, status, }: CreateApiErrorParams) => ApiError;
export type RequestWithFiles = Request & {
    xpiFilepath?: string;
};
export type FunctionConfig = {
    _console?: typeof console;
    _fetch?: typeof fetch;
    _process?: typeof process;
    _unlinkFile?: typeof fs.promises.unlink;
    apiKeyEnvVarName?: string;
    requiredApiKeyParam?: string;
    requiredDownloadUrlParam?: string;
    tmpDir?: string;
    xpiFilename?: string;
};
export declare const createExpressApp: ({ _console, _fetch, _process, _unlinkFile, apiKeyEnvVarName, requiredApiKeyParam, requiredDownloadUrlParam, tmpDir, xpiFilename, }?: FunctionConfig) => (handler: RequestHandler) => import("express-serve-static-core").Express;
export {};
