/**
 * Safely parses a JSON string into a typed object.
 * Returns a fallback value if parsing fails completely.
 */
export function safeJsonParse<T>(jsonStr: any, fallback: T): T {
    if (jsonStr === null || jsonStr === undefined) {
        return fallback;
    }

    if (typeof jsonStr !== 'string') {
        if (typeof jsonStr === 'object') {
            return jsonStr as T;
        }
        return fallback;
    }
    
    const trimmed = jsonStr.trim();
    if (!trimmed) {
        return fallback;
    }
    
    try {
        return JSON.parse(trimmed) as T;
    } catch (error) {
        // Recover from cases where AI wraps the JSON in markdown code blocks
        try {
            const cleanJson = trimmed
                .replace(/^```json\s*/i, '')
                .replace(/```$/, '')
                .trim();
            return JSON.parse(cleanJson) as T;
        } catch {
            console.error("Failed to parse JSON string safely. returning fallback.", error);
            return fallback;
        }
    }
}
