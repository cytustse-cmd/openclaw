#!/usr/bin/env python3
"""
X Tweet Tracker - Uses Tavily search to detect new tweets
"""
import os
import json
import sys
import subprocess
import re
from datetime import datetime

# Configuration
USERS = ["steipete"]  # Add more users here
STATE_FILE = "/Users/xfurious/.openclaw/workspace/scripts/x_tracker_state.json"
MCPORTER_PATH = "/Users/xfurious/.npm-global/bin/mcporter"

def get_tweets_via_tavily(username):
    """Use Tavily search to get latest tweets"""
    query = f"latest tweets from x.com/{username}"
    cmd = [MCPORTER_PATH, "call", "tavily.tavily_search", f"query={query}"]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            data = json.loads(result.stdout)
            return data.get("results", [])
        else:
            print(f"Tavily error: {result.stderr}", file=sys.stderr)
            return []
    except Exception as e:
        print(f"Tavily exception: {e}", file=sys.stderr)
        return []

def extract_tweet_id(url):
    match = re.search(r"status/(\d+)", url)
    return match.group(1) if match else None

def main():
    print(f"[{datetime.now().isoformat()}] X Tracker checking {len(USERS)} users via Tavily...", file=sys.stderr)
    
    # Load state
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            state = json.load(f)
    else:
        state = {"users": {}}
    
    # Ensure each user has state
    for user in USERS:
        if user not in state["users"]:
            state["users"][user] = {"last_id": "0", "seen_ids": []}
    
    all_new_tweets = []
    
    for username in USERS:
        print(f"Checking @{username}...", file=sys.stderr)
        
        # Get tweets via Tavily
        results = get_tweets_via_tavily(username)
        
        if not results:
            print(f"Failed to get tweets for @{username}", file=sys.stderr)
            continue
        
        # Extract tweet IDs
        current_ids = []
        for res in results:
            url = res.get("url", "")
            if f"x.com/{username}/status/" in url or f"twitter.com/{username}/status/" in url:
                tweet_id = extract_tweet_id(url)
                if tweet_id:
                    current_ids.append(tweet_id)
        
        if not current_ids:
            print(f"No tweets found for @{username}", file=sys.stderr)
            continue
        
        # Find max ID
        max_id = max(current_ids, key=int)
        print(f"Found {len(current_ids)} tweets, latest: {max_id}", file=sys.stderr)
        
        user_state = state["users"][username]
        # Handle both old format (last_tweet_id) and new format (last_id)
        last_known_id = user_state.get("last_id") or user_state.get("last_tweet_id", "0")
        
        # Find new tweets (ID > last known)
        new_tweets = []
        for res in results:
            url = res.get("url", "")
            if f"x.com/{username}/status/" in url or f"twitter.com/{username}/status/" in url:
                tweet_id = extract_tweet_id(url)
                if tweet_id and int(tweet_id) > int(last_known_id):
                    new_tweets.append({
                        "id": tweet_id,
                        "url": url,
                        "title": res.get("title", ""),
                        "content": res.get("content", "")
                    })
        
        if new_tweets:
            print(f"Found {len(new_tweets)} new tweets!", file=sys.stderr)
            all_new_tweets.append({
                "user": username,
                "tweets": new_tweets
            })
        
        # Update state - use last_id for new format
        user_state["last_id"] = max_id
        if "last_tweet_id" in user_state:
            del user_state["last_tweet_id"]
        if "last_tweet_ids" in user_state:
            del user_state["last_tweet_ids"]
    
    # Save state
    with open(STATE_FILE, "w") as f:
        json.dump(state, f)
    
    # Output for cron to process
    if all_new_tweets:
        print(json.dumps(all_new_tweets, indent=2))
    else:
        print("[]")

if __name__ == "__main__":
    main()
