import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Content, Type, ThinkingLevel, Schema } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const EDUCATIONAL_GEMINI_MODEL = 'gemini-3.1-flash-lite';
const REASONING_GEMINI_MODEL = 'gemini-4-hydrogen';
const EDUCATIONAL_FIRST_CHUNK_MS = 12000;
const EDUCATIONAL_TOTAL_MS = 24000;
const REASONING_STREAM_TIMEOUT_MS = 8500;
const EDUCATIONAL_STREAM_TIMEOUT_MS = 12000;
const MAX_TOPIC_CHARS = 6000;
const AI_BUSY_MESSAGE = '⚠️ AI service is busy. Please try again in a moment.';

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ProfilePayload {
  fullName?: string;
  studentId?: string;
  academicYear?: string;
  clinicalRotation?: string;
  focusAreas?: string[];
}

interface SettingsPayload {
  responseFormat?: 'adpie' | 'nanda' | 'dosage' | 'exam';
  density?: 'comfortable' | 'compact';
  clinicalSafetyNotes?: boolean;
  language?: 'en' | 'ar';
}

function getGeneratorLanguageDirective(language?: 'en' | 'ar'): string {
  if (language === 'ar') {
    return 'Write all text in clear Arabic, keeping essential English medical/drug terms in parentheses for exam accuracy.';
  }
  return 'Match the input language (English, Arabic, or EN+AR if requested).';
}

const IDENTITY_RESPONSE = `😎 Created and developed by Mohamed Ayman Kamel Elsawy
🆔 Student ID: 200105235
💙 Founder and Owner of PulseMind AI`;

function isIdentityQuestion(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  const patterns = [
    /who\s+(created|made|developed|built|designed|owns|founded|invented)\s+(you|pulsemind|this)/i,
    /who\s+is\s+(your\s+)?(creator|developer|maker|owner|founder|author)/i,
    /who\s+owns\s+pulsemind/i,
    /(مين|من)\s+(اللي\s+)?(عملك|صنعك|طورك|برمجك|أنشأك|انشأك|اسسك|أسسك|صاحب|مطور|مؤسس)/i,
    /صاحب\s+pulsemind/i,
    /مطور\s+pulsemind/i,
  ];
  return patterns.some((re) => re.test(normalized));
}

function isExamTomorrowTrigger(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  return (
    normalized.includes('exam tomorrow') ||
    normalized.includes('امتحان بكرة') ||
    normalized.includes('امتحاني بكرة') ||
    normalized.includes('امتحان بكره') ||
    normalized.includes('امتحان غدا') ||
    normalized.includes('امتحان غداً')
  );
}

function requiresAdvancedReasoning(text: string): boolean {
  const normalized = text.toLowerCase();
  // Pure educational generation prompts in chat go straight to flash-lite for speed
  const isEducationalGenerationOnly =
    /\b(flashcard|flashcards|mcq|mcqs|true\/false|true or false|quiz|keywords|summarize|summary)\b/i.test(
      normalized
    ) &&
    !/\b(care plan|nanda|adpie|dosage|calculate|mcg\/kg|abg|ecg|differential|pathophysiology|triage|priority)\b/i.test(
      normalized
    );

  if (isEducationalGenerationOnly) {
    return false;
  }

  return /\b(care plan|nanda|adpie|noc|nic|dosage|calculate|titration|infusion rate|mcg\/kg|abg|arterial blood gas|ecg|ekg|differential|pathophysiology|triage|priority nursing|acute|deterioration|shock|sepsis|dka|exam tomorrow|امتحان بكرة|خطة تمريض|تشخيص تمريضي|جرعة)\b/i.test(
    normalized
  );
}

function buildNursingSystemInstruction(
  profile?: ProfilePayload,
  settings?: SettingsPayload,
  examTomorrowTriggered?: boolean
): string {
  const studentName = profile?.fullName?.trim() || 'Nursing Student';
  const academicYear = profile?.academicYear?.trim() || '3rd Year BSN';
  const rotation = profile?.clinicalRotation?.trim() || 'Medical-Surgical & Critical Care';
  const focusList =
    profile?.focusAreas && profile.focusAreas.length > 0
      ? profile.focusAreas.slice(0, 4).join(', ')
      : 'Pharmacology, Pathophysiology, Medical-Surgical Nursing';

  const formatMap: Record<string, string> = {
    adpie: 'Structure clinical care along ADPIE (Assessment, Diagnosis, Planning, Intervention, Evaluation).',
    nanda: 'Use NANDA-I diagnoses (Problem, Related To, As Evidenced By) with NOC outcomes and NIC interventions.',
    dosage: 'Show medication math step-by-step via dimensional analysis + safety range check.',
    exam: 'Optimize for MUST Nursing exams/OSCE: highlight ABCs, priority actions, lab cutoffs, and concise rationales.',
  };

  const selectedFormat = formatMap[settings?.responseFormat || 'adpie'] || formatMap.adpie;
  const densityNote =
    settings?.density === 'compact'
      ? 'Keep responses concise with tight bullets and compact markdown tables.'
      : 'Use clear subheadings, quick memory tricks, and structured tables.';

  const safetyNote =
    settings?.clinicalSafetyNotes !== false
      ? 'Include a brief bedside safety/monitoring check for high-alert drugs or acute instability.'
      : '';

  const examTomorrowDirective = examTomorrowTriggered
    ? `EXAM TOMORROW MODE ACTIVATED! Include ALL 5 labeled sections with emojis:
1. ⚡ **High-Yield Summary**
2. 🔑 **Important Keywords**
3. 📝 **Expected MCQs** (4 clinical MCQs A-D with answer + rationale)
4. ✅ **True/False Practice** (4 statements with answer + correction)
5. 🧠 **Rapid Revision Notes** (mnemonics & last-minute anchors)`
    : '';

  return [
    `You are **PulseMind AI** — a warm, smart, supportive 💙, slightly witty 😄 nursing study partner for MUST University Faculty of Nursing students. Use natural emojis (🩺📚💙🚀⚡✅).`,
    `LANGUAGE: ${settings?.language === 'ar' ? 'Prioritize clear Arabic with essential English medical/drug terms in parentheses unless asked for English-only.' : 'Respond in English or Arabic matching the user.'} When helping the student study a topic/lecture/exam, pair clear English clinical terms with friendly Arabic explanation (Bilingual EN+AR).`,
    `IDENTITY RULE (STRICT): If asked who created/developed/owns you, reply ONLY with:\n${IDENTITY_RESPONSE}`,
    examTomorrowDirective,
    `CONTEXT: Student ${studentName} (${academicYear}, ${rotation}, focus: ${focusList}). ${selectedFormat} ${densityNote} ${safetyNote} Use standard SI/hospital units.`,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function clampCount(raw: unknown, min: number, max: number, fallback: number): number {
  const num = Number(raw);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, Math.round(num)));
}

