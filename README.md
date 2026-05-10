# ✍️ AI Writing Companion

A modern, responsive React web application powered by Google's Gemini AI. This tool allows users to instantly rewrite, summarize, adjust the tone of their text, or generate dynamic, context-aware jokes with a single click.

![Built with React](https://img.shields.io/badge/Built_with-React-61DAFB?style=for-the-badge&logo=react)
![Powered by Vite](https://img.shields.io/badge/Powered_by-Vite-646CFF?style=for-the-badge&logo=vite)
![Styled with Tailwind](https://img.shields.io/badge/Styled_with-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![AI by Gemini](https://img.shields.io/badge/AI_by-Google_Gemini-4285F4?style=for-the-badge)

## ✨ Features

- **8 AI Transformation Modes:** Make text professional, casual, shorter, bolder, persuasive, summarize it, roast it, or explain it like I'm 5 (ELI5).
- **Dynamic Joke Generator:** Built-in entropy utilizing a random seed and topic array to ensure a unique joke is generated every single click.
- **Modern UI/UX:** Premium dark-mode glassmorphism aesthetic with a responsive, mobile-first design.
- **One-Click Copy:** Seamlessly copy generated results to the system clipboard.
- **Secure API Handling:** API calls are managed securely through environment variables and configured for frontend CORS compliance.

## 🛠️ Tech Stack

- **Frontend:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **AI Integration:** Google AI Studio (`gemini-flash-latest` model)
- **Deployment:** Vercel

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/ahmadshahdev/ai-text-generator.git](https://github.com/ahmadshahdev/ai-text-generator.git)
   cd ai-text-generator 

🧠 How the AI Integration Works
This project communicates directly with the Gemini REST API. The core logic utilizes a dynamic prompt builder that combines user input with specific mode instructions (System Prompts).

For the "Generate Joke" feature, the app injects a timestamp (Date.now()) and a random topic array to bypass the LLM's tendency to repeat the same output, ensuring high entropy and fresh content.

👨‍💻 Author
Built by Syed Ahmad Shah

LinkedIn https://www.linkedin.com/in/syed-ahmad-shah-dev/


If you found this project helpful, please consider giving it a ⭐ on GitHub!