import { Message } from "@shared/types";

export class ApiError extends Error {
    public constructor(public readonly messages: Message[]) {
        super(messages.map(m => m.text).join('; '));
    }
}