# open terminals with wsl
# start back end server in wsl
# start front end server in windows
# start traffic generator in windows
#!/bin/bash

cd Back-end
source .venv/bin/activate
sudo .venv/bin/python src/kubernetesAPI.py

# tmux new-window -n cluster

# tmux attach -t cluster