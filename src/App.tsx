import { useState } from "react";
import { ScreenStep, IncidentFormData, IncidentAnalysisResult } from "./types";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { IncidentCustomizerScreen } from "./components/IncidentCustomizerScreen";
import { ChecklistScreen } from "./components/ChecklistScreen";
import { AnalyzingScreen } from "./components/AnalyzingScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { WheelScreen } from "./components/WheelScreen";
import { SoundControlBar } from "./components/SoundControlBar";
import { sound } from "./utils/soundEngine";
import { Lock } from "lucide-react";

export default function App() {
  const [currentStep, setCurrentStep] = useState<ScreenStep>("welcome");
  const [formData, setFormData] = useState<IncidentFormData>({
    incidentText: "She replied with 'ok.' with a period. Just a period. That's it. Now I'm rewriting my entire life path and checking if Mercury is in retrograde.",
    category: "serious",
    actor: "Crush / Partner",
    timeElapsed: "7 minutes ago",
    initialPanic: 85,
    triggerType: "Ominous Punctuation"
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    "Interpreted a period as an aggressive declaration of war",
    "Have you replayed the moment more than 5 times in your head?"
  ]);
  const [analysisResult, setAnalysisResult] = useState<IncidentAnalysisResult | null>(null);

  const handleUpdateFormData = (updated: Partial<IncidentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updated }));
  };

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleStepTransition = (step: ScreenStep) => {
    sound.unlock();
    sound.playClick();
    setCurrentStep(step);
  };

  const handleAnalysisComplete = (result: IncidentAnalysisResult) => {
    setAnalysisResult(result);
    setCurrentStep("results");
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentStep("customizer");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f3f1ea] py-4 px-2 sm:px-4 flex flex-col items-center justify-center font-sans selection:bg-[#ff5fd1] selection:text-[#0a0a0c]">
      {/* Outer Fake OS / Browser Frame */}
      <div className="w-full max-w-4xl border border-[#312d38] rounded-2xl bg-[#151318] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col min-h-[640px]">
        {/* Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-[#1a1720] to-[#141117] border-b border-[#312d38]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4545] inline-block shadow-sm"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffd23f] inline-block shadow-sm"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#5dffa8] inline-block shadow-sm"></span>
            <span className="ml-2 font-mono text-[11px] text-[#948f9c] truncate max-w-[280px] sm:max-w-md">
              🧠 overthinking_calculator.exe — not responding (as usual)
            </span>
          </div>
          <SoundControlBar />
        </div>

        {/* Tabstrip */}
        <div className="flex gap-1 px-2 pt-1 bg-[#0a0a0c] border-b border-[#312d38] overflow-x-auto scrollbar-none font-mono text-[11px]">
          <div
            onClick={() => handleStepTransition("customizer")}
            className={`cursor-pointer px-3 py-1.5 rounded-t border-t border-x border-[#312d38] transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentStep !== "welcome"
                ? "bg-[#151318] text-[#f3f1ea] border-b-2 border-b-[#ff5fd1]"
                : "text-[#948f9c] hover:text-[#c9c3d6] hover:bg-[#121017]"
            }`}
          >
            <span>Overthinking Calculator</span>
          </div>
          <div className="px-3 py-1.5 text-[#6c6676] border-r border-[#201d26] whitespace-nowrap hidden sm:block">
            why is he like this.pdf
          </div>
          <div className="px-3 py-1.5 text-[#6c6676] border-r border-[#201d26] whitespace-nowrap hidden md:block">
            unread messages (247)
          </div>
          <div className="px-3 py-1.5 text-[#6c6676] border-r border-[#201d26] whitespace-nowrap hidden lg:block">
            therapist prices near me
          </div>
          <div className="px-3 py-1.5 text-[#6c6676] border-r border-[#201d26] whitespace-nowrap hidden xl:block">
            how to stop caring (WORKS!!)
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1c1a20] border-b border-[#312d38] font-mono text-[11px] text-[#948f9c]">
          <Lock className="w-3 h-3 text-[#5dffa8]" />
          <span className="text-[#c9c3d6] truncate">therapist-would-be-cheaper.com/spiral</span>
          <span className="ml-auto text-[10px] text-[#ff5fd1] font-semibold uppercase tracking-wider">
            [MODE: {currentStep.toUpperCase()}]
          </span>
        </div>

        {/* Dynamic Screen Area */}
        <main className="flex-1 p-3 sm:p-6 flex flex-col justify-center relative overflow-y-auto">
          {currentStep === "welcome" && (
            <WelcomeScreen onStart={() => handleStepTransition("customizer")} />
          )}

          {currentStep === "customizer" && (
            <IncidentCustomizerScreen
              formData={formData}
              onChange={handleUpdateFormData}
              onProceed={() => handleStepTransition("checklist")}
            />
          )}

          {currentStep === "checklist" && (
            <ChecklistScreen
              formData={formData}
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={handleToggleSymptom}
              onProceed={() => handleStepTransition("analyzing")}
              onBack={() => handleStepTransition("customizer")}
            />
          )}

          {currentStep === "analyzing" && (
            <AnalyzingScreen
              formData={formData}
              selectedSymptoms={selectedSymptoms}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}

          {currentStep === "results" && analysisResult && (
            <ResultsScreen
              result={analysisResult}
              formData={formData}
              onSpinWheel={() => handleStepTransition("wheel")}
              onRestart={handleRestart}
            />
          )}

          {currentStep === "wheel" && (
            <WheelScreen
              options={analysisResult?.recommendedWheelOptions || []}
              onRestart={handleRestart}
            />
          )}
        </main>

        {/* Footer Credits */}
        <footer className="py-2.5 px-4 bg-[#0d0d10] border-t border-[#312d38] text-center font-mono text-[10px] text-[#6b6675]">
          a deeply unserious project by TinkerHub · no therapists were consulted · no problems were solved · with procedural Web Audio panic synthesizer
        </footer>
      </div>
    </div>
  );
}
