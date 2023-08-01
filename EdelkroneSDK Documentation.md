---
aliases:
  - SDK
tags:
  - Software
hersteller: "[[Edelkrone]]"
id: 01H6H92FP29053QV59SCG1YFPM
---
# HTTP Endpoints

You can communicate with HTTP/REST API over edelkrone SDK.

Caution

- edelkrone SDK supports **only** HTTP/1.1.
- SDK **does not** provide an SSL connection. You can **only** connect over HTTP.
- edelkrone SDK **does not** support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because a HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

## Pairing

edelkrone SDK gives you full control of pairing a single or multiple edelkrone motion control systems into a bundle connected via wireless or wired interfaces.

You can read the relevant [summary page](http://127.0.0.1:32223/docs/overview.html#pairing-connecting) for high level overview.

### Wireless

#### Initiate wireless scan

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because a HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"wirelessPairingScanStart"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`wirelessPairingScanStart`|Command name|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Get current wireless scan results

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK **does not** support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"wirelessPairingScanResults"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`wirelessPairingScanResults`|Command name|

**Return value**

```json
{
    "data": [
        {
            "groupId": 65535,
            "isDeviceFirmwareUpdateAvailable": false,
            "isRadioFirmwareUpdateAvailable": false,
            "mac": "A4:E5:7C:CF:4F:66",
            "rssi": -49.0,
            "setup": "none",
            "type": "slideModuleV3"
        },
        {
            "groupId": 65535,
            "isDeviceFirmwareUpdateAvailable": false,
            "isRadioFirmwareUpdateAvailable": false,
            "mac": "98:F4:AB:21:A7:7E",
            "rssi": -88.0,
            "setup": "none",
            "type": "headPlusProV2"
        },
        {
            "groupId": 24883,
            "isDeviceFirmwareUpdateAvailable": false,
            "isRadioFirmwareUpdateAvailable": false,
            "mac": "E8:DB:84:2C:C4:76",
            "rssi": -87.0,
            "setup": "panTilt",
            "type": "headPlusV2"
        },
        {
            "groupId": 25052,
            "isDeviceFirmwareUpdateAvailable": false,
            "isRadioFirmwareUpdateAvailable": false,
            "mac": "F0:08:D1:85:BD:1A",
            "rssi": -86.0,
            "setup": "groupMember",
            "type": "slideModuleV3"
        },
        {
            "groupId": 65535,
            "isDeviceFirmwareUpdateAvailable": false,
            "isRadioFirmwareUpdateAvailable": false,
            "isTilted": 1,
            "mac": "C4:4F:33:65:D9:CF",
            "rssi": -81.0,
            "setup": "none",
            "type": "headOne"
        }
    ],
    "result": "ok"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`data`|-|-|Array of information about edelkrone motion control system(s) found in wireless range|

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`groupId`|`int`|-|GroupID for the device. This value is 65535 for non paired devices. All devices belong in a specific bundle share the same GroupID.|
|`linkPairigingActive`|`bool`|-|Link (3.5mm) cable is connected to this device **and** this device received a ping from at least one other link connected device.|
|`isTilted`|`bool`|-|This flag is valid when _HeadONE_'s axis is tilted.|
|`mac`|`string`|`FF:FF:FF:FF:FF:FF`|Mac address as hex string.|
|`rssi`|`int`|-|Received signal strength indication.|
|`isDeviceFirmwareUpdateAvailable`|`bool`|-|Device firmware update available for device.   <br>You can connect with mobile app to your device which can be updated & follow the instructions from the mobile app to continue.|
|`isRadioFirmwareUpdateAvailable`|`bool`|-|Radio firmware update available for device.   <br>You can connect with mobile app to your device which can be updated & follow the instructions from the mobile app to continue.|
|`setup`|`string`|If device is a bundle master: <br><br>- `panOnly`<br>- `tiltOnly`<br>- `panTilt`<br>- `slideOnly`<br>- `dollyOnly`<br>- `panAndSlide`<br>- `tiltAndSlide`<br>- `panAndDolly`<br>- `tiltAndDolly`<br>- `panTiltAndSlide`<br>- `panTiltAndDolly`<br><br>- `panAndJib`<br>- `tiltAndJib`<br>- `panTiltAndJib`<br>- `jibOnly`<br>- `panAndJibPlus`<br>- `tiltAndJibPlus`<br>- `panTiltAndJibPlus`<br>- `jibPlusOnly`<br>- `followFocusOnly`<br><br>If device is a bundle member: - `groupMember`<br>  <br>If device is not paired yet: - `none`<br>- `possibleCanbusMaster`<br>  <br>Other states: - `bootingUp`<br>- `firmwareError`|-|
|`type`|`string`|-|See _Device Type_ Table below|

|Device Type|Product Name|
|:--|:--|
|`slideModule`|Slide Module v2|
|`slideModuleV3`|Slide Module v3|
|`sliderOnePro`|SliderONE PRO v2|
|`sliderOne`|SliderONE v2|
|`dollyPlus`|DollyPLUS|
|`dollyOne`|DollyONE|
|`dollyPlusPro`|DollyPLUS PRO|
|`panPro`|PanPRO|
|`headOne`|HeadONE|
|`headPlus`|HeadPLUS v1|
|`headPlusPro`|HeadPLUS v1 PRO|
|`headPlusV2`|HeadPLUS v2|
|`headPlusProV2`|HeadPLUS v2 PRO|
|`focusPlusPro`|FocusPLUS PRO|
|`jibOne`|JibONE|
|`jibOneV2`|JibONE v2|

Note

You **must** send _wirelessPairingScanStart_ command before sending _wirelessPairingScanResults_ command.

#### Create Bundle

You can initiate a bundling operation by sending the MAC address(es) of the motion control system(s) you want to connect with Link Adapter.

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK return a error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
    "command": "wirelessPairingCreateBundle",
    "deviceCount": 1,
    "forcedMasterDevice": "none",
    "macList": [
        "E8:68:E7:2E:B5:E2"
    ]
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`wirelessPairingCreateBundle`|Command name|
|`deviceCount`|`integer`|-|Number of devices to be paired|
|`forcedMasterDevice`|`string`|-|See _Forced Master Device_ table below.   <br>Critical for _JibONE / JibONE v2 + Pan PRO_ bundle.|
|`macList`|`string`|`FF:FF:FF:FF:FF:FF`|Mac address list of devices. Mac addresses should follow "xx:xx:xx:xx:xx" pattern|

|Forced Master Device|Description|
|:--|:--|
|`jibOne`|If Pan PRO is to be used as panning Jib with _JibONE + Pan PRO_ bundle|
|`jibOneV2`|If Pan PRO is to be used as panning Jib with _JibONE v2 + Pan PRO_ bundle|
|`panPro`|If Pan PRO is to be used as panning Head with _JibONE / JibONE v2 + Pan PRO_ bundle|
|`none`|For all other setups|

![jibone_top_bottom](./HTTP Interface - edelkrone SDK_files/jibone--top-bottom.jpg)

```text
Figure1: Pan PRO pairing scenarios with JibONE 
```

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

Note

edelkrone motion control system(s) you want to connect **must** be in wireless range and powered on before sending this command. If not, process will fail. You can check the pairing progress with [wirelessPairingStatus](http://127.0.0.1:32223/docs/endpoints/commands/link_module#get-pairing-status) command.

#### Attach to Existing Bundle

You can attach your Link Adapter to previously created bundle by sending the MAC adress of the main edelkrone motion control system for the particular bundle.

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
    "command": "wirelessPairingAttachToBundle",
    "mac": "30:AE:A4:8F:B1:46"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`wirelessPairingAttachToBundle`|Command name|
|`mac`|`string`|`FF:FF:FF:FF:FF:FF`|Mac address of the main device.   <br>Mac addresses should follow "xx:xx:xx:xx:xx" pattern|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

Note

edelkrone motion control system(s) you want to connect **must** be in wireless range and powered on before sending this command. If not, process will fail. You can check the pairing progress with [wirelessPairingStatus](http://127.0.0.1:32223/docs/endpoints/commands/link_module#get-pairing-status) command.

#### Get Pairing Status

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"wirelessPairingStatus"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|command|`string`|`wirelessPairingStatus`|Command name|

**Return value**

```json
{
    "data": {
        "lastPairError": "none",
        "wirelessPairState": "idle"
    },
    "result": "ok"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`lastPairError`|`string`|-|See _Last Pair Error Descriptions_ table below|
|`pairState`|`string`|- `idle`<br>- `connecting`<br>- `connectionOk`<br>- `problem`||

|Last Pair Error|Description|
|:--|:--|
|`none`|-|
|`impossibleScenario`|Devices are not compatible with each other and can't be bundled together.|
|`radioFirmwareUpdateRequired`|Radio firmware update required for one or more device in the current bundle. Please connect with mobile app to your bundle to check wihch device(s) need update & follow the instructions from the mobile app to continue.|
|`deviceFirmwareUpdateRequired`|Device firmware update required for one or more device in the current bundle. Please connect with mobile app to your bundle to check wihch device(s) need update & follow the instructions from the mobile app to continue.|
|`unknown`|Unknown problem occured. Please retry.|
|`deviceSearchProblem`|Link adapter could not find one or more device(s) with given mac address list.|
|`alreadyGroupMember`|Device you want to pair is already in a bundle.|
|`connectionProblem`|Connection problem occured. Please retry.|

#### Disconnect from bundle

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"disconnect"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`disconnect`|Command name|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

### Wired

#### List Currently Connected Wired Devices

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK **does not** support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK return a error because of HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"link2PairingScanResults"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`link2PairingScanResults`|Command name|

**Return value**

```json
{
    "data": [
        {
            "isDeviceFirmwareUpdateAvailable": false,
            "type": "slideModuleV3"
        },
        {
            "isDeviceFirmwareUpdateAvailable": false,
            "type": "headPlusV2"
        }
    ],
    "result": "ok"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`data`|-|-|Array of information about edelkrone motion control system(s) connected to the Link Adapter via 3.5mm Link cable.|

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`isDeviceFirmwareUpdateAvailable`|`bool`|-|Device firmware update available for device.   <br>You can connect with mobile app to your device which can be updated & follow the instructions from the mobile app to continue.|
|`type`|`string`|-|See _Device Type Table_ below|

|Device Type|Product Name|
|:--|:--|
|`slideModuleV3`|Slide Module v3|
|`panPro`|PanPRO|
|`headPlusV2`|HeadPLUS v2|
|`headPlusProV2`|HeadPLUS v2 PRO|
|`focusPlusPro`|FocusPLUS PRO|
|`jibOneV2`|JibONE v2|

#### Connect to Wired Device(s)

This command tries to pair the Link Adapter to one or more devices connected with the Link (3.5mm) cables **or** tries to attach the Link Adapter to an already paired group with wired interface.

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK **does not** support CORS, so when you send a request with the "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"link2PairingConnect",
  "forcedMasterDevice": "none"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`link2PairingConnect`|Command name|
|`forcedMasterDevice`|`string`|-|See _Forced Master Device_ table below.   <br>Critical for _JibONE v2 + Pan PRO_ bundle.|

|Forced Master Device|Description|
|:--|:--|
|`jibOneV2`|If Pan PRO is to be used as panning Jib with _JibONE v2 + Pan PRO_ bundle|
|`panPro`|If Pan PRO is to be used as panning Head with _JibONE v2 + Pan PRO_ bundle|
|`none`|For all other setups|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Get Wired Pairing Status

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"link2PairingStatus"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`link2PairingStatus`|Command name|

**Return value**

```json
{
    "data": {
        "canbusPairState": "pingReceived",
        "lastPairError": "none"
    },
    "result": "ok"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|canbusPairState|`string`|- `idle`<br>- `pingReceived`<br>- `connecting`<br>- `connectionOk`|Pairing State|
|lastPairError|`string`|-|See _Last Pair Error_ table below|

|Last Pair Error|Description|
|:--|:--|
|`none`|-|
|`impossibleScenario`|Devices are not compatible with each other and can't be bundled together.|
|`cantAppendDevice`|At least one device inside the wired network is paired **and** at least another one is not paired. You can't append an unpaired device to an already paired group.|
|`deviceFirmwareUpdateRequired`|Device firmware update required for one or more device in the current bundle. Please connect with mobile app to your bundle to check wihch device(s) need update & follow the instructions from the mobile app to continue.|
|`unknown`|Unknown problem. Please retry.|

#### Disconnect

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"disconnect"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`disconnect`|Command name|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Keypose

With keypose commands, you can store multiple axis values in a single setpoint group called keyposes and recall them with specific speed and acceleration.

You can read the relevant [summary page](http://127.0.0.1:32223/docs/overview.html#keypose-move) for high level overview.

#### Keypose Store Current Pose

Use this command to store your overall pose as a keypose. You can move your system to this location later by referencing with index.

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command": "keyposeStoreCurrentPose",
  "index": 0
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeStoreCurrentPose`|Command name|
|`index`|`integer`|`0 - 5 (max)`|Keypose slot you want to store the current pose|

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Keypose Store by Numeric Data

You can fill a keypose slot by entering specific encoder values. This can be useful when moving the motion control system to a predefined location algorithmically.

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK return a error because of HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"keyposeStoreWithNumericData",
  "index":0,
  "{axis_name}": "{setpoint_value}"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeStoreWithNumericData`|Command name|
|`index`|`integer`|`0 - 5 (max)`|Keypose slot you want to store the current pose|
|`axis_name`|`string`|-|See table below|
|`setpoint_value`|`float`|-|See table below|

|Axis Name|Type|Unit|Value Range|
|:--|:--|:--|:--|
|`headPan`|`float`|degree|-36000.0 - +36000.0|
|`headTilt`|`float`|degree|-89.1 - +89.1|
|`slide`|`float`|centimeter|Depends on the slider type.|
|`focus`|`float`|raw encoder|There is no limit if calibration is not done.  <br>After calibration, the limit is between two endpoints of your lens|
|`jibPlusPan`|`float`|degree|-36000.0 - +36000.0|
|`jibPlusTilt`|`float`|degree|-43.8 - +43.8|

Note

See [axis name convention](http://127.0.0.1:32223/docs/overview.html#axis-naming-convention) chapter for details.

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

Caution

When storing a keypose by entering specific encoder values, you **must** specify all axis values for the particular bundle. If you miss even one, this command returns an error.

**Example JSON**

For a bundle consisting of Slide Module v3 + HeadPLUSv2 units, we can store keypose slot number 2 by sending the following command:

```json
{
  "command":"keyposeStoreWithNumericData",
  "index": 2,
  "headPan": 10.0,
  "headTilt": 20.0,
  "slide": -5.2
}
```

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Keypose Move with Fixed Duration

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
    "command":"keyposeMoveFixedDuration",
    "index": 0,
    "duration": 5.2,
    "acceleration": 0.5
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeMoveFixedDuration`|Command name|
|`index`|`integer`|`0 - 5 (max)`|Keypose slot index you want to move|
|`acceleration`|`float`|`0.0 - 1.0`|Acceleration amount for the motion. <br><br>- 0.0 being the most immediate start / stop <br>- 1.0 being the most gradual start / stop|
|`duration`|`float`|-|Planned motion duration in seconds|

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

Caution

- With this type of fixed duration command, our motion control systems can't guarantee that the motion will be completed with the given duration, if the given duration is shorter than what it can be achieved with %100 speed.
- If the given duration is shorter than what it can be achieved with %100 speed, system moves with %100 speed with the given acceleration.
- You can check the _actual_ motion duration information inside the periodic status data structure after motion is started.

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Keypose Move with Fixed Speed

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command": "keyposeMoveFixedSpeed",
  "index": 0,
  "acceleration": 0.5,
  "speed": 0.5
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeMoveFixedSpeed`|Command name|
|`index`|`integer`|`0 - 5 (max)`|Keypose slot index you want to move|
|`acceleration`|`float`|`0.0 - 1.0`|Acceleration amount for the motion. <br><br>- 0.0 being the most immediate start / stop <br>- 1.0 being the most gradual start / stop|
|`speed`|`float`|`0.0 - 1.0`|Speed argument. This is normalised based on current bundle.|

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Loop Between Keyposes with Fixed Duration

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
    "command":"keyposeLoopFixedDuration",
    "index1":0,
    "index2":1,
    "duration":0.0,
    "acceleration":0.0
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeMoveFixedDuration`|Command name|
|`index1`|`integer`|`0 - 5 (max)`|-|
|`index2`|`integer`|`0 - 5 (max)`|-|
|`acceleration`|`float`|`0.0 - 1.0`|Acceleration amount for the motion. <br><br>- 0.0 being the most immediate start / stop <br>- 1.0 being the most gradual start / stop|
|`duration`|`float`|-|Planned motion duration in seconds|

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

Caution

- With this type of fixed duration command, our motion control systems can't guarantee that the motion will be completed with the given duration, if the given duration is shorter than what it can be achieved with %100 speed.
- If the given duration is shorter than what it can be achieved with %100 speed, system moves with %100 speed with the given acceleration.
- You can check the _actual_ motion duration information inside the periodic status data structure after motion is started.

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Loop Between Keyposes with Fixed Speed

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json"..

**Payload**

```json
{
  "command": "keyposeLoopFixedSpeed",
  "index1": 0,
  "index2": 1,
  "acceleration": 0.5,
  "speed": 0.25
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeLoopFixedSpeed`|Command name|
|`index1`|`integer`|`0 - 5 (max)`|-|
|`index2`|`integer`|`0 - 5 (max)`|-|
|`acceleration`|`float`|`0.0 - 1.0`|Acceleration amount for the motion. <br><br>- 0.0 being the most immediate start / stop <br>- 1.0 being the most gradual start / stop|
|`speed`|`float`|`0.0 - 1.0`|Speed argument. This is normalised based on current bundle.|

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

#### Read Keypose Numeric Information

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command": "keyposeReadNumericValues",
  "index": 0
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeReadNumericValues`|Command name|
|`index`|`integer`|`0 - 5 (max)`|Keypose slot index you want to get information about keypose|

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

**Return value**

```json
{
  "data": {
        "{axis_name}": "{set_point}",
    },
    "result": "ok"
}
```

**Example Return**

```json
{
    "data": {
        "focus": 0,
        "headPan": 0.0,
        "headTilt": 0.0,
        "index": 0,
        "jibPlusPan": -1.0,
        "jibPlusTilt": -1.0,
        "slide": 0.0
    },
    "result": "ok"
}
```

|Axis Name|Type|Unit|Value Range|
|:--|:--|:--|:--|
|`headPan`|`float`|degree|-36000.0 - +36000.0|
|`headTilt`|`float`|degree|-89.1 - +89.1|
|`slide`|`float`|centimeter|Depends on the slider type.|
|`focus`|`float`|raw encoder|There is no limit if calibration is not done.  <br>After calibration, the limit is between two endpoints of your lens|
|`jibPlusPan`|`float`|degree|-36000.0 - +36000.0|
|`jibPlusTilt`|`float`|degree|-43.8 - +43.8|

Note

See [axis name convention](http://127.0.0.1:32223/docs/overview.html#axis-naming-convention) chapter for details.

#### Delete Keypose

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"keyposeDeletePose",
  "index":1
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`keyposeDeletePose`|Command name|
|`index`|`integer`|`0 - 5 (max)`|Keypose slot index you want to delete|

Note

The number of keypose slots depend on the device you are using. The number of keypose slots can be obtained from the length of `keyposeSlotsFilled` in the status.

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Real Time Move

With real time move commands, you can send and playback a precomputed motion profile data to real motion control system in real time.

You can read the relevant [summary page](http://127.0.0.1:32223/docs/overview.html#real-time-move) for high level overview.

### Realtime Move

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK return a error because of HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"realTimeMoveFixedDuration",
  "duration": 0.033,
  "{axis_name}": "{setpoint_value}"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`realTimeMoveFixedDuration`|Command name|
|`duration`|`float`|-|Motion duration in seconds|
|`axis_name`|`string`|-|See table below|
|`setpoint_value`|`float`|-|See table below|

|Axis Name|Type|Unit|Value Range|
|:--|:--|:--|:--|
|`headPan`|`float`|degree|-36000.0 - +36000.0|
|`headTilt`|`float`|degree|-89.1 - +89.1|
|`slide`|`float`|centimeter|Depends on the slider type.|
|`focus`|`float`|raw encoder|There is no limit if calibration is not done.  <br>After calibration, the limit is between two endpoints of your lens|

Note

See [axis name convention](http://127.0.0.1:32223/docs/overview.html#axis-naming-convention) chapter for details.

Caution

When sending a real time move command, you must specify _all_ real time move supported axis values for the particular bundle. If you miss even one, this command returns an error.

**Example JSON**

```json
{
  "command": "realTimeMoveFixedDuration",
  "headPan": 45.0,
  "headTilt": -12.5,
  "slide": 10.0,
  "focus": 10430,
  "duration": 0.033
}
```

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Joystick Move / Focus Move

Manual control of Pan / Tilt / Slide / Focus axes with joystick & jogwheel like interface.

You can read the relevant [summary page](http://127.0.0.1:32223/docs/overview.html#joystick-move) for high level overview.

### Joystick Move

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command": "joystickMove",
  "{axis_name}": "{speed_ratio}"
}
```

---

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`joystickMove`|Command name|
|`axis_name`|`string`|-|See table below.|
|`speed_ratio`|`float`|-|Relative speed you want that axis to move.|

---

|Axis Name|Type|Value Range|
|:--|:--|:--|
|`headPan`|`float`|_-1.0 - +1.0_|
|`headTilt`|`float`|_-1.0 - +1.0_|
|`slide`|`float`|_-1.0 - +1.0_|
|`jibPlusPan`|`float`|_-1.0 - +1.0_|
|`jibPlusTilt`|`float`|_-1.0 - +1.0_|

---

**Example JSON**

You can send multiple joystick move setpoints for different axes in a single command. You can find an example payload for similar scenario below.

```json
{
  "command": "joystickMove",
  "headPan": -0.05,
  "headTilt": 0.25,
  "slide": 0.4
}
```

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

### Focus Manual Move

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command": "focusManualMove",
  "deltaEnc": 4360
}
```

---

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`focusManualMove`|Command name|
|`deltaEnc`|`integer`|-|Encoder step amount you want focus motor to move. Can be positive or negative.   <br>**Example:** Full round rotation of focus motor is roughly equivalent to 44500 units of encoder movement.|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Motion Abort

You can send this command to stop any ongoing motion activity.

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command": "motionAbort"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`motionAbort`|Command name|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Calibration

You can read the relevant [summary page](http://127.0.0.1:32223/docs/overview.html#calibration) for high level overview.

### Calibration

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
    "command": "calibrate",
    "device": "slideModuleV3",
    "isOnGround": true,
    "isOnLeftSide" : false
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`calibrate`|Command name|
|`device`|`string`|-|Which device you want to calibrate.   <br>See table below for possible devices.|

Note

Some devices may need extra parameters for calibration.

Caution

You can't send multiple calibration requests for separate devices in a single command. You **must** send separate calibration commands for each device.

|Device Type|Required Parameter|
|:--|:--|
|`slideModule`|- _isOnGround_<br>- _isOnLeftSide_|
|`slideModuleV3`|- _isOnGround_<br>- _isOnLeftSide_|
|`headPlus`|-|
|`headPlusPro`|-|
|`headPlusV2`|-|
|`headPlusProV2`|-|
|`headOne`|-|
|`panPro`|-|
|`focusPlusPro`|-|
|`jibOne`|- _jibLength_<br>- _rodLength_|
|`jibOneV2`|- _jibLength_<br>- _rodLength_|

Parameter descriptions:

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`jibLength`|`float`|-|Length of the JibONE. See _Overview_ page for details.|
|`rodLength`|`float`|-|Length of the camera rod of the JibONE. See _Overview_ page for details.|
|`isOnGround`|`bool`|-|If SliderPLUS and Slide Module v2 / v3 is on ground, it should be true.|
|`isOnLeftSide`|`bool`|-|If Slide Module v2 / v3 is mounted on the left side of the slider, it should be true.|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Periodic Status

- You can find the current status of the device, encoder readings, battery level of the units, which axes are supported in the current bundle, which keypose slots are filled etc. information inside this update.
- You need to ask for this manually at regular intervals.
- Status update response returns everything you need in a single JSON package.
- Asking for status will return last updated status of the device regardless of its changes.
- If you want to be sure that status has changed, you can use the _TimestampEpoch_ field value inside the result.

You can read the relevant [summary page](http://127.0.0.1:32223/docs/overview.html#periodic-status-update) for high level overview.

**URL**

```text
/bundle/{linkID}/status
```

**Method**

```text
GET
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Return value**

```json
{
    "data": {
        "calibratedAxes": [
            {
                "axis": "headPan",
                "device": "headPlusV2"
            },
            {
                "axis": "headTilt",
                "device": "headPlusV2"
            }
        ],
        "deviceInfo": [
            {
                "batteryLevel": 1.0,
                "type": "headPlusV2"
            }
        ],
        "deviceInfoEverythingReady": true,
        "keyposeLoopActive": false,
        "keyposeMotionAimIndex": 0,
        "keyposeMotionStartIndex": 0,
        "keyposeSlotsFilled": [
            false,
            false,
            false,
            false,
            false,
            false
        ],
        "plannedMotionProgress": 1.0,
        "plannedMotionDuration": 0.0,
        "readings": {
            "headPan": 89.95600128173828,
            "headTilt": 0.0
        },
        "realTimeSupportedAxes": [],
        "state": "idle",
        "supportedAxes": [
            {
                "axis": "headPan",
                "device": "headPlusV2"
            },
            {
                "axis": "headTilt",
                "device": "headPlusV2"
            }
        ],
        "timestampDevice": 303462,
        "timestampEpoch": 1634645133077
    },
    "result": "ok"
}

```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`calibratedAxes`|`list`|-|List of calibrated axes.|
|`deviceInfo`|`list`|-|List of information of device(s) in the bundle. See table below.|
|`deviceInfoEverythingReady`|`bool`|-|`deviceInfo` list is incomplete while this flag is _false_|
|`keyposeLoopActive`|`bool`|-|If _true_, keypose move is in _loop_ mode.|
|`keyposeMotionAimIndex`|`int`|`0 - 5 (max)`|Which keypose slot are we moving towards?|
|`keyposeMotionStartIndex`|`int`|`-1 - 5 (max)`|If _keyposeLoopActive_ flag is true, this value represents starting index of the keypose loop. Otherwise, this value is **-1** to indicate that system has started the keypose move from its _current_ position.|
|`keyposeSlotsFilled`|`list`|-|Each element represents which keypose slot is filled or not. Length of this array also represents how many keypose slots are available for this particular bundle.|
|`plannedMotionProgress`|`float`|`0.0 - 1.0`|How much of the currently planned motion is finished?|
|`plannedMotionDuration`|`float`|-|How many seconds the currently planned motion is going to take?|
|`realTimeSupportedAxes`|`list`|-|Which of the currently available axes are capable for _realTimeMove_ commands?|
|`state`|`string`|- `idle`<br>- `keyposeMove`<br>- `realTimeMove`<br>- `focusCalibration`<br>- `sliderCalibration`<br>- `joystickMove`<br>- `unsupportedActivity`|Current state of bundle.|
|`timestampDevice`|`long`|-|Local device timestamp for this particular update. Starts from zero and counted inside the motion control system firmware with _1 milisecond_ increments.|
|`timestampEpoch`|`long`|-|Local computer epoch timestamp for this parcticular update. Synchronised to the computer time.|

---

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`batteryLevel`|`float`|`0.0 - 1.0`|Battery level|
|`type`|`string`|-|Device Type|

---

|Device Type|Product Name|
|:--|:--|
|`slideModule`|Slide Module v2|
|`slideModuleV3`|Slide Module v3|
|`sliderOnePro`|SliderONE PRO v2|
|`sliderOne`|SliderONE v2|
|`dollyPlus`|DollyPLUS|
|`dollyOne`|DollyONE|
|`dollyPlusPro`|DollyPLUS PRO|
|`panPro`|PanPRO|
|`headOne`|HeadONE|
|`headPlus`|HeadPLUS v1|
|`headPlusPro`|HeadPLUS v1 PRO|
|`headPlusV2`|HeadPLUS v2|
|`headPlusProV2`|HeadPLUS v2 PRO|
|`focusPlusPro`|FocusPLUS PRO|
|`jibOne`|JibONE|
|`jibOneV2`|JibONE v2|

---

|Axis Name|Type|Unit|Value Range|
|:--|:--|:--|:--|
|`headPan`|`float`|degree|-36000.0 - +36000.0|
|`headTilt`|`float`|degree|-89.1 - +89.1|
|`slide`|`float`|centimeter|Depends on the slider type.|
|`focus`|`float`|raw encoder|There is no limit if calibration is not done.  <br>After calibration, the limit is between two endpoints of your lens|
|`jibPlusPan`|`float`|degree|-36000.0 - +36000.0|
|`jibPlusTilt`|`float`|degree|-43.8 - +43.8|

Note

See [axis name convention](http://127.0.0.1:32223/docs/overview.html#axis-naming-convention) chapter for details.

## Link Adapter Related Control Commands

These are Link Adapter related commands.

### Get Link Module List And Status

**URL**

```text
/v1/device
```

**Method**

```text
POST
```

**Payload**

```json

{
    "command": "linkStatus"
}

```

Caution

edelkrone SDK **does not** support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`linkStatus`|Command name|

**Return value**

```json
{
    "data": [
        {
            "initialFoundEpoch": "1634625480462967400",
            "isDeviceFirmwareUpdateAvailable": false,
            "isDeviceFirmwareUpdateRequired": false,
            "isFirmwareCorrupted": false,
            "isPairingDone": false,
            "isRadioFirmwareUpdateAvailable": false,
            "isRadioFirmwareUpdateRequired": false,
            "isValid": true,
            "linkConnectionType": "none",
            "linkID": "206034415530",
            "linkType": "linkAdapter",
            "portName": "COM7"
        }
    ],
    "result": "ok"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`data`|`device list`|-|List of identified link modules|

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`initialFoundEpoch`|`string`|-|When did edelkrone SDK enumerated this particular link adapter initially?|
|`isRadioFirmwareUpdateAvailable`|`bool`|-|Update is available for radio firmware of the link adapter.|
|`isRadioFirmwareUpdateRequired`|`bool`|-|Update is **required** for radio firmware of the link adapter.|
|`isDeviceFirmwareUpdateRequired`|`bool`|-|Update is **required** for device firmware of the link adapter.|
|`isDeviceFirmwareUpdateAvailable`|`bool`|-|Update is available for device firmware of the link adapter.|
|`isPairingDone`|`bool`|-|Starts off _false_ and goes to _true_ when a pairing operation is completed successfull. Goes back to _false_ when link adapter disconnects from the current bundle.|
|`isValid`|`bool`|-|Starts off _true_ when first enumerated. Goes to _false_ if you unplug the particular link adpater while edelkrone SDK is running.|
|`linkConnectionType`|`string`|- wireless<br>- canbus<br>- none|Link connection type|
|`linkID`|`string`|-|Unique LinkID string for the particular link adapter.|
|`linkType`|`string`|-|Indicates the type of link adapter.|
|`portName`|`string`|-|Hardware port name.|

### Link Device Firmware Update

You can update device firmware of your link adapter with this command.

**URL**

```text
/v1/device
```

**Method**

```text
POST
```

Caution

edelkrone SDK **does not** support CORS, so when you send a request with the "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
    "command":"startLinkDeviceFirmwareUpdate"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`startLinkDeviceFirmwareUpdate`|Command name|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

### Get Link Device Firmware Update Status

Device firmware update progress can be checked with this command.

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"linkDeviceFirmwareUpdateStatus"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`linkDeviceFirmwareUpdateStatus`|Command name|

**Return value**

```json
{
  "status": "noDevice",
  "result": "ok"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`status`|`string`|none|-|
|`status`|`string`|multipleDevice|There are multiple devices in DFU mode. There has to be **only** one.|
|`status`|`string`|noDevice|There isn't any device in DFU mode.|
|`status`|`string`|running|Firmware update process is running.|
|`status`|`string`|finished|Firmware update process is finished.|

### Link Radio Firmware Update

You can update radio firmware of your link adapter with this command.

**URL**

```text
/v1/device
```

**Method**

```text
POST
```

Caution

edelkrone SDK **does not** support CORS, so when you send a request with the "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
    "command":"startLinkRadioFirmwareUpdate"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`startLinkRadioFirmwareUpdate`|Command name|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

### Get Link Radio Firmware Update Status

Radio firmware update progress can be checked with this command.

**URL**

```text
/v1/link/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command":"linkRadioFirmwarUpdateStatus"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`linkRadioFirmwarUpdateStatus`|Command name|

**Return value**

```json
{
  "status": "none",
  "result": "ok"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`status`|`string`|none|-|
|`status`|`string`|running|Firmware update process is running.|
|`status`|`string`|finished|Firmware update process is finished.|
|`status`|`string`|error|An error occured. Please retry.|

### Detect Link Adapter

When this command is sent to Link Adapter, LED of the Link Adapter becomes **on** for 1 second.

**URL**

```text
/v1/link/{linkID}/detect
```

**Method**

```text
GET
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because of HTTP request of "Content-Type" is sent always as "text/plain" NOT "application/json".

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Miscellaneous Commands

### Shutter Trigger

Use this command to creates a shutter trigger signal from your edelkrone motion control system using compatible cable shutter trigger cable.

**URL**

```text
/v1/bundle/{linkID}
```

**Method**

```text
POST
```

Caution

edelkrone SDK does not support CORS, so when you send a request with "OPTIONS" method, edelkrone SDK returns an error because an HTTP request of "Content-Type" is always sent as "text/plain" NOT "application/json".

**Payload**

```json
{
  "command": "shutterTrigger",
  "triggerDuration_ms": "{triggerDuration_ms}"
}
```

|Label|Type|Value|Description|
|:--|:--|:--|:--|
|`command`|`string`|`shutterTrigger`|Command name|
|`triggerDuration_ms`|`integer`|`0 - 999999`|Shutter trigger duration in milliseconds|

**Return value**

See [default return values](http://127.0.0.1:32223/docs/endpoints/endpoints_http.html#default-return-values).

## Default Return Values

```json
{
  "result": "ok"
}
```

- System executed your command without any issues.

---

```json
{
  "result": "Invalid Arguments"
}
```

- Given arguments are invalid.

---

```json
{
  "result": "ok",
  "message": "Link command is ignored. Link is already paired. Unpair the link adapter if you want to send a link related command."
}
```

- Link command is ignored. Link is already paired.
- Unpair the link adapter if you want to send a link related command.