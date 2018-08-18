from gpiozero import Servo
from time import sleep

t = True

while t == True :
  Pin = 17
  ServoMotore = Servo(Pin)
  ServoMotore.max()
  sleep(0.5)
  t = False
