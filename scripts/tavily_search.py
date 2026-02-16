#!/usr/bin/env python3
"""Tavily Search CLI - AI-powered web search"""

import json
import sys
from tavily import TavilyClient

API_KEY = "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"

def main():
    query = " ".join(sys.argv[1:])
    if not query:
        print("Usage: tavily_search.py <query>", file=sys.stderr)
        sys.exit(1)
    
    client = TavilyClient(api_key=API_KEY)
    results = client.search(query, max_results=10)
    
    # Output as JSON for easy parsing
    print(json.dumps(results, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
