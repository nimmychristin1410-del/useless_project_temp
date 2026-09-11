import React from "react";
import { IncidentFormData, IncidentCategory } from "../types";
import { INCIDENT_PRESETS, CATEGORY_LABELS } from "../data/incidentData";
import { sound } from "../utils/soundEngine";
import { Sparkles, Sliders, AlertOctagon, User, Clock, ArrowRight, ShieldQuestion } from "lucide-react";

interface IncidentCustomizerScreenProps {
  formData: IncidentFormData;
  onChange: (updated: Partial<IncidentFormData>) => void;
  onProceed: () => void;
}

export const IncidentCustomizerScreen: React.FC<IncidentCustomizerScreenProps> = ({
  formData,
  onChange,
  onProceed
}) => {
  const handleSelectPreset = (presetId: string) => {
    sound.playClick();
    const found = INCIDENT_PRESETS.find((p) => p.id === presetId);
    if (found) {
      onChange(found.data);
    }
  };

  const handleCategorySelect = (cat: IncidentCategory) => {
    sound.playClick();
    onChange({ category: cat });
  };

  const getPanicDescription = (val: number) => {
    if (val < 35) return "Mild curiosity with minor overthinking";
    if (val < 65) return "Noticeable anxiety, 3 simulated conversations";
    if (val < 85) return "Full DEFCON 2: Re-reading old texts, analyzing commas";
    return "MAXIMUM DOOM: Drafting apology letter, considering moving continents";
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-3 sm:px-4 animate-in fade-in duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#ff5fd1] tracking-widest border border-[#ff5fd1]/40 rounded-full px-3 py-1 mb-2 bg-[#ff5fd1]/10">
          <Sliders className="w-3 h-3" /> STEP 1 OF 4 — INCIDENT SPECIFICATION
        </div>
        <h2 className="font-['Unbounded',sans-serif] font-bold text-2xl sm:text-3xl text-[#f3f1ea]">
          CUSTOMIZE YOUR INCIDENT
        </h2>
        <p className="text-xs sm:text-sm text-[#948f9c] font-mono mt-1">
          Tell us what happened. The calculator will tailor its forensic breakdown to your exact situation.
        </p>
      </div>

      {/* Quick Presets Carousel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] text-[#ffd23f] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> QUICK-LOAD COMMON CRISES:
          </span>
          <span className="font-mono text-[10px] text-[#948f9c]">Tap to populate</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {INCIDENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-[#312d38] bg-[#151318] hover:border-[#ff5fd1] hover:bg-[#1f1925] text-left transition-all text-xs font-mono group"
            >
              <div className="text-[#f3f1ea] group-hover:text-[#ffd7f4] font-medium">{preset.name}</div>
              <div className="text-[10px] text-[#ff5fd1]">{preset.badge}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Grid */}
      <div className="mb-6">
        <label className="block font-mono text-xs text-[#948f9c] mb-2">
          CRISIS CLASSIFICATION:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(CATEGORY_LABELS) as IncidentCategory[]).map((cat) => {
            const item = CATEGORY_LABELS[cat];
            const isSelected = formData.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[#ff5fd1] bg-[#ff5fd1]/10 shadow-[0_0_12px_rgba(255,95,209,0.15)]"
                    : "border-[#312d38] bg-[#151318] hover:border-[#484252] hover:bg-[#1a1720]"
                }`}
              >
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="font-mono font-bold text-xs text-[#f3f1ea]">{item.label}</div>
                <div className="text-[10.5px] text-[#948f9c] line-clamp-2 mt-0.5 leading-snug">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Incident Text Area */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="incident-text" className="font-mono text-xs font-semibold text-[#f3f1ea] flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-[#ff4545]" />
            WHAT ACTUALLY HAPPENED? (THE CRUCIAL INCIDENT)
          </label>
          <span className="font-mono text-[10px] text-[#5dffa8]">CALCULATOR ENGINE ACTIVE</span>
        </div>
        <textarea
          id="incident-text"
          rows={3}
          value={formData.incidentText}
          onChange={(e) => onChange({ incidentText: e.target.value })}
          placeholder="e.g. She answered with 'ok.' with a period. Just a period. That's it. Now I'm rewriting my entire life path and checking if Mercury is in retrograde..."
          className="w-full bg-[#0d0d10] border border-[#312d38] focus:border-[#ff5fd1] focus:ring-1 focus:ring-[#ff5fd1] rounded-xl p-3.5 text-xs sm:text-sm font-mono text-[#f3f1ea] placeholder-[#605a69] transition-all resize-none"
        />
      </div>

      {/* Contextual Nuances: Actor & Time Elapsed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="incident-actor" className="font-mono text-xs text-[#948f9c] mb-1.5 flex items-center gap-1">
            <User className="w-3 h-3 text-[#9b7bff]" /> WHO WAS ON THE OTHER END?
          </label>
          <input
            id="incident-actor"
            type="text"
            value={formData.actor}
            onChange={(e) => onChange({ actor: e.target.value })}
            placeholder="e.g. Crush, Manager, Best Friend, Stranger"
            className="w-full bg-[#0d0d10] border border-[#312d38] focus:border-[#9b7bff] rounded-lg px-3 py-2 text-xs font-mono text-[#f3f1ea]"
          />
        </div>

        <div>
          <label htmlFor="incident-time" className="font-mono text-xs text-[#948f9c] mb-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#ffd23f]" /> HOW LONG AGO DID THIS OCCUR?
          </label>
          <input
            id="incident-time"
            type="text"
            value={formData.timeElapsed}
            onChange={(e) => onChange({ timeElapsed: e.target.value })}
            placeholder="e.g. 7 minutes ago, 2 hours ago, 2018"
            className="w-full bg-[#0d0d10] border border-[#312d38] focus:border-[#ffd23f] rounded-lg px-3 py-2 text-xs font-mono text-[#f3f1ea]"
          />
        </div>
      </div>

      {/* Primary Trigger Type */}
      <div className="mb-5">
        <label htmlFor="incident-trigger" className="font-mono text-xs text-[#948f9c] mb-1.5 flex items-center gap-1">
          <ShieldQuestion className="w-3 h-3 text-[#5dffa8]" /> SUSPECTED SUB-TRIGGER:
        </label>
        <select
          id="incident-trigger"
          value={formData.triggerType}
          onChange={(e) => {
            sound.playClick();
            onChange({ triggerType: e.target.value });
          }}
          className="w-full bg-[#0d0d10] border border-[#312d38] focus:border-[#5dffa8] rounded-lg px-3 py-2 text-xs font-mono text-[#f3f1ea]"
        >
          <option value="Ominous Punctuation">Ominous Punctuation (Single period, missing exclamation)</option>
          <option value="Latency & Delay">Suspicious Response Latency (Took 43 minutes instead of 2)</option>
          <option value="Mysterious Tone Shift">Sudden Micro-Tone Modulation (Unusually terse)</option>
          <option value="Social Script Collision">Reflex Collision (Said 'You too' at the wrong time)</option>
          <option value="Digital Ghosting">Digital Ghosting (Seen status with no reply)</option>
          <option value="Ambiguous Summons">Ambiguous Summons ('Do you have 5 minutes?')</option>
          <option value="Eye Contact Gaffe">Eye Contact Miscalculation (Waved to wrong person)</option>
        </select>
      </div>

      {/* Panic Level Slider */}
      <div className="bg-[#151318] border border-[#312d38] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs font-semibold text-[#f3f1ea]">INITIAL PANIC RATING:</span>
          <span className="font-mono text-xs font-bold text-[#ff4545]">{formData.initialPanic}%</span>
        </div>
        <input
          id="slider-panic-level"
          type="range"
          min="1"
          max="100"
          value={formData.initialPanic}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (val % 5 === 0) sound.playKeyClick();
            onChange({ initialPanic: val });
          }}
          className="w-full h-2 bg-[#0d0d10] rounded-lg appearance-none cursor-pointer accent-[#ff4545] mb-2"
        />
        <div className="font-mono text-[11px] text-[#ff8a8a] italic">
          "{getPanicDescription(formData.initialPanic)}"
        </div>
      </div>

      {/* Next Step Button */}
      <button
        id="btn-to-symptom-check"
        onClick={() => {
          sound.unlock();
          sound.playClick();
          onProceed();
        }}
        disabled={!formData.incidentText.trim()}
        className="w-full py-4 px-6 rounded-xl font-mono font-bold text-sm bg-[#5dffa8] hover:bg-[#72ffb4] text-[#0a0a0c] shadow-[0_6px_0_#2b8a5c] active:translate-y-1 active:shadow-[0_2px_0_#2b8a5c] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>PROCEED TO SYMPTOM CHECK →</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
