interface EventEmitterOptions {
    /**
     * Enables automatic capturing of promise rejection.
     */
    captureRejections?: boolean;
}
export interface ReaderOptions extends EventEmitterOptions {
    format?: string;
    priority?: number;
    fixLineFeeds?: boolean;
}
export {};
