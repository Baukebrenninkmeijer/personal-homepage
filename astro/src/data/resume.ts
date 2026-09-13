// Single source for the resume page and the generated CV PDF (see cv/cv.typ).
export const person = {
  name: 'Bauke Brenninkmeijer',
  title: 'AI Research Engineer',
  location: 'Amsterdam, Netherlands',
  email: 'bauke.brenninkmeijer@gmail.com',
};

export const experience = [
  {
    company: 'orq.ai',
    role: 'AI Research Engineer',
    period: 'Aug 2025–present',
    bullets: [
      'Built out the red-teaming module in evaluatorq (LangGraph target, agent simulation, simplified API) — a customer used it to find and patch vulnerabilities in their own agent',
      'Redesigned the PII detection service to key recognizers on jurisdiction rather than text language, and unified six disagreeing keyword-boundary scanners onto one predicate',
      'Maintain the orq CLI stack — auth profiles, active-project workflow, a self-updating terminal assistant, and normalized trace rendering',
      'Agent evaluation: jury-of-judges alignment against human labels, multi-turn agent simulation, OpenTelemetry capture for coding-agent traces',
    ],
  },
  {
    company: 'Agentic AI Foundation Amsterdam',
    role: 'Chapter Lead / Organiser',
    period: 'Sep 2024–present',
    bullets: [
      'Run the Amsterdam chapter: speaker curation, sponsor partnerships, ~10 events per year',
    ],
  },
  {
    company: 'Sytac → ING',
    role: 'Senior Consultant / Senior AI Engineer',
    period: 'May 2024–Jul 2025',
    bullets: [
      'Tech lead on MLOps in Global Financial Crime & Fraud Prevention — V2 release, Airflow DAG parameterization across countries',
      'Detection & forecasting system for reliability events from Track-and-Trace logs (1TB out-of-memory processing with Polars)',
      'Rewrote RAG ingestion pipeline for sustainability peer-review app — 5× faster, better extraction quality',
      'Sytac internal: LLM-based extraction for the resume app; simplified Slackbot by querying Notion search directly, dropping the vector DB',
      'Ran day-long hackathons and education sessions on testing, pre-commit, and merging strategy; mentored junior Python engineers',
    ],
  },
  {
    company: 'ABN AMRO',
    role: 'Full Stack Data Scientist — Global Markets',
    period: 'Jul 2021–May 2024',
    bullets: [
      'Designed and led platform migration from IaaS VMs to PaaS (Azure Data Factory, Databricks, Data Lake)',
      'Built real-time streaming framework on Spark Structured Streaming with Medallion architecture',
      'Bond origination interest prediction — matched investor parties to new issuances',
    ],
  },
  {
    company: 'ABN AMRO',
    role: 'Data Scientist — Chief Architecture & Data Management',
    period: 'Oct 2019–Jun 2021',
    bullets: [
      'Mortgage condition assessment from 5 photos — multi-ResNet feeding into BERT',
      'Co-authored data lake metadata-generation framework',
      'Piloted GAN-based synthetic data for privacy-preserving analytics; managed two collaborators',
      'Drove data-science process improvements (versioning, peer review) across internal ML platform',
    ],
  },
  {
    company: 'ABN AMRO',
    role: 'Thesis Intern — Data Science',
    period: 'Mar 2019–Oct 2019',
    bullets: [
      "Master's thesis research on GANs for synthetic tabular data — evaluating whether generated data preserves distributions well enough to sidestep GDPR",
    ],
  },
  {
    company: 'OneTwoModel',
    role: 'CTO & Co-founder',
    period: 'Sep 2019–Nov 2021',
    bullets: [
      'Co-founded startup building products for the modelling industry; split value-prop / product-dev responsibility',
      'Stack: AWS (ECS, EC2), Airflow, Docker, Keras/TensorFlow, NLP tokenization & word embeddings',
    ],
  },
  {
    company: 'TAPP',
    role: 'Data Scientist',
    period: 'Sep 2018–Mar 2019',
    bullets: [
      'Hierarchical product classification from receipt descriptions (Keras + NLP) — replaced manual labelling',
      'Time-series anomaly detection on live data streams; full pipeline from ingestion to analytics',
    ],
  },
];

export const education = [
  {
    company: 'Radboud University',
    role: 'MSc Data Science — ML in Practice, Medical Imaging, Natural Computing, Computational Cognitive Neuroscience',
    period: '2017–2019',
    bullets: [],
  },
  {
    company: 'Radboud University',
    role: 'BSc Computing Science — modeling, databases, calculus, linear algebra, algorithms',
    period: '2013–2017',
    bullets: [],
  },
];

// Shown on the printed CV only (see the @media print block in global.css).
export const summary =
  'AI Research Engineer working on LLM agents in production: evaluation, agent infrastructure, prompt optimization and observability. Seven years shipping ML and data systems in banking and startups, most of it close to production rather than to research.';

export const skills = [
  { label: 'Languages', value: 'Python (expert), SQL, TypeScript/JavaScript, Bash' },
  {
    label: 'LLM & agents',
    value: 'LLM evaluation & LLM-as-a-judge, agent frameworks & tool use, RAG, prompt optimization, red teaming, OpenTelemetry tracing',
  },
  {
    label: 'ML & data',
    value: 'PyTorch, scikit-learn, pandas/Polars, Spark (incl. Structured Streaming), Airflow',
  },
  {
    label: 'Platform',
    value: 'Azure (Data Factory, Databricks, Storage, DevOps), AWS (ECS, EC2, S3), Docker, GitHub Actions, CI/CD',
  },
];

// Icon-only in the printed CV; the href is what carries the address, so these
// stay clickable in the PDF.
export const contactLinks = [
  { icon: 'linkedin', label: 'linkedin.com/in/baukebrenninkmeijer', href: 'https://linkedin.com/in/baukebrenninkmeijer' },
  { icon: 'github', label: 'github.com/Baukebrenninkmeijer', href: 'https://github.com/Baukebrenninkmeijer' },
  { icon: 'globe', label: 'blog.baukebrenninkmeijer.nl', href: 'https://blog.baukebrenninkmeijer.nl' },
] as const;

export const languages = 'Dutch (native), English (fluent), French & German (intermediate)';

export const certifications = [
  { name: 'Microsoft Certified: Power BI Data Analyst Associate', year: '2022' },
  { name: 'Microsoft Certified: Azure AI Fundamentals', year: '2022' },
  { name: 'Microsoft Certified: Azure Fundamentals', year: '2021' },
];

export const publications = [
  {
    title: 'On the Generation and Evaluation of Tabular Data using GANs',
    venue: "Master's thesis, Radboud University",
    year: '2019',
    href: 'https://www.cs.ru.nl/masters-theses/2019/B_Brenninkmeijer___On_the_generation_and_evaluation_of_tabular_data_using_GANs.pdf',
  },
  {
    title: 'Automated Product Recognition for Hospitality Industry Insights',
    venue: 'Blog / write-up',
    year: '2020',
    href: 'https://github.com/Baukebrenninkmeijer/Automated-Product-Classification',
  },
];
