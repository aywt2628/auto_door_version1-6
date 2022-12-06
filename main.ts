function clear_vertical_bar () {
    OLED12864_I2C.rect(
    110,
    18,
    115,
    48,
    0
    )
}
function door_close_stop () {
    pins.digitalWritePin(DigitalPin.P12, 1)
    pins.digitalWritePin(DigitalPin.P9, 1)
    pins.analogWritePin(AnalogPin.P0, 0)
    stage_number = 0
}
input.onButtonPressed(Button.A, function () {
    stage_number = 10
})
function door_close () {
    basic.showArrow(ArrowNames.East)
    pins.digitalWritePin(DigitalPin.P9, 1)
    pins.digitalWritePin(DigitalPin.P12, 0)
    pins.analogWritePin(AnalogPin.P0, 750)
    OLED12864_I2C.showString(
    6,
    3,
    "CLOSE",
    1
    )
    clear_vertical_bar()
    draw_horizontal_bar()
    pins.digitalWritePin(DigitalPin.P14, 0)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P14, 1)
}
function door_open () {
    basic.showArrow(ArrowNames.West)
    pins.digitalWritePin(DigitalPin.P9, 0)
    pins.digitalWritePin(DigitalPin.P12, 1)
    pins.analogWritePin(AnalogPin.P0, 750)
    OLED12864_I2C.showString(
    6,
    3,
    "OPEN  ",
    1
    )
    clear_horizontal_bar()
    draw_vertical_bar()
    pins.digitalWritePin(DigitalPin.P13, 0)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P13, 1)
}
function draw_horizontal_bar () {
    OLED12864_I2C.rect(
    97,
    30,
    127,
    35,
    1
    )
}
function draw_vertical_bar () {
    OLED12864_I2C.rect(
    110,
    18,
    115,
    48,
    1
    )
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "Open") {
        stage_number = 10
    } else if (receivedString == "Close") {
        stage_number = 30
    } else if (receivedString == "Stop") {
        stage_number = 0
    }
})
input.onButtonPressed(Button.B, function () {
    stage_number = 30
})
function init_display () {
    OLED12864_I2C.showString(
    0,
    0,
    "DEFION",
    1
    )
    OLED12864_I2C.showString(
    0,
    1,
    "A - OPEN / B - CLOSE",
    1
    )
    OLED12864_I2C.showString(
    0,
    3,
    "DOOR: ",
    1
    )
    OLED12864_I2C.showString(
    6,
    3,
    "CLOSE",
    1
    )
    OLED12864_I2C.showString(
    0,
    4,
    "MODE: ",
    1
    )
    OLED12864_I2C.showString(
    6,
    4,
    "NORMAL",
    1
    )
    draw_horizontal_bar()
}
function idle () {
    basic.showIcon(IconNames.Square)
    // connect to K1
    pins.digitalWritePin(DigitalPin.P9, 1)
    // connect to K2
    pins.digitalWritePin(DigitalPin.P12, 1)
    // PWM input
    pins.analogWritePin(AnalogPin.P0, 0)
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
    pins.digitalWritePin(DigitalPin.P9, 1)
    pins.digitalWritePin(DigitalPin.P12, 1)
    motor_cw_flag = 0
    motor_ccw_flag = 0
})
function door_open_stop () {
    pins.digitalWritePin(DigitalPin.P9, 1)
    pins.digitalWritePin(DigitalPin.P12, 1)
    pins.analogWritePin(AnalogPin.P0, 0)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
        `)
}
function clear_horizontal_bar () {
    OLED12864_I2C.rect(
    97,
    30,
    127,
    35,
    0
    )
}
function stage_20 () {
    time_counter += 1
    OLED12864_I2C.showNumber(
    21,
    7,
    time_counter,
    1
    )
    if (time_counter >= time_limit) {
        stage_number = 30
        time_counter = 0
        OLED12864_I2C.showNumber(
        21,
        7,
        0,
        1
        )
        OLED12864_I2C.showNumber(
        22,
        7,
        0,
        1
        )
        OLED12864_I2C.showNumber(
        23,
        7,
        0,
        1
        )
    }
}
let door_open_status = 0
let time_counter = 0
let motor_ccw_flag = 0
let motor_cw_flag = 0
let stage_number = 0
let time_limit = 0
radio.setGroup(1)
OLED12864_I2C.init(60)
OLED12864_I2C.zoom(false)
OLED12864_I2C.clear()
init_display()
pins.digitalWritePin(DigitalPin.P12, 1)
pins.digitalWritePin(DigitalPin.P9, 1)
pins.digitalWritePin(DigitalPin.P14, 1)
pins.digitalWritePin(DigitalPin.P13, 1)
time_limit = 450
basic.forever(function () {
    if (stage_number == 0) {
        idle()
    } else if (stage_number == 10) {
        door_open()
        door_open_status = 1
        stage_number = 11
    } else if (stage_number == 11) {
        basic.pause(1000)
        stage_number = 12
    } else if (stage_number == 12) {
        basic.pause(1000)
        stage_number = 13
    } else if (stage_number == 13) {
        basic.pause(1000)
        stage_number = 14
    } else if (stage_number == 14) {
        basic.pause(1000)
        stage_number = 15
    } else if (stage_number == 15) {
        door_open_stop()
        stage_number = 20
    } else if (stage_number == 20) {
        stage_20()
    } else if (stage_number == 30) {
        if (door_open_status == 1) {
            door_close()
            door_open_status = 0
            stage_number = 31
        }
    } else if (stage_number == 31) {
        basic.pause(1000)
        stage_number = 32
    } else if (stage_number == 32) {
        basic.pause(1000)
        stage_number = 33
    } else if (stage_number == 33) {
        basic.pause(1000)
        stage_number = 34
    } else if (stage_number == 34) {
        basic.pause(1000)
        stage_number = 40
    } else if (stage_number == 40) {
        door_close_stop()
        stage_number = 0
    }
})
