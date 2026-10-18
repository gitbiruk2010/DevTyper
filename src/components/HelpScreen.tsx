import React, { useEffect } from 'react';

interface HelpScreenProps {
  onBack: () => void;
  /** Section id to scroll to when the screen opens (e.g. from Help > Keyboard Shortcuts). */
  section?: string;
}

interface HelpSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => <span className="kbd">{children}</span>;

const SHORTCUTS: [string, string][] = [
  ['Enter', 'Start typing (menu) / next snippet (results)'],
  ['Esc', 'Restart snippet (typing) · back to menu (results, help) · leave full screen'],
  ['R', 'Retry snippet (results)'],
  ['Backspace', 'Delete the last typed character'],
  ['F11', 'Toggle full screen'],
  ['Ctrl + +  /  Ctrl + -', 'Zoom in / zoom out'],
  ['Ctrl + 0', 'Reset zoom to actual size'],
  ['F1', 'Open this help'],
];

const SECTIONS: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    body: (
      <ol className="list-decimal space-y-1 pl-5">
        <li>Pick a language on the main menu (or <em>Mix it up</em> for every language).</li>
        <li>Click the <strong>Start</strong> button that pops out on the selected card, or press <Kbd>Enter</Kbd>.</li>
        <li>Type the snippet exactly as shown. The timer starts on your first keystroke.</li>
        <li>When you finish, review your results and move on to the next snippet.</li>
      </ol>
    ),
  },
  {
    id: 'languages-levels',
    title: 'Languages and difficulty',
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Use the search box above the language cards to filter by name.</li>
        <li><strong>Beginner</strong>: short, simple snippets.</li>
        <li><strong>Intermediate</strong>: realistic code snippets.</li>
        <li><strong>Advanced</strong>: symbol-heavy code that tests your accuracy.</li>
        <li>Only languages that have snippets at the chosen difficulty are listed.</li>
      </ul>
    ),
  },
  {
    id: 'practice-modes',
    title: 'Practice modes',
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Explore</strong>: snippets you have not played come first, then the ones you played longest ago.</li>
        <li><strong>Memorize</strong>: repeats the snippets you have not mastered yet, weakest first.</li>
      </ul>
    ),
  },
  {
    id: 'typing',
    title: 'Typing a snippet',
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Mistakes are marked and counted against your accuracy.</li>
        <li><Kbd>Backspace</Kbd> removes the last character but breaks your streak.</li>
        <li>Press <Kbd>Esc</Kbd> at any time to restart the current snippet.</li>
      </ul>
    ),
  },
  {
    id: 'results-stats',
    title: 'Results, XP and stats',
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Each finished run earns XP, which raises your level and rank.</li>
        <li>The result screen shows WPM, accuracy, errors, time and your best streak.</li>
        <li>On the result screen: <Kbd>Enter</Kbd> next snippet, <Kbd>R</Kbd> retry, <Kbd>Esc</Kbd> back to menu.</li>
        <li>Open <strong>Stats</strong> from the menu for your speed trend, per-language runs, weak keys and achievements.</li>
        <li>Your progress is saved on this computer only; nothing is sent over the network.</li>
      </ul>
    ),
  },
  {
    id: 'shortcuts',
    title: 'Keyboard shortcuts',
    body: (
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-white/[0.06]">
            {SHORTCUTS.map(([keys, what]) => (
              <tr key={keys}>
                <td className="whitespace-nowrap px-4 py-2 font-mono text-neon-cyan">{keys}</td>
                <td className="px-4 py-2 text-mist">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-white/[0.06] px-4 py-2 text-xs text-mist">On macOS use Cmd instead of Ctrl.</p>
      </div>
    ),
  },
  {
    id: 'view-options',
    title: 'View options',
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>View → Zoom In / Zoom Out / Actual Size</strong> changes the interface size.</li>
        <li><strong>View → Toggle Full Screen</strong> (or <Kbd>F11</Kbd>) enters full screen; press <Kbd>Esc</Kbd> to leave it.</li>
      </ul>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting and support',
    body: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Keys not registering? Click inside the typing area once so it has focus.</li>
        <li>Text too small or too large? Use the View menu zoom options.</li>
        <li>
          On Linux, if the AppImage does not start on Ubuntu 24.04 or newer, install the <code>.deb</code> instead or
          launch the AppImage once with <code>--no-sandbox</code>.
        </li>
        <li>Found a bug or have an idea? Use <strong>Help → Report an Issue</strong>.</li>
      </ul>
    ),
  },
];

export const HelpScreen: React.FC<HelpScreenProps> = ({ onBack, section }) => {
  useEffect(() => {
    if (section) {
      document.getElementById(`help-${section}`)?.scrollIntoView({ block: 'start' });
    }
  }, [section]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  const jump = (id: string) => document.getElementById(`help-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Help</h1>
          <p className="text-sm text-mist">Everything you need to get the most out of DevTyper.</p>
        </div>
        <button onClick={onBack} className="btn-secondary">← Menu</button>
      </div>

      <nav aria-label="Help index" className="glass mb-6 animate-fade-up p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-mist">Index</h2>
        <ol className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => jump(s.id)}
                className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white/5 hover:text-neon-cyan"
              >
                <span className="mr-2 font-mono text-mist">{i + 1}.</span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-4">
        {SECTIONS.map((s, i) => (
          <section key={s.id} id={`help-${s.id}`} className="glass scroll-mt-6 p-5">
            <h2 className="mb-3 text-lg font-semibold">
              <span className="mr-2 font-mono text-neon-violet">{i + 1}.</span>
              {s.title}
            </h2>
            <div className="text-sm leading-relaxed text-snow/90">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
};
