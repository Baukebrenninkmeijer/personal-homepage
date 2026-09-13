import type { APIRoute } from 'astro';
import * as resume from '../data/resume';
import { paths } from '../data/icons';

// The Typst template (cv/cv.typ) reads this at build time, so the CV and the
// resume page cannot drift.
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ...resume, icons: paths }, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
