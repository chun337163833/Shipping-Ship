//set main namespace
goog.provide('helloworld');


//get requirements
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.RotateTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.Spawn');
goog.require('lime.Circle');
goog.require('lime.Director');
goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('lime.Scene');
goog.require('lime.scheduleManager');
goog.require('lime.Sprite');
goog.require('lime.Sprite');

var levels = [
{
    planets: [
        [200, 200, 'planet1', 'mineral'],
        [500, 100, 'planet2', 'meat'],
        [800, 200, 'planet3', 'gold'],
        [200, 600, 'planet4', 'weapon'],
        [550, 600, 'planet3', 'aliens']
    ],
    winCon: ['mineral', 'meat', 'weapon']
},
{
    planets: [
        [75, 100, 'planet1', 'mineral'],
        [500, 100, 'planet2', 'meat'],
        [950, 75, 'planet3', 'gold'],
        [400, 600, 'planet4', 'weapon'],
        [950, 700, 'planet2', 'aliens'],
        [100, 650, 'planet1', 'fuel']
    ],
    winCon: ['gold', 'aliens', 'mineral']
},
{
    planets: [
        [200, 200, 'planet1', 'mineral'],
        [500, 100, 'planet2', 'meat'],
        [800, 200, 'planet3', 'gold'],
        [200, 600, 'planet4', 'aliens'],
        [550, 600, 'planet5', 'weapon', 'gold']
    ],
    winCon: ['mineral', 'weapon', 'meat']
},
{
    planets: [
        [75, 100, 'planet1', 'weapon'],
        [500, 100, 'planet2', 'gold'],
        [950, 75, 'planet3', 'meat'],
        [200, 300, 'planet4', 'mineral'],
        [950, 700, 'planet2', 'aliens'],
        [550, 600, 'planet7', 'fuel', 'generic']
    ],
    winCon: ['weapon', 'aliens', 'meat']
},
{
    planets: [
        [200, 200, 'planet1', 'mineral'],
        [800, 700, 'planet2', 'meat'],
        [800, 200, 'planet3', 'gold'],
        [550, 600, 'planet4', 'weapon'],
        [200, 600, 'planet5', 'aliens', 'weapon'],
        [100, 400, 'planet6', 'fuel', 'mineral'],
        [900, 400, 'planet7', 'mineral', 'generic'],
        [500, 100, 'planet8', 'mineral', 'meat']
    ],
    winCon: ['gold', 'aliens', 'mineral']
},
{
    planets: [
        [600, 150, 'planet1', 'mineral'],
        [500, 100, 'planet2', 'weapon'],
        [900, 200, 'planet3', 'aliens'],
        [100, 75, 'planet4', 'weapon'],
        [550, 650, 'planet5', 'gold', 'weapon'],
        [100, 400, 'planet6', 'fuel', 'aliens'],
        [900, 400, 'planet7', 'meat', 'generic'],
        [800, 700, 'planet8', 'meat', 'aliens']
    ],
    winCon: ['weapon', 'gold', 'meat']
}];

var dimension = {
    x: 1024,
    y: 768
};

var planetsize = 92;
var startingFuel = 2100;

var resources = {
    aliens: 'assets/goods-01.png',
    meat: 'assets/goods-02.png',
    gold: 'assets/goods-03.png',
    mineral: 'assets/goods-05.png',
    weapon: 'assets/goods-06.png',
    fuel: 'assets/goods-04.png'
};

var resourcesCosts = {
    aliens: 'assets/goods-07.png',
    meat: 'assets/goods-08.png',
    gold: 'assets/goods-09.png',
    mineral: 'assets/goods-10.png',
    weapon: 'assets/goods-11.png',
    generic: 'assets/goods-12.png'
};

var planets = {
    planet1: 'assets/planets-02.png',
    planet2: 'assets/planets-03.png',
    planet3: 'assets/planets-04.png',
    planet4: 'assets/planets-05.png',
    planet5: 'assets/planets-06.png',
    planet6: 'assets/planets-07.png',
    planet7: 'assets/planets-08.png',
    planet8: 'assets/planets-09.png'
};

function getDist(x1, y1, x2, y2) {
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    return Math.sqrt(dx * dx + dy * dy);
}

function line(myRect, x1, y1, x2, y2) {
    var width = getDist(x1, y1, x2, y2);
    return myRect.setSize(width + 10, 10).setRadius(5).setAnchorPoint(5 / width, .5).setRotation(
        -Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
    ).setPosition(x1, y1);
}

