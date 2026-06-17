// ============================================
// TalentLens — Candidate Profiles
// 22 realistic, detailed candidate profiles
// ============================================

export const CANDIDATES = [
    {
        id: 'c001',
        name: 'Sarah Chen',
        avatar: '👩‍💻',
        currentTitle: 'Senior Full-Stack Engineer',
        currentCompany: 'Stripe',
        location: 'San Francisco, CA',
        yearsOfExperience: 7,
        education: { degree: 'M.S. Computer Science', institution: 'Stanford University', year: 2017 },
        skills: ['react', 'typescript', 'nodejs', 'python', 'postgresql', 'aws', 'docker', 'kubernetes', 'graphql', 'redis', 'system_design', 'microservices', 'cicd', 'unit_testing', 'rest_api', 'git'],
        experience: [
            { role: 'Senior Full-Stack Engineer', company: 'Stripe', duration: '2021–Present', years: 3, description: 'Led development of payment processing APIs handling $2B+ annual volume. Architected microservices migration reducing latency by 40%.' },
            { role: 'Full-Stack Engineer', company: 'Airbnb', duration: '2019–2021', years: 2, description: 'Built search and discovery features serving 150M+ users. Implemented real-time pricing engine.' },
            { role: 'Software Engineer', company: 'Google', duration: '2017–2019', years: 2, description: 'Worked on Google Maps backend services. Contributed to location services API used by 1B+ devices.' }
        ],
        certifications: ['AWS Solutions Architect'],
        openSourceContributions: 3,
        publications: 1,
        teamSizeManaged: 5,
        behavioralSignals: { leadership: 0.85, autonomy: 0.9, collaboration: 0.88, mentoring: 0.8, innovation: 0.85 }
    },
    {
        id: 'c002',
        name: 'Marcus Johnson',
        avatar: '👨‍💻',
        currentTitle: 'Engineering Manager',
        currentCompany: 'Meta',
        location: 'Menlo Park, CA',
        yearsOfExperience: 10,
        education: { degree: 'B.S. Computer Science', institution: 'MIT', year: 2014 },
        skills: ['python', 'java', 'react', 'system_design', 'distributed_systems', 'team_management', 'tech_lead', 'aws', 'kubernetes', 'machine_learning', 'scalability', 'agile', 'mentoring', 'microservices', 'cicd'],
        experience: [
            { role: 'Engineering Manager', company: 'Meta', duration: '2022–Present', years: 2, description: 'Managing team of 12 engineers building Meta\'s ad targeting platform. Drove 25% improvement in ad relevance scores.' },
            { role: 'Senior Staff Engineer', company: 'Meta', duration: '2019–2022', years: 3, description: 'Designed and implemented real-time ML inference pipeline processing 10M+ requests/sec.' },
            { role: 'Senior Software Engineer', company: 'Netflix', duration: '2016–2019', years: 3, description: 'Built content recommendation engine. Led migration to microservices architecture.' },
            { role: 'Software Engineer', company: 'Amazon', duration: '2014–2016', years: 2, description: 'Worked on AWS Lambda infrastructure. Built internal deployment automation tools.' }
        ],
        certifications: ['AWS Solutions Architect Professional'],
        openSourceContributions: 8,
        publications: 3,
        teamSizeManaged: 12,
        behavioralSignals: { leadership: 0.95, autonomy: 0.85, collaboration: 0.9, mentoring: 0.92, innovation: 0.88 }
    },
    {
        id: 'c003',
        name: 'Priya Patel',
        avatar: '👩‍🔬',
        currentTitle: 'ML Engineer',
        currentCompany: 'OpenAI',
        location: 'San Francisco, CA',
        yearsOfExperience: 5,
        education: { degree: 'Ph.D. Machine Learning', institution: 'Carnegie Mellon University', year: 2019 },
        skills: ['python', 'pytorch', 'tensorflow', 'machine_learning', 'deep_learning', 'nlp', 'llm', 'transformers', 'docker', 'kubernetes', 'aws', 'data_science', 'statistics', 'mlops', 'computer_vision'],
        experience: [
            { role: 'ML Engineer', company: 'OpenAI', duration: '2022–Present', years: 2, description: 'Core contributor to GPT model fine-tuning pipeline. Developed RLHF infrastructure for language model alignment.' },
            { role: 'Research Scientist', company: 'DeepMind', duration: '2019–2022', years: 3, description: 'Published 5 papers on transformer architectures. Developed novel attention mechanisms improving model efficiency by 30%.' }
        ],
        certifications: ['Google Professional ML Engineer'],
        openSourceContributions: 12,
        publications: 8,
        teamSizeManaged: 3,
        behavioralSignals: { leadership: 0.7, autonomy: 0.95, collaboration: 0.75, mentoring: 0.72, innovation: 0.98 }
    },
    {
        id: 'c004',
        name: 'James Rodriguez',
        avatar: '👨‍🎨',
        currentTitle: 'Senior Frontend Engineer',
        currentCompany: 'Figma',
        location: 'New York, NY',
        yearsOfExperience: 6,
        education: { degree: 'B.S. Computer Science', institution: 'UC Berkeley', year: 2018 },
        skills: ['react', 'typescript', 'nextjs', 'javascript', 'css', 'html', 'vue', 'svelte', 'graphql_client', 'redux', 'tailwind', 'storybook', 'accessibility', 'responsive_design', 'design_system', 'unit_testing', 'pwa', 'threejs', 'figma', 'webpack', 'vite', 'git'],
        experience: [
            { role: 'Senior Frontend Engineer', company: 'Figma', duration: '2022–Present', years: 2, description: 'Building high-performance collaborative editing features using WebGL and Canvas APIs. Reduced rendering latency by 60%.' },
            { role: 'Frontend Engineer', company: 'Vercel', duration: '2020–2022', years: 2, description: 'Contributed to Next.js framework development. Built developer dashboard serving 500K+ developers.' },
            { role: 'UI Engineer', company: 'Shopify', duration: '2018–2020', years: 2, description: 'Built Polaris design system components. Improved merchant dashboard performance by 45%.' }
        ],
        certifications: [],
        openSourceContributions: 15,
        publications: 0,
        teamSizeManaged: 0,
        behavioralSignals: { leadership: 0.6, autonomy: 0.88, collaboration: 0.82, mentoring: 0.65, innovation: 0.92 }
    },
    {
        id: 'c005',
        name: 'Emily Watson',
        avatar: '👩‍💼',
        currentTitle: 'Principal Engineer',
        currentCompany: 'Datadog',
        location: 'Boston, MA',
        yearsOfExperience: 12,
        education: { degree: 'M.S. Computer Science', institution: 'MIT', year: 2012 },
        skills: ['go', 'python', 'java', 'system_design', 'distributed_systems', 'kubernetes', 'docker', 'aws', 'google_cloud', 'postgresql', 'elasticsearch', 'redis', 'microservices', 'scalability', 'event_driven', 'grpc', 'performance', 'tech_lead', 'team_management', 'mentoring', 'cicd', 'terraform', 'prometheus', 'datadog'],
        experience: [
            { role: 'Principal Engineer', company: 'Datadog', duration: '2021–Present', years: 3, description: 'Architecting next-gen observability platform. Leading technical strategy for infrastructure monitoring serving 25K+ enterprise customers.' },
            { role: 'Staff Engineer', company: 'Cloudflare', duration: '2018–2021', years: 3, description: 'Designed edge computing platform handling 30M+ requests/sec. Led team of 8 senior engineers.' },
            { role: 'Senior Engineer', company: 'LinkedIn', duration: '2014–2018', years: 4, description: 'Built real-time data pipeline processing 1T+ events/day. Core contributor to Kafka ecosystem.' },
            { role: 'Software Engineer', company: 'IBM', duration: '2012–2014', years: 2, description: 'Developed cloud infrastructure services for enterprise clients.' }
        ],
        certifications: ['AWS Solutions Architect Professional', 'CKA'],
        openSourceContributions: 20,
        publications: 5,
        teamSizeManaged: 8,
        behavioralSignals: { leadership: 0.95, autonomy: 0.92, collaboration: 0.85, mentoring: 0.95, innovation: 0.9 }
    },
    {
        id: 'c006',
        name: 'David Kim',
        avatar: '👨‍🔧',
        currentTitle: 'DevOps Lead',
        currentCompany: 'HashiCorp',
        location: 'Remote',
        yearsOfExperience: 8,
        education: { degree: 'B.S. Information Technology', institution: 'Georgia Tech', year: 2016 },
        skills: ['terraform', 'kubernetes', 'docker', 'aws', 'google_cloud', 'azure', 'linux', 'python', 'go', 'ansible', 'cicd', 'jenkins', 'github_actions', 'gitlab_ci', 'prometheus', 'grafana', 'nginx', 'helm', 'cloud_native', 'security'],
        experience: [
            { role: 'DevOps Lead', company: 'HashiCorp', duration: '2022–Present', years: 2, description: 'Leading infrastructure automation team. Designed multi-cloud deployment patterns for Fortune 500 clients.' },
            { role: 'Senior DevOps Engineer', company: 'GitLab', duration: '2019–2022', years: 3, description: 'Built CI/CD pipeline infrastructure serving 30M+ developers. Reduced deployment times by 70%.' },
            { role: 'Cloud Engineer', company: 'AWS', duration: '2016–2019', years: 3, description: 'Developed internal infrastructure tooling for EC2 service. Managed infrastructure for 10K+ servers.' }
        ],
        certifications: ['CKA', 'AWS DevOps Professional', 'HashiCorp Terraform Associate'],
        openSourceContributions: 18,
        publications: 2,
        teamSizeManaged: 6,
        behavioralSignals: { leadership: 0.82, autonomy: 0.9, collaboration: 0.78, mentoring: 0.85, innovation: 0.8 }
    },
    {
        id: 'c007',
        name: 'Aisha Mohammed',
        avatar: '👩‍🏫',
        currentTitle: 'Data Scientist',
        currentCompany: 'Spotify',
        location: 'London, UK',
        yearsOfExperience: 4,
        education: { degree: 'M.S. Statistics', institution: 'Oxford University', year: 2020 },
        skills: ['python', 'r_lang', 'machine_learning', 'data_science', 'statistics', 'pandas', 'numpy', 'sklearn', 'tensorflow', 'sql', 'spark', 'airflow', 'recommender_systems', 'data_engineering', 'aws'],
        experience: [
            { role: 'Data Scientist', company: 'Spotify', duration: '2022–Present', years: 2, description: 'Building recommendation algorithms serving 500M+ users. Improved playlist personalization by 35% through novel collaborative filtering.' },
            { role: 'Junior Data Scientist', company: 'BBC', duration: '2020–2022', years: 2, description: 'Developed content recommendation engine for BBC iPlayer. Built A/B testing framework for data experiments.' }
        ],
        certifications: ['AWS Machine Learning Specialty'],
        openSourceContributions: 5,
        publications: 2,
        teamSizeManaged: 0,
        behavioralSignals: { leadership: 0.55, autonomy: 0.8, collaboration: 0.85, mentoring: 0.6, innovation: 0.82 }
    },
    {
        id: 'c008',
        name: 'Alex Turner',
        avatar: '🧑‍💻',
        currentTitle: 'Senior Backend Engineer',
        currentCompany: 'Uber',
        location: 'Seattle, WA',
        yearsOfExperience: 8,
        education: { degree: 'B.S. Computer Science', institution: 'University of Washington', year: 2016 },
        skills: ['java', 'go', 'python', 'spring_boot', 'microservices', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes', 'aws', 'rest_api', 'grpc', 'event_driven', 'system_design', 'scalability', 'cicd', 'performance'],
        experience: [
            { role: 'Senior Backend Engineer', company: 'Uber', duration: '2021–Present', years: 3, description: 'Building ride-matching microservices handling 20M+ daily trips. Optimized matching algorithm reducing wait times by 15%.' },
            { role: 'Backend Engineer', company: 'Twitter', duration: '2018–2021', years: 3, description: 'Developed timeline serving infrastructure. Built real-time tweet processing pipeline handling 500K tweets/min.' },
            { role: 'Software Engineer', company: 'Microsoft', duration: '2016–2018', years: 2, description: 'Worked on Azure Functions serverless platform. Built auto-scaling infrastructure.' }
        ],
        certifications: ['AWS Solutions Architect'],
        openSourceContributions: 6,
        publications: 1,
        teamSizeManaged: 3,
        behavioralSignals: { leadership: 0.72, autonomy: 0.88, collaboration: 0.8, mentoring: 0.7, innovation: 0.78 }
    },
    {
        id: 'c009',
        name: 'Lisa Park',
        avatar: '👩‍🎨',
        currentTitle: 'Product Designer & Frontend Dev',
        currentCompany: 'Linear',
        location: 'San Francisco, CA',
        yearsOfExperience: 5,
        education: { degree: 'B.F.A. Interaction Design', institution: 'RISD', year: 2019 },
        skills: ['react', 'typescript', 'css', 'html', 'figma', 'ui_design', 'ux_design', 'design_system', 'accessibility', 'responsive_design', 'tailwind', 'nextjs', 'storybook', 'javascript'],
        experience: [
            { role: 'Product Designer & Frontend Dev', company: 'Linear', duration: '2022–Present', years: 2, description: 'Designing and implementing UI for productivity tool used by 10K+ teams. Bridging design and engineering.' },
            { role: 'Design Engineer', company: 'Notion', duration: '2020–2022', years: 2, description: 'Built component library and design system. Implemented complex editor interactions.' },
            { role: 'UI Developer', company: 'InVision', duration: '2019–2020', years: 1, description: 'Developed design tool prototyping features. Worked on cross-platform consistency.' }
        ],
        certifications: [],
        openSourceContributions: 4,
        publications: 0,
        teamSizeManaged: 0,
        behavioralSignals: { leadership: 0.55, autonomy: 0.85, collaboration: 0.9, mentoring: 0.5, innovation: 0.88 }
    },
    {
        id: 'c010',
        name: 'Ryan O\'Brien',
        avatar: '👨‍🚀',
        currentTitle: 'Staff Engineer',
        currentCompany: 'Coinbase',
        location: 'Remote',
        yearsOfExperience: 9,
        education: { degree: 'M.S. Computer Science', institution: 'Carnegie Mellon University', year: 2015 },
        skills: ['typescript', 'react', 'nodejs', 'python', 'go', 'postgresql', 'redis', 'aws', 'docker', 'kubernetes', 'system_design', 'microservices', 'security', 'authentication', 'encryption', 'fintech', 'scalability', 'event_driven', 'cicd', 'terraform'],
        experience: [
            { role: 'Staff Engineer', company: 'Coinbase', duration: '2021–Present', years: 3, description: 'Leading security-critical trading platform architecture. Designed zero-trust authentication system for $100B+ in assets.' },
            { role: 'Senior Engineer', company: 'Square', duration: '2018–2021', years: 3, description: 'Built payment processing infrastructure. Implemented PCI-DSS compliant payment gateway handling $50B+ annually.' },
            { role: 'Software Engineer', company: 'Goldman Sachs', duration: '2015–2018', years: 3, description: 'Developed algorithmic trading systems. Built real-time market data processing pipeline.' }
        ],
        certifications: ['CISSP', 'AWS Security Specialty'],
        openSourceContributions: 7,
        publications: 2,
        teamSizeManaged: 4,
        behavioralSignals: { leadership: 0.82, autonomy: 0.9, collaboration: 0.75, mentoring: 0.78, innovation: 0.83 }
    },
    {
        id: 'c011',
        name: 'Nina Volkov',
        avatar: '👩‍🔬',
        currentTitle: 'Mobile Lead',
        currentCompany: 'Duolingo',
        location: 'Pittsburgh, PA',
        yearsOfExperience: 7,
        education: { degree: 'B.S. Computer Science', institution: 'University of Michigan', year: 2017 },
        skills: ['swift', 'kotlin', 'react_native', 'flutter', 'ios', 'android', 'cross_platform', 'jetpack_compose', 'typescript', 'javascript', 'firebase_db', 'rest_api', 'cicd', 'unit_testing', 'agile', 'tech_lead'],
        experience: [
            { role: 'Mobile Lead', company: 'Duolingo', duration: '2022–Present', years: 2, description: 'Leading mobile engineering team of 8. Architected cross-platform strategy serving 50M+ monthly active users.' },
            { role: 'Senior iOS Engineer', company: 'Uber', duration: '2019–2022', years: 3, description: 'Built rider app features used by millions. Implemented real-time location tracking and ride animations.' },
            { role: 'Mobile Developer', company: 'Lyft', duration: '2017–2019', years: 2, description: 'Developed driver-side mobile app. Built offline-first architecture for low-connectivity areas.' }
        ],
        certifications: ['Google Associate Android Developer'],
        openSourceContributions: 9,
        publications: 1,
        teamSizeManaged: 8,
        behavioralSignals: { leadership: 0.85, autonomy: 0.82, collaboration: 0.88, mentoring: 0.8, innovation: 0.82 }
    },
    {
        id: 'c012',
        name: 'Tom Harrison',
        avatar: '🧑‍🔧',
        currentTitle: 'Junior Software Engineer',
        currentCompany: 'Startup (Series A)',
        location: 'Austin, TX',
        yearsOfExperience: 2,
        education: { degree: 'B.S. Computer Science', institution: 'University of Texas at Austin', year: 2022 },
        skills: ['javascript', 'react', 'nodejs', 'python', 'mongodb', 'html', 'css', 'git', 'docker', 'rest_api', 'agile', 'unit_testing'],
        experience: [
            { role: 'Junior Software Engineer', company: 'TechStartup Inc.', duration: '2022–Present', years: 2, description: 'Full-stack development on SaaS platform. Built customer onboarding flow increasing conversion by 20%.' },
            { role: 'Software Engineering Intern', company: 'Dell', duration: '2021–2021', years: 0.5, description: 'Developed internal tooling for hardware testing automation.' }
        ],
        certifications: [],
        openSourceContributions: 2,
        publications: 0,
        teamSizeManaged: 0,
        behavioralSignals: { leadership: 0.35, autonomy: 0.6, collaboration: 0.75, mentoring: 0.2, innovation: 0.65 }
    },
    {
        id: 'c013',
        name: 'Dr. Wei Zhang',
        avatar: '👨‍🔬',
        currentTitle: 'Senior Research Scientist',
        currentCompany: 'Google Brain',
        location: 'Mountain View, CA',
        yearsOfExperience: 8,
        education: { degree: 'Ph.D. Artificial Intelligence', institution: 'UC Berkeley', year: 2016 },
        skills: ['python', 'pytorch', 'tensorflow', 'machine_learning', 'deep_learning', 'nlp', 'computer_vision', 'llm', 'transformers', 'statistics', 'data_science', 'cuda', 'distributed_systems', 'mlops', 'research'],
        experience: [
            { role: 'Senior Research Scientist', company: 'Google Brain', duration: '2020–Present', years: 4, description: 'Leading research on multimodal foundation models. Published 15+ papers at top venues (NeurIPS, ICML, CVPR).' },
            { role: 'Research Scientist', company: 'Facebook AI Research', duration: '2016–2020', years: 4, description: 'Developed self-supervised learning methods for vision and language. Co-authored FAIR\'s influential paper on visual pre-training.' }
        ],
        certifications: [],
        openSourceContributions: 25,
        publications: 22,
        teamSizeManaged: 4,
        behavioralSignals: { leadership: 0.7, autonomy: 0.98, collaboration: 0.72, mentoring: 0.75, innovation: 0.99 }
    },
    {
        id: 'c014',
        name: 'Sophie Martinez',
        avatar: '👩‍💻',
        currentTitle: 'Full-Stack Developer',
        currentCompany: 'Shopify',
        location: 'Toronto, Canada',
        yearsOfExperience: 4,
        education: { degree: 'B.S. Software Engineering', institution: 'University of Toronto', year: 2020 },
        skills: ['ruby', 'rails', 'react', 'typescript', 'javascript', 'postgresql', 'redis', 'graphql', 'docker', 'cicd', 'rest_api', 'html', 'css', 'agile', 'ecommerce', 'unit_testing'],
        experience: [
            { role: 'Full-Stack Developer', company: 'Shopify', duration: '2021–Present', years: 3, description: 'Building merchant-facing tools on the Shopify platform. Led rebuild of checkout customization engine serving 2M+ merchants.' },
            { role: 'Junior Developer', company: 'Wealthsimple', duration: '2020–2021', years: 1, description: 'Developed financial dashboard features. Built investment portfolio visualization components.' }
        ],
        certifications: [],
        openSourceContributions: 6,
        publications: 0,
        teamSizeManaged: 0,
        behavioralSignals: { leadership: 0.5, autonomy: 0.78, collaboration: 0.85, mentoring: 0.45, innovation: 0.72 }
    },
    {
        id: 'c015',
        name: 'Omar Hassan',
        avatar: '👨‍💻',
        currentTitle: 'Cloud Architect',
        currentCompany: 'Snowflake',
        location: 'San Mateo, CA',
        yearsOfExperience: 11,
        education: { degree: 'M.S. Distributed Computing', institution: 'ETH Zurich', year: 2013 },
        skills: ['aws', 'google_cloud', 'azure', 'terraform', 'kubernetes', 'docker', 'python', 'go', 'system_design', 'distributed_systems', 'scalability', 'cloud_native', 'serverless', 'security', 'performance', 'tech_lead', 'team_management'],
        experience: [
            { role: 'Cloud Architect', company: 'Snowflake', duration: '2021–Present', years: 3, description: 'Designing multi-cloud data platform architecture. Led migration to cloud-native infrastructure reducing costs by 40%.' },
            { role: 'Principal Cloud Engineer', company: 'Databricks', duration: '2018–2021', years: 3, description: 'Architected auto-scaling Spark clusters on AWS/Azure. Managed infrastructure for 5K+ enterprise customers.' },
            { role: 'Senior Cloud Engineer', company: 'Google Cloud', duration: '2015–2018', years: 3, description: 'Built GKE (Google Kubernetes Engine) core components. Contributed to Kubernetes open-source project.' },
            { role: 'Systems Engineer', company: 'Oracle', duration: '2013–2015', years: 2, description: 'Developed cloud infrastructure automation for Oracle Cloud.' }
        ],
        certifications: ['AWS Solutions Architect Professional', 'CKA', 'GCP Professional Cloud Architect'],
        openSourceContributions: 14,
        publications: 3,
        teamSizeManaged: 10,
        behavioralSignals: { leadership: 0.9, autonomy: 0.92, collaboration: 0.82, mentoring: 0.88, innovation: 0.85 }
    },
    {
        id: 'c016',
        name: 'Mia Thompson',
        avatar: '👩‍🏭',
        currentTitle: 'QA Lead / SDET',
        currentCompany: 'Microsoft',
        location: 'Redmond, WA',
        yearsOfExperience: 6,
        education: { degree: 'B.S. Computer Science', institution: 'Purdue University', year: 2018 },
        skills: ['python', 'java', 'typescript', 'test_automation', 'unit_testing', 'integration_testing', 'cicd', 'docker', 'selenium', 'azure', 'agile', 'performance', 'security'],
        experience: [
            { role: 'QA Lead / SDET', company: 'Microsoft', duration: '2021–Present', years: 3, description: 'Leading test automation strategy for Azure DevOps. Built comprehensive E2E testing framework reducing bug escape rate by 60%.' },
            { role: 'SDET', company: 'Amazon', duration: '2019–2021', years: 2, description: 'Developed automated testing infrastructure for Prime Video. Built load testing framework simulating 1M+ concurrent users.' },
            { role: 'QA Engineer', company: 'Atlassian', duration: '2018–2019', years: 1, description: 'Built test automation for Jira Cloud. Implemented visual regression testing pipeline.' }
        ],
        certifications: ['ISTQB Advanced'],
        openSourceContributions: 3,
        publications: 0,
        teamSizeManaged: 4,
        behavioralSignals: { leadership: 0.72, autonomy: 0.8, collaboration: 0.88, mentoring: 0.7, innovation: 0.68 }
    },
    {
        id: 'c017',
        name: 'Carlos Rivera',
        avatar: '👨‍🎓',
        currentTitle: 'Backend Engineer',
        currentCompany: 'Twitch',
        location: 'San Francisco, CA',
        yearsOfExperience: 3,
        education: { degree: 'B.S. Computer Engineering', institution: 'University of Illinois', year: 2021 },
        skills: ['go', 'python', 'typescript', 'nodejs', 'postgresql', 'redis', 'docker', 'aws', 'rest_api', 'graphql', 'websockets', 'cicd', 'git', 'agile', 'linux'],
        experience: [
            { role: 'Backend Engineer', company: 'Twitch', duration: '2022–Present', years: 2, description: 'Building real-time chat and messaging infrastructure handling 10M+ concurrent connections.' },
            { role: 'Software Engineer Intern → Full-time', company: 'Twitch', duration: '2021–2022', years: 1, description: 'Converted from intern to full-time. Built moderation tools and API rate limiting system.' }
        ],
        certifications: [],
        openSourceContributions: 4,
        publications: 0,
        teamSizeManaged: 0,
        behavioralSignals: { leadership: 0.45, autonomy: 0.75, collaboration: 0.82, mentoring: 0.3, innovation: 0.72 }
    },
    {
        id: 'c018',
        name: 'Hannah Wright',
        avatar: '👩‍💻',
        currentTitle: 'Senior Data Engineer',
        currentCompany: 'Databricks',
        location: 'Amsterdam, Netherlands',
        yearsOfExperience: 7,
        education: { degree: 'M.S. Data Science', institution: 'University of Amsterdam', year: 2017 },
        skills: ['python', 'scala', 'sql', 'spark', 'airflow', 'data_engineering', 'big_data', 'aws', 'google_cloud', 'docker', 'kubernetes', 'postgresql', 'mongodb', 'terraform', 'cicd', 'machine_learning'],
        experience: [
            { role: 'Senior Data Engineer', company: 'Databricks', duration: '2021–Present', years: 3, description: 'Building data platform features for enterprise customers. Designed lakehouse architecture processing 10PB+ daily.' },
            { role: 'Data Engineer', company: 'Booking.com', duration: '2018–2021', years: 3, description: 'Built real-time data pipeline for pricing optimization. Processed 1B+ events/day for search ranking.' },
            { role: 'Junior Data Engineer', company: 'ING Bank', duration: '2017–2018', years: 1, description: 'Developed ETL pipelines for regulatory reporting. Built data quality monitoring dashboard.' }
        ],
        certifications: ['Databricks Certified Data Engineer', 'AWS Data Analytics Specialty'],
        openSourceContributions: 7,
        publications: 1,
        teamSizeManaged: 2,
        behavioralSignals: { leadership: 0.65, autonomy: 0.85, collaboration: 0.8, mentoring: 0.6, innovation: 0.78 }
    },
    {
        id: 'c019',
        name: 'Jake Morrison',
        avatar: '🧑‍💻',
        currentTitle: 'Founding Engineer',
        currentCompany: 'AI Startup (Seed)',
        location: 'New York, NY',
        yearsOfExperience: 5,
        education: { degree: 'B.S. Computer Science', institution: 'Columbia University', year: 2019 },
        skills: ['typescript', 'react', 'nextjs', 'nodejs', 'python', 'postgresql', 'redis', 'aws', 'docker', 'machine_learning', 'llm', 'rest_api', 'graphql', 'cicd', 'system_design', 'startup', 'product_management', 'agile'],
        experience: [
            { role: 'Founding Engineer', company: 'AI Startup', duration: '2023–Present', years: 1, description: 'Built entire product from 0 to 1. Designed LLM-powered analytics platform now serving 200+ enterprise clients. Raised $5M seed.' },
            { role: 'Full-Stack Engineer', company: 'Notion', duration: '2021–2023', years: 2, description: 'Built collaborative workspace features. Implemented real-time sync engine for block-based editing.' },
            { role: 'Software Engineer', company: 'Bloomberg', duration: '2019–2021', years: 2, description: 'Developed financial data visualization tools. Built real-time market analytics dashboard.' }
        ],
        certifications: [],
        openSourceContributions: 10,
        publications: 0,
        teamSizeManaged: 3,
        behavioralSignals: { leadership: 0.82, autonomy: 0.95, collaboration: 0.78, mentoring: 0.55, innovation: 0.92 }
    },
    {
        id: 'c020',
        name: 'Rachel Cooper',
        avatar: '👩‍🔧',
        currentTitle: 'Site Reliability Engineer',
        currentCompany: 'Google',
        location: 'Zurich, Switzerland',
        yearsOfExperience: 6,
        education: { degree: 'M.Eng. Computer Science', institution: 'Imperial College London', year: 2018 },
        skills: ['go', 'python', 'kubernetes', 'docker', 'terraform', 'google_cloud', 'aws', 'linux', 'prometheus', 'grafana', 'cicd', 'system_design', 'scalability', 'performance', 'distributed_systems', 'nginx', 'helm', 'ansible'],
        experience: [
            { role: 'SRE', company: 'Google', duration: '2021–Present', years: 3, description: 'Ensuring reliability of Google Cloud Storage serving 99.999% availability. Managing infrastructure for exabyte-scale storage.' },
            { role: 'SRE', company: 'Spotify', duration: '2019–2021', years: 2, description: 'Built observability platform for microservices. Reduced incident response time by 50% through automated remediation.' },
            { role: 'Infrastructure Engineer', company: 'King (Activision)', duration: '2018–2019', years: 1, description: 'Managed game server infrastructure handling 250M+ monthly active players.' }
        ],
        certifications: ['CKA', 'GCP Professional Cloud DevOps Engineer'],
        openSourceContributions: 8,
        publications: 1,
        teamSizeManaged: 3,
        behavioralSignals: { leadership: 0.7, autonomy: 0.88, collaboration: 0.82, mentoring: 0.72, innovation: 0.75 }
    },
    {
        id: 'c021',
        name: 'Ben Nakamura',
        avatar: '👨‍💻',
        currentTitle: 'Senior Android Engineer',
        currentCompany: 'Uber',
        location: 'Tokyo, Japan',
        yearsOfExperience: 6,
        education: { degree: 'B.S. Computer Science', institution: 'University of Tokyo', year: 2018 },
        skills: ['kotlin', 'java', 'android', 'jetpack_compose', 'react_native', 'typescript', 'firebase_db', 'rest_api', 'cicd', 'unit_testing', 'agile', 'cross_platform', 'git'],
        experience: [
            { role: 'Senior Android Engineer', company: 'Uber', duration: '2022–Present', years: 2, description: 'Building Uber Eats merchant app for APAC region. Led migration to Jetpack Compose reducing UI code by 40%.' },
            { role: 'Android Developer', company: 'LINE Corp', duration: '2019–2022', years: 3, description: 'Developed features for LINE messenger app with 190M+ MAU. Built payment integration for LINE Pay.' },
            { role: 'Mobile Developer', company: 'Mercari', duration: '2018–2019', years: 1, description: 'Built marketplace features for Japanese e-commerce app. Implemented image recognition for product listing.' }
        ],
        certifications: ['Google Associate Android Developer'],
        openSourceContributions: 5,
        publications: 0,
        teamSizeManaged: 2,
        behavioralSignals: { leadership: 0.6, autonomy: 0.82, collaboration: 0.85, mentoring: 0.55, innovation: 0.7 }
    },
    {
        id: 'c022',
        name: 'Laura Schmidt',
        avatar: '👩‍💼',
        currentTitle: 'VP of Engineering',
        currentCompany: 'Series C Startup',
        location: 'Berlin, Germany',
        yearsOfExperience: 14,
        education: { degree: 'M.S. Computer Science', institution: 'TU Munich', year: 2010 },
        skills: ['python', 'java', 'system_design', 'distributed_systems', 'team_management', 'tech_lead', 'mentoring', 'agile', 'aws', 'kubernetes', 'microservices', 'scalability', 'product_management', 'stakeholder_management', 'leadership', 'hiring'],
        experience: [
            { role: 'VP of Engineering', company: 'FinTech Startup', duration: '2022–Present', years: 2, description: 'Leading 45-person engineering org. Scaled team from 15 to 45 while maintaining velocity. Series C ($80M) fundraise.' },
            { role: 'Director of Engineering', company: 'Zalando', duration: '2018–2022', years: 4, description: 'Managed 4 teams (30 engineers) building e-commerce platform serving 50M+ customers across 25 countries.' },
            { role: 'Engineering Manager', company: 'SAP', duration: '2014–2018', years: 4, description: 'Led cloud migration for SAP Business Suite. Managed team of 12 senior engineers.' },
            { role: 'Senior Engineer', company: 'Siemens', duration: '2010–2014', years: 4, description: 'Built IoT data processing platform for industrial automation.' }
        ],
        certifications: [],
        openSourceContributions: 3,
        publications: 2,
        teamSizeManaged: 45,
        behavioralSignals: { leadership: 0.98, autonomy: 0.85, collaboration: 0.92, mentoring: 0.95, innovation: 0.78 }
    }
];
