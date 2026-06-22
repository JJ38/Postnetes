from flask import Flask, jsonify, request
from queue import Queue
import threading
import time

app = Flask(__name__)

queue = Queue(maxsize=5)
processing_time = 2 #seconds

processed = 0

def process_parcels():
    global processed

    while True:
        parcel = queue.get()

        time.sleep(processing_time)

        processed += 1

        print(f"Processed parcel {parcel}")

        queue.task_done()


threading.Thread(
    target=process_parcels,
    daemon=True
).start()


@app.route("/parcel", methods=["POST"])
def parcel():

    if queue.full():
        return jsonify({
            "accepted": False,
            "reason": "queue full"
        }), 429

    parcel_id = request.json.get("parcel_id")

    queue.put(parcel_id)

    return jsonify({
        "accepted": True
    })


@app.route("/stats")
def stats():

    return jsonify({
        "queue_size": queue.qsize(),
        "processed": processed
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0")