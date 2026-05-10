import { useState, useCallback } from "react";
import "./App.css";
const MODES = [
	{ id: "professional", label: "Make it professional" },
	{ id: "casual", label: "Make it casual" },
	{ id: "shorter", label: "Make it shorter" },
	{ id: "bolder", label: "Make it bolder" },
	{ id: "summarize", label: "Summarize it" },
	{ id: "roast", label: "Roast it" },
	{ id: "explain", label: "Explain like I'm 5" },
	{ id: "persuasive", label: "Make it persuasive" },
];

const MODE_PROMPTS = {
	professional:
		"Rewrite the following text to sound professional, polished, and workplace-appropriate. Keep the core message but elevate the tone:",
	casual: "Rewrite the following text to sound friendly, relaxed, and conversational — like texting a friend:",
	shorter:
		"Rewrite the following text to be significantly shorter and more concise while keeping all the key points:",
	bolder: "Rewrite the following text to be more bold, confident, and impactful. Make every word count:",
	summarize:
		"Give a clear, concise summary of the following text in 2-3 sentences:",
	roast: "Playfully roast and poke fun at the following text in a witty, lighthearted way (no cruelty, just fun):",
	explain:
		"Explain the following text like the reader is 5 years old — simple words, simple ideas, maybe an analogy:",
	persuasive:
		"Rewrite the following text to be highly persuasive and compelling. Use rhetorical techniques to convince the reader:",
};

const MODE_LABELS = {
	professional: "Professional version",
	casual: "Casual version",
	shorter: "Shorter version",
	bolder: "Bolder version",
	summarize: "Summary",
	roast: "Roasted",
	explain: "ELI5 version",
	persuasive: "Persuasive version",
};

// Grabbing the Gemini key securely from Vite's environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function LoadingDots() {
	return (
		<div className="flex items-center gap-1.5 py-2">
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					className="w-2 h-2 rounded-full bg-neutral-500 animate-pulse"
					style={{ animationDelay: `${i * 0.2}s` }}
				/>
			))}
		</div>
	);
}

export default function AIWritingCompanion() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState("professional");
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [copied, setCopied] = useState(false);
	const [error, setError] = useState(null);

	const transform = useCallback(async () => {
		if (!input.trim()) return;
		setLoading(true);
		setResult(null);
		setError(null);

		try {
			// Gemini expects the key either in headers or as a URL query parameter.
			// URL parameter is the standard approach for the Gemini REST API.
			const res = await fetch(
				`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						contents: [
							{
								parts: [
									{
										text:
											MODE_PROMPTS[mode] +
											"\n\n---\n\n" +
											input.trim() +
											"\n\n---\n\nRespond with only the rewritten text. No preamble, no explanation, no formatting quotes around it.",
									},
								],
							},
						],
					}),
				},
			);

			const data = await res.json();

			// Catch Google API errors (like invalid key or quota issues)
			if (data.error) {
				throw new Error(data.error.message);
			}

			// Drilling down into Gemini's specific JSON response structure
			const generatedText =
				data.candidates?.[0]?.content?.parts?.[0]?.text;

			setResult(generatedText || "Something went wrong. Try again!");
		} catch (e) {
			setError(
				e.message ||
					"Error connecting to AI. Please check your API key and try again or Reached your API limits.",
			);
		} finally {
			setLoading(false);
		}
	}, [input, mode]);

	const copy = useCallback(() => {
		if (!result) return;
		navigator.clipboard.writeText(result).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [result]);

	return (
		<div className="min-h-screen bg-[#1a1a1a] p-8 font-sans text-[#e8e8e8]">
			<div className="mx-auto max-w-2xl pt-6">
				<h1 className="mb-1 text-2xl font-medium text-[#f0f0f0]">
					AI Writing Companion
				</h1>
				<p className="mb-6 text-sm text-[#999]">
					Paste any text. Pick a mode. Watch the magic.
				</p>

				{/* Input */}
				<textarea
					className="min-h-30 w-full resize-y rounded-xl border border-[#444] bg-[#2a2a2a] p-3 text-[15px] leading-relaxed text-[#e8e8e8] outline-none transition-colors focus:border-[#888]"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Paste your text here — an email, a message, a paragraph, anything..."
				/>
				<div className="mt-1 text-right text-xs text-[#555]">
					{input.length} characters
				</div>

				{/* Mode buttons */}
				<div className="my-4 flex flex-wrap gap-2">
					{MODES.map((m) => (
						<button
							key={m.id}
							onClick={() => setMode(m.id)}
							className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-[13px] transition-all ${
								mode === m.id
									? "border-[#888] bg-[#333] font-medium text-[#f0f0f0]"
									: "border-[#444] bg-[#2a2a2a] text-[#999] hover:bg-[#333]"
							}`}
						>
							{m.label}
						</button>
					))}
				</div>

				{/* Transform button */}
				<button
					className="mt-1 w-full rounded-lg border border-[#555] bg-[#333] p-2.5 text-[15px] font-medium text-[#f0f0f0] transition-all hover:bg-[#444] disabled:cursor-not-allowed disabled:opacity-50"
					onClick={transform}
					disabled={loading || !input.trim()}
				>
					{loading ? "Working..." : "Transform ↗"}
				</button>

				{/* Result */}
				{(loading || result || error) && (
					<div className="mt-6 min-h-20 rounded-xl border border-[#333] bg-[#2a2a2a] p-4">
						<div className="mb-2 text-xs uppercase tracking-wide text-[#666]">
							{MODE_LABELS[mode]}
						</div>

						{loading && <LoadingDots />}

						{error && (
							<div className="text-[15px] leading-relaxed text-red-400">
								{error}
							</div>
						)}

						{result && !loading && (
							<>
								<div className="whitespace-pre-wrap text-[15px] leading-relaxed text-[#e8e8e8]">
									{result}
								</div>
								<button
									className="mt-2.5 cursor-pointer rounded-lg border border-[#444] bg-transparent px-3 py-1.5 text-xs text-[#999] transition-colors hover:bg-[#333]"
									onClick={copy}
								>
									{copied ? "Copied!" : "Copy result"}
								</button>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
