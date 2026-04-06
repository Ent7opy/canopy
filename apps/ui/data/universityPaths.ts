import { Phase, ProgressCategory, Resource, Task } from "./roadmap";

export type UniversityPath = {
  id: string;
  name: string;
  country: string;
  university: string;
  program: string;
  language: string;
  duration: string;
  tuition: string;
  deadline: string;
  description: string;
  phases: Phase[];
  progressCategories: ProgressCategory[];
  resources: Resource[];
  tasks: Task[];
};

// German path (original Hochschule Rhein‑Waal)
export const germanPath: UniversityPath = {
  id: "german",
  name: "German Path",
  country: "Germany",
  university: "Hochschule Rhein‑Waal",
  program: "Environment and Energy (B.Sc.)",
  language: "English (B2 required)",
  duration: "3.5 years (7 semesters)",
  tuition: "~€0 for EU citizens (semester fee ~€300)",
  deadline: "2027-07-15",
  description: "Applied environmental science with international perspective, mandatory internship.",
  phases: [
    {
      id: "research",
      title: "Research & Foundation",
      start: "2026-04-01",
      end: "2026-06-30",
      color: "#3b82f6",
      tasks: [
        "Confirm HZB equivalence via uni‑assist",
        "Gather official documents",
        "Start German A1 self‑study",
        "Review high‑school math",
      ],
    },
    {
      id: "language",
      title: "Language & Academic Refresh",
      start: "2026-07-01",
      end: "2026-12-31",
      color: "#10b981",
      tasks: [
        "German A2 (complete structured course)",
        "English test preparation",
        "Refresh physics & chemistry",
        "Explore environmental science MOOCs",
      ],
    },
    {
      id: "skill",
      title: "Skill Building & Test Taking",
      start: "2027-01-01",
      end: "2027-03-31",
      color: "#8b5cf6",
      tasks: [
        "Take English test (IELTS/TOEFL)",
        "German B1 (if possible)",
        "Dive into data analysis (Python, pandas)",
        "Complete intro environmental science course",
      ],
    },
    {
      id: "application",
      title: "Application & Finances",
      start: "2027-04-01",
      end: "2027-06-30",
      color: "#f59e0b",
      tasks: [
        "Prepare application documents",
        "Submit uni‑assist evaluation",
        "Open German blocked account",
        "Search for accommodation in Kleve",
      ],
    },
    {
      id: "submit",
      title: "Submit Application",
      start: "2027-07-01",
      end: "2027-07-15",
      color: "#ef4444",
      tasks: ["Finalize and submit application before 15 July"],
    },
    {
      id: "predeparture",
      title: "Pre‑Departure",
      start: "2027-08-01",
      end: "2027-09-30",
      color: "#ec4899",
      tasks: [
        "Receive admission letter",
        "Arrange health insurance, flight",
        "Intensive German (A2/B1)",
      ],
    },
    {
      id: "start",
      title: "Start of Studies",
      start: "2027-10-01",
      end: "2027-10-31",
      color: "#06b6d4",
      tasks: ["Move to Kleve, enroll, start your degree!"],
    },
  ],
  progressCategories: [
    { id: "german", label: "German", value: 10, color: "#3b82f6" },
    { id: "english", label: "English", value: 100, color: "#10b981" },
    { id: "math", label: "Mathematics", value: 30, color: "#8b5cf6" },
    { id: "physics", label: "Physics", value: 20, color: "#f59e0b" },
    { id: "chemistry", label: "Chemistry", value: 15, color: "#ef4444" },
    { id: "environmental", label: "Environmental Science", value: 25, color: "#ec4899" },
    { id: "skills", label: "Technical Skills", value: 70, color: "#06b6d4" },
  ],
  resources: [
    {
      id: "1",
      title: "Khan Academy: Calculus 1",
      url: "https://www.khanacademy.org/math/calculus-1",
      category: "Mathematics",
    },
    {
      id: "2",
      title: "Deutsche Welle – Nicos Weg (A1)",
      url: "https://www.dw.com/en/learn-german/s-2469",
      category: "German",
    },
    {
      id: "3",
      title: "IELTS Official Practice",
      url: "https://www.ielts.org/",
      category: "English",
    },
    {
      id: "4",
      title: "Coursera: Introduction to Environmental Science",
      url: "https://www.coursera.org/learn/environmental-science",
      category: "Environmental Science",
    },
    {
      id: "5",
      title: "Python DataCamp Track",
      url: "https://www.datacamp.com/tracks/data-scientist-with-python",
      category: "Technical Skills",
    },
    {
      id: "6",
      title: "Hochschule Rhein‑Waal Program Page",
      url: "https://www.hochschule-rhein-waal.de/en/faculties/communication-and-environment/degree-programmes/bachelor-degree-programmes/environment",
      category: "Official",
    },
  ],
  tasks: [
    { id: "1", label: "Confirm HZB equivalence", completed: false, phaseId: "research" },
    { id: "2", label: "Start German A1 self‑study", completed: false, phaseId: "research" },
    { id: "3", label: "Take IELTS practice test", completed: false, phaseId: "language" },
    { id: "4", label: "Finish Duolingo A1", completed: false, phaseId: "language" },
    { id: "5", label: "Complete Khan Academy Calculus 1", completed: false, phaseId: "skill" },
    { id: "6", label: "Build a Python data visualization", completed: false, phaseId: "skill" },
    { id: "7", label: "Prepare CV and motivation letter", completed: false, phaseId: "application" },
    { id: "8", label: "Submit uni‑assist evaluation", completed: false, phaseId: "application" },
  ],
};

