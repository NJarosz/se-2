# Use this script to register a new RFID product

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522
from eth_utils import keccak
import os
from dotenv import load_dotenv
import json
import websocket

load_dotenv()
NODE_ID = os.getenv('NODE_ID')
APP_ADDR = os.getenv('APP_ADDR')
ws = websocket.WebSocket()
ws.connect(APP_ADDR)
reader = SimpleMFRC522()

try:
    text = input("Pass key (Keep private and do not forget!): ") # User's secret key is used as the basis for the RFID's hash
    hashed = keccak(text=text).hex() # Hashes the key (keccak256) and converts to hexidecimal

    print("Now place your tag to write")
    reader.write(hashed)
    product_id, hex_hash = reader.read() 

    print(f"WRITTEN- Proudct ID: {product_id}, RFID: {hex_hash}, NODE_ID: {NODE_ID}")
    verification = input("Correct? (y/n): ")
    if verification == "y":
        data = {
        "id" : product_id,
        "rfid" : hex_hash,
        "supplyChainNode" : NODE_ID
        }
        
        ws.send(json.dumps(data))
        print("Data Transmitted")
    ws.close()
finally:
    GPIO.cleanup()
