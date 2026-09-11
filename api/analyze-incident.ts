import { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

// Helper for procedural contextual fallback if Gemini is offline/unconfigured
function generateProceduralAnalysis(data: {
  incidentText: string;
  category: string;
  timeElapsed: string;
  actor: string;
  initialPanic: number;
  symptoms: string[];
}) {
  const text = (data.incidentText || "The mysterious incident").trim();
  const actor = data.actor || "The other person";
  const category = data.category || "social";
  const time = data.timeElapsed || "recently";
  const symptomsCount = data.symptoms?.length || 3;
  const panicBase = Math.min(240, Math.max(120, (data.initialPanic || 65) * 2 + symptomsCount * 12));

  // Determine specific keyword triggers
  const lower = text.toLowerCase();
  const isPunctuation = lower.includes("period") || lower.includes("dot") || lower.includes(".") || lower.includes("comma");
  const isTexting = lower.includes("text") || lower.includes("message") || lower.includes("reply") || lower.includes("seen") || lower.includes("read") || lower.includes("dm") || lower.includes("typing");
  const isWork = category === "work" || lower.includes("boss") || lower.includes("slack") || lower.includes("meeting") || lower.includes("email");
  const isSocialGaffe = lower.includes("wave") || lower.includes("you too") || lower.includes("trip") || lower.includes("stumble") || lower.includes("like");

  return {
    incidentTitle: `CASE #${Math.floor(1000 + Math.random() * 9000)}: THE ${category.toUpperCase()} CRISIS`,
    caseNumber: `OT-${Math.floor(100000 + Math.random() * 900000)}`,
    severityLabel: panicBase > 190 ? "DEFCON 1: MAXIMUM PARANOIA" : panicBase > 150 ? "SEVERE: HIGH-OCTANE RUMINATION" : "ELEVATED: ACTIVE SPIRAL",
    panicScore: panicBase,
    executiveDiagnosis: `Subject has converted a single, ambiguous stimulus involving ${actor} (${time}) into a multi-season psychological thriller where subject is on trial for social malpractice. Current rational cognitive function estimated at 8.4%.`,
    translationMatrix: [
      {
        actualEvent: text.length > 55 ? `"${text.slice(0, 52)}..."` : `"${text}"`,
        brainInterpretation: `"${actor} has secretly convened a committee of peers to discuss my complete expulsion from society."`,
        dangerRating: "98.7% Imagined Lethality"
      },
      {
        actualEvent: `${actor} took ${time} to respond or didn't elaborate.`,
        brainInterpretation: `"They are currently drafting a 14-page manifesto explaining every flaw in my personality since 2017."`,
        dangerRating: "Fatal to Ego"
      },
      {
        actualEvent: "A standard neutral interpersonal exchange occurred.",
        brainInterpretation: `"The slight modulation in their pitch / punctuation was an encrypted insult directed specifically at my lineage."`,
        dangerRating: "Permanent Cringe Index"
      }
    ],
    threeTimelines: {
      reality: {
        title: "Timeline 1: The Extremely Boring Reality",
        probability: "94.2%",
        description: `${actor} literally put their phone face-down to eat a sandwich, opened a microwave, or simply sneezed. They have zero memory of whatever slight you have built a courtroom around.`
      },
      paranoid: {
        title: "Timeline 2: The Semi-Hostile Conspiracy",
        probability: "5.7%",
        description: `${actor} noticed your message/interaction, felt mildly indifferent, thought 'I will deal with this later,' and promptly forgot for the next 4 business days.`
      },
      apocalyptic: {
        title: "Timeline 3: Nuclear Social Excommunication",
        probability: "0.1%",
        description: `${actor} has contacted interpol, changed their legal name, and is currently holding a press conference regarding your unforgivable behavior.`
      }
    },
    brainAllocation: [
      {
        label: isPunctuation ? "Analyzing Punctuation & Tone" : isTexting ? "Screening Typing Indicators" : "Micro-analyzing Facial Micro-expressions",
        percentage: 42,
        color: "#ff5fd1"
      },
      {
        label: "Replaying Alternate Rebuttals in Shower",
        percentage: 28,
        color: "#ffd23f"
      },
      {
        label: "Drafting Apology Speeches I Will Never Send",
        percentage: 22,
        color: "#9b7bff"
      },
      {
        label: "Actual Objective Facts & Solutions",
        percentage: 8,
        color: "#5dffa8"
      }
    ],
    microAudit: [
      {
        clue: isTexting ? "Response latency & typography" : "Non-verbal transmission",
        overthinkingObsession: "Subject believes the missing exclamation mark represents calculated disdain.",
        rationalVerdict: "They were walking to their car in the rain with one hand."
      },
      {
        clue: `Interaction with ${actor}`,
        overthinkingObsession: "Assumes everyone in the room / group chat noticed and is whispering.",
        rationalVerdict: "Literally no one registered this except your hyperactive amygdala."
      }
    ],
    certifiedPrescription: `Prescribed Protocol: Put down the electronic device immediately. Drink one (1) large glass of room-temperature water. Lay flat on the rug for 6 minutes. Remind yourself that people think about you approximately 0.003% as much as you think they do.`,
    recommendedWheelOptions: [
      "Drink a glass of cold water right now",
      "Put your phone in another room for 30 minutes",
      "Close your eyes and breathe in for 4, hold for 4, out for 4",
      "Text a totally unrelated friend a funny meme",
      "Do 15 frantic jumping jacks to shake off adrenaline",
      "Stare blankly at a wall until your brain reboots"
    ],
    humorousNotes: [
      "Reminder: Your brain is currently a fiction author with an unlimited special effects budget.",
      "Odds of anyone bringing this up at your funeral: 0.0000001%.",
      "Status: Re-read threshold critically exceeded. Abort mission."
    ]
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { incidentText, category, timeElapsed, actor, initialPanic, symptoms } = req.body || {};

  if (!incidentText || typeof incidentText !== "string" || incidentText.trim().length === 0) {
    return res.status(400).json({ error: "Incident description is required." });
  }

  // Check if Gemini API key exists
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the world's premier forensic psychologist specializing in satirical, hilarious, hyper-detailed overthinking analysis.
The user is experiencing high anxiety over a specific personal incident.

Incident details:
- Incident Description: "${incidentText}"
- Category: ${category || "General"}
- Other Person Involved: ${actor || "Unknown"}
- Time Elapsed: ${timeElapsed || "Recently"}
- Self-Reported Panic: ${initialPanic || 50}/100
- Confirmed Overthinking Symptoms: ${(symptoms || []).join(", ") || "None specified"}

Generate a customized, witty, deeply satirical forensic case analysis in STRICT JSON FORMAT.
Do NOT wrap the output in markdown codeblocks if possible, or provide valid raw JSON.
JSON format requirements:
{
  "incidentTitle": "string (funny dramatic case title)",
  "caseNumber": "string (e.g. OT-93821)",
  "severityLabel": "string (e.g. DEFCON 1: CATASTROPHIC SPIRAL)",
  "panicScore": number (calculated overthinking percentage, e.g. 185 to 250),
  "executiveDiagnosis": "string (2-3 sentences diagnosing their overthinking with dry psychiatric humor)",
  "translationMatrix": [
    {
      "actualEvent": "string (what literally happened)",
      "brainInterpretation": "string (the unhinged paranoid narrative the brain created)",
      "dangerRating": "string (humorous doom rating)"
    },
    {
      "actualEvent": "string",
      "brainInterpretation": "string",
      "dangerRating": "string"
    },
    {
      "actualEvent": "string",
      "brainInterpretation": "string",
      "dangerRating": "string"
    }
  ],
  "threeTimelines": {
    "reality": {
      "title": "Timeline 1: The Extremely Boring Reality",
      "probability": "string (e.g. 93.4%)",
      "description": "string (why nothing is wrong)"
    },
    "paranoid": {
      "title": "Timeline 2: The Mild Social Friction",
      "probability": "string (e.g. 6.5%)",
      "description": "string (the mildly awkward but totally survivable middle ground)"
    },
    "apocalyptic": {
      "title": "Timeline 3: Nuclear Social Excommunication",
      "probability": "string (e.g. 0.1%)",
      "description": "string (the wildly exaggerated catastrophic conclusion)"
    }
  },
  "brainAllocation": [
    { "label": "string", "percentage": number, "color": "#ff5fd1" },
    { "label": "string", "percentage": number, "color": "#ffd23f" },
    { "label": "string", "percentage": number, "color": "#9b7bff" },
    { "label": "string", "percentage": number, "color": "#5dffa8" }
  ],
  "microAudit": [
    { "clue": "string", "overthinkingObsession": "string", "rationalVerdict": "string" },
    { "clue": "string", "overthinkingObsession": "string", "rationalVerdict": "string" }
  ],
  "certifiedPrescription": "string (satirical yet soothing directive on what to do right now)",
  "recommendedWheelOptions": [
    "string (coping action 1)",
    "string (coping action 2)",
    "string (coping action 3)",
    "string (coping action 4)",
    "string (coping action 5)",
    "string (coping action 6)"
  ],
  "humorousNotes": [
    "string",
    "string",
    "string"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.85,
        }
      });

      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return res.status(200).json({ source: "gemini", data: parsed });
      }
    } catch (err) {
      console.warn("Gemini call failed or timed out, using high-fidelity procedural engine:", err);
    }
  }

  // High-fidelity procedural fallback tailored to the incident
  const fallback = generateProceduralAnalysis({
    incidentText,
    category: category || "social",
    timeElapsed: timeElapsed || "recently",
    actor: actor || "The other person",
    initialPanic: Number(initialPanic) || 60,
    symptoms: Array.isArray(symptoms) ? symptoms : []
  });

  return res.status(200).json({ source: "procedural", data: fallback });
}
