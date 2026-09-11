import { IncidentFormData, IncidentCategory } from "../types";

export interface IncidentPreset {
  id: string;
  name: string;
  badge: string;
  data: IncidentFormData;
}

export const INCIDENT_PRESETS: IncidentPreset[] = [
  {
    id: "fatal-period",
    name: "The Fatal Period ('ok.')",
    badge: "Punctuation Crime",
    data: {
      incidentText: "She replied with 'ok.' with a period. Just a period. That's it. Now I'm rewriting my entire life path and checking if Mercury is in retrograde.",
      category: "romance",
      actor: "Crush / Partner",
      timeElapsed: "7 minutes ago",
      initialPanic: 88,
      triggerType: "Ominous Punctuation"
    }
  },
  {
    id: "slack-ambush",
    name: "The 4:00 PM Slack Ambush",
    badge: "Corporate Dread",
    data: {
      incidentText: "Manager sent a Slack message at 2:03 PM: 'Hey, do you have 5 minutes this afternoon to sync?' without a single hint of what it is about.",
      category: "work",
      actor: "Direct Manager",
      timeElapsed: "25 minutes ago",
      initialPanic: 96,
      triggerType: "Ambiguous Summons"
    }
  },
  {
    id: "left-on-read",
    name: "The Left-on-Read Abyss",
    badge: "Digital Silence",
    data: {
      incidentText: "Sent a vulnerable meme into the friend group chat. 5 people have 'seen' it. Zero replies for 41 minutes. I am being quietly excised from the tribe.",
      category: "social",
      actor: "Group Chat",
      timeElapsed: "41 minutes ago",
      initialPanic: 75,
      triggerType: "Read Receipt Freeze"
    }
  },
  {
    id: "instagram-stalk",
    name: "The 2:00 AM Double-Tap",
    badge: "Digital Footprint",
    data: {
      incidentText: "Was inspecting someone's vacation photos from August 2018 in the dark and my thumb twitched and accidentally liked the photo before I unliked it 0.4 seconds later.",
      category: "lowkey",
      actor: "Acquaintance from 2017",
      timeElapsed: "12 minutes ago",
      initialPanic: 99,
      triggerType: "Accidental Digital Evidence"
    }
  },
  {
    id: "you-too-gaffe",
    name: "The Airport 'You Too!'",
    badge: "Social Malpractice",
    data: {
      incidentText: "TSA security officer handed me my passport and said 'Have a safe flight!' and I confidently smiled and said 'You too!' and then we stared at each other.",
      category: "lowkey",
      actor: "Federal Agent",
      timeElapsed: "2 hours ago",
      initialPanic: 64,
      triggerType: "Automatic Reflex Glitch"
    }
  }
];

export const CATEGORY_LABELS: Record<IncidentCategory, { label: string; icon: string; desc: string }> = {
  serious: {
    label: "SERIOUS CRISIS",
    icon: "🕯️",
    desc: "A genuine adult scenario. Deadlines, life choices, or relationship crossroads requiring high-grade overanalysis."
  },
  lowkey: {
    label: "LOWKEY MENACE",
    icon: "🫠",
    desc: "A micro-awkwardness that no one noticed, but you will replay in 4K resolution at 2:30 AM for 7 years."
  },
  romance: {
    label: "ROMANTIC ANOMALY",
    icon: "💘",
    desc: "Deciphering emojis, response intervals, mysterious lowercase letters, and typing bubble illusions."
  },
  work: {
    label: "WORKPLACE PARANOIA",
    icon: "💼",
    desc: "Calendar invites without agendas, 'quick sync' requests, and missing exclamation marks in emails."
  },
  social: {
    label: "SOCIAL ISOLATION",
    icon: "👥",
    desc: "Group chats gone quiet, wave misfires, unanswered compliments, and imagined whispering."
  }
};

export function getIncidentSymptoms(incidentText: string, category: IncidentCategory): string[] {
  const lower = incidentText.toLowerCase();
  const symptoms: string[] = [];

  if (lower.includes("period") || lower.includes("ok") || lower.includes("short") || lower.includes("k")) {
    symptoms.push("Interpreted a period as an aggressive declaration of war");
    symptoms.push("Compared this text against the last 40 texts to evaluate punctuation density");
    symptoms.push("Wondering if a missing emoji means they secretly despise you");
  }

  if (lower.includes("slack") || lower.includes("boss") || lower.includes("manager") || lower.includes("work") || category === "work") {
    symptoms.push("Mentally rehearsing your resignation speech just in case");
    symptoms.push("Checking your sent emails from the last 3 months for fatal errors");
    symptoms.push("Reviewing your LinkedIn profile and estimating job market survival");
  }

  if (lower.includes("read") || lower.includes("seen") || lower.includes("typing") || lower.includes("ignore")) {
    symptoms.push("Watched the 3 typing bubbles appear, disappear, and re-appear with elevated heart rate");
    symptoms.push("Checked their active status on 2 other social apps to verify online activity");
    symptoms.push("Calculated the exact minute-by-minute delay compared to their historical average");
  }

  if (lower.includes("wave") || lower.includes("you too") || lower.includes("stumble") || lower.includes("trip")) {
    symptoms.push("Considered moving to an unlisted village in northern Norway to start a new life");
    symptoms.push("Replayed the facial expression of the other person in slow motion");
    symptoms.push("Googling whether anyone has ever legally erased their own identity over an awkward greeting");
  }

  // General questions matching category
  const genericQuestions = [
    "Have you replayed the moment more than 5 times in your head?",
    "Did you screenshot this and send it to a friend for forensic analysis?",
    "Are you drafting an explanation or apology that no one asked for?",
    "Are you convinced their tone subtly changed by at least 15%?",
    "Have you asked ChatGPT or Google 'what does it mean when someone says...?'",
    "Did you physically flinch while remembering this interaction?",
    "Are you assuming the worst possible interpretation is 100% the truth?",
    "Are you pacing around your room or staring blankly at the ceiling?"
  ];

  genericQuestions.forEach(q => {
    if (symptoms.length < 10 && !symptoms.includes(q)) {
      symptoms.push(q);
    }
  });

  return symptoms;
}

export const UNHINGED_BONUS_SYMPTOMS = [
  "Have you constructed a 6-node conspiracy board linking this to an event from 2019?",
  "Did you simulate an imaginary shouting match in the shower where you delivered an epic speech?",
  "Have you checked your horoscope to confirm if the universe orchestrated this humiliation?",
  "Are you mentally calculating how many years until everyone who witnessed this passes away?"
];

export const PANIC_TOAST_MESSAGES = [
  "🚨 ALERT: Rational thought capacity dropped to 9.2%",
  "🚨 WARNING: Re-read threshold critically exceeded (8th time)",
  "🚨 NOTICE: Catastrophic simulation engine operating at 100% capacity",
  "🚨 CRITICAL: Dignity levels fluctuating dangerously",
  "🚨 CAUTION: Paranoia matrix detected phantom tone inflection",
  "🚨 SYSTEM ERROR: Emotional defense protocols bypassed"
];
