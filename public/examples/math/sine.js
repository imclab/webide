function effect(cube) {
    cube().off();
    cube({z: 0}).map(function(led) {
        led.z = 0.25 * (2 + math.sin(led.x / 2 + ticks / 25) + math.sin(led.y / 2 + ticks / 50)) * cube.z;

        return led;
    }).on();
}
