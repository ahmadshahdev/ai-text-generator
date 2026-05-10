import { useState, useCallback } from "react";
import "./App.css";

const MODES = [
  { id: "professional", label: "Make it professional" },
  { id: "casual",       label: "Make it casual" },
  { id: "shorter",      label: "Make it shorter" },
  { id: "bolder",       label: "Make it bolder" },
  { id: "summarize",    label: "Summarize it" },
  { id: "roast",        label: "Roast it" },
  { id: "explain",      label: "Explain like I'm 5" },
  { id: "persuasive",   label: "Make it persuasive" },
];

const MODE_PROMPTS = {
  professional: "Rewrite the following text to sound professional, polished, and workplace-appropriate:",
  casual:       "Rewrite the following text to sound friendly and conversational:",
  shorter:      "Rewrite the following text to be significantly shorter and more concise:",
  bolder:       "Rewrite the following text to be more bold and impactful:",
  summarize:    "Give a clear, concise summary of the following text in 2-3 sentences:",
  roast:        "Playfully roast the following text in a witty, lighthearted way:",
  explain:      "Explain the following text like the reader is 5 years old:",
  persuasive:   "Rewrite the following text to be highly persuasive and compelling:",
};

const JOKE_THEMES = [
  "programming", "pixel art", "space travel", "coffee", "dinosaurs", 
  "time travel", "cats", "smartphones", "ocean life", "office work"
];

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-3">
      {[0, 1, 2].map((i) => (
        <div 
          key={i} 
          className="w-2.5 h-2.5 rounded-full bg-[#7DD3FC] animate-pulse" 
          style={{ animationDelay: `${i * 0.2}s` }} 
        />
      ))}
    </div>
  );
}

export default function AIWritingCompanion() {
  const [input, setInput]           = useState("");
  const [mode, setMode]             = useState("professional");
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);
  const [error, setError]           = useState(null);

  const callGemini = async (promptText) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setResult(generatedText || "Something went wrong. Try again!");
    } catch (e) {
      setError(e.message || "Error connecting to AI.");
    } finally {
      setLoading(false);
    }
  };

  const transform = () => {
    if (!input.trim()) return;
    const fullPrompt = `${MODE_PROMPTS[mode]}\n\n---\n\n${input.trim()}\n\n---\n\nRespond with only the rewritten text. No preamble, no quotes.`;
    callGemini(fullPrompt);
  };

  const generateJoke = () => {
    setMode("joke");
    const randomTheme = JOKE_THEMES[Math.floor(Math.random() * JOKE_THEMES.length)];
    const dynamicJokePrompt = `Tell me a unique, funny joke about ${randomTheme}. 
    Random Seed: ${Date.now()}. 
    No preamble, no "Sure! Here is a joke", just the joke itself.`;
    callGemini(dynamicJokePrompt);
  };

  const copy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  return (
    // Main Wrapper: Deep blue background, custom selection colors
    <div className="min-h-screen bg-[#082F49] p-4 sm:p-8 font-sans text-slate-100 selection:bg-[#7DD3FC] selection:text-[#082F49] relative">
      
      {/* Creator Watermark */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center rounded-full border border-[#7DD3FC]/30 bg-[#082F49]/80 px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-widest text-[#7DD3FC] shadow-lg backdrop-blur-md uppercase">
        Built by Syed Ahmad Shah
      </div>

      <div className="mx-auto max-w-2xl pt-14 sm:pt-6">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              AI Writing Companion
            </h1>
            <p className="text-sm text-[#7DD3FC]/80 font-medium">
              Enhance your text or get a quick laugh.
            </p>
          </div>
          
          <button 
            onClick={generateJoke}
            className="w-full sm:w-auto rounded-xl border-2 border-[#7DD3FC] bg-transparent px-5 py-2.5 text-sm font-bold text-[#7DD3FC] shadow-[0_0_15px_rgba(125,211,252,0.15)] transition-all hover:bg-[#7DD3FC] hover:text-[#082F49] hover:shadow-[0_0_20px_rgba(125,211,252,0.3)] active:scale-95"
          >
            Generate Joke 😂
          </button>
        </header>

        {/* Input Textarea Container */}
        <div className="relative group">
          <textarea
            className="min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-black/20 p-4 text-[15px] leading-relaxed text-white outline-none backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-[#7DD3FC] focus:bg-black/30 focus:ring-1 focus:ring-[#7DD3FC] shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here — an email, a message, a paragraph, anything..."
          />
          <div className="absolute bottom-3 right-4 text-xs font-medium text-slate-400">
            {input.length} characters
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="my-6 flex flex-wrap gap-2.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`cursor-pointer rounded-xl border px-4 py-2 text-[13px] transition-all duration-200 ${
                mode === m.id 
                  ? "border-transparent bg-[#7DD3FC] font-bold text-[#082F49] shadow-[0_4px_14px_rgba(125,211,252,0.3)]" 
                  : "border-white/10 bg-white/5 font-medium text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Primary Transform Button */}
        <button
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl border border-transparent bg-[#7DD3FC] p-4 text-[16px] font-extrabold text-[#082F49] shadow-[0_4px_20px_rgba(125,211,252,0.25)] transition-all hover:bg-[#bae6fd] hover:shadow-[0_6px_25px_rgba(125,211,252,0.4)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
          onClick={transform}
          disabled={loading || !input.trim()}
        >
          {loading ? "Processing Magic..." : "Transform Text ↗"}
        </button>

        {/* Result Area */}
        {(loading || result || error) && (
          <div className="mt-8 min-h-30 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#7DD3FC]/80">
              <span className="w-2 h-2 rounded-full bg-[#7DD3FC]"></span>
              {mode === "joke" ? "Random Joke" : (MODES.find(m => m.id === mode)?.label || "Result")}
            </div>

            {loading && <LoadingDots />}
            
            {error && <div className="text-[15px] font-medium leading-relaxed text-red-400 p-2 bg-red-400/10 rounded-lg">{error}</div>}
            
            {result && !loading && (
              <div className="animate-in fade-in duration-500">
                <div className="whitespace-pre-wrap text-[16px] leading-relaxed text-slate-100 font-medium">
                  {result}
                </div>
                <div className="mt-6 flex justify-end">
                  <button 
                    className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
                      copied 
                        ? "border-[#7DD3FC] bg-[#7DD3FC]/10 text-[#7DD3FC]" 
                        : "border-white/20 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={copy}
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Copied!
                      </>
                    ) : (
                      "Copy Result"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}