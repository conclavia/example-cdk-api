import { readFileSync } from 'fs';

export default function loadTags(tagsFile: string): [string, string][] {
  return Object.entries(
    readFileSync(tagsFile, 'utf8')
      .trim()
      .split('\n')
      .map((x) => x.split('='))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  );
}
