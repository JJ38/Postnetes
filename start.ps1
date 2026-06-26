# Start WSL + tmux session
# Start-Process wt -ArgumentList "wsl bash -c 'start_wsl.sh'"
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "wsl -d Ubuntu"

Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "wsl -d Ubuntu bash Back-end/start_back_end.sh"

# Start frontend
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "cd Front-End; npm run dev"

# Start traffic generator
Start-Process powershell -ArgumentList `
    "-NoExit", `
    "-Command", `
    "python Game-Loop\src\traffic_generator.py"