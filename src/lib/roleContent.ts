export type RoleArticle = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  readingTime: string;
  updatedAt: string;
  sections: Array<{
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
  sources: Array<{
    label: string;
    url: string;
  }>;
};

export const roleArticles: RoleArticle[] = [
  {
    slug: "what-is-an-fde",
    eyebrow: "Role definition",
    title: "What is a Forward Deployed Engineer?",
    description:
      "A practical definition of the FDE role, how it differs from solutions engineering, and why AI companies are rebuilding around it.",
    readingTime: "5 min",
    updatedAt: "2026-05-24",
    sections: [
      {
        heading: "The short version",
        paragraphs: [
          "A Forward Deployed Engineer is an engineer who works close to the customer and ships production systems in the customer context. The role sits between product engineering, solutions architecture, implementation, and strategy.",
          "The point is not to write bespoke glue code forever. The point is to turn messy customer workflows into working software, learn what repeats, and feed those patterns back into the core product."
        ]
      },
      {
        heading: "What FDEs actually do",
        bullets: [
          "Map the customer workflow, data model, constraints, and success criteria.",
          "Build prototypes, integrations, internal tools, agents, evals, and deployment paths.",
          "Work with product and research teams when the customer need exposes a platform gap.",
          "Translate field learning into reusable abstractions, playbooks, and roadmap signal."
        ]
      },
      {
        heading: "How it differs from adjacent roles",
        paragraphs: [
          "A solutions engineer usually proves and explains the product before or during a sale. An implementation consultant often configures a known solution after purchase. An FDE is usually expected to build, debug, and own ambiguous technical delivery when the product still needs adaptation to become valuable.",
          "The best FDE roles are engineering roles with customer proximity, not sales roles with a more technical title."
        ]
      }
    ],
    sources: [
      {
        label: "a16z: services-led growth and the rise of FDEs",
        url: "https://a16z.com/services-led-growth/"
      },
      {
        label: "Pave: Is the Forward Deployed Engineer on the rise?",
        url: "https://www.pave.com/blog-posts/forward-deployed-engineer-on-the-rise"
      }
    ]
  },
  {
    slug: "what-makes-a-good-fde",
    eyebrow: "Role archetype",
    title: "What makes a good FDE?",
    description:
      "The traits, operating habits, and tradeoffs that separate strong FDEs from generic customer-facing engineers.",
    readingTime: "6 min",
    updatedAt: "2026-05-25",
    sections: [
      {
        heading: "They are builders first",
        paragraphs: [
          "A strong FDE can ship. They are comfortable moving from a customer conversation to a design sketch to a working artifact without waiting for every requirement to be perfect.",
          "They do not need to be the deepest specialist in every stack, but they need enough engineering range to debug data, APIs, workflows, auth, UI, model behavior, and deployment details."
        ]
      },
      {
        heading: "They optimize for outcomes, not the statement of work",
        paragraphs: [
          "The job is not to satisfy the literal SOW and disappear. A strong FDE keeps asking whether the customer's actual operating problem has been solved.",
          "That may mean challenging the scope, simplifying a requested feature, or building a different path if it gets the customer to the outcome faster. The written ask is often only a proxy for the real workflow problem."
        ],
        bullets: [
          "Translate deliverables into customer outcomes and measurable change.",
          "Notice when the requested feature would not actually move the business result.",
          "Keep engineering judgment in the loop instead of treating implementation as order-taking."
        ]
      },
      {
        heading: "They deeply understand the customer problem",
        paragraphs: [
          "Nabeel Qureshi's reflection on Palantir captures the core field lesson: FDEs gained leverage by getting close enough to understand how customers actually worked, not just by collecting requirements.",
          "Good FDEs become fluent in the customer's world: workflows, incentives, constraints, data, institutional language, and what failure looks like. They spend enough time with users to understand why the problem exists, not only what the customer says they want."
        ],
        bullets: [
          "Learn the customer's operational context before designing the system.",
          "Build trust with users close enough to see whether the tool changes the work.",
          "Bring that context back into product and platform decisions.",
          "They can explain technical tradeoffs to executives without losing the engineering truth."
        ]
      },
      {
        heading: "They create leverage",
        paragraphs: [
          "The best FDEs do not heroically solve the same problem ten times. They notice repetition and turn field work into templates, internal tooling, integrations, product changes, and sharper sales qualification.",
          "This is why FDE work can be strategic. It can reveal which customer workflows are worth owning and which custom requests should stay custom."
        ]
      },
      {
        heading: "The tradeoff",
        paragraphs: [
          "FDE work can involve travel, context switching, ambiguous ownership, and pressure from revenue teams. Good FDEs are energized by proximity to the real problem, but they still need a product organization that converts field learning into platform progress."
        ]
      }
    ],
    sources: [
      {
        label: "a16z: Trading margin for moat",
        url: "https://a16z.com/services-led-growth/"
      },
      {
        label: "a16z: Forward-deployed job titles",
        url: "https://a16z.com/forward-deployed-job-titles/"
      },
      {
        label: "Nabeel Qureshi: Reflections on Palantir",
        url: "https://nabeelqu.co/reflections-on-palantir"
      }
    ]
  },
  {
    slug: "why-fde-job-volumes-are-exploding",
    eyebrow: "Market growth",
    title: "Why FDE job volumes are exploding",
    description:
      "Why AI companies are hiring more FDEs, why the role is appearing under multiple titles, and what to watch as the market matures.",
    readingTime: "7 min",
    updatedAt: "2026-05-24",
    sections: [
      {
        heading: "AI products need deployment, not just demos",
        paragraphs: [
          "Many AI products look magical in a demo and messy inside a real enterprise. The hard part is often workflow redesign, data access, permissions, evals, reliability, and adoption.",
          "That gap creates demand for engineers who can sit near the customer, build the missing pieces, and turn model capability into production behavior."
        ]
      },
      {
        heading: "Services are becoming a wedge, not a weakness",
        paragraphs: [
          "For years, software companies often treated implementation work as lower-quality revenue. AI has changed the tradeoff. When the product category is still forming, hands-on deployment work can reveal the actual system of record a company should become.",
          "This is the core argument behind services-led growth: the company that solves the workflow deeply may earn the right to own the software layer later."
        ]
      },
      {
        heading: "The title is spreading",
        bullets: [
          "Some companies use Forward Deployed Engineer directly.",
          "Others hire AI Deployment Engineers, Deployed Engineers, Customer Engineers, Field Engineers, Solutions Architects, or Technical Deployment Leads for similar work.",
          "The job-board signal is therefore bigger than exact-title FDE postings, but exact-title tracking is still useful because it shows where the market is naming the role explicitly."
        ]
      },
      {
        heading: "What the data says",
        paragraphs: [
          "Pave reported that the FDE title was still rare in its dataset as of September 2025, while showing a sharp rise in the share of companies with the role. That combination is important: the role is early, but the slope is steep.",
          "This site tracks both live roles from company career pages and a separate weekly market snapshot for exact-title Forward Deployed Engineer listings."
        ]
      }
    ],
    sources: [
      {
        label: "Pave: FDE adoption trend",
        url: "https://www.pave.com/blog-posts/forward-deployed-engineer-on-the-rise"
      },
      {
        label: "a16z: Services-led growth",
        url: "https://a16z.com/services-led-growth/"
      }
    ]
  },
  {
    slug: "how-to-get-an-fde-role",
    eyebrow: "Candidate playbook",
    title: "How to Get an FDE Role",
    description:
      "A practical guide to positioning yourself for Forward Deployed Engineer roles, preparing for interviews, and using referrals well.",
    readingTime: "8 min",
    updatedAt: "2026-05-26",
    sections: [
      {
        heading: "What an FDE does",
        paragraphs: [
          "An FDE turns ambiguous customer problems into working software. The work usually blends product engineering, solutions architecture, implementation, and strategic customer discovery.",
          "The strongest candidates can move from a messy workflow conversation into a technical design, ship the first version, instrument whether it works, and feed the learning back into the product."
        ]
      },
      {
        heading: "Why FDE roles are growing",
        paragraphs: [
          "AI products often need real deployment work before customers see durable value. Data access, permissions, workflow redesign, evals, and reliability all happen inside the customer's operating context.",
          "That makes customer-proximate engineers more valuable. Companies want people who can make AI systems useful in production, not just demo them."
        ]
      },
      {
        heading: "Skills companies look for",
        bullets: [
          "Strong software engineering fundamentals across APIs, data, auth, cloud, and debugging.",
          "Production AI experience: RAG, agents, evals, observability, model APIs, and failure analysis.",
          "Customer judgment: asking sharper questions, reducing scope, and understanding the real workflow.",
          "Written communication: crisp design docs, tradeoff explanations, and customer-facing updates.",
          "Taste for outcomes over activity: the point is changed customer behavior, not a longer statement of work."
        ]
      },
      {
        heading: "How to position your background",
        paragraphs: [
          "If you come from product engineering, emphasize the moments where you owned messy requirements, worked directly with users, or made product tradeoffs under uncertainty.",
          "If you come from solutions engineering or consulting, emphasize the systems you actually built, automated, debugged, or shipped. Hiring teams need to see engineering depth, not just customer polish.",
          "If you come from data or ML, frame your experience around production reliability: how you evaluated outputs, handled edge cases, integrated with systems of record, and measured whether the workflow improved."
        ]
      },
      {
        heading: "How to prepare for interviews",
        bullets: [
          "Prepare two concrete stories about ambiguous customer problems you turned into shipped systems.",
          "Be ready to whiteboard a customer workflow and identify what should be productized versus kept custom.",
          "Practice explaining a technical architecture to both an engineering peer and a commercial stakeholder.",
          "Expect a build or debugging exercise. They are testing whether you can move quickly without losing judgment.",
          "Bring a point of view on AI deployment: evals, data boundaries, model choice, latency, cost, and human review."
        ]
      },
      {
        heading: "How referrals help",
        paragraphs: [
          "FDE roles are trust-heavy. Hiring managers want evidence that you can represent the company in high-stakes customer contexts while still being a serious engineer.",
          "A warm referral helps because it can quickly answer the hardest questions: does this person ship, do they understand customers, and would we trust them in the field?"
        ]
      },
      {
        heading: "Get on the shortlist",
        paragraphs: [
          "The best opportunities are often not the most visible postings. Join the candidate list if you want to be considered for exclusive FDE job offers, warm referrals, founder introductions where relevant, private events, and practical FDE guides."
        ]
      }
    ],
    sources: [
      {
        label: "a16z: Services-led growth",
        url: "https://a16z.com/services-led-growth/"
      },
      {
        label: "Nabeel Qureshi: Reflections on Palantir",
        url: "https://nabeelqu.co/reflections-on-palantir"
      },
      {
        label: "Pave: Is the Forward Deployed Engineer on the rise?",
        url: "https://www.pave.com/blog-posts/forward-deployed-engineer-on-the-rise"
      }
    ]
  }
];

export function getRoleArticle(slug: string) {
  return roleArticles.find((article) => article.slug === slug);
}

const baseHref = import.meta.env.BASE_URL.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function roleArticlePath(slug: string) {
  return `${baseHref}content/${slug}/`;
}

export const roleHubPath = `${baseHref}content/`;
