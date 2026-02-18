#!/usr/bin/env node

import { EproMemory } from '@tobybridges/epro-memory';

const config = {
  embedding: {
    apiKey: 'dummy',
    baseUrl: 'http://localhost:11434/v1',
    model: 'nomic-embed-text'
  },
  llm: {
    apiKey: 'sk-cp-coxAC_y7xyXkO84sJvokXDIIUDlLkXvWVBGWgk0myKnxCC-I7fiQFx-zSkjetcEwIBrGQkPkO_SmTAymeoABQFVN7sDfNjGhCI96pS-4dL0Hadx7O8Z5d9c',
    baseUrl: 'https://api.minimax.io/v1',
    model: 'MiniMax-M2.5'
  },
  dbPath: '~/.openclaw/epro-memory/db',
  autoCapture: false,
  autoRecall: false
};

async function test() {
  console.log('Testing epro-memory...');
  try {
    const memory = new EproMemory(config);
    await memory.initialize();
    console.log('✅ epro-memory initialized successfully!');
    
    // Test embedding
    const testEmbedding = await memory.embed('Hello world');
    console.log('✅ Embedding works! Vector length:', testEmbedding.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

test();
