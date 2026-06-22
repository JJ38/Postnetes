import time
from kubernetes import client, config

CLUSTER_NAMESPACE = "default"

config.load_kube_config("/etc/rancher/k3s/k3s.yaml")

contexts = config.list_kube_config_contexts(
    config_file="/etc/rancher/k3s/k3s.yaml"
)

print(contexts)

v1 = client.CoreV1Api()

def getPods():

    pods = v1.list_namespaced_pod(CLUSTER_NAMESPACE)

    parsedPods = []
    
    for pod in pods.items:

        pod_data = {
            "name": pod.metadata.name,
            "status": pod.status.phase,
            "ip": pod.status.pod_ip,
            "labels": pod.metadata.labels,
            "ports": [
                c.ports for c in pod.spec.containers
                if c.ports
            ]
        }
        
        parsedPods.append(pod_data)


    return parsedPods


def getServices():  

    services = v1.list_namespaced_service(CLUSTER_NAMESPACE)

    parsedServices = []

    for service in services.items:

        service_data = {
            "name": service.metadata.name,
            "type": service.spec.type,
            "cluster_ip": service.spec.cluster_ip,
            "ports": [
                {
                    "port": p.port,
                    "target": p.target_port
                }
                for p in service.spec.ports
            ],
            "selector": service.spec.selector
        }

        parsedServices.append(service_data)

    return parsedServices



while True:
    try:
    
        start = time.perf_counter()

        pods = getPods()
        services = getServices()

        duration = time.perf_counter() - start

        print("before len(*.items)")

        print(f"Pods: {len(pods.items)} | Poll time: {duration:.3f}s")
        print(f"Services: {len(services.items)} | Poll time: {duration:.3f}s")

    except Exception as e:
        print("Kubernetes error:", e)

    time.sleep(5)