// Bulgarian path (University of Forestry - Ecology and Environmental Protection)
export const bulgarianPath: UniversityPath = {
  id: "bulgarian",
  name: "Bulgarian Path",
  country: "Bulgaria",
  university: "University of Forestry (Лесотехнически университет)",
  program: "Ecology and Environmental Protection (Екология и опазване на околната среда)",
  language: "Bulgarian (native)",
  duration: "4 years (8 semesters)",
  tuition: "~€0–€2000/year for EU citizens at public universities",
  deadline: "2027-06-30",
  description: "Traditional ecology and environmental protection with focus on local/regional issues.",
  phases: [
    {
      id: "research",
      title: "Research & Foundation",
      start: "2026-04-01",
      end: "2026-06-30",
      color: "#3b82f6",
      tasks: [
        "Research Bulgarian university programs",
        "Gather official documents (high school diploma, transcripts)",
        "Review Bulgarian academic terminology",
        "Review high‑school biology and chemistry",
      ],
    },
    {
      id: "language",
      title: "Language Preparation",
      start: "2026-07-01",
      end: "2026-12-31",
      color: "#10b981",
      tasks: [
        "Review Bulgarian academic terminology",
        "Prepare for entrance exams (Biology, Chemistry)",
        "Refresh mathematics",
        "Explore environmental science MOOCs",
      ],
    },
    {
      id: "exam",
      title: "Entrance Exam Preparation",
      start: "2027-01-01",
      end: "2027-04-30",
      color: "#8b5cf6",
      tasks: [
        "Study biology syllabus",
        "Study chemistry syllabus",
        "Take practice entrance exams",
        "Visit university open days (if possible)",
      ],
    },
    {
      id: "application",
      title: "Application & Documents",
      start: "2027-05-01",
      end: "2027-06-30",
      color: "#f59e0b",
      tasks: [
        "Prepare application documents",
        "Submit application before 30 June",
        "Arrange accommodation in Sofia (if needed)",
        "Explore scholarship options",
      ],
    },
    {
      id: "results",
      title: "Admission Results",
      start: "2027-07-01",
      end: "2027-07-31",
      color: "#ef4444",
      tasks: ["Receive admission results", "Confirm enrollment"],
    },
    {
      id: "predeparture",
      title: "Pre‑Semester Preparation",
      start: "2027-08-01",
      end: "2027-09-30",
      color: "#ec4899",
      tasks: [
        "Finalize accommodation",
        "Buy textbooks and materials",
        "Connect with future classmates",
        "Prepare for first semester courses",
      ],
    },
    {
      id: "start",
      title: "Start of Studies",
      start: "2027-10-01",
      end: "2027-10-31",
      color: "#06b6d4",
      tasks: ["Move to Sofia (if needed), enroll, start your degree!"],
    },
  ],
  progressCategories: [
    { id: "bulgarian", label: "Bulgarian Language", value: 100, color: "#3b82f6" },
    { id: "biology", label: "Biology", value: 40, color: "#10b981" },
    { id: "chemistry", label: "Chemistry", value: 35, color: "#8b5cf6" },
    { id: "math", label: "Mathematics", value: 60, color: "#f59e0b" },
    { id: "environmental", label: "Environmental Science", value: 30, color: "#ef4444" },
    { id: "skills", label: "Technical Skills", value: 50, color: "#ec4899" },
  ],
  resources: [
    {
      id: "1",
      title: "Bulgarian Academic Terminology",
      url: "https://bg.wikipedia.org/wiki/Български_език",
      category: "Language",
    },
    {
      id: "2",
      title: "Biology Entrance Exam Syllabus",
      url: "https://ltu.bg/прием/",
      category: "Exam Preparation",
    },
    {
      id: "3",
      title: "Chemistry Study Materials",
      url: "https://www.khanacademy.org/science/chemistry",
      category: "Exam Preparation",
    },
    {
      id: "4",
      title: "University of Forestry Website",
      url: "https://ltu.bg/",
      category: "Official",
    },
    {
      id: "5",
      title: "Environmental Science MOOC (Coursera)",
      url: "https://www.coursera.org/learn/environmental-science",
      category: "Environmental Science",
    },
    {
      id: "6",
      title: "Bulgarian Student Accommodation Portal",
      url: "https://www.studentski-grad.com/",
      category: "Accommodation",
    },
  ],
  tasks: [
    { id: "1", label: "Research university programs", completed: false, phaseId: "research" },
    { id: "2", label: "Refresh Bulgarian language", completed: false, phaseId: "research" },
    { id: "3", label: "Study biology syllabus", completed: false, phaseId: "exam" },
    { id: "4", label: "Study chemistry syllabus", completed: false, phaseId: "exam" },
    { id: "5", label: "Take practice entrance exams", completed: false, phaseId: "exam" },
    { id: "6", label: "Prepare application documents", completed: false, phaseId: "application" },
    { id: "7", label: "Submit application", completed: false, phaseId: "application" },
    { id: "8", label: "Arrange accommodation", completed: false, phaseId: "predeparture" },
  ],
};

