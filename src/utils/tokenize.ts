// Lightweight, language-agnostic syntax colouring. Returns one token class per character.
export type TokenClass = 'kw' | 'str' | 'num' | 'com' | 'fn' | 'type' | 'punct' | 'plain';

const KEYWORDS = new Set(
  (
    'abstract as async await break case catch class const constructor continue def default defer del delete do elif else enum except export ' +
    'extends false final finally fn for foreach from func function go if impl implements import in instanceof interface is lambda let loop match ' +
    'module mut namespace new nil none null of or override package pass private protected pub public raise readonly ref return select self static ' +
    'struct super switch this throw trait true try type typeof use using val var void when where while with yield not and ' +
    'SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE JOIN LEFT RIGHT INNER OUTER ON GROUP BY ORDER HAVING LIMIT AS AND OR NOT NULL CREATE TABLE ' +
    'PRIMARY KEY DISTINCT UNION RETURNING select from where insert into values update set delete join left right inner outer on group by order having limit as create table ' +
    'echo fi then done esac guard local end fun data unless until begin elsif puts require include attr_reader defmodule defp print param my our foreach sub'
  ).split(/\s+/),
);

const COMMENT_PREFIX: Record<string, string> = {
  python: '#',
  ruby: '#',
  bash: '#',
  powershell: '#',
  json: '#',
  docker: '#',
  r: '#',
  perl: '#',
  elixir: '#',
  graphql: '#',
  haskell: '--',
  lua: '--',
  sql: '--',
  postgresql: '--',
};

export function tokenize(text: string, language: string): TokenClass[] {
  const out: TokenClass[] = new Array(text.length).fill('plain');
  const lineComment = (COMMENT_PREFIX[language] ?? '//').replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  const re = new RegExp(
    [
      `(${lineComment}[^\\n]*|/\\*[\\s\\S]*?\\*/|<!--[\\s\\S]*?-->)`, // 1 comment
      `("(?:\\\\.|[^"\\\\\\n])*"|'(?:\\\\.|[^'\\\\\\n])*'|\`(?:\\\\.|[^\`\\\\])*\`)`, // 2 string
      `(\\b\\d[\\d_.]*(?:[eE][+-]?\\d+)?\\b)`, // 3 number
      `([A-Za-z_$][\\w$]*)(?=\\s*\\()`, // 4 function call
      `([A-Za-z_$][\\w$]*)`, // 5 identifier
      `([{}()[\\];:,.<>=+\\-*/%!&|^~?@#\\\\]+)`, // 6 punctuation
    ].join('|'),
    'g',
  );

  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    let cls: TokenClass = 'plain';
    if (m[1] !== undefined) cls = 'com';
    else if (m[2] !== undefined) cls = 'str';
    else if (m[3] !== undefined) cls = 'num';
    else if (m[4] !== undefined) cls = KEYWORDS.has(m[4]) ? 'kw' : 'fn';
    else if (m[5] !== undefined) cls = KEYWORDS.has(m[5]) ? 'kw' : /^[A-Z]/.test(m[5]) ? 'type' : 'plain';
    else if (m[6] !== undefined) cls = 'punct';
    for (let i = m.index; i < m.index + m[0].length; i++) out[i] = cls;
    if (m[0].length === 0) re.lastIndex++;
  }
  return out;
}
