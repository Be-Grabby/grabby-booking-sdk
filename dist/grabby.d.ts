import { GrabbyOpenOptions, GrabbyOptions } from './interfaces/options.interface';
export declare class GrabbySDK {
    private accountId;
    private options;
    constructor(accountId: string, options: GrabbyOptions);
    private buildUrl;
    render(selector: string, openOptions?: GrabbyOpenOptions & GrabbyOptions): void;
    showModal(openOptions?: GrabbyOpenOptions & GrabbyOptions): void;
    private attachListeners;
    private handleMessage;
    close(): void;
}
