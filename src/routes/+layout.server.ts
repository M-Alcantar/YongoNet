import type { LayoutServerLoad } from './$types.js';

export const load = (async ({ locals }) => {
  const { username } = locals;

  return { username };
}) satisfies LayoutServerLoad;