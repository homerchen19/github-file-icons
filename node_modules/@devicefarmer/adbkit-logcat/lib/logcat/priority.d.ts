declare class Priority {
    static UNKNOWN: number;
    static DEFAULT: number;
    static VERBOSE: number;
    static DEBUG: number;
    static INFO: number;
    static WARN: number;
    static ERROR: number;
    static FATAL: number;
    static SILENT: number;
    static fromName(name: string): number;
    static toName(value: number): string;
    static fromLetter(letter: string): number;
    static toLetter(value: number): string;
}
export = Priority;
