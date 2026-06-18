// ============================================
// TalentLens — LLM Integration Layer
// ============================================

/**
 * Handles communication with the Gemini API
 */
export class GeminiClient {
    constructor() {
        this.apiKey = localStorage.getItem('talentlens_gemini_key') || '';
        this.model = 'gemini-2.0-flash';
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.timeout = 30000; // 30 seconds
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('talentlens_gemini_key', key);
    }

    hasApiKey() {
        return !!this.apiKey && this.apiKey.trim().length > 0;
    }

    /**
     * Clean raw LLM text output into parseable JSON
     */
    _cleanJsonResponse(textContent) {
        let cleanJson = textContent.trim();

        // Strip markdown code fences
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.substring(7);
        } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.substring(3);
        }
        if (cleanJson.endsWith('```')) {
            cleanJson = cleanJson.substring(0, cleanJson.length - 3);
        }

        // Strip leading/trailing whitespace and newlines
        cleanJson = cleanJson.trim();

        // Handle cases where LLM wraps in extra object
        return cleanJson;
    }

    /**
     * Make a request to the Gemini generateContent endpoint.
     * Returns parsed JSON.
     */
    async generateContent(prompt, systemInstruction = null) {
        if (!this.hasApiKey()) {
            throw new Error('API key not configured. Please add your Gemini API key in Settings.');
        }

        const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        };

        if (systemInstruction) {
            payload.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        // Create an abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.error?.message || `HTTP error! status: ${response.status}`;
                console.error("Gemini API Error:", errorData);

                if (response.status === 429) {
                    throw new Error('Rate limited by Gemini API. Please wait a moment and try again.');
                }
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Invalid API key. Please check your Gemini API key in Settings.');
                }
                throw new Error(message);
            }

            const data = await response.json();
            const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!textContent) {
                const finishReason = data.candidates?.[0]?.finishReason;
                if (finishReason === 'SAFETY') {
                    throw new Error('Response blocked by safety filters. Try rephrasing.');
                }
                throw new Error('Empty response from Gemini API.');
            }

            const cleanJson = this._cleanJsonResponse(textContent);
            return JSON.parse(cleanJson);

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('Gemini API request timed out. Please try again.');
            }

            console.error("Failed to generate content:", error);
            throw error;
        }
    }

    /**
     * Generate content and return raw text (non-JSON).
     */
    async generateContentRaw(prompt, systemInstruction = null) {
        if (!this.hasApiKey()) {
            throw new Error('API key not configured.');
        }

        const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.3
            }
        };

        if (systemInstruction) {
            payload.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timed out.');
            }
            throw error;
        }
    }
}

export const llmClient = new GeminiClient();