function PlanetsModule(scene) {
    var planetList = [];
    var pathLines = [];
    var path = [];
    var winCondition;
    var levelStart;
    var currentLevel;
    var gameLevels;

    var pathLayer = new lime.Layer().setPosition(0, 0);
    scene.appendChild(pathLayer);

    var homeLayer = new lime.Layer().setPosition(0, 0);
    scene.appendChild(homeLayer);

    var planetLayer = new lime.Layer().setPosition(0, 0);
    scene.appendChild(planetLayer);

    var shipLayer = new lime.Layer().setPosition(0, 0);
    scene.appendChild(shipLayer);

    var uiLayer = new lime.Layer().setPosition(0, 0);
    scene.appendChild(uiLayer);

    var winCon01 = new lime.Sprite().setSize(32, 32).setPosition(dimension.x - 48, 32);
    var winCon02 = new lime.Sprite().setSize(32, 32).setPosition(dimension.x - 96, 32);
    var winCon03 = new lime.Sprite().setSize(32, 32).setPosition(dimension.x - 144, 32);
    uiLayer.appendChild(winCon01);
    uiLayer.appendChild(winCon02);
    uiLayer.appendChild(winCon03);

    var gameMessage = new lime.Label().setText('Mission Accomplished!').setFontFamily('Verdana').
    setFontColor('#FFF').setFontSize(64).setFontWeight('bold').setSize(600, 120).setPosition(dimension.x / 2, dimension.y / 2).setOpacity(0);
    uiLayer.appendChild(gameMessage);
    var displayMessage = new lime.animation.FadeTo(0).setDuration(2);

    var home = new lime.Circle().setSize(planetsize, planetsize).setFill(0, 150, 250).setPosition(dimension.x / 2, dimension.y / 2);
    home.setFill('assets/planets-01.png');
    homeLayer.appendChild(home);
    path.push({
        sprite: home,
        x: dimension.x / 2,
        y: dimension.y / 2,
        planetType: 'home',
        resource: {
            type: 'empty'
        },
        cost: {
        }
    });

    function drawPath(x1, y1, x2, y2) {
        var newLine = new lime.RoundedRect().setFill(255, 255, 255, 0.15);
        pathLayer.appendChild(newLine);
        pathLines.push(line(newLine, x1, y1, x2, y2));
    }

    function newPath(destinationPlanet) {
        var arrayLength = path.push(destinationPlanet);
        drawPath(path[arrayLength - 2].x, path[arrayLength - 2].y, destinationPlanet.x, destinationPlanet.y);
        if (arrayLength === 2) {
            var startRot = new lime.animation.RotateTo(shipAngle(path[0], path[1])).setDuration(1);
            ship.runAction(startRot);
        }
        if (arrayLength === 3) {
            goog.events.listenOnce(home, ['click', 'touchend'], function(e) {
                newPath(path[0]);
                planetList.forEach(function(element) {
                    goog.events.removeAll(element.sprite);
                });
                shipTravel(1);
            });
        }
    }

    function newPlanet(x, y, planetType, resourceType, costType) {
        var thisPlanet = new lime.Layer().setPosition(x, y).setAnchorPoint(0.5, 0.5);
        var thisSurface = new lime.Circle()
        .setSize(planetsize, planetsize)
        .setPosition(0, 0)
        .setAnchorPoint(0.5, 0.5)
        .setFill(planets[planetType]);
        thisPlanet.appendChild(thisSurface);

        var thisResource,
            thisCost;
        if (resourceType !== 'empty') {
            if (costType != undefined) {
                thisCost = new lime.Sprite()
                .setSize(32, 32)
                .setPosition(-18, 0)
                .setFill(this.resourcesCosts[costType]);
                thisPlanet.appendChild(thisCost);

                thisResource = new lime.Sprite()
                .setSize(32, 32)
                .setPosition(18, 0)
                .setFill(this.resources[resourceType]);
                thisPlanet.appendChild(thisResource);


            } else {
                thisResource = new lime.Sprite()
                .setSize(32, 32)
                .setFill(resources[resourceType]);
                thisPlanet.appendChild(thisResource);
            }
        }

        planetLayer.appendChild(thisPlanet);

        var planetObject = {
            sprite: thisPlanet,
            x: x,
            y: y,
            planetType: planetType,
            resource: {
                type: resourceType,
                sprite: thisResource
            },
            cost: {
                type: costType,
                sprite: thisCost
            }
        };
        planetList.push(planetObject);
        return planetObject;
    }

    function loadPlanets(planetArray) {
        planetArray.forEach(function(element) {
            newPlanet.apply(this, element);
        });
        planetList.forEach(function(element) {
                goog.events.listenOnce(element.sprite, ['click', 'touchend'], function(e) {
                    newPath(element);
            });
        });
    }

    function initializeLevel(thisLevel) {
        winCondition = thisLevel.winCon;
        winCon01.setFill(resources[winCondition[0]]);
        winCon02.setFill(resources[winCondition[1]]);
        winCon03.setFill(resources[winCondition[2]]);
        levelStart = function() {
            loadPlanets(thisLevel.planets);
        };
        levelStart();
    }

    function clearLevel() {
        myShip.fuel = startingFuel;
        fuelGuage.setText('Fuel: 100%');
        myShip.cargo = [];
        updateCargo();
        planetList = [];
        pathLines = [];
        path.splice(1, path.length - 1);
        pathLayer.removeAllChildren();
        planetLayer.removeAllChildren();
    }

    var myShip = {
        cargo: [],
        fuel: startingFuel
    };

    function shipAngle(location1, location2) {
        return -Math.atan2(location2.y - location1.y, location2.x - location1.x) * 180 / Math.PI;
    }

    function updateCargo() {
        if (myShip.cargo.length === 0) {
                shipResources.children_.forEach(function(element) {
                    element.setFill('assets/goods-13.png');
                });
            } else {
            myShip.cargo.forEach(function(element, index) {
                shipResources.getChildAt(index).setFill(resources[element]);
            });
        }
    }

    function checkFuel(dt) {
        var stepDist = 48 / dt;
        myShip.fuel -= stepDist;
        if (myShip.fuel < 0) {
            fuelGuage.setText('Fuel: 0%');
            gameMessage.setText('Out of Gas!')
            .setOpacity(1)
            .runAction(displayMessage);
            goog.events.listenOnce(displayMessage, lime.animation.Event.STOP, function() {
                lime.scheduleManager.unschedule(checkFuel);
                clearLevel();
                levelStart();
            });
        } else {
            fuelGuage.setText('Fuel: ' + Math.floor(myShip.fuel / 21) + '%');
        }
    }

    function checkSuccess() {
        var testWin = winCondition.every(function(element) {
                if (myShip.cargo.lastIndexOf(element) !== -1) {
                    return true;
                } else {
                    return false;
                }
        });
        if (testWin) {
            gameMessage.setText('Mission Accomplished!')
            .setOpacity(1)
            .runAction(displayMessage);
            goog.events.listenOnce(displayMessage, lime.animation.Event.STOP, function() {
                clearLevel();
                if (currentLevel + 1 < gameLevels.length) {
                    currentLevel += 1;
                } else {
                    currentLevel = 0;
                }
                initializeLevel(gameLevels[currentLevel]);
            });
        } else {
            gameMessage.setText('Mission Failed.')
            .setOpacity(1)
            .runAction(displayMessage);
            goog.events.listenOnce(displayMessage, lime.animation.Event.STOP, function() {
                clearLevel();
                levelStart();
            });
        }
    }

    var fuelGuage = new lime.Label().setText('Fuel: ' + myShip.fuel / 21 + '%').setFontFamily('Verdana').
    setFontColor('#FFF').setFontSize(24).setFontWeight('bold').setSize(160, 48).setPosition(32, 32).setAnchorPoint(0, 0);
    uiLayer.appendChild(fuelGuage);

    var ship = new lime.Layer()
    .setRotation(90)
    .setPosition(path[0].x, path[0].y);
    shipLayer.appendChild(ship);

    var shipContainer = new lime.Sprite()
    .setFill('assets/ship-01.png')
    .setSize(80, 48)
    .setAnchorPoint(-0.25, 0.5)
    .setPosition(0, 0);
    ship.appendChild(shipContainer);

    var shipResources = new lime.Layer();
    ship.appendChild(shipResources);

    var shipResource01 = new lime.Sprite().setSize(16, 16).setPosition(34, 0);
    var shipResource02 = new lime.Sprite().setSize(16, 16).setPosition(52, 0);
    var shipResource03 = new lime.Sprite().setSize(16, 16).setPosition(70, 0);
    shipResources.appendChild(shipResource01);
    shipResources.appendChild(shipResource02);
    shipResources.appendChild(shipResource03);


    function shipTravel(i) {
        if (i < path.length) {
            var tripDist = getDist(path[i].x, path[i].y, path[i - 1].x, path[i - 1].y);

            lime.scheduleManager.schedule(checkFuel);

            var newAngle;
            if (i + 1 < path.length) {
                newAngle = shipAngle(path[i], path[i + 1]);
            } else {
                newAngle = shipAngle(path[i], path[i - 1]);
            }

            if (tripDist < myShip.fuel) {
                var moveToPlanet = new lime.animation.Spawn(
                    new lime.animation.MoveTo(path[i].x, path[i].y),
                    new lime.animation.RotateTo(newAngle)
                ).setDuration(tripDist / 200);
                ship.runAction(moveToPlanet);
                goog.events.listenOnce(moveToPlanet, lime.animation.Event.STOP, function() {
                    lime.scheduleManager.unschedule(checkFuel);

                    // Test if planet has item
                      // Test if planet has cost
                        // Can pay cost?
                          // Pay cost
                          // Else Return
                      // Is fuel?
                        // Refuel
                      // Have free space?
                        // Load Cargo
                      // Is either?
                        // 

                    if (path[i].resource.type !== 'empty') {
                        if (path[i].cost.type != null) {


                            if (path[i].cost.type === 'generic') {
                                myShip.cargo.splice(-1, 1);
                                    if (path[i].resource.type === 'fuel') {
                                        myShip.fuel = startingFuel;
                                    } else {
                                        myShip.cargo.push(path[i].resource.type);
                                    }
                                updateCargo();
                                path[i].sprite.removeChild(path[i].resource.sprite);
                                path[i].resource.type = 'empty';
                            } else {
                                var thisIndex = myShip.cargo.lastIndexOf(path[i].cost.type);
                                if (thisIndex !== -1) {
                                    myShip.cargo.splice(thisIndex, 1);
                                    if (path[i].resource.type === 'fuel') {
                                        myShip.fuel = startingFuel;
                                    } else {
                                        myShip.cargo.push(path[i].resource.type);
                                    }
                                    updateCargo();
                                    path[i].sprite.removeChild(path[i].resource.sprite);
                                    path[i].resource.type = 'empty';
                                }
                            }

                        } else if (path[i].resource.type === 'fuel') {
                            myShip.fuel = startingFuel;
                            path[i].sprite.removeChild(path[i].resource.sprite);
                            path[i].resource.type = 'empty';
                        } else if (myShip.cargo.length !== 3) {
                            myShip.cargo.push(path[i].resource.type);
                            updateCargo();
                            path[i].sprite.removeChild(path[i].resource.sprite);
                            path[i].resource.type = 'empty';
                        }
                    }
                    shipTravel(i + 1);
                });
            } else {
                var destinationX = path[i - 1].x + (path[i].x - path[i - 1].x) * myShip.fuel / tripDist;
                var destinationY = path[i - 1].y + (path[i].y - path[i - 1].y) * myShip.fuel / tripDist;
                var moveToPlanet = new lime.animation.Spawn(
                    new lime.animation.MoveTo(destinationX, destinationY),
                    new lime.animation.RotateTo(newAngle)
                ).setDuration(tripDist / 200);
                ship.runAction(moveToPlanet);
                goog.events.listenOnce(moveToPlanet, lime.animation.Event.STOP, function() {
                    ship.setPosition(dimension.x / 2, dimension.y / 2);
                });
            }
        } else {
            checkSuccess();
            return;
        }
    }


    return {
        startLevel: function(myLevels) {
            currentLevel = 0;
            gameLevels = myLevels;
            initializeLevel(myLevels[0]);
        }
    };
}




// entrypoint
helloworld.start = function() {

    var director = new lime.Director(document.body, dimension.x, dimension.y);
    var scene = new lime.Scene();
    var levelBackground = new lime.Sprite()
    .setFill('assets/nightsky-01.png')
    .setAnchorPoint(0, 0)
    .setPosition(0, 0)
    .setSize(dimension.x, dimension.y);
    scene.appendChild(levelBackground);

    var planets = PlanetsModule(scene);
    planets.startLevel(levels);

    director.makeMobileWebAppCapable();

    // set current scene active
    director.replaceScene(scene);

};


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('helloworld.start', helloworld.start);
