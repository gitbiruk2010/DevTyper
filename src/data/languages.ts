export interface LanguageMeta {
  id: string;
  name: string;
  glyph: string;
  color: string; // hex accent
  blurb: string;
}

// Metadata for every language the app knows about. The picker only shows
// languages that actually have exercises in exercises.json.
export const LANGUAGES: LanguageMeta[] = [
  { id: 'en_common', name: 'Warm-up', glyph: 'Aa', color: '#94a3b8', blurb: 'Plain-text finger warm-ups' },
  { id: 'typing', name: 'Home Row', glyph: '⌨', color: '#64748b', blurb: 'Build muscle memory' },
  { id: 'javascript', name: 'JavaScript', glyph: 'JS', color: '#f7df1e', blurb: 'Arrows, promises and braces' },
  { id: 'typescript', name: 'TypeScript', glyph: 'TS', color: '#3178c6', blurb: 'Types, generics, interfaces' },
  { id: 'python', name: 'Python', glyph: 'Py', color: '#4b8bbe', blurb: 'Colons, indents, comprehensions' },
  { id: 'java', name: 'Java', glyph: 'Jv', color: '#f89820', blurb: 'Classes and generics' },
  { id: 'c', name: 'C', glyph: 'C', color: '#a8b9cc', blurb: 'Pointers and printf' },
  { id: 'cpp', name: 'C++', glyph: 'C+', color: '#3b82c4', blurb: 'Templates and scope ::' },
  { id: 'csharp', name: 'C#', glyph: 'C#', color: '#9b4f96', blurb: 'LINQ, async, properties' },
  { id: 'go', name: 'Go', glyph: 'Go', color: '#00add8', blurb: 'Goroutines and :=' },
  { id: 'rust', name: 'Rust', glyph: 'Rs', color: '#ff7043', blurb: 'Lifetimes and match' },
  { id: 'php', name: 'PHP', glyph: 'Ph', color: '#8892bf', blurb: '$variables and arrows ->' },
  { id: 'ruby', name: 'Ruby', glyph: 'Rb', color: '#cc342d', blurb: 'Blocks and symbols' },
  { id: 'swift', name: 'Swift', glyph: 'Sw', color: '#fa7343', blurb: 'Optionals and guard' },
  { id: 'kotlin', name: 'Kotlin', glyph: 'Kt', color: '#a97bff', blurb: 'Data classes and lambdas' },
  { id: 'dart', name: 'Dart', glyph: 'Da', color: '#2aa7e6', blurb: 'Flutter-style widgets' },
  { id: 'lua', name: 'Lua', glyph: 'Lu', color: '#5c6bc0', blurb: 'Tables and end keywords' },
  { id: 'r', name: 'R', glyph: 'R', color: '#2b7bd6', blurb: 'Vectors, data frames, pipes' },
  { id: 'scala', name: 'Scala', glyph: 'Sc', color: '#dc322f', blurb: 'Case classes and pattern matching' },
  { id: 'perl', name: 'Perl', glyph: 'Pl', color: '#6a9fd8', blurb: 'Sigils and regex magic' },
  { id: 'haskell', name: 'Haskell', glyph: 'Hs', color: '#8f6bd1', blurb: 'Pure functions and types' },
  { id: 'elixir', name: 'Elixir', glyph: 'Ex', color: '#9b6bdf', blurb: 'Pipes and pattern matching' },
  { id: 'bash', name: 'Bash', glyph: '$_', color: '#4eaa25', blurb: 'Pipes, flags and quotes' },
  { id: 'powershell', name: 'PowerShell', glyph: 'PS', color: '#5391fe', blurb: 'Cmdlets and pipelines' },
  { id: 'html', name: 'HTML', glyph: '<>', color: '#e44d26', blurb: 'Tags and attributes' },
  { id: 'css', name: 'CSS', glyph: '{}', color: '#7c5cff', blurb: 'Selectors and declarations' },
  { id: 'sql', name: 'SQL', glyph: 'SQ', color: '#e38c00', blurb: 'SELECT, JOIN, GROUP BY' },
  { id: 'postgresql', name: 'PostgreSQL', glyph: 'Pg', color: '#4a90c2', blurb: 'Postgres flavoured queries' },
  { id: 'mongodb', name: 'MongoDB', glyph: 'Mg', color: '#47a248', blurb: 'Queries and aggregation pipelines' },
  { id: 'graphql', name: 'GraphQL', glyph: 'GQ', color: '#e535ab', blurb: 'Queries, schemas, mutations' },
  { id: 'json', name: 'JSON & YAML', glyph: '{ }', color: '#9ccc65', blurb: 'Quotes, colons and nesting' },
  { id: 'docker', name: 'Docker & Git', glyph: 'Dk', color: '#2496ed', blurb: 'Dockerfiles and git commands' },
  { id: 'regex', name: 'Regex', glyph: '.*', color: '#f472b6', blurb: 'Symbol soup, mastered' },
];

export const getLanguage = (id: string): LanguageMeta =>
  LANGUAGES.find(l => l.id === id) ?? {
    id,
    name: id,
    glyph: '</>',
    color: '#22d3ee',
    blurb: 'Code snippets',
  };
