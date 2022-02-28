# Bionic-QRScout

QRScout is a scouting app that allows scouts to input match data and generates QR Codes witht he data. The QRCodes are then scanned into an excel spreadsheet.

Based on QRScout from [iRaiders 2713](https://github.com/iraiders/QRScout)


## Concept of Operation
Six scouts each with a mobile device capable of displaying a web page (android or ios) watch eatch match. Each scout is responsible for recording objective metrics about a single robot in the match.

At the end of the match, the scouts pass around the wireless QRCode scanner which inputs data in the lead scouts spreadsheet. We are using the [NETUM QR Code Scanner C750](https://www.amazon.com/dp/B0855MQ9Y6) which comes with a usb dongle and acts as a usb keyboard.

The QRcode contains tab separated data which nicely breaks into columns in excel.

Before the comeptition the scouting team will determine the metrics they which to collect and build the [config.json](/config/2022/config.json) file which controls what input fields appear in the app.

A spreadsheet can then be created, the column headers can be copied from the app using the "Copy Column Names" button

## Documentation of possible field options
@Todo

## Sample Spreadsheet
See the [spreadheet shared by the IRaiders from Week0 2022](https://docs.google.com/spreadsheets/d/1QSaoukM5h_plNLsuOTItU9wWeNHQhQxbPj45vAGsRkg/edit#gid=985145947)