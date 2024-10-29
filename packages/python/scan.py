# Use this script to scan an existing RFID product

import RPi.GPIO as GPIO
import os
from mfrc522 import SimpleMFRC522
from dotenv import load_dotenv
import json
import websocket

load_dotenv()
NODE_ID = os.getenv('NODE_ID')
APP_ADDR = os.getenv('APP_ADDR')
ws = websocket.WebSocket()
reader = SimpleMFRC522()

try:
    ws.connect(APP_ADDR)
    print("Please Scan Product")
    product_id, hash = reader.read()  # This will read the RFID tag
    print(f"Proudct ID: {product_id}, RFID: {hash}, NODE_ID: {NODE_ID}")
    data = {
        "id" : product_id,
        "rfid" : hash,
        "supplyChainNode" : NODE_ID
    }
    ws.send(json.dumps(data))
    print("Data Transmitted")
    ws.close()
finally:
    GPIO.cleanup()