import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

async function importMemories() {
  const text = fs.readFileSync('./combined_memory.txt', 'utf-8');
  
  console.log('--- Starting Memory Import ---');
  const sessionKey = 'legacy-import';
  const user = 'X';
  
  try {
    const { MemoryDB } = await import('./epro-memory/dist/db.js');
    const { Embeddings } = await import('./epro-memory/dist/embeddings.js');
    const { LlmClient } = await import('./epro-memory/dist/llm.js');
    const { MemoryDeduplicator } = await import('./epro-memory/dist/deduplicator.js');
    const { MemoryExtractor } = await import('./epro-memory/dist/extractor.js');

    const db = new MemoryDB(config.dbPath, 1536, console); 
    const embeddings = new Embeddings(config.embedding.apiKey, config.embedding.model, config.embedding.baseUrl);
    const llm = new LlmClient(config.llm.apiKey, config.llm.model, config.llm.baseUrl);
    const deduplicator = new MemoryDeduplicator(db, llm, console);
    const extractor = new MemoryExtractor(db, embeddings, llm, deduplicator, console);

    console.log('Processing historical records...');
    await extractor.extractAndPersist(text, sessionKey, user);
    console.log('Import completed successfully.');
  } catch (err) {
    console.error('Import failed:', err);
  }
}

importMemories();