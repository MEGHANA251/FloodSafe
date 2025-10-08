#!/bin/bash
# start.sh – launches your project

# Navigate to the project directory
cd "$(floodsafeindia "$0")"

# Start the static server in the background
npx serve -s build &

# Give the server 2 seconds to start
sleep 2

# Open the browser automatically
open http://localhost:3000
