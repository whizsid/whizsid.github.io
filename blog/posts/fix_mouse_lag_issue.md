# Fixing the Linux optical mouse lag issue after idle for a while

Some optical mouses are becoming unresponsive after idle for a while on Linux. It caused by the Linux built-in power management configurations. Linux power management system will suspend your USB devices if not used for a while. So it effecting badly for some devices. To fix this issue you have to disable the autosuspend rules for your specific device.

## Disabling autosuspend rule

To disable the autosuspending rules, first you need to obtain the device's vendor id and the product id. You can get these ids by running `lsusb`.

```
$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 005: ID 0bda:b00a Realtek Semiconductor Corp. Realtek Bluetooth 4.2 Adapter
Bus 001 Device 004: ID 04f2:b626 Chicony Electronics Co., Ltd HP TrueVision HD Camera
Bus 001 Device 003: ID 1ea7:0064 SHARKOON Technologies GmbH 2.4GHz Wireless rechargeable vertical mouse [More&Better]
Bus 001 Device 002: ID c0f4:04c0 SZH usb keyboard
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```
In this example  `Bus 001 Device 003: ID 1ea7:0064 SHARKOON Technologies GmbH 2.4GHz Wireless rechargeable vertical mouse [More&Better]` is my device, `1ea7` is the vendor id and `0064` is the product id.

Now open the `/etc/udev/rules.d/50-usb_power_save.rules` file and add the following autosuspend rule.

```
$ sudo nano /etc/udev/rules.d/50-usb_power_save.rules

ACTION=="add", SUBSYSTEM=="usb", ATTR{idVendor}=="1ea7", ATTR{idProduct}=="0064", ATTR{power/autosuspend}="-1"
```
To exit from `nano` editor, press `Ctrl+x` and `. If this file not exist, `nano` command will create it for you. Replace the `1ea7`,`0064` with your vendor id and product id.

## Reloading suspend rules

Linux udev daemon will automatically detect the changes in rules file and reload your rules. However, the rules are not re-triggered automatically on already existing devices. Hot-pluggable devices, such as USB devices, will probably have to be reconnected for the new rules to take effect. 

If rules fail to reload automatically run the following command. 

```
$ sudo udevadm control --reload
```

And run this command to trigger those rules.
```
$ sudo udevadm trigger
```

Now you do not need to restart your system.