# Fixing Gaming Keyboard Backlight Issue - Arch Linux - Jedel K510

I recently bought a Jedel K510 gaming keyboard and found that keyboard
LEDs are not working on my Arch Linux laptop. By default extra LEDS are
disabled on most of linux distributions for power saving purposes.
However I enabled it and found that LED toggle button is also not
working. But finally I managed to make all things work.

## Turn on/off keyboard LEDs by terminal

Linux is allowing users to control all hardware items by a virtual
file system called `sys`. You can find out whats in the `sys` directory
by running `ls /sys` command. As per the [official linux
doc](https://www.kernel.org/doc/html/latest/leds/leds-class.html) LED
controllers are in the `/sys/class/leds` and we can control LEDs by
running following commands.

```
# Turn on LEDS on a specific device
$ echo 1 > /sys/class/leds/<led-name>/brightness

# Turn off LEDS on s specific device
$ echo 0 > /sys/class/leds/<led-name>/brightness
```

But there are multiple LED names in the `/sys/class/leds/`
directory and we need to find the exact LED name for our device.

## Finding the LED name

To find out the LED name, first we should know the device id. To find
the device id we can use our friendly `lsusb` command.

```
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 005: ID 0bda:b00a Realtek Semiconductor Corp. Realtek Bluetooth 4.2 Adapter
Bus 001 Device 004: ID 04f2:b626 Chicony Electronics Co., Ltd HP TrueVision HD Camera
Bus 001 Device 003: ID 2a7a:9587  CASUE USB KB
Bus 001 Device 002: ID 1bcf:08a0 Sunplus Innovation Technology Inc. Gaming mouse [Philips SPK9304]
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

In this example my device id is `2a7a:9587` which vendor id is `2a7a`
and the product id is `9587`.

Now we can find the LED name by running following command in your
bash/sh terminal.

```
$ for led in $(ls -1 /sys/class/leds/); do echo "LED Name:- $led Device Id:- $(cat /sys/class/leds/$led/device/id/vendor):$(cat /sys/class/leds/$led/device/id/product)"; done | grep 2a7a:9587
```

Replace `2a7a:9587` with your device id. Now you can see an output like
below.

```
LED Name:- input8::capslock Device Id:- 2a7a:9587
LED Name:- input8::compose Device Id:- 2a7a:9587
LED Name:- input8::kana Device Id:- 2a7a:9587
LED Name:- input8::numlock Device Id:- 2a7a:9587
LED Name:- input8::scrolllock Device Id:- 2a7a:9587
```

I know in Jedel K510 keyboard, all LEDs mapped to Scroll Lock button.
Because it mentioned in the keyboard casing. If you are trying with
another keyboard, Run bellow command for each LED names and check which
LED name is making your LEDs turn on.

```
$ su # Logging as root user
$ echo 1 > /sys/class/leds/<led-name>/brightness
```

## Is this LED name is constant?

For some keyboards this LED name is permanent and not
for some keyboards. You can run below command after re-plug your
keyboard to check the weather the LED name changed.

```
$ for led in $(ls -1 /sys/class/leds/); do echo "LED Name:- $led Device Id:- $(cat /sys/class/leds/$led/device/id/vendor):$(cat /sys/class/leds/$led/device/id/product)"; done | grep 2a7a:9587
```

## Script to toggle keyboard backlight

I made a simple script to toggle keyboard backlight when we pass
vendor id and product id obtained by `lsusb` command. Change `VENDOR`,
`PRODUCT` variables with your vendor id and product id. And also change
`BUTTON` with your LED name suffix.

```sh
# ~/.local/bin/kbb.sh

#!/usr/bin/bash

VENDOR=2a7a
PRODUCT=9587

BUTTON="scrolllock"
MODE=$1

for led in $(ls -1 /sys/class/leds/)
do
    productId=$(cat /sys/class/leds/$led/device/id/product)
    vendorId=$(cat /sys/class/leds/$led/device/id/vendor)
    if [ "$VENDOR:$PRODUCT" = "$vendorId:$productId" -a "${led##*::}" = "$BUTTON" ]
    then
        if [ "$#" -ne 1 ]; then
            if [ "0" = $(cat /sys/class/leds/$led/brightness) ]; then
                MODE="1"
            else
                MODE="0"
            fi
        fi

        echo "MODE" > /sys/class/leds/$led/brightness
    fi
done
```

I made this script for keyboards with dynamic LED names. If your LED
name is a constant, remove additional `for` loops and make it simple
like below. Replace `LEDNAME` variable with the name of the LED.

```sh
# ~/.local/bin/kbb.sh

#!/usr/bin/bash

MODE=$1
LEDNAME="asuskb_backlight"

if [ "$#" -ne 1 ]; then
    if [ "0" = $(cat /sys/class/leds/$LEDNAME/brightness) ]; then
        MODE="1"
    else
        MODE="0"
    fi
fi

echo "MODE" > /sys/class/leds/$LEDNAME/brightness
```

Now you can run the script like bellow.

```
# Giving executable permissions to file
$ chmod +x ~/.local/bin/kbb.sh

# Turn on LEDs
$ sudo ~/.local/bin/kbb.sh 1

# Turn off LEDs
$ sudo ~/.local/bin/kbb.sh 0

# Toggle LEDs
$ sudo ~/.local/bin/kbb.sh
```

## Adding the script to run on startup

By default non-root users do not have permission to edit the `/sys/class`
files. So we have to use `sudo` when running the command in terminal and
the `sudo` will ask for the password. But in auto-scripts, we do not have
a tty to interact with commands. So we have to avoid the interactions
when using `sudo` command. We can achieve this by adding a rule to
`sudoers` file.

Another issue is we can not redirect `echo` output to a file when using
`sudo` command. So we have to use `tee` command with `sudo` to write
output to `/sys` files.

```
# /etc/sudoers

# ...

ALL ALL = (ALL) NOPASSWD: /usr/bin/tee /sys/class/leds/*/brightness
```

After adding the above rule `sudo` command will not asking for a
password anymore when controlling LEDs.

Now we have to change our script to use `tee` instead echo.

```sh
$ ~/.local/bin/kbb.sh

# Change this

echo "MODE" > /sys/class/leds/$led/brightness
# to
echo "$MODE" | sudo /usr/bin/tee "/sys/class/leds/$device/brightness"
```

Now check our change by running the script without `sudo`

```
$ ~/.local/bin/kbb.sh
```

You can see your keyboard LEDs toggled. Next add the command to your
`.profile` file to run on startup

```
# ~/.profile

/home/ramesh/.local/bin/kbb.sh
```

## Binding Scroll Lock key (xorg + i3 only)

To bind the scroll lock key to our script, we have to know the key id of
the Scroll Lock key. First run below command and find the master id of
your keyboard.

```
$ xinput list
⎡ Virtual core pointer                    	id=2	[master pointer  (3)]
⎜   ↳ Virtual core XTEST pointer              	id=4	[slave  pointer  (2)]
⎜   ↳ HID 1bcf:08a0 Mouse                     	id=8	[slave  pointer  (2)]
⎜   ↳ HID 1bcf:08a0 Keyboard                  	id=9	[slave  pointer  (2)]
⎜   ↳ SynPS/2 Synaptics TouchPad              	id=16	[slave  pointer  (2)]
⎣ Virtual core keyboard                   	id=3	[master keyboard (2)]
    ↳ Virtual core XTEST keyboard             	id=5	[slave  keyboard (3)]
    ↳ Power Button                            	id=6	[slave  keyboard (3)]
    ↳ Video Bus                               	id=7	[slave  keyboard (3)]
    ↳ HID 1bcf:08a0                           	id=10	[slave  keyboard (3)]
    ↳ CASUE USB KB                            	id=11	[slave  keyboard (3)]
    ↳ CASUE USB KB System Control             	id=12	[slave  keyboard (3)]
    ↳ CASUE USB KB Consumer Control           	id=13	[slave  keyboard (3)]
    ↳ HP TrueVision HD Camera: HP Tru         	id=14	[slave  keyboard (3)]
    ↳ AT Translated Set 2 keyboard            	id=15	[slave  keyboard (3)]
    ↳ Wireless hotkeys                        	id=17	[slave  keyboard (3)]
    ↳ HP WMI hotkeys                          	id=18	[slave  keyboard (3)]
    ↳ HID 1bcf:08a0 Keyboard                  	id=19	[slave  keyboard (3)]
```

In this example, the master id of my keyboard is 11. Then run the below
command and press Scroll Lock key while running it. Replace `11` with
your master id.

```
$ xinput test 11 
key release 36 
key press   78 
key release 78 
key press   78 
key release 78 
key press   78 
key release 78 
key press   37 
key press   54 
^C
```

In this example the key id is `78` and it is the common key id of the
scroll key for every keyboard.

Now bind our script to the Scroll Key by editing i3 configuration file.

```
# ~/.config/i3/config

# Keyboard backlight
bindcode 78 exec --no-startup-id /home/ramesh/.local/bin/kbb.sh
```

Now reload the i3 configurations by pressing `Cmd+Shift+R`.

Check it by pressing the Scroll Lock key. Your keyboard backlight will be
toggled.