function sanitizeTopicInput(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX_TOPIC_CHARS);
}

function extractGeminiError(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) {
    let msg = err.message.trim();
    for (let depth = 0; depth < 3; depth++) {
      if (!msg.startsWith('{')) break;
      try {
        const parsed = JSON.parse(msg) as { error?: { message?: string }; message?: string };
        const inner = parsed?.error?.message ?? parsed?.message;
        if (typeof inner === 'string' && inner.trim()) {
          msg = inner.trim();
        } else {
          break;
        }
      } catch {
        break;
      }
    }
    return msg || fallback;
  }
  return fallback;
}

function isApiKeyError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return /API_KEY_INVALID|API key not valid|PERMISSION_DENIED.*api key/i.test(msg);
}

function isGeminiBusyOrTimeoutError(err: unknown): boolean {
  if (isApiKeyError(err)) return false;
  const status =
    typeof err === 'object' && err !== null && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : NaN;
  if (status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504 || status === 404) {
    return true;
  }
  const msg = err instanceof Error ? err.message : String(err ?? '');
  return /503|429|504|502|500|408|404|UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE_EXCEEDED|NOT_FOUND|high demand|overloaded|timed out|timeout|ETIMEDOUT|ECONNRESET|fetch failed|not found|not supported/i.test(
    msg
  );
}

