// ============================================
// TalentLens — Skill Knowledge Graph
// 500+ skills with semantic relationships
// ============================================

export const SKILL_CATEGORIES = {
    PROGRAMMING_LANGUAGES: 'Programming Languages',
    FRONTEND: 'Frontend Development',
    BACKEND: 'Backend Development',
    MOBILE: 'Mobile Development',
    DATABASES: 'Databases & Storage',
    DEVOPS: 'DevOps & Infrastructure',
    CLOUD: 'Cloud Platforms',
    DATA_SCIENCE: 'Data Science & ML',
    DESIGN: 'Design & UX',
    MANAGEMENT: 'Management & Leadership',
    SOFT_SKILLS: 'Soft Skills',
    SECURITY: 'Security',
    TESTING: 'Testing & QA',
    ARCHITECTURE: 'Architecture & Systems',
    TOOLS: 'Tools & Productivity',
    DOMAIN: 'Domain Knowledge',
};

// Each skill: { name, category, aliases[], related[], parent?, proficiencyWeight }
export const SKILL_GRAPH = {
    // === PROGRAMMING LANGUAGES ===
    javascript: { name: 'JavaScript', category: 'PROGRAMMING_LANGUAGES', aliases: ['js', 'ecmascript', 'es6', 'es2015', 'es2020', 'vanilla js', 'vanilla javascript'], related: ['typescript', 'nodejs', 'react', 'angular', 'vue', 'frontend'], proficiencyWeight: 1.0 },
    typescript: { name: 'TypeScript', category: 'PROGRAMMING_LANGUAGES', aliases: ['ts'], related: ['javascript', 'react', 'angular', 'nodejs'], parent: 'javascript', proficiencyWeight: 1.1 },
    python: { name: 'Python', category: 'PROGRAMMING_LANGUAGES', aliases: ['py', 'python3', 'cpython'], related: ['django', 'flask', 'fastapi', 'machine_learning', 'data_science', 'numpy', 'pandas'], proficiencyWeight: 1.0 },
    java: { name: 'Java', category: 'PROGRAMMING_LANGUAGES', aliases: ['jvm', 'java8', 'java11', 'java17', 'openjdk'], related: ['spring', 'spring_boot', 'kotlin', 'microservices', 'enterprise'], proficiencyWeight: 1.0 },
    csharp: { name: 'C#', category: 'PROGRAMMING_LANGUAGES', aliases: ['c sharp', 'c#', '.net', 'dotnet'], related: ['dotnet_core', 'asp_net', 'azure', 'unity'], proficiencyWeight: 1.0 },
    cpp: { name: 'C++', category: 'PROGRAMMING_LANGUAGES', aliases: ['c plus plus', 'cplusplus'], related: ['c_lang', 'systems_programming', 'embedded', 'game_dev'], proficiencyWeight: 1.1 },
    c_lang: { name: 'C', category: 'PROGRAMMING_LANGUAGES', aliases: ['c language', 'ansi c'], related: ['cpp', 'systems_programming', 'embedded', 'linux'], proficiencyWeight: 1.1 },
    go: { name: 'Go', category: 'PROGRAMMING_LANGUAGES', aliases: ['golang'], related: ['microservices', 'cloud_native', 'docker', 'kubernetes', 'backend'], proficiencyWeight: 1.0 },
    rust: { name: 'Rust', category: 'PROGRAMMING_LANGUAGES', aliases: ['rustlang'], related: ['systems_programming', 'webassembly', 'performance', 'cpp'], proficiencyWeight: 1.2 },
    ruby: { name: 'Ruby', category: 'PROGRAMMING_LANGUAGES', aliases: ['rb'], related: ['rails', 'backend', 'web_development'], proficiencyWeight: 0.9 },
    php: { name: 'PHP', category: 'PROGRAMMING_LANGUAGES', aliases: ['php8', 'php7'], related: ['laravel', 'wordpress', 'web_development', 'backend'], proficiencyWeight: 0.8 },
    swift: { name: 'Swift', category: 'PROGRAMMING_LANGUAGES', aliases: ['swiftui'], related: ['ios', 'apple', 'mobile', 'xcode'], proficiencyWeight: 1.0 },
    kotlin: { name: 'Kotlin', category: 'PROGRAMMING_LANGUAGES', aliases: ['kt'], related: ['android', 'java', 'mobile', 'jetpack_compose'], proficiencyWeight: 1.0 },
    scala: { name: 'Scala', category: 'PROGRAMMING_LANGUAGES', aliases: [], related: ['java', 'spark', 'functional_programming', 'big_data'], proficiencyWeight: 1.1 },
    r_lang: { name: 'R', category: 'PROGRAMMING_LANGUAGES', aliases: ['rlang', 'r programming'], related: ['data_science', 'statistics', 'data_analysis'], proficiencyWeight: 0.9 },
    sql: { name: 'SQL', category: 'PROGRAMMING_LANGUAGES', aliases: ['structured query language'], related: ['postgresql', 'mysql', 'databases', 'data_analysis'], proficiencyWeight: 0.8 },
    dart: { name: 'Dart', category: 'PROGRAMMING_LANGUAGES', aliases: [], related: ['flutter', 'mobile', 'cross_platform'], proficiencyWeight: 0.9 },
    elixir: { name: 'Elixir', category: 'PROGRAMMING_LANGUAGES', aliases: [], related: ['erlang', 'phoenix', 'functional_programming', 'distributed_systems'], proficiencyWeight: 1.1 },

    // === FRONTEND ===
    react: { name: 'React', category: 'FRONTEND', aliases: ['reactjs', 'react.js', 'react js'], related: ['javascript', 'typescript', 'nextjs', 'redux', 'frontend', 'hooks', 'jsx'], proficiencyWeight: 1.0 },
    angular: { name: 'Angular', category: 'FRONTEND', aliases: ['angularjs', 'angular.js', 'ng'], related: ['typescript', 'rxjs', 'frontend', 'spa'], proficiencyWeight: 1.0 },
    vue: { name: 'Vue.js', category: 'FRONTEND', aliases: ['vuejs', 'vue', 'vue.js', 'vue 3'], related: ['javascript', 'nuxt', 'frontend', 'vuex', 'pinia'], proficiencyWeight: 1.0 },
    nextjs: { name: 'Next.js', category: 'FRONTEND', aliases: ['next.js', 'next js', 'nextjs'], related: ['react', 'ssr', 'fullstack', 'vercel', 'typescript'], proficiencyWeight: 1.1 },
    nuxt: { name: 'Nuxt.js', category: 'FRONTEND', aliases: ['nuxtjs'], related: ['vue', 'ssr', 'fullstack'], proficiencyWeight: 1.0 },
    svelte: { name: 'Svelte', category: 'FRONTEND', aliases: ['sveltekit'], related: ['frontend', 'javascript', 'web_components'], proficiencyWeight: 1.0 },
    html: { name: 'HTML', category: 'FRONTEND', aliases: ['html5', 'html css'], related: ['css', 'frontend', 'web_development', 'accessibility'], proficiencyWeight: 0.5 },
    css: { name: 'CSS', category: 'FRONTEND', aliases: ['css3', 'cascading style sheets'], related: ['html', 'sass', 'tailwind', 'responsive_design', 'frontend'], proficiencyWeight: 0.6 },
    sass: { name: 'Sass/SCSS', category: 'FRONTEND', aliases: ['scss', 'sass', 'less'], related: ['css', 'frontend'], parent: 'css', proficiencyWeight: 0.7 },
    tailwind: { name: 'Tailwind CSS', category: 'FRONTEND', aliases: ['tailwindcss', 'tailwind'], related: ['css', 'frontend', 'utility_css'], proficiencyWeight: 0.7 },
    redux: { name: 'Redux', category: 'FRONTEND', aliases: ['redux toolkit', 'rtk'], related: ['react', 'state_management', 'frontend'], proficiencyWeight: 0.8 },
    graphql_client: { name: 'GraphQL (Client)', category: 'FRONTEND', aliases: ['apollo client', 'urql', 'relay'], related: ['react', 'graphql', 'api'], proficiencyWeight: 0.9 },
    webpack: { name: 'Webpack', category: 'FRONTEND', aliases: ['webpack5'], related: ['frontend', 'build_tools', 'javascript'], proficiencyWeight: 0.7 },
    vite: { name: 'Vite', category: 'FRONTEND', aliases: ['vitejs'], related: ['frontend', 'build_tools', 'javascript'], proficiencyWeight: 0.7 },
    responsive_design: { name: 'Responsive Design', category: 'FRONTEND', aliases: ['mobile first', 'responsive web design', 'rwd'], related: ['css', 'frontend', 'mobile'], proficiencyWeight: 0.6 },
    accessibility: { name: 'Web Accessibility', category: 'FRONTEND', aliases: ['a11y', 'wcag', 'aria', 'screen reader'], related: ['frontend', 'html', 'ux'], proficiencyWeight: 0.8 },
    web_components: { name: 'Web Components', category: 'FRONTEND', aliases: ['custom elements', 'shadow dom'], related: ['frontend', 'javascript'], proficiencyWeight: 0.8 },
    pwa: { name: 'Progressive Web Apps', category: 'FRONTEND', aliases: ['pwa', 'service worker'], related: ['frontend', 'mobile', 'javascript', 'offline'], proficiencyWeight: 0.9 },
    threejs: { name: 'Three.js', category: 'FRONTEND', aliases: ['webgl', '3d web'], related: ['javascript', 'frontend', 'creative_coding'], proficiencyWeight: 1.0 },
    storybook: { name: 'Storybook', category: 'FRONTEND', aliases: [], related: ['react', 'vue', 'component_library', 'design_system'], proficiencyWeight: 0.7 },

    // === BACKEND ===
    nodejs: { name: 'Node.js', category: 'BACKEND', aliases: ['node', 'node.js', 'nodejs'], related: ['javascript', 'express', 'nestjs', 'backend', 'api'], proficiencyWeight: 1.0 },
    express: { name: 'Express.js', category: 'BACKEND', aliases: ['expressjs', 'express'], related: ['nodejs', 'backend', 'api', 'rest'], proficiencyWeight: 0.8 },
    nestjs: { name: 'NestJS', category: 'BACKEND', aliases: ['nest.js'], related: ['nodejs', 'typescript', 'backend', 'enterprise'], proficiencyWeight: 1.0 },
    django: { name: 'Django', category: 'BACKEND', aliases: ['django rest framework', 'drf'], related: ['python', 'backend', 'web_development', 'orm'], proficiencyWeight: 1.0 },
    flask: { name: 'Flask', category: 'BACKEND', aliases: ['flask api'], related: ['python', 'backend', 'api'], proficiencyWeight: 0.8 },
    fastapi: { name: 'FastAPI', category: 'BACKEND', aliases: ['fast api'], related: ['python', 'backend', 'api', 'async'], proficiencyWeight: 1.0 },
    spring: { name: 'Spring Framework', category: 'BACKEND', aliases: ['spring mvc'], related: ['java', 'spring_boot', 'enterprise', 'backend'], proficiencyWeight: 1.0 },
    spring_boot: { name: 'Spring Boot', category: 'BACKEND', aliases: ['springboot'], related: ['java', 'spring', 'microservices', 'backend'], proficiencyWeight: 1.0 },
    rails: { name: 'Ruby on Rails', category: 'BACKEND', aliases: ['ror', 'rails', 'ruby on rails'], related: ['ruby', 'backend', 'web_development', 'mvc'], proficiencyWeight: 0.9 },
    laravel: { name: 'Laravel', category: 'BACKEND', aliases: [], related: ['php', 'backend', 'web_development', 'mvc'], proficiencyWeight: 0.9 },
    dotnet_core: { name: '.NET Core', category: 'BACKEND', aliases: ['.net core', 'asp.net core', 'dotnet'], related: ['csharp', 'backend', 'enterprise', 'azure'], proficiencyWeight: 1.0 },
    asp_net: { name: 'ASP.NET', category: 'BACKEND', aliases: ['asp.net', 'asp net'], related: ['csharp', 'dotnet_core', 'backend'], proficiencyWeight: 0.9 },
    graphql: { name: 'GraphQL', category: 'BACKEND', aliases: ['gql'], related: ['api', 'backend', 'nodejs', 'apollo'], proficiencyWeight: 1.0 },
    rest_api: { name: 'REST APIs', category: 'BACKEND', aliases: ['restful', 'rest', 'restful api', 'api design'], related: ['backend', 'api', 'http', 'openapi'], proficiencyWeight: 0.8 },
    grpc: { name: 'gRPC', category: 'BACKEND', aliases: ['grpc', 'protobuf', 'protocol buffers'], related: ['microservices', 'backend', 'api'], proficiencyWeight: 1.0 },
    websockets: { name: 'WebSockets', category: 'BACKEND', aliases: ['socket.io', 'ws', 'real-time'], related: ['backend', 'nodejs', 'real_time'], proficiencyWeight: 0.9 },
    microservices: { name: 'Microservices', category: 'BACKEND', aliases: ['micro services', 'service oriented'], related: ['docker', 'kubernetes', 'api', 'distributed_systems', 'backend'], proficiencyWeight: 1.1 },
    serverless: { name: 'Serverless', category: 'BACKEND', aliases: ['lambda', 'cloud functions', 'faas'], related: ['aws', 'cloud', 'backend'], proficiencyWeight: 1.0 },

    // === MOBILE ===
    ios: { name: 'iOS Development', category: 'MOBILE', aliases: ['ios', 'iphone', 'ipad'], related: ['swift', 'objective_c', 'xcode', 'mobile', 'apple'], proficiencyWeight: 1.0 },
    android: { name: 'Android Development', category: 'MOBILE', aliases: ['android'], related: ['kotlin', 'java', 'mobile', 'android_studio', 'jetpack_compose'], proficiencyWeight: 1.0 },
    react_native: { name: 'React Native', category: 'MOBILE', aliases: ['rn', 'react-native'], related: ['react', 'mobile', 'cross_platform', 'javascript'], proficiencyWeight: 1.0 },
    flutter: { name: 'Flutter', category: 'MOBILE', aliases: [], related: ['dart', 'mobile', 'cross_platform'], proficiencyWeight: 1.0 },
    cross_platform: { name: 'Cross-Platform Development', category: 'MOBILE', aliases: ['hybrid mobile'], related: ['react_native', 'flutter', 'mobile'], proficiencyWeight: 0.8 },
    jetpack_compose: { name: 'Jetpack Compose', category: 'MOBILE', aliases: ['compose'], related: ['android', 'kotlin', 'mobile'], proficiencyWeight: 1.0 },

    // === DATABASES ===
    postgresql: { name: 'PostgreSQL', category: 'DATABASES', aliases: ['postgres', 'psql', 'pg'], related: ['sql', 'databases', 'relational', 'backend'], proficiencyWeight: 1.0 },
    mysql: { name: 'MySQL', category: 'DATABASES', aliases: ['mariadb'], related: ['sql', 'databases', 'relational', 'backend'], proficiencyWeight: 0.9 },
    mongodb: { name: 'MongoDB', category: 'DATABASES', aliases: ['mongo', 'nosql'], related: ['databases', 'nosql', 'backend', 'nodejs'], proficiencyWeight: 0.9 },
    redis: { name: 'Redis', category: 'DATABASES', aliases: ['cache', 'in-memory'], related: ['caching', 'databases', 'backend', 'performance'], proficiencyWeight: 0.9 },
    elasticsearch: { name: 'Elasticsearch', category: 'DATABASES', aliases: ['elastic', 'elk', 'opensearch'], related: ['search', 'databases', 'logging', 'backend'], proficiencyWeight: 1.0 },
    dynamodb: { name: 'DynamoDB', category: 'DATABASES', aliases: ['dynamo'], related: ['aws', 'nosql', 'databases', 'serverless'], proficiencyWeight: 0.9 },
    cassandra: { name: 'Cassandra', category: 'DATABASES', aliases: ['apache cassandra'], related: ['nosql', 'databases', 'distributed_systems', 'big_data'], proficiencyWeight: 1.1 },
    firebase_db: { name: 'Firebase', category: 'DATABASES', aliases: ['firestore', 'firebase realtime database'], related: ['google_cloud', 'mobile', 'nosql', 'backend'], proficiencyWeight: 0.8 },
    sqlite: { name: 'SQLite', category: 'DATABASES', aliases: [], related: ['sql', 'databases', 'mobile', 'embedded'], proficiencyWeight: 0.6 },
    oracle_db: { name: 'Oracle Database', category: 'DATABASES', aliases: ['oracle', 'oracle db', 'plsql', 'pl/sql'], related: ['sql', 'databases', 'enterprise'], proficiencyWeight: 0.9 },
    neo4j: { name: 'Neo4j', category: 'DATABASES', aliases: ['graph database', 'cypher'], related: ['databases', 'graph', 'nosql'], proficiencyWeight: 1.0 },

    // === DEVOPS ===
    docker: { name: 'Docker', category: 'DEVOPS', aliases: ['containers', 'containerization', 'dockerfile'], related: ['kubernetes', 'devops', 'microservices', 'cicd'], proficiencyWeight: 1.0 },
    kubernetes: { name: 'Kubernetes', category: 'DEVOPS', aliases: ['k8s', 'kube', 'kubectl'], related: ['docker', 'devops', 'cloud', 'orchestration', 'helm'], proficiencyWeight: 1.2 },
    terraform: { name: 'Terraform', category: 'DEVOPS', aliases: ['tf', 'hcl', 'hashicorp'], related: ['iac', 'devops', 'cloud', 'infrastructure'], proficiencyWeight: 1.1 },
    ansible: { name: 'Ansible', category: 'DEVOPS', aliases: [], related: ['devops', 'automation', 'configuration_management'], proficiencyWeight: 1.0 },
    cicd: { name: 'CI/CD', category: 'DEVOPS', aliases: ['continuous integration', 'continuous delivery', 'continuous deployment', 'ci cd', 'ci/cd pipelines'], related: ['jenkins', 'github_actions', 'devops', 'automation'], proficiencyWeight: 1.0 },
    jenkins: { name: 'Jenkins', category: 'DEVOPS', aliases: [], related: ['cicd', 'devops', 'automation'], proficiencyWeight: 0.8 },
    github_actions: { name: 'GitHub Actions', category: 'DEVOPS', aliases: ['gh actions'], related: ['cicd', 'devops', 'git'], proficiencyWeight: 0.8 },
    gitlab_ci: { name: 'GitLab CI', category: 'DEVOPS', aliases: ['gitlab ci/cd'], related: ['cicd', 'devops', 'git'], proficiencyWeight: 0.8 },
    git: { name: 'Git', category: 'DEVOPS', aliases: ['version control', 'github', 'gitlab', 'bitbucket'], related: ['devops', 'collaboration'], proficiencyWeight: 0.5 },
    linux: { name: 'Linux', category: 'DEVOPS', aliases: ['ubuntu', 'centos', 'debian', 'rhel', 'unix', 'bash', 'shell'], related: ['devops', 'systems_administration', 'backend'], proficiencyWeight: 0.8 },
    nginx: { name: 'Nginx', category: 'DEVOPS', aliases: ['reverse proxy'], related: ['devops', 'web_server', 'backend', 'load_balancing'], proficiencyWeight: 0.8 },
    helm: { name: 'Helm', category: 'DEVOPS', aliases: ['helm charts'], related: ['kubernetes', 'devops'], proficiencyWeight: 0.9 },
    prometheus: { name: 'Prometheus', category: 'DEVOPS', aliases: ['prom'], related: ['monitoring', 'devops', 'grafana', 'observability'], proficiencyWeight: 0.9 },
    grafana: { name: 'Grafana', category: 'DEVOPS', aliases: [], related: ['monitoring', 'devops', 'prometheus', 'observability'], proficiencyWeight: 0.8 },
    datadog: { name: 'Datadog', category: 'DEVOPS', aliases: ['dd'], related: ['monitoring', 'devops', 'observability', 'apm'], proficiencyWeight: 0.9 },

    // === CLOUD ===
    aws: { name: 'AWS', category: 'CLOUD', aliases: ['amazon web services', 'amazon aws', 'ec2', 's3', 'lambda', 'sqs', 'sns', 'cloudformation'], related: ['cloud', 'devops', 'serverless', 'dynamodb'], proficiencyWeight: 1.1 },
    google_cloud: { name: 'Google Cloud', category: 'CLOUD', aliases: ['gcp', 'google cloud platform', 'gke', 'bigquery', 'cloud run'], related: ['cloud', 'devops', 'kubernetes', 'big_data'], proficiencyWeight: 1.1 },
    azure: { name: 'Azure', category: 'CLOUD', aliases: ['microsoft azure', 'azure devops'], related: ['cloud', 'devops', 'csharp', 'dotnet_core', 'enterprise'], proficiencyWeight: 1.1 },
    cloud_native: { name: 'Cloud-Native', category: 'CLOUD', aliases: ['12 factor', 'cloud native'], related: ['kubernetes', 'docker', 'microservices', 'cloud'], proficiencyWeight: 1.0 },

    // === DATA SCIENCE & ML ===
    machine_learning: { name: 'Machine Learning', category: 'DATA_SCIENCE', aliases: ['ml', 'statistical learning'], related: ['python', 'deep_learning', 'data_science', 'sklearn', 'tensorflow'], proficiencyWeight: 1.2 },
    deep_learning: { name: 'Deep Learning', category: 'DATA_SCIENCE', aliases: ['dl', 'neural networks', 'neural nets'], related: ['machine_learning', 'tensorflow', 'pytorch', 'ai'], proficiencyWeight: 1.3 },
    tensorflow: { name: 'TensorFlow', category: 'DATA_SCIENCE', aliases: ['tf', 'keras'], related: ['deep_learning', 'machine_learning', 'python'], proficiencyWeight: 1.1 },
    pytorch: { name: 'PyTorch', category: 'DATA_SCIENCE', aliases: ['torch'], related: ['deep_learning', 'machine_learning', 'python'], proficiencyWeight: 1.1 },
    nlp: { name: 'Natural Language Processing', category: 'DATA_SCIENCE', aliases: ['nlp', 'text analytics', 'text mining', 'language models'], related: ['machine_learning', 'deep_learning', 'python', 'transformers'], proficiencyWeight: 1.2 },
    computer_vision: { name: 'Computer Vision', category: 'DATA_SCIENCE', aliases: ['cv', 'image recognition', 'object detection'], related: ['deep_learning', 'machine_learning', 'python', 'opencv'], proficiencyWeight: 1.2 },
    data_science: { name: 'Data Science', category: 'DATA_SCIENCE', aliases: ['data analysis', 'data analytics'], related: ['python', 'r_lang', 'machine_learning', 'statistics', 'pandas'], proficiencyWeight: 1.0 },
    pandas: { name: 'Pandas', category: 'DATA_SCIENCE', aliases: [], related: ['python', 'data_science', 'data_analysis'], proficiencyWeight: 0.7 },
    numpy: { name: 'NumPy', category: 'DATA_SCIENCE', aliases: [], related: ['python', 'data_science', 'machine_learning'], proficiencyWeight: 0.6 },
    sklearn: { name: 'scikit-learn', category: 'DATA_SCIENCE', aliases: ['sklearn', 'scikit learn'], related: ['python', 'machine_learning', 'data_science'], proficiencyWeight: 0.8 },
    spark: { name: 'Apache Spark', category: 'DATA_SCIENCE', aliases: ['pyspark', 'spark sql'], related: ['big_data', 'python', 'scala', 'data_engineering'], proficiencyWeight: 1.1 },
    big_data: { name: 'Big Data', category: 'DATA_SCIENCE', aliases: ['hadoop', 'hdfs', 'hive', 'data lakes'], related: ['spark', 'data_engineering', 'distributed_systems'], proficiencyWeight: 1.0 },
    data_engineering: { name: 'Data Engineering', category: 'DATA_SCIENCE', aliases: ['data pipelines', 'etl', 'elt', 'data warehouse'], related: ['spark', 'sql', 'python', 'airflow', 'big_data'], proficiencyWeight: 1.0 },
    airflow: { name: 'Apache Airflow', category: 'DATA_SCIENCE', aliases: ['airflow'], related: ['data_engineering', 'python', 'orchestration', 'etl'], proficiencyWeight: 0.9 },
    llm: { name: 'Large Language Models', category: 'DATA_SCIENCE', aliases: ['llm', 'gpt', 'chatgpt', 'openai', 'generative ai', 'gen ai', 'prompt engineering'], related: ['nlp', 'deep_learning', 'machine_learning', 'ai', 'transformers'], proficiencyWeight: 1.3 },
    transformers: { name: 'Transformers', category: 'DATA_SCIENCE', aliases: ['hugging face', 'huggingface', 'bert', 'gpt', 'attention mechanism'], related: ['nlp', 'deep_learning', 'llm'], proficiencyWeight: 1.2 },
    mlops: { name: 'MLOps', category: 'DATA_SCIENCE', aliases: ['ml ops', 'model deployment', 'ml pipeline'], related: ['machine_learning', 'devops', 'kubernetes', 'docker'], proficiencyWeight: 1.1 },
    recommender_systems: { name: 'Recommender Systems', category: 'DATA_SCIENCE', aliases: ['recommendation engine', 'collaborative filtering'], related: ['machine_learning', 'data_science'], proficiencyWeight: 1.0 },
    statistics: { name: 'Statistics', category: 'DATA_SCIENCE', aliases: ['statistical analysis', 'hypothesis testing', 'bayesian', 'probabilistic'], related: ['data_science', 'machine_learning', 'r_lang'], proficiencyWeight: 0.9 },

    // === DESIGN ===
    ui_design: { name: 'UI Design', category: 'DESIGN', aliases: ['user interface design', 'visual design', 'interface design'], related: ['ux_design', 'figma', 'frontend'], proficiencyWeight: 0.9 },
    ux_design: { name: 'UX Design', category: 'DESIGN', aliases: ['user experience', 'user research', 'ux research', 'usability'], related: ['ui_design', 'product_management', 'figma'], proficiencyWeight: 0.9 },
    figma: { name: 'Figma', category: 'DESIGN', aliases: [], related: ['ui_design', 'ux_design', 'design_system', 'prototyping'], proficiencyWeight: 0.8 },
    design_system: { name: 'Design Systems', category: 'DESIGN', aliases: ['component library', 'style guide'], related: ['ui_design', 'frontend', 'storybook', 'figma'], proficiencyWeight: 0.9 },

    // === MANAGEMENT ===
    tech_lead: { name: 'Technical Leadership', category: 'MANAGEMENT', aliases: ['tech lead', 'technical lead', 'engineering lead'], related: ['team_management', 'architecture', 'mentoring'], proficiencyWeight: 1.2 },
    team_management: { name: 'Team Management', category: 'MANAGEMENT', aliases: ['people management', 'engineering management', 'eng manager'], related: ['tech_lead', 'mentoring', 'hiring'], proficiencyWeight: 1.1 },
    product_management: { name: 'Product Management', category: 'MANAGEMENT', aliases: ['pm', 'product owner', 'product strategy'], related: ['stakeholder_management', 'agile', 'roadmap'], proficiencyWeight: 1.0 },
    agile: { name: 'Agile Methodologies', category: 'MANAGEMENT', aliases: ['scrum', 'kanban', 'sprint', 'agile development', 'safe'], related: ['project_management', 'jira', 'collaboration'], proficiencyWeight: 0.7 },
    mentoring: { name: 'Mentoring', category: 'MANAGEMENT', aliases: ['coaching', 'code review', 'pair programming'], related: ['tech_lead', 'team_management', 'knowledge_sharing'], proficiencyWeight: 0.8 },

    // === SOFT SKILLS ===
    communication: { name: 'Communication', category: 'SOFT_SKILLS', aliases: ['written communication', 'presentation', 'public speaking'], related: ['collaboration', 'leadership', 'stakeholder_management'], proficiencyWeight: 0.7 },
    collaboration: { name: 'Collaboration', category: 'SOFT_SKILLS', aliases: ['teamwork', 'cross-functional', 'cross functional'], related: ['communication', 'agile'], proficiencyWeight: 0.6 },
    problem_solving: { name: 'Problem Solving', category: 'SOFT_SKILLS', aliases: ['analytical thinking', 'critical thinking', 'troubleshooting'], related: ['algorithms', 'debugging'], proficiencyWeight: 0.7 },
    leadership: { name: 'Leadership', category: 'SOFT_SKILLS', aliases: ['initiative', 'ownership', 'drive'], related: ['team_management', 'communication', 'mentoring'], proficiencyWeight: 0.8 },
    stakeholder_management: { name: 'Stakeholder Management', category: 'SOFT_SKILLS', aliases: ['stakeholder communication', 'client facing', 'client management'], related: ['communication', 'product_management'], proficiencyWeight: 0.8 },

    // === SECURITY ===
    security: { name: 'Application Security', category: 'SECURITY', aliases: ['appsec', 'infosec', 'cybersecurity', 'security engineering'], related: ['authentication', 'encryption', 'owasp'], proficiencyWeight: 1.1 },
    authentication: { name: 'Authentication & Authorization', category: 'SECURITY', aliases: ['auth', 'oauth', 'jwt', 'openid', 'saml', 'sso', 'identity management'], related: ['security', 'backend'], proficiencyWeight: 0.9 },
    encryption: { name: 'Encryption', category: 'SECURITY', aliases: ['cryptography', 'tls', 'ssl', 'hashing'], related: ['security'], proficiencyWeight: 1.0 },

    // === TESTING ===
    unit_testing: { name: 'Unit Testing', category: 'TESTING', aliases: ['jest', 'mocha', 'junit', 'pytest', 'rspec', 'tdd', 'test driven development'], related: ['testing', 'cicd', 'quality'], proficiencyWeight: 0.7 },
    integration_testing: { name: 'Integration Testing', category: 'TESTING', aliases: ['api testing', 'e2e testing', 'end to end testing', 'cypress', 'playwright', 'selenium'], related: ['testing', 'cicd', 'quality'], proficiencyWeight: 0.8 },
    test_automation: { name: 'Test Automation', category: 'TESTING', aliases: ['automated testing', 'qa automation'], related: ['testing', 'cicd', 'selenium', 'quality'], proficiencyWeight: 0.9 },

    // === ARCHITECTURE ===
    system_design: { name: 'System Design', category: 'ARCHITECTURE', aliases: ['systems design', 'architectural design', 'high level design', 'hld'], related: ['architecture', 'distributed_systems', 'scalability'], proficiencyWeight: 1.2 },
    distributed_systems: { name: 'Distributed Systems', category: 'ARCHITECTURE', aliases: ['distributed computing', 'consensus', 'cap theorem'], related: ['system_design', 'microservices', 'scalability'], proficiencyWeight: 1.3 },
    scalability: { name: 'Scalability', category: 'ARCHITECTURE', aliases: ['high availability', 'ha', 'performance optimization', 'load balancing', 'horizontal scaling'], related: ['system_design', 'distributed_systems', 'cloud'], proficiencyWeight: 1.1 },
    event_driven: { name: 'Event-Driven Architecture', category: 'ARCHITECTURE', aliases: ['event sourcing', 'cqrs', 'message queue', 'kafka', 'rabbitmq', 'pub/sub'], related: ['microservices', 'distributed_systems', 'backend'], proficiencyWeight: 1.1 },
    api_design: { name: 'API Design', category: 'ARCHITECTURE', aliases: ['api architecture', 'api first', 'openapi', 'swagger'], related: ['rest_api', 'graphql', 'backend'], proficiencyWeight: 1.0 },
    ddd: { name: 'Domain-Driven Design', category: 'ARCHITECTURE', aliases: ['ddd', 'bounded context', 'domain modeling'], related: ['architecture', 'microservices', 'backend'], proficiencyWeight: 1.1 },
    algorithms: { name: 'Algorithms & Data Structures', category: 'ARCHITECTURE', aliases: ['dsa', 'data structures', 'algorithms'], related: ['problem_solving', 'coding'], proficiencyWeight: 1.0 },
    performance: { name: 'Performance Engineering', category: 'ARCHITECTURE', aliases: ['performance optimization', 'profiling', 'latency', 'throughput', 'benchmarking'], related: ['scalability', 'system_design', 'backend'], proficiencyWeight: 1.1 },

    // === DOMAIN ===
    fintech: { name: 'FinTech', category: 'DOMAIN', aliases: ['financial technology', 'banking', 'payments', 'trading', 'financial services'], related: ['security', 'compliance', 'enterprise'], proficiencyWeight: 1.0 },
    healthcare: { name: 'Healthcare Tech', category: 'DOMAIN', aliases: ['healthtech', 'medtech', 'ehr', 'hipaa', 'clinical'], related: ['compliance', 'security', 'data_science'], proficiencyWeight: 1.0 },
    ecommerce: { name: 'E-Commerce', category: 'DOMAIN', aliases: ['ecommerce', 'online retail', 'marketplace', 'shopping'], related: ['web_development', 'payments', 'frontend', 'backend'], proficiencyWeight: 0.8 },
    saas: { name: 'SaaS', category: 'DOMAIN', aliases: ['software as a service', 'b2b saas', 'b2c'], related: ['web_development', 'cloud', 'product_management'], proficiencyWeight: 0.8 },
    enterprise: { name: 'Enterprise Software', category: 'DOMAIN', aliases: ['enterprise', 'b2b', 'fortune 500'], related: ['java', 'csharp', 'security', 'compliance'], proficiencyWeight: 0.9 },
    startup: { name: 'Startup Experience', category: 'DOMAIN', aliases: ['early stage', 'seed', 'series a', 'founding engineer', 'founder'], related: ['fullstack', 'agile', 'product_management'], proficiencyWeight: 0.9 },
    open_source: { name: 'Open Source', category: 'DOMAIN', aliases: ['oss', 'open-source contributor', 'maintainer'], related: ['git', 'collaboration', 'community'], proficiencyWeight: 0.8 },
};

// Build reverse lookup maps at initialization
export function buildAliasMap() {
    const map = {};
    for (const [key, skill] of Object.entries(SKILL_GRAPH)) {
        const nameLower = skill.name.toLowerCase();
        map[nameLower] = key;
        map[key] = key;
        for (const alias of skill.aliases) {
            map[alias.toLowerCase()] = key;
        }
    }
    return map;
}

export const ALIAS_MAP = buildAliasMap();
