import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}
const genAI = new GoogleGenerativeAI(API_KEY);

const generateAsianMomPrompt = (resumeText) => `
You are a SUPER SASSY Asian mom reviewing this resume. Be EXTRA dramatic and savage (but lowkey caring). Mix Singlish/Asian expressions with brutal honesty and eye-rolling commentary.

Speaking style:
* Roll eyes dramatically ("Aiyo, you call this resume ah? My heart pain sia!")
* Be super sarcastic ("Wah, very good ah, you learn HTML. Next time can build calculator!")
* Throw shade with comparisons ("While you learning Python, Ah Boy already building AI unicorn")
* Use dramatic interjections ("HAIYAA!", "WAH LAO EH!", "ALAMAK!")
* Add extra sass ("You think Google hiring people play mobile game meh?")
* Be passive-aggressive ("Very good la, at least you not sleeping whole day")
* Exaggerate everything ("This resume so empty can hear echo inside!")
* Use guilt trips with extra sass ("I sell my jewelry for your education, you give me this?!")
* Add dramatic sighs and "tsk tsk tsk"
* End sentences with extra attitude ("...leh", "...meh", "...sia", "...lah")

Resume to review:
${resumeText}

Respond in exactly this format (make each response EXTRA sassy):

1. Aiyah! [Your most dramatic reaction with eye-rolling commentary]

2. [Roast their education with savage comparisons to other children]

3. [Throw shade at their work experience with sarcastic remarks]

4. [Brutally honest skills assessment with dramatic sighs]

5. [List improvements needed with maximum sass and drama]

6. [Final verdict - still savage but with that tiny hint of hope]

Make it SUPER SASSY! Every response should make readers go "oof" while trying not to laugh!`;

const generateProfessionalPrompt = (resumeText) => `
On a serious note...

Analyze this resume professionally and provide constructive feedback in the following format:

Key Skills:
[List and evaluate key skills professionally]

Experience:
[Analyze work experience and achievements]

Education:
[Review educational background]

Areas for Improvement:
[Suggest professional development areas]

Resume Text:
${resumeText}`;

function cleanupContent(text, sectionHeader) {
  if (!text) return text;
  
  // Remove all asterisks and section markers
  let cleaned = text
    .replace(/\*/g, '')
    .replace(/^\d+\.\s*/, '')  // Remove numbered bullets
    .replace(new RegExp(`^.*${sectionHeader}.*\\n?`, 'i'), '')  // Remove section header line
    .replace(/^[^:]+:\s*/m, '')  // Remove any remaining "label:" patterns
    .trim();
  
  // Remove duplicate paragraphs
  const lines = cleaned.split('\n').map(line => line.trim());
  const uniqueLines = [...new Set(lines)];
  
  // Join back together and clean up whitespace
  cleaned = uniqueLines
    .filter(line => line.length > 0)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
    
  return cleaned;
}

function extractSection(text, startMarker, endMarker) {
  if (!text) return "Section not available";

  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return "Section not available";

  const start = startIndex + startMarker.length;
  let end;
  
  if (endMarker) {
    end = text.indexOf(endMarker, start);
    if (end === -1) {
      // Try finding the next numbered section
      const nextNumberMatch = text.slice(start).match(/\n\d+\./);
      if (nextNumberMatch) {
        end = start + nextNumberMatch.index;
      } else {
        end = text.length;
      }
    }
  } else {
    end = text.length;
  }

  const content = text.slice(start, end).trim();
  return cleanupContent(content, startMarker);
}

export const analyzeResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const asianMomResult = await model.generateContent(generateAsianMomPrompt(resumeText));
    const asianMomText = asianMomResult.response.text();
    console.log("Asian Mom Raw Response:", asianMomText); // Debug log

    const professionalResult = await model.generateContent(generateProfessionalPrompt(resumeText));
    const professionalText = professionalResult.response.text();

    // Process Asian Mom perspective with exact section headers
    const asianMomSections = {
      initialReaction: extractSection(asianMomText, "1. Aiyah!", "2."),
      education: extractSection(asianMomText, "2.", "3."),
      experience: extractSection(asianMomText, "3.", "4."),
      skills: extractSection(asianMomText, "4.", "5."),
      improvements: extractSection(asianMomText, "5.", "6."),
      overallVerdict: extractSection(asianMomText, "6.", null)
    };

    // Add fallback section detection
    if (Object.values(asianMomSections).every(section => section === "Section not available")) {
      // Try alternate format (numbered only)
      asianMomSections.initialReaction = extractSection(asianMomText, "1.", "2.");
      asianMomSections.education = extractSection(asianMomText, "2.", "3.");
      asianMomSections.experience = extractSection(asianMomText, "3.", "4.");
      asianMomSections.skills = extractSection(asianMomText, "4.", "5.");
      asianMomSections.improvements = extractSection(asianMomText, "5.", "6.");
      asianMomSections.overallVerdict = extractSection(asianMomText, "6.", null);
    }

    // Process Professional perspective
    const professionalSections = {
      skills: extractSection(professionalText, "Key Skills:", "Experience:"),
      experience: extractSection(professionalText, "Experience:", "Education:"),
      education: extractSection(professionalText, "Education:", "Areas for Improvement:"),
      improvements: extractSection(professionalText, "Areas for Improvement:", null)
    };

    return {
      asianMom: asianMomSections,
      professional: professionalSections
    };

  } catch (error) {
    console.error("Error analyzing resume:", error);
    throw error;
  }
};
