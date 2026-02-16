#!/bin/bash
# scripts/check_context.sh - Check context usage and trigger backup if > 80%

# Note: This is a placeholder for a more complex logic if needed.
# Since we can't easily get the 'current' session's context from a shell script 
# without knowing the session ID, we'll rely on an agentTurn cron job 
# to perform the check using the session_status tool.

echo "Context check triggered."
