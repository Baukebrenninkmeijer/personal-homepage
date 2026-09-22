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
      'Built the red-teaming module of the evaluation library: framework-agnostic targets, agent simulation and a simplified API, now used to surface vulnerabilities in customer agents',
      'Redesigned the PII detection service around jurisdiction-based recognizers, and consolidated its keyword-matching logic onto one shared implementation',
      'Maintain the CLI toolchain: auth profiles, project workflows, a self-updating terminal assistant, and normalized trace rendering',
      'Agent evaluation: aligning LLM judges against human labels, multi-turn agent simulation, and OpenTelemetry capture of coding-agent traces',
    ],
  },
  {
    company: 'ING (through Sytac)',
    role: 'Senior Consultant / Senior AI Engineer',
    period: 'May 2024–Jul 2025',
    bullets: [
      'Tech lead for MLOps in Global Financial Crime & Fraud Prevention, including Airflow DAG parameterization across countries',
      'Built detection and forecasting for reliability events from Track-and-Trace logs, processing 1TB out of memory with Polars',
      'Rewrote the RAG ingestion pipeline for a sustainability peer-review app: 5× faster, with better extraction quality',
      'Ran day-long hackathons and teaching sessions on testing, pre-commit and merging strategy, and mentored junior Python engineers',
    ],
  },
  {
    company: 'ABN AMRO',
    role: 'Full Stack Data Scientist, Global Markets',
    period: 'Jul 2021–May 2024',
    bullets: [
      'Designed and led platform migration from IaaS VMs to PaaS (Azure Data Factory, Databricks, Data Lake)',
      'Built real-time streaming framework on Spark Structured Streaming with Medallion architecture',
      'Bond origination interest prediction, matching investor parties to new issuances',
    ],
  },
  {
    company: 'OneTwoModel',
    role: 'CTO & Co-founder',
    period: 'Sep 2019–Nov 2021',
    bullets: [
      'Co-founded a startup building products for the modelling industry, splitting responsibility for the value proposition and product development',
      'Stack: AWS (ECS, EC2), Airflow, Docker, Keras/TensorFlow, NLP tokenization & word embeddings',
    ],
  },
];

export const volunteering = [
  {
    company: 'Agentic AI Foundation (Linux Foundation)',
    role: 'Amsterdam Chapter Lead / Organiser',
    period: 'Sep 2024–present',
    bullets: [
      'Run the Amsterdam chapter: speaker curation, sponsor partnerships, venue hosting, roughly 10 events a year',
      'Hosted at ABN AMRO, ING, Adyen, Xomnia, JetBrains and AI House Amsterdam. The Y Combinator special drew 328 attendees, and recent editions fill to a waitlist',
    ],
  },
];

export const education = [
  {
    company: 'Radboud University',
    role: 'MSc Data Science (ML in Practice, Medical Imaging, Natural Computing, Computational Cognitive Neuroscience)',
    period: '2017–2019',
    bullets: [],
  },
  {
    company: 'Radboud University',
    role: 'BSc Computing Science (modeling, databases, calculus, linear algebra, algorithms)',
    period: '2013–2017',
    bullets: [],
  },
];

// Shown on the printed CV only (see the @media print block in global.css).
export const summary =
  'AI Research Engineer working on LLM agents in production: evaluation, agent infrastructure, prompt optimization and observability. Seven years building ML and data systems in banking and startups, at home in both research and production.';

export const skills = [
  {
    label: 'Agents',
    items: ['Agent development lifecycle', 'Multi-agent orchestration', 'Tool use', 'MCP', 'Context engineering', 'Agent memory', 'Agent simulation', 'Red teaming'],
  },
  {
    label: 'Evaluation & LLMs',
    items: ['LLM-as-a-judge', 'Jury alignment', 'Failure taxonomies', 'RAG', 'Prompt engineering', 'Prompt optimization', 'Fine-tuning', 'OpenTelemetry tracing'],
  },
  {
    label: 'Languages & libraries',
    items: ['Python', 'SQL', 'TypeScript', 'Bash', 'Claude Agent SDK', 'OpenAI SDK', 'LangGraph', 'PyTorch', 'pandas/Polars', 'scikit-learn'],
  },
  {
    label: 'Data & platform',
    items: ['Spark', 'Airflow', 'Azure', 'Databricks', 'AWS', 'Docker', 'GitHub Actions', 'CI/CD'],
  },
];

// Icon-only in the printed CV; the href is what carries the address, so these
// stay clickable in the PDF.
export const contactLinks = [
  { icon: 'linkedin', label: 'linkedin.com/in/baukebrenninkmeijer', href: 'https://linkedin.com/in/baukebrenninkmeijer' },
  { icon: 'github', label: 'github.com/Baukebrenninkmeijer', href: 'https://github.com/Baukebrenninkmeijer' },
  { icon: 'globe', label: 'blog.baukebrenninkmeijer.nl', href: 'https://blog.baukebrenninkmeijer.nl' },
] as const;

export const languages = 'Dutch (native), English (fluent), French & German (beginner)';


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
