import time
from kubernetes import client, config
from flask import Flask, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)

CORS(app) #allows all origins

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

        parsedPods.append({
            "name": pod.metadata.name,
            "namespace": pod.metadata.namespace,
            "ip": pod.status.pod_ip,
            "node": pod.spec.node_name,
            "phase": pod.status.phase,
            "hostIP": pod.status.host_ip,
            "startTime": pod.status.start_time.isoformat() if pod.status.start_time else None,
            "labels": pod.metadata.labels,
            "containers": [
                {
                    "name": c.name,
                    "image": c.image,
                    "ports": [
                        p.container_port
                        for p in (c.ports or [])
                    ]
                }
                for c in pod.spec.containers
            ]
        })

    return parsedPods

def getServices():  

    global parsedServices

    services = v1.list_namespaced_service(CLUSTER_NAMESPACE)

    parsedServices = []

    for service in services.items:

        parsedServices.append({
            "name": service.metadata.name,
            "namespace": service.metadata.namespace,
            "type": service.spec.type,
            "clusterIP": service.spec.cluster_ip,
            "labels": service.metadata.labels,
            # "externalIPs": service.spec.external_i_ps or [],
            "selector": service.spec.selector or {},
            "ports": [
                {
                    "name": p.name,
                    "port": p.port,
                    "targetPort": p.target_port,
                    "protocol": p.protocol,
                    "nodePort": p.node_port
                }
                for p in service.spec.ports
            ]
        })

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