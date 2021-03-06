function effect(cube) {
    var demo = 0;

    cube().off();
    [wholeCube, twoFreedoms, oneFreedom, oneFreedomTwoYs, specificLed, multipleLeds][demo](cube);
}

function wholeCube(cube) {
    cube().on();
}

function twoFreedoms(cube) {
    // all x from 0 to cube.x - 3 - 1 -> whole
    cube({x: range(cube.x - 3)}).on();
}

function oneFreedom(cube) {
    // all x = 3, y = 7 (z is free)
    cube({x: 3, y: 7}).on();
}

function oneFreedomTwoYs(cube) {
    // all x = 3, y = [2, 7] (z is free)
    cube({x: 3, y: [2, 7]}).on();
}

function specificLed(cube) {
    cube({x: 2, y: 4, z: 1}).on();
    cube([3, 5, 2]).on();
    cube(4, 6, 3).on();
}

function multipleLeds(cube) {
    cube([[0, 0, 0], [0, 0, 1], [0, 0, 2]]).on();
    cube([{x: 4, y: 4, z: 4}, {x: 4, y: 4, z: 5}, {x: 4, y: 4, z: 6}]).on();
}
