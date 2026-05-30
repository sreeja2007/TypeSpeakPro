import { z } from 'zod';

/**
 * Zod schema to validate Google sign-in ID Token JWT payloads.
 * Ensures the structure has all required fields and safely parses expiration.
 */
export const googleTokenPayloadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    picture: z.string().url().or(z.string().min(1)).catch(''),
    sub: z.string().min(1, "Subject (sub) is required"),
    exp: z.number().int("Expiration must be an integer")
});

/**
 * Zod schema for AI Analysis results (grammar, fluency, relevance, confidence).
 * Constrains/coerces scores to the 0-10 range and provides fallback values.
 */
export const aiAnalysisResultSchema = z.object({
    grammar_score: z.coerce.number().min(0).max(10).catch(5),
    fluency_score: z.coerce.number().min(0).max(10).catch(5),
    relevance_score: z.coerce.number().min(0).max(10).catch(5),
    confidence_score: z.coerce.number().min(0).max(10).catch(5),
    feedback: z.string().min(1).catch("Good attempt!"),
    corrections: z.array(z.string()).catch(["Practice speaking more fluidly."]),
    improvements: z.array(z.string()).catch(["Try to speak more confidently.", "Expand on your points."]),
    corrected_text: z.string().catch("")
});

/**
 * Zod schema for AI Writing Coaching results.
 * Constrains/coerces scores to the 0-10 range and provides fallback values.
 */
export const aiWritingAnalysisResultSchema = z.object({
    grammar_score: z.coerce.number().min(0).max(10).catch(5),
    vocabulary_score: z.coerce.number().min(0).max(10).catch(5),
    tone_score: z.coerce.number().min(0).max(10).catch(5),
    feedback: z.string().min(1).catch("Feedback generation completed."),
    corrections: z.array(z.string()).catch([]),
    better_version: z.string().catch("")
});

/**
 * Zod schema for AI Conversation Roleplay game replies.
 * Constrains/coerces character conversation scores to the 0-5 range.
 */
export const aiConversationResponseSchema = z.object({
    reply: z.string().min(1).catch("I'm having trouble understanding. Can you say that again?"),
    feedback: z.enum(['good', 'average', 'bad']).catch('average'),
    scores: z.object({
        pronunciation: z.coerce.number().min(0).max(5).catch(3),
        grammar: z.coerce.number().min(0).max(5).catch(3),
        confidence: z.coerce.number().min(0).max(5).catch(3)
    }).catch({ pronunciation: 3, grammar: 3, confidence: 3 })
});

/**
 * Validates a required environment variable.
 * Logs a clear warning in development if missing or containing standard placeholders.
 */
export function validateEnv(name: string, value: string | undefined): string {
    const isDev = import.meta.env?.DEV;
    const isValid = value && value.trim() !== '' && !value.toLowerCase().includes('placeholder');
    
    if (!isValid) {
        const errorMsg = `Required environment variable "${name}" is missing or contains placeholder values.`;
        if (isDev) {
            console.warn(`[DEV ENVIRONMENT WARNING]: ${errorMsg} Please configure it in your .env file.`);
        }
        throw new Error(errorMsg);
    }
    
    return value;
}

/**
 * Standardized structure for application errors.
 */
export interface NormalizedError {
    message: string;
    code: string;
    details?: string;
    originalError?: unknown;
}

/**
 * Normalizes any error object, string, or API exception.
 * Keeps stack traces out of production UI while printing them in development environments.
 */
export function normalizeError(error: unknown, fallbackMessage: string): NormalizedError {
    const isDev = import.meta.env?.DEV;
    let message = fallbackMessage;
    let code = 'UNKNOWN_ERROR';
    let details: string | undefined;

    if (error instanceof Error) {
        message = error.message;
        code = error.name || 'ERROR';
        if (isDev) {
            details = error.stack;
        }
    } else if (typeof error === 'string') {
        message = error;
    } else if (error && typeof error === 'object') {
        const errObj = error as Record<string, unknown>;
        if (typeof errObj.message === 'string') {
            message = errObj.message;
        }
        if (typeof errObj.code === 'string') {
            code = errObj.code;
        } else if (typeof errObj.status === 'string' || typeof errObj.status === 'number') {
            code = `HTTP_${errObj.status}`;
        }
        if (isDev) {
            try {
                details = JSON.stringify(error);
            } catch {
                details = String(error);
            }
        }
    }

    // In production, mask raw technical/TypeError crashes with the fallback message
    if (!isDev) {
        const lowerMsg = message.toLowerCase();
        if (
            lowerMsg.includes('typeerror') || 
            lowerMsg.includes('domexception') || 
            lowerMsg.includes('failed to fetch') || 
            lowerMsg.includes('cannot read properties') ||
            lowerMsg.includes('networkerror')
        ) {
            message = fallbackMessage;
        }
    }

    return {
        message,
        code,
        details,
        originalError: error
    };
}
