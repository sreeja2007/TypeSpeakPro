import { describe, it, expect, vi } from 'vitest';
import { safeJsonParse } from '@/lib/safe-json';
import {
    aiAnalysisResultSchema,
    aiWritingAnalysisResultSchema,
    aiConversationResponseSchema,
    googleTokenPayloadSchema,
    normalizeError,
} from '@/lib/validation';

// ─── safeJsonParse ───────────────────────────────────────────────────────────

describe('safeJsonParse', () => {
    it('parses valid JSON string', () => {
        const result = safeJsonParse('{"a":1}', {});
        expect(result).toEqual({ a: 1 });
    });

    it('returns fallback for null input', () => {
        const fallback = { default: true };
        expect(safeJsonParse(null, fallback)).toBe(fallback);
    });

    it('returns fallback for undefined input', () => {
        const fallback = { default: true };
        expect(safeJsonParse(undefined, fallback)).toBe(fallback);
    });

    it('returns fallback for empty string', () => {
        expect(safeJsonParse('', 'fallback')).toBe('fallback');
    });

    it('returns fallback for malformed JSON', () => {
        expect(safeJsonParse('{bad json', null)).toBeNull();
    });

    it('passes through objects directly', () => {
        const obj = { already: 'parsed' };
        expect(safeJsonParse(obj, {})).toBe(obj);
    });

    it('recovers from markdown-wrapped JSON', () => {
        const markdown = '```json\n{"score": 10}\n```';
        expect(safeJsonParse(markdown, {})).toEqual({ score: 10 });
    });

    it('handles whitespace-padded JSON', () => {
        expect(safeJsonParse('  {"x":1}  ', {})).toEqual({ x: 1 });
    });
});

// ─── AI Analysis Schema ─────────────────────────────────────────────────────

describe('aiAnalysisResultSchema', () => {
    it('validates a well-formed AI analysis result', () => {
        const input = {
            grammar_score: 8,
            fluency_score: 7,
            relevance_score: 9,
            confidence_score: 6,
            feedback: 'Great answer!',
            corrections: ['Fix comma usage.'],
            improvements: ['Speak louder.'],
            corrected_text: 'Hello world.',
        };
        const result = aiAnalysisResultSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.grammar_score).toBe(8);
        }
    });

    it('coerces string scores to numbers', () => {
        const input = {
            grammar_score: '7',
            fluency_score: '8',
            relevance_score: '6',
            confidence_score: '9',
            feedback: 'OK',
            corrections: [],
            improvements: [],
            corrected_text: '',
        };
        const result = aiAnalysisResultSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.grammar_score).toBe(7);
        }
    });

    it('clamps out-of-range scores to catch fallback', () => {
        const input = {
            grammar_score: 15, // out of range
            fluency_score: -3, // out of range
            relevance_score: 5,
            confidence_score: 5,
            feedback: 'OK',
            corrections: [],
            improvements: [],
            corrected_text: '',
        };
        const result = aiAnalysisResultSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            // Out-of-range values hit the .catch(5) fallback
            expect(result.data.grammar_score).toBe(5);
            expect(result.data.fluency_score).toBe(5);
        }
    });

    it('provides defaults for completely empty input', () => {
        const result = aiAnalysisResultSchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.grammar_score).toBe(5);
            expect(result.data.feedback).toBe('Good attempt!');
        }
    });
});

// ─── AI Writing Analysis Schema ──────────────────────────────────────────────

describe('aiWritingAnalysisResultSchema', () => {
    it('validates a well-formed writing analysis', () => {
        const input = {
            grammar_score: 9,
            vocabulary_score: 8,
            tone_score: 7,
            feedback: 'Well written.',
            corrections: ['Fix typo.'],
            better_version: 'Improved text here.',
        };
        const result = aiWritingAnalysisResultSchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it('provides defaults for empty input', () => {
        const result = aiWritingAnalysisResultSchema.safeParse({});
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.grammar_score).toBe(5);
        }
    });
});

// ─── AI Conversation Response Schema ─────────────────────────────────────────

describe('aiConversationResponseSchema', () => {
    it('validates a correct conversation response', () => {
        const input = {
            reply: 'Tell me more!',
            feedback: 'good',
            scores: { pronunciation: 4, grammar: 5, confidence: 3 },
        };
        const result = aiConversationResponseSchema.safeParse(input);
        expect(result.success).toBe(true);
    });

    it('coerces invalid feedback to average', () => {
        const input = {
            reply: 'Hello',
            feedback: 'excellent', // not in enum
            scores: { pronunciation: 3, grammar: 3, confidence: 3 },
        };
        const result = aiConversationResponseSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.feedback).toBe('average');
        }
    });

    it('provides default scores for missing scores object', () => {
        const input = {
            reply: 'Hello',
            feedback: 'good',
        };
        const result = aiConversationResponseSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.scores).toEqual({ pronunciation: 3, grammar: 3, confidence: 3 });
        }
    });
});

// ─── Google Token Schema ─────────────────────────────────────────────────────

describe('googleTokenPayloadSchema', () => {
    it('validates a correct token payload', () => {
        const payload = {
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'https://example.com/photo.jpg',
            sub: '123456789',
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        };
        const result = googleTokenPayloadSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('rejects missing email', () => {
        const payload = {
            name: 'John Doe',
            picture: 'https://example.com/photo.jpg',
            sub: '123456789',
            exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const result = googleTokenPayloadSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    it('rejects invalid email format', () => {
        const payload = {
            name: 'John Doe',
            email: 'not-an-email',
            picture: 'https://example.com/photo.jpg',
            sub: '123456789',
            exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const result = googleTokenPayloadSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });

    it('rejects missing sub', () => {
        const payload = {
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'https://example.com/photo.jpg',
            exp: Math.floor(Date.now() / 1000) + 3600,
        };
        const result = googleTokenPayloadSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
});

// ─── normalizeError ──────────────────────────────────────────────────────────

describe('normalizeError', () => {
    it('normalizes an Error object', () => {
        const err = new Error('Something broke');
        const normalized = normalizeError(err, 'Fallback message');
        expect(normalized.message).toBe('Something broke');
        expect(normalized.code).toBe('Error');
    });

    it('normalizes a plain string', () => {
        const normalized = normalizeError('oops', 'Fallback');
        expect(normalized.message).toBe('oops');
        expect(normalized.code).toBe('UNKNOWN_ERROR');
    });

    it('normalizes null/undefined to fallback', () => {
        const normalized = normalizeError(null, 'Something went wrong');
        expect(normalized.message).toBe('Something went wrong');
    });

    it('normalizes an object with message property', () => {
        const err = { message: 'custom error', code: 'CUSTOM' };
        const normalized = normalizeError(err, 'Fallback');
        expect(normalized.message).toBe('custom error');
        expect(normalized.code).toBe('CUSTOM');
    });

    it('normalizes an object with HTTP status', () => {
        const err = { message: 'Not found', status: 404 };
        const normalized = normalizeError(err, 'Fallback');
        expect(normalized.code).toBe('HTTP_404');
    });
});
