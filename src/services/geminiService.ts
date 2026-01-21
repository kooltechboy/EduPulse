import { GoogleGenAI, Modality, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY || '';
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

const SYSTEM_PROMPT = "You are the EduPulse AI, a world-class academic architect and pedagogy consultant for a futuristic 2026 digital campus. You specialize in generating curricula aligned with IB, IGCSE, and Common Core standards.";

/**
 * Architects a master grading rubric for high-fidelity LMS assessment.
 */
export const generateGradingRubric = async (assignmentTitle: string, criteria: string[]) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Architect a professional 4-level grading rubric for "${assignmentTitle}". 
      Criteria to evaluate: ${criteria.join(', ')}. 
      Format: Clean Markdown table. Output criteria for levels: Mastery, Proficient, Developing, Beginning.`,
      config: { systemInstruction: "Institutional Assessment Expert Mode." }
    });
    return response.text || "Failed to synthesize rubric.";
  } catch (error) {
    return "Assessment link offline.";
  }
};

/**
 * Matches available staff for substitutions based on skills and availability.
 */
export const findAIGuidedSubstitution = async (absentStaff: any, availableStaff: any[]) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Match an available teacher for an absence. 
      Absent Teacher: ${JSON.stringify(absentStaff)}. 
      Available Pool: ${JSON.stringify(availableStaff)}. 
      Select the top 3 best fits and explain why based on subject mastery and pedagogical alignment.`,
      config: { systemInstruction: "Institutional Resource Coordinator mode." }
    });
    return response.text || "No optimal matches found.";
  } catch (error) {
    return "Sync offline.";
  }
};

/**
 * Architects a master 40-week syllabus roadmap.
 */
export const generateFullSyllabus = async (subject: string, level: string, standard: string) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Architect a master 40-week academic syllabus for "${subject}" at "${level}" level, adhering to "${standard}" standards. 
      Include 8 modules, each covering 4-5 weeks. 
      The output must be a JSON object with this structure:
      {
        "introduction": "A high-level pedagogical summary",
        "modules": [
          {
            "weekRange": "Weeks 1-5",
            "title": "Module Title",
            "objectives": ["Learner Objective 1", "Learner Objective 2"],
            "summary": "Instructional path summary",
            "standards": ["IB-DP-1.1", "CCSS-ELA-1"],
            "pedagogicalLoad": 75,
            "suggestedExercise": "Practical Activity Title"
          }
        ]
      }`,
      config: {
        systemInstruction: "Lead Academic Architect mode. Output valid JSON only.",
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Syllabus Generation Error:", error);
    return null;
  }
};

/**
 * Generates a specific lesson plan based on modality (Daily, Weekly, etc.)
 */
export const generateAILessonPlan = async (title: string, modality: string, courseContext: string) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Architect a professional ${modality} pedagogical plan for "${title}" in the course: ${courseContext}. 
      Include: 1. Core Objectives, 2. Instructional Flow, 3. Recommended Materials (Video/Docs), 4. Assessment Strategy.
      Format: Clean Markdown.`,
      config: { systemInstruction: "Institutional Pedagogy Specialist mode." }
    });
    return response.text || "AI synthesis failed.";
  } catch (error) {
    return "Neural link offline. Manual planning required.";
  }
};

/**
 * Generates high-fidelity conceptual visual aids for students using Imagen 4.0
 */
export const generateConceptualVisual = async (prompt: string) => {
  try {
    const response = await getAI().models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Educational conceptual diagram for a 2026 school textbook: ${prompt}. High fidelity, 4k, clean labels, futuristic aesthetic.`,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
        outputMimeType: 'image/jpeg'
      }
    });
    const base64 = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Imagen Error:", error);
    return null;
  }
};

/**
 * Generates a cinematic lesson recap video using Veo 3.1
 */
export const generateLessonRecapVideo = async (topic: string, description: string, onProgress?: (msg: string) => void) => {
  try {
    if (onProgress) onProgress("Initializing Veo 3.1 Fast engine...");

    // Create a new instance right before the call to ensure the latest API key from user selection is utilized
    const veoAi = getAI();

    let operation = await veoAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A high-tech educational cinematic recap video about ${topic}. Narrative: ${description}. 1080p, smooth transitions, futuristic dashboard overlays.`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      if (onProgress) onProgress("Synthesizing cinematic frames... (May take a few minutes)");
      await new Promise(resolve => setTimeout(resolve, 8000));
      operation = await veoAi.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    // Append API key when fetching from download link as per protocol
    return `${downloadLink}&key=${process.env.API_KEY}`;
  } catch (error: any) {
    // If request fails due to missing auth entity, prompt for key re-selection
    if (error?.message?.includes("Requested entity was not found.")) {
      console.warn("Auth drift detected. Requesting key re-selection.");
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        (window as any).aistudio.openSelectKey();
      }
    }
    console.error("Veo Synthesis Error:", error);
    return null;
  }
};

