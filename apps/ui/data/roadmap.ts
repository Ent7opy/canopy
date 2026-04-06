export type Phase = {
  id: string;
  title: string;
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  color: string;
  tasks: string[];
};

export type ProgressCategory = {
  id: string;
  label: string;
  value: number; // 0-100
  color: string;
};

export type Task = {
  id: string;
  label: string;
  completed: boolean;
  phaseId: string;
};

export type Resource = {
  id: string;
  title: string;
  url: string;
  category: string;
};

export const phases: Phase[] = [
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
];

export const progressCategories: ProgressCategory[] = [
  { id: "german", label: "German", value: 10, color: "#3b82f6" },
  { id: "english", label: "English", value: 100, color: "#10b981" },
  { id: "math", label: "Mathematics", value: 30, color: "#8b5cf6" },
  { id: "physics", label: "Physics", value: 20, color: "#f59e0b" },
  { id: "chemistry", label: "Chemistry", value: 15, color: "#ef4444" },
  { id: "environmental", label: "Environmental Science", value: 25, color: "#ec4899" },
  { id: "skills", label: "Technical Skills", value: 70, color: "#06b6d4" },
];

export const tasks: Task[] = [
  { id: "1", label: "Confirm HZB equivalence", completed: false, phaseId: "research" },
  { id: "2", label: "Start German A1 self‑study", completed: false, phaseId: "research" },
  { id: "3", label: "Take IELTS practice test", completed: false, phaseId: "language" },
  { id: "4", label: "Finish Duolingo A1", completed: false, phaseId: "language" },
  { id: "5", label: "Complete Khan Academy Calculus 1", completed: false, phaseId: "skill" },
  { id: "6", label: "Build a Python data visualization", completed: false, phaseId: "skill" },
  { id: "7", label: "Prepare CV and motivation letter", completed: false, phaseId: "application" },
  { id: "8", label: "Submit uni‑assist evaluation", completed: false, phaseId: "application" },
];

export const resources: Resource[] = [
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
];

// Helper to get days until deadline
export const deadline = "2027-07-15";
export const today = new Date().toISOString().split("T")[0];
export const daysUntilDeadline = Math.ceil(
  (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
);