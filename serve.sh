#!/bin/bash

# Simple script to serve the website locally
# Usage: ./serve.sh [port]
# Default port is 8000

PORT=${1:-8000}

echo "Starting local server on port $PORT..."
echo "Website will be available at: http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server $PORT
