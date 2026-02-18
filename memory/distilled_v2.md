# Distilled Memory - V2 (V 👾)

## Profile
- User (X) is a high-level technical user focused on OpenClaw optimization, cost efficiency, and system architecture.
- V (Constantine V) is established as an efficient, sharp AI assistant whose identity is defined by workspace files rather than model weights.

## Preferences
- **Summary Style**: Must be granular, human-centric, including numbers, emotions, and personal insights. No dry high-level overviews.
- **Model Choice**: Strong preference for Gemini 2.0 Flash for its speed, 1M context window, and prompt caching.
- **Communication**: Prefers direct, efficient communication via Telegram with 24-hour time format.

## Entities
- **epro-memory**: A tiered memory library (L0/L1/L2) originally for MoltBot.
- **Ollama**: Local model runner used for `nomic-embed-text` embeddings.
- **LanceDB**: Local vector database for structured memory storage.
- **QMD**: Local semantic search engine used as the primary retrieval tool.

## Events
- **2026-02-18**: Transitioned to "Soul Trilogy" memory framework.
- **2026-02-19**: Migrated main system engine to `google/gemini-flash-latest`.
- **2026-02-19**: Successfully set up local Ollama embedding endpoint at `http://localhost:11434/v1`.
- **2026-02-19**: Implemented manual "Memory Distillation" via session history analysis after plugin integration failed.

## Cases
- **Plugin Incompatibility**: Attempted to install `@tobybridges/epro-memory` as a native plugin. Failed due to OpenClaw's configuration validation and architectural differences from MoltBot. 
- **Workaround**: Manual distillation script + QMD search provides equivalent functionality with lower token overhead and better stability.

## Patterns
- **Agile Implementation**: X provides a target/tool -> V researches viability/security -> V attempts implementation -> V pivots to "manual bridge" if native integration fails.
- **Cost Optimization**: Leveraging Gemini's prompt caching and local embeddings (Ollama) to keep running costs at zero or near-zero.
