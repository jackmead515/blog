from asyncio import run
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor

def get_build_plugin_comand(plugin_name):
    return f"""
    source ~/.zshrc && \
    cd plugins/{plugin_name} && \
    nvm use && \
    npm install && \
    npm run build
    """


def get_build_client_command():
    return f"""
    source ~/.zshrc && \
    cd client && \
    nvm use && \
    npm install && \
    npm run build
    """


def get_build_utilities_command():
    return f"""
    source ~/.zshrc && \
    cd utilities && \
    activate && \
    pip3 install -r requirements.txt && \
    python3 related/main.py && \
    python3 sitemap/main.py && \
    cp sitemap.xml ../client/public/sitemap.xml && \
    cp related.json ../server/resources/related.json
    """


def run_command(command):
    return subprocess.run(command, shell=True, check=True, executable=os.environ['SHELL'])


if __name__ == "__main__":
    """
    Build plugins
    Run Utilities
    Move resources
    Move plugins
    Build Client
    Move Client
    """

    plugins = [
        "sat-tester",
        "cap-sensor-vis",
        "d3-graphs"
    ]

    # Build plugins
    pool = ThreadPoolExecutor(max_workers=8)
    for plugin in plugins:
        pool.submit(run_command, get_build_plugin_comand(plugin))
        pool.submit(run_command, f"mkdir -p client/public/plugins/{plugin}")
    pool.shutdown(wait=True)

    # Run Utilities
    run_command(get_build_utilities_command())

    # Copy plugins to client
    pool = ThreadPoolExecutor(max_workers=8)
    for plugin in plugins:
        pool.submit(run_command, f"cp -r plugins/{plugin}/build/* client/public/plugins/{plugin}")
    pool.shutdown(wait=True)

    run_command(get_build_client_command())

    # Copy client to server
    run_command(f"mkdir -p server/resources/build")
    run_command(f"cp -r client/build/* server/resources/build")