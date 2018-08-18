import RPi.GPIO as GPIO
import time
import sys

GPIO.setwarnings(False)

GPIO.setmode(GPIO.BCM)
	 
Emettitore = 20 
Ricevitore = 21
	 
GPIO.setup(Emettitore,GPIO.OUT)
GPIO.setup(Ricevitore,GPIO.IN)
	 
GPIO.output(Emettitore, False)
time.sleep(1)
	 
GPIO.output(Emettitore, True)
time.sleep(0.00001)
GPIO.output(Emettitore, False)
	 
while GPIO.input(Ricevitore)==0:
 avvio_onda = time.time()
	 
while GPIO.input(Ricevitore)==1:
 fine_onda = time.time()
	 
tempo = fine_onda - avvio_onda 
	 
distanza_approssimata = tempo * 34390 / 2

distanza = round(distanza_approssimata, 2)
	 
print (distanza)

sys.stdout.flush()