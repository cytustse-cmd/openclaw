import { parseConfig, DEFAULTS, vectorDimsForModel } from "./epro-memory/dist/config.js";
import { MemoryDB } from "./epro-memory/dist/db.js";
import { Embeddings } from "./epro-memory/dist/embeddings.js";
import { LlmClient } from "./epro-memory/dist/llm.js";
import { MemoryDeduplicator } from "./epro-memory/dist/deduplicator.js";
import { MemoryExtractor } from "./epro-memory/dist/extractor.js";
import fs from 'fs';
import path from 'path';

// Manual logger shim
const logger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.log(`[WARN] ${msg}`),
  error: (msg) => console.log(`[ERROR] ${msg}`)
};

const cfgRaw = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const cfg = parseConfig(cfgRaw);

async function test() {
  const embeddingModel = cfg.embedding.model ?? DEFAULTS.embeddingModel;
  const llmModel = cfg.llm.model ?? DEFAULTS.llmModel;
  const dbPath = path.resolve(cfg.dbPath ?? DEFAULTS.dbPath);
  
  const vectorDim = vectorDimsForModel(embeddingModel);
  const db = new MemoryDB(dbPath, vectorDim, logger);
  const embeddings = new Embeddings(cfg.embedding.apiKey, embeddingModel, cfg.embedding.baseUrl);
  const llm = new LlmClient(cfg.llm.apiKey, llmModel, cfg.llm.baseUrl);
  const deduplicator = new MemoryDeduplicator(db, llm, logger);
  const extractor = new MemoryExtractor(db, embeddings, llm, deduplicator, logger);

  console.log('--- Testing Memory Extraction ---');
  const conversationText = `
Human: My name is X, I love building with OpenClaw and I prefer dark mode.
Assistant: Nice to meet you X! I will remember your preference for dark mode.
  `;
  
  await extractor.extractAndPersist(conversationText, 'test-session', 'X');
  console.log('Extraction completed.');

  console.log('\n--- Testing Memory Search ---');
  const vector = await embeddings.embed('What is the user name and preference?');
  const results = await db.search(vector, 5, 0.3);
  console.log('Search Results:', JSON.stringify(results, null, 2));
}

test().catch(console.error);