// Gobble Dash — a turkey escape game for make.fun's turkey-run-game-01
// bounty (Node 22, standard library only). The game is this directory's
// game/ folder, plain static files a desktop browser loads offline
// (game/index.html and its ES modules, no library and no network request),
// and the program hands it in: it copies game/ and screenshots/ from
// beside this file to /output and writes /output/dossier.json, the summary
// the judge reads, with the vendored make.fun library.
//
// The grader's /output is a mount point, so this program never removes the
// output directory itself: it creates it, then removes only the destination
// files (the previous run's read-only copies) before copying fresh ones.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Create the output directory (never remove it: it may be a mount point).
mkdirSync(out, { recursive: true });

// Remove only the destination entries from a previous run, so read-only
// copies left behind cannot make the copy below fail.
for (const name of ['game', 'screenshots', 'dossier.json']) {
  rmSync(join(out, name), { recursive: true, force: true });
}

cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Verify the hand-in landed before writing the dossier: the entry point
// must be present and readable in /output, or the run fails loudly here
// instead of handing in a broken dossier.
const entryPoint = join(out, 'game', 'index.html');
const entryBytes = readFileSync(entryPoint);
if (entryBytes.length === 0 || !entryBytes.includes('<canvas')) {
  throw new Error('hand-in incomplete: ' + entryPoint + ' is missing or empty');
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB
// of game files, in all, or a path under game/ over 1000 bytes).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
