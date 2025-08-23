
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, QuizAnalysis, QuizMode, ApiProvider } from '../types';

// --- SCHEMAS (Provider-agnostic) ---
const quizGenerationSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: { type: Type.STRING, description: "The question text." },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 4 multiple-choice options." },
            correctAnswer: { type: Type.STRING, description: "The exact text of the correct answer from the options array." },
            category: { type: Type.STRING, description: "A one or two-word category for the question (e.g., 'History', 'Syntax')." },
            explanation: { type: Type.STRING, description: "A brief explanation for why the correct answer is right." }
        },
        required: ["question", "options", "correctAnswer", "category", "explanation"]
    }
};

const analysisGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        strongAreas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of the user's strongest categories." },
        weakAreas: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of the user's weakest categories." },
        overallFeedback: { type: Type.STRING, description: "A brief, encouraging paragraph of overall feedback." }
    },
    required: ["strongAreas", "weakAreas", "overallFeedback"]
};

// --- SYSTEM INSTRUCTIONS (Provider-agnostic) ---
const getQuizSystemInstruction = (mode: QuizMode) => {
    switch (mode) {
        case QuizMode.FUN: return "You are a fun and quirky quiz master. Generate questions that are playful and include witty explanations. The tone should be lighthearted and entertaining.";
        case QuizMode.EXPERT: return "You are an expert quiz creator. Generate challenging, in-depth questions suitable for professionals or enthusiasts. The explanations should be detailed and technical.";
        case QuizMode.KIDS: return "You are a friendly teacher creating a quiz for 10-year-olds. The questions should be simple, and the explanations fun and educational.";
        default: return "You are an AI assistant designed to create high-quality multiple-choice quizzes.";
    }
};
const getAnalysisSystemInstruction = (mode: QuizMode) => {
    switch (mode) {
        case QuizMode.FUN: return "Analyze these quiz results in a fun, witty, and encouraging tone. Use playful language.";
        case QuizMode.EXPERT: return "Provide a concise, professional analysis of the user's performance, highlighting specific areas for technical improvement.";
        case QuizMode.KIDS: return "Give simple, positive, and encouraging feedback on these quiz results for a child. Be very friendly and supportive.";
        default: return "You are an AI assistant designed to analyze quiz performance and provide constructive feedback.";
    }
};

// --- GOOGLE GEMINI IMPLEMENTATION ---
const generateQuizWithGoogle = async (params: GenerationParams): Promise<QuizQuestion[]> => {
    const { apiKey, topic, numQuestions, mode } = params;
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a quiz with ${numQuestions} questions on the topic of "${topic}". Ensure variety in sub-topics. For each question, provide: The question, 4 options, the correct answer, a category, and an explanation.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: quizGenerationSchema,
            systemInstruction: getQuizSystemInstruction(mode),
        },
    });
    return JSON.parse(response.text.trim());
};

const analyzeQuizWithGoogle = async (params: AnalysisParams): Promise<QuizAnalysis> => {
    const { apiKey, topic, results, mode } = params;
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Analyze the user's performance for a quiz on "${topic}". Results: ${JSON.stringify(results)}. Identify strong/weak areas and give overall feedback.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisGenerationSchema,
            systemInstruction: getAnalysisSystemInstruction(mode),
        },
    });
    return JSON.parse(response.text.trim());
};


// --- OPENROUTER IMPLEMENTATION ---
const openRouterRequest = async (apiKey: string, body: object) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://ai-quizmaster.example.com', // Replace with your site URL
            'X-Title': 'AI QuizMaster',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) {
        throw new Error("Received an empty response from OpenRouter.");
    }
    // The response content is a stringified JSON, so we need to parse it.
    return JSON.parse(content);
};

const generateQuizWithOpenRouter = (params: GenerationParams): Promise<QuizQuestion[]> => {
    const { apiKey, topic, numQuestions, mode, openRouterModel } = params;
    const systemInstruction = getQuizSystemInstruction(mode) + " You MUST respond with a valid JSON object that adheres to this JSON schema: " + JSON.stringify(quizGenerationSchema);
    const userPrompt = `Generate a quiz with ${numQuestions} questions on the topic of "${topic}".`;

    const body = {
        model: openRouterModel,
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
    };

    return openRouterRequest(apiKey, body);
};

const analyzeQuizWithOpenRouter = (params: AnalysisParams): Promise<QuizAnalysis> => {
    const { apiKey, topic, results, mode, openRouterModel } = params;
    const systemInstruction = getAnalysisSystemInstruction(mode) + " You MUST respond with a valid JSON object that adheres to this JSON schema: " + JSON.stringify(analysisGenerationSchema);
    const userPrompt = `Analyze the user's performance for a quiz on "${topic}". Results: ${JSON.stringify(results)}. Identify strong/weak areas and give overall feedback.`;

    const body = {
        model: openRouterModel,
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
    };
    
    return openRouterRequest(apiKey, body);
};

// --- API DISPATCHER ---
interface BaseParams {
    apiKey: string;
    apiProvider: ApiProvider;
    mode: QuizMode;
    openRouterModel: string;
}

interface GenerationParams extends BaseParams {
    topic: string;
    numQuestions: number;
}

interface AnalysisPayloadItem {
    question: string;
    category: string;
    userAnswer: string;
    correctAnswer: string;
}

interface AnalysisParams extends BaseParams {
    topic: string;
    results: AnalysisPayloadItem[];
}

const handleApiError = (error: unknown, provider: ApiProvider) => {
    console.error(`Error with ${provider}:`, error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('Incorrect API key')) {
            return new Error(`The provided API Key for ${provider} is not valid. Please check it and try again.`);
        }
        if (error.message.includes('404')) {
             return new Error(`Model not found for ${provider}. Please check the model name.`);
        }
    }
    return new Error(`Failed to get a response from ${provider}. The service may be unavailable or the request was invalid.`);
}

export const generateQuiz = async (params: GenerationParams): Promise<QuizQuestion[]> => {
    try {
        if (params.apiProvider === ApiProvider.OPENROUTER) {
            return await generateQuizWithOpenRouter(params);
        }
        return await generateQuizWithGoogle(params);
    } catch (error) {
        throw handleApiError(error, params.apiProvider);
    }
};

export const analyzeQuiz = async (params: AnalysisParams): Promise<QuizAnalysis> => {
    try {
        if (params.apiProvider === ApiProvider.OPENROUTER) {
            return await analyzeQuizWithOpenRouter(params);
        }
        return await analyzeQuizWithGoogle(params);
    } catch (error) {
        throw handleApiError(error, params.apiProvider);
    }
};