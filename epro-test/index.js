import { EproMemory } from './epro-memory/dist/index.js';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

async function test() {
  const memory = new EproMemory(config);
  
  console.log('--- Testing Memory Extraction ---');
  const messages = [
    { role: 'user', content: 'My name is X, I love building with OpenClaw and I prefer dark mode.' },
    { role: 'assistant', content: 'Nice to meet you X! I will remember your preference for dark mode.' }
  ];
  
  const extracted = await memory.extract(messages);
  console.log('Extracted Memories:', JSON.stringify(extracted, null, 2));

  console.log('\n--- Testing Memory Search ---');
  const results = await memory.search('What is the user name?');
  console.log('Search Results:', JSON.stringify(results, null, 2));
}

test().catch(console.error);