// Hybrid path (Bulgarian bachelor + German master)
export const hybridPath: UniversityPath = {
  id: "hybrid",
  name: "Hybrid Path",
  country: "Bulgaria → Germany",
  university: "University of Forestry → Hochschule Rhein‑Waal (or similar)",
  program: "Ecology Bachelor (BG) + Environmental Science Master (DE)",
  language: "Bulgarian (B2) → English/German",
  duration: "4 + 2 years",
  tuition: "~€0–€2000/year (BG) + ~€0 (DE master)",
  deadline: "2027-06-30",
  description: "Complete bachelor's in Bulgaria (lower cost), then pursue master's in Germany for international exposure.",
  phases: [
    {
      id: "bachelor",
      title: "Bulgarian Bachelor Phase",
      start: "2026-04-01",
      end: "2030-06-30",
      color: "#3b82f6",
      tasks: [
        "Get admitted to Bulgarian ecology program",
        "Complete bachelor's courses",
        "Maintain good GPA (≥ 3.0/4.0)",
        "Learn German alongside studies",
      ],
    },
    {
      id: "master-prep",
      title: "Master Preparation",
      start: "2029-01-01",
      end: "2030-06-30",
      color: "#10b981",
      tasks: [
        "Research German master programs",
        "Improve English/German to C1",
        "Gain relevant internships",
        "Prepare master application documents",
      ],
    },
    {
      id: "master-apply",
      title: "Master Application",
      start: "2030-07-01",
      end: "2031-01-31",
      color: "#8b5cf6",
      tasks: [
        "Submit master applications",
        "Secure funding/scholarships",
        "Arrange visa (if needed)",
        "Find accommodation in Germany",
      ],
    },
    {
      id: "master-start",
      title: "Start Master Studies",
      start: "2031-04-01",
      end: "2031-10-31",
      color: "#f59e0b",
      tasks: ["Move to Germany", "Enroll in master program", "Begin specialized studies"],
    },
  ],
  progressCategories: [
    { id: "bulgarian", label: "Bulgarian Language", value: 90, color: "#3b82f6" },
    { id: "german", label: "German Language", value: 20, color: "#10b981" },
    { id: "english", label: "English", value: 100, color: "#8b5cf6" },
    { id: "gpa", label: "Bachelor GPA", value: 0, color: "#f59e0b" },
    { id: "internship", label: "Internship Experience", value: 10, color: "#ef4444" },
    { id: "research", label: "Research Skills", value: 15, color: "#ec4899" },
  ],
  resources: [
    {
      id: "1",
      title: "Bulgarian Bachelor Program Info",
      url: "https://ltu.bg/",
      category: "Official",
    },
    {
      id: "2",
      title: "German Master Programs (DAAD)",
      url: "https://www.daad.de/en/",
      category: "Master Research",
    },
    {
      id: "3",
      title: "German Language Learning",
      url: "https://www.dw.com/en/learn-german/s-2469",
      category: "Language",
    },
    {
      id: "4",
      title: "Scholarship Databases",
      url: "https://www.scholarshipportal.com/",
      category: "Funding",
    },
    {
      id: "5",
      title: "Internship Portals (EU)",
      url: "https://europa.eu/europass/en",
      category: "Career",
    },
  ],
  tasks: [
    { id: "1", label: "Get admitted to Bulgarian bachelor", completed: false, phaseId: "bachelor" },
    { id: "2", label: "Maintain GPA ≥ 3.0", completed: false, phaseId: "bachelor" },
    { id: "3", label: "Learn German to B1", completed: false, phaseId: "bachelor" },
    { id: "4", label: "Complete relevant internship", completed: false, phaseId: "master-prep" },
    { id: "5", label: "Research master programs", completed: false, phaseId: "master-prep" },
    { id: "6", label: "Prepare master application", completed: false, phaseId: "master-apply" },
    { id: "7", label: "Submit master applications", completed: false, phaseId: "master-apply" },
  ],
};

export const paths: Record<string, UniversityPath> = {
  german: germanPath,
  bulgarian: bulgarianPath,
  hybrid: hybridPath,
};

export const defaultPathId = "german";

// Helper functions
export function getPath(id: string): UniversityPath {
  return paths[id] || germanPath;
}

export function getDaysUntilDeadline(pathId: string): number {
  const path = getPath(pathId);
  const deadline = new Date(path.deadline);
  const today = new Date();
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}