function safeParseJson<T>(rawText: string | undefined): T | null {
  if (!rawText || typeof rawText !== 'string') return null;

  let cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const firstObj = cleaned.indexOf('{');
  const firstArr = cleaned.indexOf('[');
  let start = -1;
  if (firstObj !== -1 && (firstArr === -1 || firstObj < firstArr)) {
    start = firstObj;
  } else if (firstArr !== -1) {
    start = firstArr;
  }

  if (start > 0) {
    cleaned = cleaned.slice(start);
  }

  const tryParse = (text: string): T | null => {
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  };

  const direct = tryParse(cleaned);
  if (direct !== null) return direct;

  // Strip trailing commas before closing brackets/braces
  const withoutTrailingCommas = cleaned.replace(/,\s*([}\]])/g, '$1');
  const second = tryParse(withoutTrailingCommas);
  if (second !== null) return second;

  // Trim to last closing brace/bracket in case of trailing prose
  const lastObj = withoutTrailingCommas.lastIndexOf('}');
  const lastArr = withoutTrailingCommas.lastIndexOf(']');
  const end = Math.max(lastObj, lastArr);
  if (end > 0) {
    const sliced = tryParse(withoutTrailingCommas.slice(0, end + 1));
    if (sliced !== null) return sliced;
  }

  return null;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`${label} timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateEducationalJson<T>(
  ai: GoogleGenAI,
  params: {
    contents: string;
    systemInstruction: string;
    responseSchema: Schema;
    firstChunkMs?: number;
    totalTimeoutMs?: number;
  },
  validateAndNormalize: (raw: unknown) => T | null
): Promise<T> {
  const firstChunkMs = params.firstChunkMs ?? EDUCATIONAL_FIRST_CHUNK_MS;
  const totalTimeoutMs = params.totalTimeoutMs ?? EDUCATIONAL_TOTAL_MS;

  const runModel = async (model: string, thinkingLevel: ThinkingLevel): Promise<T> => {
    const stream = await withTimeout(
      ai.models.generateContentStream({
        model,
        contents: params.contents,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: params.responseSchema,
          thinkingConfig: { thinkingLevel },
        },
      }),
      firstChunkMs,
      `Stream init (${model})`
    );

    const iterator = stream[Symbol.asyncIterator]();
    let fullText = '';
    let gotFirstChunk = false;
    const startTime = Date.now();

    while (true) {
      const elapsed = Date.now() - startTime;
      const remainingTotal = totalTimeoutMs - elapsed;
      if (remainingTotal <= 0) {
        throw new Error(`Model (${model}) timed out after ${totalTimeoutMs}ms`);
      }

      const stepTimeout = gotFirstChunk
        ? remainingTotal
        : Math.min(firstChunkMs, Math.max(500, firstChunkMs - elapsed));

      const step = await withTimeout(
        iterator.next(),
        stepTimeout,
        gotFirstChunk ? `Stream chunk (${model})` : `First chunk (${model})`
      );

      if (step.done) break;
      const chunkText = step.value?.text;
      if (chunkText) {
        gotFirstChunk = true;
        fullText += chunkText;
      }
    }

    const parsed = safeParseJson<unknown>(fullText);
    if (parsed === null) {
      throw new Error(`Invalid JSON output from ${model}`);
    }
    const normalized = validateAndNormalize(parsed);
    if (normalized === null) {
      throw new Error(`Incomplete structured output from ${model}`);
    }
    return normalized;
  };

  // Attempt 1: Primary fast educational model (gemini-3.1-flash-lite with MINIMAL thinking)
  try {
    return await runModel(EDUCATIONAL_GEMINI_MODEL, ThinkingLevel.MINIMAL);
  } catch (err1) {
    if (isApiKeyError(err1)) {
      throw err1;
    }
    console.warn(
      `Educational attempt 1 (${EDUCATIONAL_GEMINI_MODEL}) failed, retrying:`,
      extractGeminiError(err1, 'retry')
    );
  }

  // Attempt 2: Fast retry on gemini-3.1-flash-lite
  await sleep(200);
  try {
    return await runModel(EDUCATIONAL_GEMINI_MODEL, ThinkingLevel.MINIMAL);
  } catch (err2) {
    if (isApiKeyError(err2) || !isGeminiBusyOrTimeoutError(err2)) {
      throw err2;
    }
    console.warn(
      `Educational attempt 2 (${EDUCATIONAL_GEMINI_MODEL}) failed; trying fallback (${REASONING_GEMINI_MODEL}):`,
      extractGeminiError(err2, 'unavailable')
    );
  }

  // Attempt 3: Fallback to gemini-4-hydrogen with LOW thinking if available
  return await runModel(REASONING_GEMINI_MODEL, ThinkingLevel.LOW);
}

function normalizeMcqList(rawList: unknown, stamp: number, idPrefix = 'mcq') {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const q = item as Record<string, unknown>;
      const stem = typeof q.stem === 'string' ? q.stem.trim() : '';
      if (!stem) return null;

      const rawOptions = Array.isArray(q.options)
        ? q.options
            .map((o) => (typeof o === 'string' ? o.trim() : String(o ?? '').trim()))
            .filter(Boolean)
        : [];
      if (rawOptions.length < 2) return null;

      const options = rawOptions.slice(0, 4);
      while (options.length < 4) {
        options.push('None of the above');
      }

      const parsedIdx = Number(q.correctIndex);
      const safeIndex =
        Number.isInteger(parsedIdx) && parsedIdx >= 0 && parsedIdx < options.length ? parsedIdx : 0;

      const rationale =
        typeof q.rationale === 'string' && q.rationale.trim()
          ? q.rationale.trim()
          : 'This option addresses the highest clinical priority and patient safety threshold.';
      const distractorNote =
        typeof q.distractorNote === 'string' && q.distractorNote.trim()
          ? q.distractorNote.trim()
          : 'Other choices are lower priority, incomplete, or carry higher safety risk.';

      return {
        id: `${idPrefix}-${stamp}-${index}`,
        stem,
        options,
        correctIndex: safeIndex,
        rationale,
        distractorNote,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

function normalizeFlashcardList(rawList: unknown, stamp: number, idPrefix = 'fc') {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const c = item as Record<string, unknown>;
      const front = typeof c.front === 'string' ? c.front.trim() : '';
      const back = typeof c.back === 'string' ? c.back.trim() : '';
      if (!front || !back) return null;
      const clinicalPearl =
        typeof c.clinicalPearl === 'string' && c.clinicalPearl.trim()
          ? c.clinicalPearl.trim()
          : '🩺 Always verify baseline vitals and relevant lab thresholds before intervention.';
      return {
        id: `${idPrefix}-${stamp}-${index}`,
        front,
        back,
        clinicalPearl,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

function normalizeTrueFalseList(rawList: unknown, stamp: number, idPrefix = 'tf') {
  if (!Array.isArray(rawList)) return [];
  return rawList
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const s = item as Record<string, unknown>;
      const statement = typeof s.statement === 'string' ? s.statement.trim() : '';
      if (!statement) return null;
      const isTrue =
        typeof s.isTrue === 'boolean'
          ? s.isTrue
          : String(s.isTrue).toLowerCase() === 'true';
      const explanation =
        typeof s.explanation === 'string' && s.explanation.trim()
          ? s.explanation.trim()
          : 'Review standard clinical safety guidelines and priority nursing protocols.';
      const keyTakeaway =
        typeof s.keyTakeaway === 'string' && s.keyTakeaway.trim()
          ? s.keyTakeaway.trim()
          : '⚡ Prioritize patient safety, ABCs, and baseline lab checks.';
      return {
        id: `${idPrefix}-${stamp}-${index}`,
        statement,
        isTrue,
        explanation,
        keyTakeaway,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

async function startModelStream(
  ai: GoogleGenAI,
  model: string,
  contents: Content[],
  systemInstruction: string,
  timeoutMs: number
) {
  const thinkingLevel =
    model === EDUCATIONAL_GEMINI_MODEL ? ThinkingLevel.MINIMAL : ThinkingLevel.LOW;

  const stream = await withTimeout(
    ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingLevel },
      },
    }),
    timeoutMs,
    `Stream init (${model})`
  );

  const iterator = stream[Symbol.asyncIterator]();
  const bufferedTexts: string[] = [];
  let finished = false;

  const deadline = Date.now() + timeoutMs;
  while (true) {
    const remaining = Math.max(500, deadline - Date.now());
    const step = await withTimeout(iterator.next(), remaining, `First chunk (${model})`);
    if (step.done) {
      finished = true;
      break;
    }
    const text = step.value?.text;
    if (text) {
      bufferedTexts.push(text);
      break;
    }
  }

  return { model, iterator, bufferedTexts, finished };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
      primaryModel: EDUCATIONAL_GEMINI_MODEL,
      reasoningModel: REASONING_GEMINI_MODEL,
      fallbackModel: EDUCATIONAL_GEMINI_MODEL,
    });
  });

  app.post('/api/chat', async (req, res) => {
    const { messages, profile, settings } = req.body as {
      messages?: IncomingMessage[];
      profile?: ProfilePayload;
      settings?: SettingsPayload;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let closed = false;
    res.on('close', () => {
      if (!res.writableEnded) {
        closed = true;
      }
    });

    if (isIdentityQuestion(lastUserMessage)) {
      if (!closed && !res.writableEnded) {
        res.write(`data: ${JSON.stringify({ text: IDENTITY_RESPONSE })}\n\n`);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      }
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      if (!closed && !res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({
            error:
              'GEMINI_API_KEY is not configured. Please add your key in the Settings > Secrets panel.',
          })}\n\n`
        );
        res.end();
      }
      return;
    }

    const examTomorrowTriggered = isExamTomorrowTrigger(lastUserMessage);

    try {
      const contents: Content[] = [];
      for (const msg of messages) {
        const text = typeof msg.content === 'string' ? msg.content.trim() : '';
        if (!text) continue;
        const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';
        if (contents.length === 0 && role === 'model') {
          continue;
        }
        const prev = contents[contents.length - 1];
        if (prev && prev.role === role) {
          prev.parts = [...(prev.parts ?? []), { text }];
        } else {
          contents.push({ role, parts: [{ text }] });
        }
      }

      if (contents.length === 0) {
        if (!closed && !res.writableEnded) {
          res.write(`data: ${JSON.stringify({ error: 'Please enter a non-empty message.' })}\n\n`);
          res.end();
        }
        return;
      }

      res.write(': connected\n\n');

      const ai = getAiClient();
      const systemInstruction = buildNursingSystemInstruction(
        profile,
        settings,
        examTomorrowTriggered
      );

      // Use gemini-4-hydrogen ONLY for advanced clinical reasoning when available;
      // use gemini-3.1-flash-lite directly for educational generation & fast Q&A.
      const useReasoningPrimary = requiresAdvancedReasoning(lastUserMessage);
      const firstModel = useReasoningPrimary ? REASONING_GEMINI_MODEL : EDUCATIONAL_GEMINI_MODEL;
      const firstTimeout = useReasoningPrimary
        ? REASONING_STREAM_TIMEOUT_MS
        : EDUCATIONAL_STREAM_TIMEOUT_MS;

      let activeStream: Awaited<ReturnType<typeof startModelStream>>;
      try {
        activeStream = await startModelStream(
          ai,
          firstModel,
          contents,
          systemInstruction,
          firstTimeout
        );
      } catch (primaryErr) {
        if (closed || res.writableEnded) return;
        if (!isGeminiBusyOrTimeoutError(primaryErr)) {
          throw primaryErr;
        }
        const fallbackModel =
          firstModel === REASONING_GEMINI_MODEL
            ? EDUCATIONAL_GEMINI_MODEL
            : EDUCATIONAL_GEMINI_MODEL;
        console.warn(
          `Chat model ${firstModel} unavailable/timed out; using ${fallbackModel}:`,
          extractGeminiError(primaryErr, 'unavailable')
        );
        res.write(`data: ${JSON.stringify({ status: 'fallback', model: fallbackModel })}\n\n`);
        activeStream = await startModelStream(
          ai,
          fallbackModel,
          contents,
          systemInstruction,
          EDUCATIONAL_STREAM_TIMEOUT_MS
        );
      }

      for (const buffered of activeStream.bufferedTexts) {
        if (closed || res.writableEnded) break;
        res.write(`data: ${JSON.stringify({ text: buffered })}\n\n`);
      }

      if (!activeStream.finished) {
        while (!closed && !res.writableEnded) {
          const step = await activeStream.iterator.next();
          if (step.done) break;
          const text = step.value?.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }
      }

      if (!closed && !res.writableEnded) {
        res.write(`data: ${JSON.stringify({ done: true, model: activeStream.model })}\n\n`);
        res.end();
      }
    } catch (err: unknown) {
      const isBusy = isGeminiBusyOrTimeoutError(err);
      const message = isBusy
        ? AI_BUSY_MESSAGE
        : extractGeminiError(err, 'Failed to generate clinical response.');
      console.error('Gemini API error:', err);
      if (!closed && !res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({ error: message, code: isBusy ? 'AI_BUSY' : 'GENERIC' })}\n\n`
        );
        res.end();
      }
    } finally {
      if (!res.writableEnded) {
        res.end();
      }
    }
  });

  app.post('/api/generate/flashcards', async (req, res) => {
    const { topic, count, focus, profile, language } = req.body as {
      topic?: string;
      count?: number;
      focus?: string;
      profile?: ProfilePayload;
      language?: 'en' | 'ar';
    };

    const trimmedTopic = sanitizeTopicInput(topic);
    if (!trimmedTopic) {
      res.status(400).json({ error: 'Please enter a nursing topic or paste study notes.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured. Please add your key in the Settings > Secrets panel.',
      });
      return;
    }

    const cardCount = clampCount(count, 3, 15, 8);
    const focusLabel = focus?.trim() || 'Clinical Nursing';
    const academicYear = profile?.academicYear?.trim() || '3rd Year BSN';

    try {
      const ai = getAiClient();
      const stamp = Date.now();

      const result = await generateEducationalJson(
        ai,
        {
          contents: `Create ${cardCount} high-yield nursing flashcards (${academicYear}, focus: ${focusLabel}) on:\n${trimmedTopic}`,
          systemInstruction: `MUST University nursing study coach. ${getGeneratorLanguageDirective(language)} Keep each front to 1 focused clinical prompt, back to a crisp 1-2 sentence answer, and clinicalPearl to 1 short safety tip with an emoji.`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING },
                    clinicalPearl: { type: Type.STRING },
                  },
                  required: ['front', 'back', 'clinicalPearl'],
                },
              },
            },
            required: ['title', 'subject', 'cards'],
          },
        },
        (raw) => {
          if (!raw || typeof raw !== 'object') return null;
          const obj = raw as Record<string, unknown>;
          const cards = normalizeFlashcardList(obj.cards, stamp, 'fc');
          if (cards.length === 0) return null;
          return {
            title:
              typeof obj.title === 'string' && obj.title.trim()
                ? obj.title.trim()
                : trimmedTopic.slice(0, 48),
            subject:
              typeof obj.subject === 'string' && obj.subject.trim()
                ? obj.subject.trim()
                : focusLabel,
            cards: cards.map((c) => ({ ...c, mastered: false })),
          };
        }
      );

      res.json(result);
    } catch (err: unknown) {
      console.error('Flashcard generation error:', err);
      const isBusy = isGeminiBusyOrTimeoutError(err);
      res.status(isBusy ? 503 : 500).json({
        error: isBusy ? AI_BUSY_MESSAGE : extractGeminiError(err, 'Failed to generate flashcards.'),
      });
    }
  });

  app.post('/api/generate/mcq', async (req, res) => {
    const { topic, count, difficulty, profile, language } = req.body as {
      topic?: string;
      count?: number;
      difficulty?: string;
      profile?: ProfilePayload;
      language?: 'en' | 'ar';
    };

    const trimmedTopic = sanitizeTopicInput(topic);
    if (!trimmedTopic) {
      res.status(400).json({ error: 'Please enter a nursing topic or clinical notes.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured. Please add your key in the Settings > Secrets panel.',
      });
      return;
    }

    const questionCount = clampCount(count, 3, 12, 5);
    const levelLabel = difficulty?.trim() || 'Clinical Application';
    const academicYear = profile?.academicYear?.trim() || '3rd Year BSN';

    try {
      const ai = getAiClient();
      const stamp = Date.now();

      const result = await generateEducationalJson(
        ai,
        {
          contents: `Create ${questionCount} concise NCLEX/MUST nursing MCQs (${levelLabel}, ${academicYear}) on:\n${trimmedTopic}`,
          systemInstruction: `MUST University nursing exam coach. ${getGeneratorLanguageDirective(language)} Keep each stem 1-2 sentences, 4 short options (<12 words each), 0-based correctIndex (0-3), 1-sentence rationale with an emoji, and 1-sentence distractorNote.`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stem: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctIndex: { type: Type.INTEGER },
                    rationale: { type: Type.STRING },
                    distractorNote: { type: Type.STRING },
                  },
                  required: ['stem', 'options', 'correctIndex', 'rationale', 'distractorNote'],
                },
              },
            },
            required: ['title', 'subject', 'questions'],
          },
        },
        (raw) => {
          if (!raw || typeof raw !== 'object') return null;
          const obj = raw as Record<string, unknown>;
          const questions = normalizeMcqList(obj.questions, stamp, 'mcq');
          if (questions.length === 0) return null;
          return {
            title:
              typeof obj.title === 'string' && obj.title.trim()
                ? obj.title.trim()
                : trimmedTopic.slice(0, 48),
            subject:
              typeof obj.subject === 'string' && obj.subject.trim()
                ? obj.subject.trim()
                : 'Medical-Surgical Nursing',
            questions,
          };
        }
      );

      res.json(result);
    } catch (err: unknown) {
      console.error('MCQ generation error:', err);
      const isBusy = isGeminiBusyOrTimeoutError(err);
      res.status(isBusy ? 503 : 500).json({
        error: isBusy ? AI_BUSY_MESSAGE : extractGeminiError(err, 'Failed to generate MCQ quiz.'),
      });
    }
  });

  app.post('/api/generate/true-false', async (req, res) => {
    const { topic, count, difficulty, profile, language } = req.body as {
      topic?: string;
      count?: number;
      difficulty?: string;
      profile?: ProfilePayload;
      language?: 'en' | 'ar';
    };

    const trimmedTopic = sanitizeTopicInput(topic);
    if (!trimmedTopic) {
      res.status(400).json({ error: 'Please enter a nursing topic or clinical notes.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured. Please add your key in the Settings > Secrets panel.',
      });
      return;
    }

    const statementCount = clampCount(count, 3, 15, 6);
    const levelLabel = difficulty?.trim() || 'Clinical Safety';
    const academicYear = profile?.academicYear?.trim() || '3rd Year BSN';

    try {
      const ai = getAiClient();
      const stamp = Date.now();

      const result = await generateEducationalJson(
        ai,
        {
          contents: `Create ${statementCount} concise nursing True/False items (${levelLabel}, ${academicYear}) on:\n${trimmedTopic}`,
          systemInstruction: `MUST University nursing tutor. ${getGeneratorLanguageDirective(language)} Mix true and false clinical statements. Keep each statement 1 short sentence, explanation 1 short sentence (<20 words), and keyTakeaway 1 short rule with an emoji.`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              statements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    statement: { type: Type.STRING },
                    isTrue: { type: Type.BOOLEAN },
                    explanation: { type: Type.STRING },
                    keyTakeaway: { type: Type.STRING },
                  },
                  required: ['statement', 'isTrue', 'explanation', 'keyTakeaway'],
                },
              },
            },
            required: ['title', 'subject', 'statements'],
          },
        },
        (raw) => {
          if (!raw || typeof raw !== 'object') return null;
          const obj = raw as Record<string, unknown>;
          const statements = normalizeTrueFalseList(obj.statements, stamp, 'tf');
          if (statements.length === 0) return null;
          return {
            title:
              typeof obj.title === 'string' && obj.title.trim()
                ? obj.title.trim()
                : trimmedTopic.slice(0, 48),
            subject:
              typeof obj.subject === 'string' && obj.subject.trim()
                ? obj.subject.trim()
                : 'Clinical Pharmacology',
            statements,
          };
        }
      );

      res.json(result);
    } catch (err: unknown) {
      console.error('True/False generation error:', err);
      const isBusy = isGeminiBusyOrTimeoutError(err);
      res.status(isBusy ? 503 : 500).json({
        error: isBusy
          ? AI_BUSY_MESSAGE
          : extractGeminiError(err, 'Failed to generate True/False drill.'),
      });
    }
  });

  app.post('/api/exam/tomorrow-pack', async (req, res) => {
    const { topic, examType, isExamTomorrow, profile, language } = req.body as {
      topic?: string;
      examType?: string;
      isExamTomorrow?: boolean;
      profile?: ProfilePayload;
      language?: 'en' | 'ar';
    };

    const trimmedTopic = sanitizeTopicInput(topic);
    if (!trimmedTopic) {
      res.status(400).json({ error: 'Please enter an exam subject, course, or syllabus topics.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured. Please add your key in the Settings > Secrets panel.',
      });
      return;
    }

    const academicYear = profile?.academicYear?.trim() || '3rd Year BSN';
    const examLabel = examType?.trim() || 'Midterm';
    const modeTag = isExamTomorrow ? 'EXAM TOMORROW SPRINT' : 'HIGH-YIELD EXAM PREP';
    const langDirective = getGeneratorLanguageDirective(language);
    const stamp = Date.now();
    const validCategories = new Set([
      'Pharmacology',
      'Lab Thresholds',
      'Priority Signs',
      'Procedures',
    ]);

    try {
      const ai = getAiClient();

      // Run 2 balanced parallel calls on gemini-3.1-flash-lite to avoid concurrent rate limits while keeping speed high
      const overviewPromise = generateEducationalJson(
        ai,
        {
          contents: `${modeTag} (${examLabel}, ${academicYear}). Topic:\n${trimmedTopic}\nReturn: title, subject, quickSummary (1-2 sentence overview, 4 short priorityActions, 3 short criticalAlerts, 3 labThresholds), 3 smartNotes (3 short bullets + mnemonic each), 6 short keywords.`,
          systemInstruction: `MUST University nursing exam coach. ${langDirective} Be very concise (under 15 words per bullet/tip, natural emojis). keywords[].category MUST be exact English: "Pharmacology", "Lab Thresholds", "Priority Signs", or "Procedures".`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              quickSummary: {
                type: Type.OBJECT,
                properties: {
                  overview: { type: Type.STRING },
                  priorityActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  criticalAlerts: { type: Type.ARRAY, items: { type: Type.STRING } },
                  labThresholds: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        parameter: { type: Type.STRING },
                        normalRange: { type: Type.STRING },
                        criticalAction: { type: Type.STRING },
                      },
                      required: ['parameter', 'normalRange', 'criticalAction'],
                    },
                  },
                },
                required: ['overview', 'priorityActions', 'criticalAlerts', 'labThresholds'],
              },
              smartNotes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    mnemonicOrAnchor: { type: Type.STRING },
                  },
                  required: ['heading', 'bulletPoints', 'mnemonicOrAnchor'],
                },
              },
              keywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    category: { type: Type.STRING },
                    highYieldDefinition: { type: Type.STRING },
                    examTip: { type: Type.STRING },
                  },
                  required: ['term', 'category', 'highYieldDefinition', 'examTip'],
                },
              },
            },
            required: ['title', 'subject', 'quickSummary', 'smartNotes', 'keywords'],
          },
        },
        (raw) => {
          if (!raw || typeof raw !== 'object') return null;
          const obj = raw as Record<string, unknown>;
          const qs = obj.quickSummary as Record<string, unknown> | undefined;
          if (!qs || typeof qs !== 'object') return null;

          const overview = typeof qs.overview === 'string' ? qs.overview.trim() : '';
          const priorityActions = Array.isArray(qs.priorityActions)
            ? qs.priorityActions.map((x) => String(x ?? '').trim()).filter(Boolean)
            : [];
          const criticalAlerts = Array.isArray(qs.criticalAlerts)
            ? qs.criticalAlerts.map((x) => String(x ?? '').trim()).filter(Boolean)
            : [];
          const labThresholds = Array.isArray(qs.labThresholds)
            ? qs.labThresholds
                .map((l) => {
                  if (!l || typeof l !== 'object') return null;
                  const lab = l as Record<string, unknown>;
                  const parameter = String(lab.parameter ?? '').trim();
                  const normalRange = String(lab.normalRange ?? '').trim();
                  const criticalAction = String(lab.criticalAction ?? '').trim();
                  if (!parameter) return null;
                  return { parameter, normalRange, criticalAction };
                })
                .filter((x): x is NonNullable<typeof x> => x !== null)
            : [];

          const smartNotes = Array.isArray(obj.smartNotes)
            ? obj.smartNotes
                .map((n, idx) => {
                  if (!n || typeof n !== 'object') return null;
                  const note = n as Record<string, unknown>;
                  const heading = String(note.heading ?? '').trim();
                  if (!heading) return null;
                  const bulletPoints = Array.isArray(note.bulletPoints)
                    ? note.bulletPoints.map((b) => String(b ?? '').trim()).filter(Boolean)
                    : [];
                  const mnemonicOrAnchor = String(note.mnemonicOrAnchor ?? '').trim();
                  return {
                    id: `sn-${stamp}-${idx}`,
                    heading,
                    bulletPoints,
                    mnemonicOrAnchor: mnemonicOrAnchor || 'Focus on ABCs & patient safety.',
                    reviewed: false,
                  };
                })
                .filter((x): x is NonNullable<typeof x> => x !== null)
            : [];

          const keywords = Array.isArray(obj.keywords)
            ? obj.keywords
                .map((k, idx) => {
                  if (!k || typeof k !== 'object') return null;
                  const kw = k as Record<string, unknown>;
                  const term = String(kw.term ?? '').trim();
                  if (!term) return null;
                  const cat = String(kw.category ?? '').trim();
                  return {
                    id: `kw-${stamp}-${idx}`,
                    term,
                    category: validCategories.has(cat) ? cat : 'Priority Signs',
                    highYieldDefinition: String(kw.highYieldDefinition ?? '').trim(),
                    examTip: String(kw.examTip ?? '').trim(),
                    mastered: false,
                  };
                })
                .filter((x): x is NonNullable<typeof x> => x !== null)
            : [];

          if (!overview && priorityActions.length === 0 && keywords.length === 0) return null;

          return {
            title:
              typeof obj.title === 'string' && obj.title.trim()
                ? obj.title.trim()
                : trimmedTopic.slice(0, 48),
            subject:
              typeof obj.subject === 'string' && obj.subject.trim()
                ? obj.subject.trim()
                : 'Clinical Nursing',
            quickSummary: {
              overview: overview || `High-yield exam review for ${trimmedTopic.slice(0, 60)}.`,
              priorityActions,
              criticalAlerts,
              labThresholds,
            },
            smartNotes,
            keywords,
          };
        }
      );

      const drillsPromise = generateEducationalJson(
        ai,
        {
          contents: `${modeTag} (${examLabel}, ${academicYear}). Topic: ${trimmedTopic}\nReturn: 4 concise MCQs (1-2 sentence stem, 4 short options, correctIndex 0-3, 1-sentence rationale & distractorNote), 4 concise True/False items, 4 concise revisionCards.`,
          systemInstruction: `MUST University nursing exam coach. ${langDirective} Keep every item brief and punchy (<18 words per explanation/rationale) with natural emojis.`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mcqs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stem: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctIndex: { type: Type.INTEGER },
                    rationale: { type: Type.STRING },
                    distractorNote: { type: Type.STRING },
                  },
                  required: ['stem', 'options', 'correctIndex', 'rationale', 'distractorNote'],
                },
              },
              trueFalse: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    statement: { type: Type.STRING },
                    isTrue: { type: Type.BOOLEAN },
                    explanation: { type: Type.STRING },
                    keyTakeaway: { type: Type.STRING },
                  },
                  required: ['statement', 'isTrue', 'explanation', 'keyTakeaway'],
                },
              },
              revisionCards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING },
                    back: { type: Type.STRING },
                    clinicalPearl: { type: Type.STRING },
                  },
                  required: ['front', 'back', 'clinicalPearl'],
                },
              },
            },
            required: ['mcqs', 'trueFalse', 'revisionCards'],
          },
        },
        (raw) => {
          if (!raw || typeof raw !== 'object') return null;
          const obj = raw as Record<string, unknown>;
          const mcqs = normalizeMcqList(obj.mcqs, stamp, 'ex-mcq');
          const trueFalse = normalizeTrueFalseList(obj.trueFalse, stamp, 'ex-tf');
          const revisionCards = normalizeFlashcardList(obj.revisionCards, stamp, 'ex-rc').map(
            (c) => ({ ...c, confident: false })
          );
          if (mcqs.length === 0 && trueFalse.length === 0 && revisionCards.length === 0) {
            return null;
          }
          return { mcqs, trueFalse, revisionCards };
        }
      );

      const [overviewResult, drillsResult] = await Promise.allSettled([
        overviewPromise,
        drillsPromise,
      ]);

      if (overviewResult.status === 'rejected' && drillsResult.status === 'rejected') {
        throw overviewResult.reason;
      }

      const overviewData =
        overviewResult.status === 'fulfilled'
          ? overviewResult.value
          : {
              title: trimmedTopic.slice(0, 48),
              subject: 'Clinical Nursing',
              quickSummary: {
                overview: `High-yield exam revision pack for ${trimmedTopic}.`,
                priorityActions: [
                  'Prioritize Airway, Breathing, and Circulation (ABCs) before secondary interventions.',
                  'Verify baseline vital signs and lab thresholds prior to high-alert medications.',
                ],
                criticalAlerts: [
                  'Monitor for acute clinical deterioration, drug toxicity, and electrolyte shifts.',
                ],
                labThresholds: [],
              },
              smartNotes: [],
              keywords: [],
            };

      const drillsData =
        drillsResult.status === 'fulfilled'
          ? drillsResult.value
          : { mcqs: [], trueFalse: [], revisionCards: [] };

      res.json({
        id: `pack-${stamp}`,
        topic: trimmedTopic,
        title: overviewData.title,
        subject: overviewData.subject,
        generatedAt: new Date().toISOString(),
        isExamTomorrowSprint: Boolean(isExamTomorrow),
        quickSummary: overviewData.quickSummary,
        smartNotes: overviewData.smartNotes,
        keywords: overviewData.keywords,
        mcqs: drillsData.mcqs,
        trueFalse: drillsData.trueFalse,
        revisionCards: drillsData.revisionCards,
      });
    } catch (err: unknown) {
      console.error('Exam Tomorrow Pack generation error:', err);
      const isBusy = isGeminiBusyOrTimeoutError(err);
      res.status(isBusy ? 503 : 500).json({
        error: isBusy
          ? AI_BUSY_MESSAGE
          : extractGeminiError(err, 'Failed to generate Exam Tomorrow Pack.'),
      });
    }
  });

  app.post('/api/exam/recommendations', async (req, res) => {
    const { profile, snapshot, language } = req.body as {
      profile?: ProfilePayload;
      language?: 'en' | 'ar';
      snapshot?: {
        upcomingExams?: Array<{ title: string; subject: string; hoursUntil: number; topics: string }>;
        subjectPerformance?: Array<{ subject: string; quizAccuracyPct: number | null; cardMasteryPct: number | null }>;
        pendingTaskCount?: number;
        totalLoggedMinutes?: number;
      };
    };

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY is not configured. Please add your key in the Settings > Secrets panel.',
      });
      return;
    }

    const academicYear = profile?.academicYear?.trim() || '3rd Year BSN';
    const rotation = profile?.clinicalRotation?.trim() || 'Medical-Surgical';
    const validPriorities = new Set(['Urgent', 'High', 'Maintain']);
    const validActions = new Set(['exam_tomorrow', 'mcq', 'truefalse', 'flashcards', 'summary']);

    try {
      const ai = getAiClient();
      const stamp = Date.now();

      const result = await generateEducationalJson(
        ai,
        {
          contents: `Student: ${academicYear}, ${rotation}. Snapshot: ${JSON.stringify(snapshot || {})}\nGive 4 concise study recommendations.`,
          systemInstruction: `MUST University nursing coach. ${language === 'ar' ? 'Write focusSummary, title, reason, and suggestedTopic in Arabic (keep clinical terms in EN when helpful).' : ''} Keep priority exact: "Urgent", "High", or "Maintain". Keep actionType exact: "exam_tomorrow", "mcq", "truefalse", "flashcards", or "summary". Prioritize exams <=48h then lowest quiz accuracy.`,
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              focusSummary: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    priority: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    title: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    actionType: { type: Type.STRING },
                    suggestedTopic: { type: Type.STRING },
                    estimatedMinutes: { type: Type.INTEGER },
                  },
                  required: [
                    'priority',
                    'subject',
                    'title',
                    'reason',
                    'actionType',
                    'suggestedTopic',
                    'estimatedMinutes',
                  ],
                },
              },
            },
            required: ['focusSummary', 'recommendations'],
          },
        },
        (raw) => {
          if (!raw || typeof raw !== 'object') return null;
          const obj = raw as Record<string, unknown>;
          const recs = Array.isArray(obj.recommendations)
            ? obj.recommendations
                .map((r, idx) => {
                  if (!r || typeof r !== 'object') return null;
                  const rec = r as Record<string, unknown>;
                  const title = String(rec.title ?? '').trim();
                  if (!title) return null;
                  const priority = String(rec.priority ?? '').trim();
                  const actionType = String(rec.actionType ?? '').trim();
                  return {
                    id: `rec-${stamp}-${idx}`,
                    priority: validPriorities.has(priority) ? priority : 'High',
                    subject: String(rec.subject ?? '').trim() || 'Clinical Nursing',
                    title,
                    reason: String(rec.reason ?? '').trim(),
                    actionType: validActions.has(actionType) ? actionType : 'exam_tomorrow',
                    suggestedTopic: String(rec.suggestedTopic ?? '').trim() || title,
                    estimatedMinutes: clampCount(rec.estimatedMinutes, 10, 90, 25),
                  };
                })
                .filter((x): x is NonNullable<typeof x> => x !== null)
            : [];

          if (recs.length === 0) return null;
          return {
            generatedAt: new Date().toISOString(),
            focusSummary:
              typeof obj.focusSummary === 'string' && obj.focusSummary.trim()
                ? obj.focusSummary.trim()
                : 'Prioritize upcoming exams within 48 hours and target weaker clinical domains with active recall.',
            recommendations: recs,
          };
        }
      );

      res.json(result);
    } catch (err: unknown) {
      console.error('Exam recommendations error:', err);
      const isBusy = isGeminiBusyOrTimeoutError(err);
      res.status(isBusy ? 503 : 500).json({
        error: isBusy
          ? AI_BUSY_MESSAGE
          : extractGeminiError(err, 'Failed to generate personalized recommendations.'),
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PulseMind AI server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
