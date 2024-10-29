#utility file- use if you need to write to an RFID tag

import RPi.GPIO as GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()


try:
    text = input("Name: ")
    print("Now place your tag to write")
    reader.write(text)
    idn, name = reader.read()
    print("Written: " + str(idn) + " " + name)
finally:
    GPIO.cleanup()
