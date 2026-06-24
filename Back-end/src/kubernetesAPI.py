import time
from kubernetes import client, config
from flask import Flask, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)

CORS(app)

parsedPods = []
parsedServices = []

CLUSTER_NAMESPACE = "default"

config.load_kube_config("/etc/rancher/k3s/k3s.yaml")

contexts = config.list_kube_config_contexts(
    config_file="/etc/rancher/k3s/k3s.yaml"
)

v1 = client.CoreV1Api()

def getPods():

    global parsedPods

    pods = v1.list_namespaced_pod(CLUSTER_NAMESPACE)

    parsedPods = []

    for pod in pods.items:

        pod_data = pod.to_dict()
        
        parsedPods.append(pod_data)


    return parsedPods

def getServices():  

    global parsedServices

    services = v1.list_namespaced_service(CLUSTER_NAMESPACE)

    parsedServices = []

    for service in services.items:

        service_data = service.to_dict()

        parsedServices.append(service_data)

    return parsedServices
    

def pollKubernetes():

    while True:
        try:
        
            start = time.perf_counter()

            pods = getPods()
            services = getServices()

            duration = time.perf_counter() - start

            print("before len(*.items)")

            print(f"Pods: {len(pods)} | Poll time: {duration:.3f}s")
            print(f"Services: {len(services)} | Poll time: {duration:.3f}s")

        except Exception as e:
            print("Kubernetes error:", e)

        time.sleep(5)


@app.route("/get-game-state", methods=["GET"])
def get_game_state():

    gameState = {
        "pods": parsedPods,
        "services": parsedServices
    }

    response = jsonify(gameState)
    response.headers.add(
        "Access-Control-Allow-Origin",
        "http://localhost:5173"
    )

    return response




threading.Thread(
    target=pollKubernetes,
    daemon=True
).start()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)