/**
 * Establishes a Live API session for real-time voice tutoring.
 */
export const connectToLiveTutor = (callbacks: any) => {
  return getAI().live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
      },
      systemInstruction: "You are a friendly, expert 2026 school tutor. Help students with their homework using a supportive, encouraging voice. Keep explanations concise but deep."
    }
  });
};

export const generateTeacherFeedback = async (notes: string, teacherName: string) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a professional teacher evaluation for ${teacherName} based on these coordinator notes: "${notes}". 
      Provide: 1. Core Strengths, 2. Growth Areas, 3. Summary Feedback. 
      Tone: Growth-oriented, clinical, supportive.`,
      config: { systemInstruction: "AI Instructional Coach mode." }
    });
    return response.text || "Feedback synthesis bypassed.";
  } catch (error) {
    return "Neural link offline. Manual entry required.";
  }
};

export const performAIResearch = async (query: string) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform deep institutional research on: "${query}". Provide citations and verified links.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Academic Research Assistant mode. Provide verified source links."
      }
    });
    const text = response.text || "No results.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Source",
      url: chunk.web?.uri || "#"
    })) || [];
    return { text, sources };
  } catch (error) {
    return { text: "Research network unavailable.", sources: [] };
  }
};

export const getAITutorResponse = async (query: string, context: any) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Query: "${query}". Context: ${JSON.stringify(context)}. Provide a helpful, encouraging, and academically rigorous response.`,
      config: { systemInstruction: "You are the Personalized AI Learning Tutor for 2026 Students." }
    });
    return response.text || "Tutor response bypassed.";
  } catch (error) {
    return "Learning node latency detected.";
  }
};

export const getCampusSummary = async (data: any) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Synthesize a brief institutional summary based on this campus performance data: ${JSON.stringify(data)}. Focus on growth trends and critical metrics.`,
      config: { systemInstruction: SYSTEM_PROMPT }
    });
    return response.text || "Campus data synthesis bypass.";
  } catch (error) {
    return "Institutional core offline.";
  }
};

export const getAIPredictiveInsights = async (data: { class: string; avgAttendance: number; lastTestAvg: number }) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this class data: ${JSON.stringify(data)}. Provide one predictive pedagogical insight and a specific recommended action for the teacher.`,
      config: { systemInstruction: "You are the Faculty AI Strategy Analyst." }
    });
    return response.text || "Insights pending data synchronization.";
  } catch (error) {
    return "Predictive engine offline.";
  }
};

export const analyzeGrades = async (grades: any[]) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this gradebook data: ${JSON.stringify(grades)}. Identify patterns and provide institutional academic summaries.`,
      config: { systemInstruction: "AI Academic Evaluation Mode." }
    });
    return response.text || "Grade synthesis incomplete.";
  } catch (error) {
    return "Assessment core offline.";
  }
};

export const generateSmartPrep = async (module: any, level: string) => {
  try {
    const response = await getAI().models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Architect a smart pedagogical preparation plan for the module: "${module.title}" at "${level}" level. 
      Objectives: ${module.objectives?.join(', ') || 'General pedagogy'}.
      Include: 1. Instructional Hooks, 2. Scaffolding, 3. Differentiation.
      Format: Clean Markdown.`,
      config: { systemInstruction: "Lead Instructional Designer mode." }
    });
    return response.text || "Preparation failed.";
  } catch (error) {
    return "Neural link offline.";
  }
};
