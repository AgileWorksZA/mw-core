import {serve} from 'bun';

serve({
  fetch(_req) {
    return new Response(Bun.file('TODO.md'));
  },
});
