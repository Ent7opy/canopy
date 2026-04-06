# Bulgarian University Research - Ecology, Environment, Renewable Energy

## Overview
Research of Bulgarian universities offering bachelor's degrees in ecology, environmental science, renewable energy, environmental technology, and related fields. Focus on programs taught in English or Bulgarian, admission requirements, curriculum, and comparison with German option.

## Universities & Programs

### 1. University of Forestry (Лесотехнически университет) - Sofia
- **Program:** Ecology and Environmental Protection (Екология и опазване на околната среда)
- **Language:** Bulgarian
- **Duration:** 4 years (8 semesters)
- **Degree:** Bachelor of Science
- **Admission requirements:** High school diploma, entrance exams in Biology and Chemistry (or Bulgarian language and literature for some tracks)
- **Curriculum likely includes:** Ecology fundamentals, Environmental protection, Soil science, Water resources, Waste management, Renewable energy basics, Environmental law, Statistics.
- **Notes:** Traditional forestry focus but strong environmental protection track.

### 2. Sofia University "St. Kliment Ohridski"
- **Faculty of Biology:** Ecology and Environmental Protection (likely)
- **Faculty of Geology and Geography:** Environmental Geology, Geography of Natural Resources
- **Language:** Bulgarian (some Master's in English)
- **Admission:** Competitive entrance exams, high school grades.

### 3. Technical University of Sofia
- **Faculty of Power Engineering and Power Machines:** Energy Efficiency, Renewable Energy Sources
- **Faculty of Mechanical Engineering:** Environmental Engineering
- **Programs:** Bachelor in "Energy Efficiency and Renewable Energy", "Environmental Engineering"
- **Language:** Bulgarian, some courses in English
- **Strong technical focus:** Engineering mathematics, thermodynamics, solar/wind/hydro energy systems, energy auditing.

### 4. University of Chemical Technology and Metallurgy - Sofia
- **Program:** Environmental Engineering, Chemical Engineering with environmental focus
- **Language:** Bulgarian
- **Focus:** Pollution control, wastewater treatment, air quality, chemical processes for environmental protection.

### 5. Plovdiv University "Paisii Hilendarski"
- **Faculty of Biology:** Ecology
- **Faculty of Physics and Technology:** Renewable Energy Technologies
- **Regional advantage:** Lower cost of living than Sofia.

### 6. Burgas Free University
- **Program:** Ecology and Environmental Protection (English-taught option possible)
- **Private university, may have higher tuition but more flexible admission.

## Admission Requirements (General)
- **High school diploma** with good grades in relevant subjects (Biology, Chemistry, Physics, Mathematics).
- **Entrance exams** (varies by university): Usually in 1-2 subjects related to the program.
- **Language proficiency:** For Bulgarian-taught programs, B2 level in Bulgarian (certificate or exam). Some universities offer preparatory language year.
- **For EU citizens:** Simplified recognition of secondary education; no student visa needed.
- **Application deadlines:** Typically June-July for fall intake.

## Curriculum Comparison
| Aspect | German (Hochschule Rhein‑Waal) | Bulgarian (typical) |
|--------|--------------------------------|---------------------|
| **Focus** | Applied environmental science, international perspective, English-taught | More theoretical, local/regional environmental issues, Bulgarian-taught |
| **Duration** | 3.5 years (7 semesters) | 4 years (8 semesters) |
| **Tuition** | ~€0 for EU citizens (semester fee ~€300) | ~€0–€2000/year for EU citizens at public universities; private higher |
| **Language** | English (B2 required), German optional | Bulgarian (B2 required), some English materials |
| **Practical** | Mandatory internship (4th semester), project‑based | Summer internships, thesis in final year |
| **Cost of living** | Kleve: €800–€1000/month | Sofia: €400–€600/month; other cities lower |

## Advantages of Bulgarian Option
- **Lower living costs** (half of Germany).
- **Familiar environment** (Bulgarian language, culture).
- **No need for German language** (unless wanting to work locally).
- **Shorter travel distance** to family.
- **Easier admission** for Bulgarian secondary school graduates.

## Disadvantages
- **Less international recognition** of degree.
- **Limited English‑taught programs** (may need Bulgarian proficiency).
- **Fewer networking opportunities** with international companies.
- **Research funding** lower than in Germany.

## Hybrid Path Consideration
Complete bachelor's in Bulgaria (lower cost, familiar setting) → Master's in Germany/Netherlands/Sweden (international exposure, better job prospects).

## Next Steps for Dashboard Integration
1. **Add university toggle** (German vs Bulgarian) to the University page.
2. **Create separate roadmaps** for each option with tailored phases, tasks, progress categories.
3. **Research specific curriculum** for selected Bulgarian programs to create meaningful task lists.
4. **Consider adding a third "Hybrid" path** (Bulgarian bachelor + German master).

## Database Schema (Railway PostgreSQL)
For storing user preferences, progress, tasks, and university selection:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  theme_preference TEXT CHECK (theme_preference IN ('light', 'dark', 'auto'))
);

CREATE TABLE university_path (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  selected_path TEXT CHECK (selected_path IN ('german', 'bulgarian', 'hybrid')),
  selected_university_name TEXT,
  start_year INTEGER,
  notes TEXT
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  label TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  phase_id TEXT,
  category TEXT
);

CREATE TABLE progress (
  user_id UUID REFERENCES users(id),
  category_id TEXT,
  value INTEGER CHECK (value >= 0 AND value <= 100),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, category_id)
);

CREATE TABLE reading_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  book_id TEXT,
  status TEXT CHECK (status IN ('unread', 'reading', 'completed')),
  started_at DATE,
  completed_at DATE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);
```

## Action Items
1. **Verify specific program URLs** (contact university admission offices if needed).
2. **Extract exact curriculum** from module handbooks (if available online).
3. **Design UI toggle** for university selection.
4. **Create Bulgarian roadmap** phases (language prep, entrance exam prep, application, etc.).
5. **Set up Railway PostgreSQL** and create migration scripts.
6. **Update dashboard** to fetch/store data from database (via API routes).