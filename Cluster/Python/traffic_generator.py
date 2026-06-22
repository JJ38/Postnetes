import time
import requests
from concurrent.futures import ThreadPoolExecutor

REQUESTS_PER_SECOND = 1
url = ""

executor = ThreadPoolExecutor(max_workers=50)

def send_request(i):
    try:
        print("sending request to: " + url)
        response = requests.post(
            url,
            json={"parcel_id": i},
            timeout=5
        )
        print(f"Parcel {i} -> {response.status_code}")
    except Exception as e:
        print(f"Parcel {i} -> ERROR: {e}")


def main():

    global url

    print("Enter the node IP:port/endpoint:")
    nodeIP = input()

    url = f"http://{nodeIP}"

    print(f"URL: {url}")

    parcel_id = 1

    interval = 1 / REQUESTS_PER_SECOND

    while True:
        print("loop")
        # schedule request immediately (non-blocking)
        executor.submit(send_request, parcel_id)

        parcel_id += 1

        sleep_time = max(0, interval)
        time.sleep(sleep_time)


if __name__ == "__main__":
    main()