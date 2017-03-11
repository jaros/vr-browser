import * as THREE from "three";
import * as d3 from "d3";
import * as TWEEN from "tween.js";
import * as zalando from "./zalando";
import * as $ from "jquery";

THREE.TrackballControls = function (object, domElement) {

    var _this = this;
    var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM_PAN: 4 };

    this.object = object;
    this.domElement = (domElement !== undefined) ? domElement : document;

    // API

    this.enabled = true;

    this.screen = { left: 0, top: 0, width: 0, height: 0 };

    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;

    this.staticMoving = false;
    this.dynamicDampingFactor = 0.2;

    this.minDistance = 0;
    this.maxDistance = Infinity;

    this.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

    // internals

    this.target = new THREE.Vector3();

    var EPS = 0.000001;

    var lastPosition = new THREE.Vector3();

    var _state = STATE.NONE,
        _prevState = STATE.NONE,

        _eye = new THREE.Vector3(),

        _movePrev = new THREE.Vector2(),
        _moveCurr = new THREE.Vector2(),

        _lastAxis = new THREE.Vector3(),
        _lastAngle = 0,

        _zoomStart = new THREE.Vector2(),
        _zoomEnd = new THREE.Vector2(),

        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,

        _panStart = new THREE.Vector2(),
        _panEnd = new THREE.Vector2();

    // for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    // events

    var changeEvent = { type: 'change' };
    var startEvent = { type: 'start' };
    var endEvent = { type: 'end' };


    // methods

    this.handleResize = function () {

        if (this.domElement === document) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            var box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;

        }

    };

    this.handleEvent = function (event) {

        if (typeof this[event.type] == 'function') {

            this[event.type](event);

        }

    };

    var getMouseOnScreen = (function () {

        var vector = new THREE.Vector2();

        return function getMouseOnScreen(pageX, pageY) {

            vector.set(
                (pageX - _this.screen.left) / _this.screen.width,
                (pageY - _this.screen.top) / _this.screen.height
            );

            return vector;

        };

    }());

    var getMouseOnCircle = (function () {

        var vector = new THREE.Vector2();

        return function getMouseOnCircle(pageX, pageY) {

            vector.set(
                ((pageX - _this.screen.width * 0.5 - _this.screen.left) / (_this.screen.width * 0.5)),
                ((_this.screen.height + 2 * (_this.screen.top - pageY)) / _this.screen.width) // screen.width intentional
            );

            return vector;

        };

    }());

    this.rotateCamera = (function () {

        var axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion(),
            eyeDirection = new THREE.Vector3(),
            objectUpDirection = new THREE.Vector3(),
            objectSidewaysDirection = new THREE.Vector3(),
            moveDirection = new THREE.Vector3(),
            angle;

        return function rotateCamera() {

            moveDirection.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
            angle = moveDirection.length();

            if (angle) {

                _eye.copy(_this.object.position).sub(_this.target);

                eyeDirection.copy(_eye).normalize();
                objectUpDirection.copy(_this.object.up).normalize();
                objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize();

                objectUpDirection.setLength(_moveCurr.y - _movePrev.y);
                objectSidewaysDirection.setLength(_moveCurr.x - _movePrev.x);

                moveDirection.copy(objectUpDirection.add(objectSidewaysDirection));

                axis.crossVectors(moveDirection, _eye).normalize();

                angle *= _this.rotateSpeed;
                quaternion.setFromAxisAngle(axis, angle);

                _eye.applyQuaternion(quaternion);
                _this.object.up.applyQuaternion(quaternion);

                _lastAxis.copy(axis);
                _lastAngle = angle;

            } else if (!_this.staticMoving && _lastAngle) {

                _lastAngle *= Math.sqrt(1.0 - _this.dynamicDampingFactor);
                _eye.copy(_this.object.position).sub(_this.target);
                quaternion.setFromAxisAngle(_lastAxis, _lastAngle);
                _eye.applyQuaternion(quaternion);
                _this.object.up.applyQuaternion(quaternion);

            }

            _movePrev.copy(_moveCurr);

        };

    }());


    this.zoomCamera = function () {

        var factor;

        if (_state === STATE.TOUCH_ZOOM_PAN) {

            factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
            _touchZoomDistanceStart = _touchZoomDistanceEnd;
            _eye.multiplyScalar(factor);

        } else {

            factor = 1.0 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;

            if (factor !== 1.0 && factor > 0.0) {

                _eye.multiplyScalar(factor);

            }

            if (_this.staticMoving) {

                _zoomStart.copy(_zoomEnd);

            } else {

                _zoomStart.y += (_zoomEnd.y - _zoomStart.y) * this.dynamicDampingFactor;

            }

        }

    };

    this.panCamera = (function () {

        var mouseChange = new THREE.Vector2(),
            objectUp = new THREE.Vector3(),
            pan = new THREE.Vector3();

        return function panCamera() {

            mouseChange.copy(_panEnd).sub(_panStart);

            if (mouseChange.lengthSq()) {

                mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);

                pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
                pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));

                _this.object.position.add(pan);
                _this.target.add(pan);

                if (_this.staticMoving) {

                    _panStart.copy(_panEnd);

                } else {

                    _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor));

                }

            }

        };

    }());

    this.checkDistances = function () {

        if (!_this.noZoom || !_this.noPan) {

            if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) {

                _this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
                _zoomStart.copy(_zoomEnd);

            }

            if (_eye.lengthSq() < _this.minDistance * _this.minDistance) {

                _this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance));
                _zoomStart.copy(_zoomEnd);

            }

        }

    };

    this.update = function () {

        _eye.subVectors(_this.object.position, _this.target);

        _eye.multiplyScalar(0.5);

        if (!_this.noRotate) {

            _this.rotateCamera();

        }

        if (!_this.noZoom) {

            _this.zoomCamera();

        }

        if (!_this.noPan) {

            _this.panCamera();

        }

        _this.object.position.addVectors(_this.target, _eye);

        _this.checkDistances();

        _this.object.lookAt(_this.target);

        if (lastPosition.distanceToSquared(_this.object.position) > EPS) {

            _this.dispatchEvent(changeEvent);

            lastPosition.copy(_this.object.position);

        }

    };

    this.reset = function () {

        _state = STATE.NONE;
        _prevState = STATE.NONE;

        _this.target.copy(_this.target0);
        _this.object.position.copy(_this.position0);
        _this.object.up.copy(_this.up0);

        console.log(_this.object.position);
        _eye.subVectors(_this.object.position, _this.target);

        _this.object.lookAt(_this.target);

        _this.dispatchEvent(changeEvent);

        lastPosition.copy(_this.object.position);

    };

    // listeners

    function keydown(event) {

        if (_this.enabled === false) return;

        window.removeEventListener('keydown', keydown);

        _prevState = _state;

        if (_state !== STATE.NONE) {

            return;

        } else if (event.keyCode === _this.keys[STATE.ROTATE] && !_this.noRotate) {

            _state = STATE.ROTATE;

        } else if (event.keyCode === _this.keys[STATE.ZOOM] && !_this.noZoom) {

            _state = STATE.ZOOM;

        } else if (event.keyCode === _this.keys[STATE.PAN] && !_this.noPan) {

            _state = STATE.PAN;

        }

    }

    function keyup(event) {

        if (_this.enabled === false) return;

        _state = _prevState;

        window.addEventListener('keydown', keydown, false);

    }

    function mousedown(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        if (_state === STATE.NONE) {

            _state = event.button;

        }

        if (_state === STATE.ROTATE && !_this.noRotate) {

            _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));
            _movePrev.copy(_moveCurr);

        } else if (_state === STATE.ZOOM && !_this.noZoom) {

            _zoomStart.copy(getMouseOnScreen(event.pageX, event.pageY));
            _zoomEnd.copy(_zoomStart);

        } else if (_state === STATE.PAN && !_this.noPan) {

            _panStart.copy(getMouseOnScreen(event.pageX, event.pageY));
            _panEnd.copy(_panStart);

        }

        document.addEventListener('mousemove', mousemove, false);
        document.addEventListener('mouseup', mouseup, false);

        _this.dispatchEvent(startEvent);

    }

    function mousemove(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        if (_state === STATE.ROTATE && !_this.noRotate) {

            _movePrev.copy(_moveCurr);
            _moveCurr.copy(getMouseOnCircle(event.pageX, event.pageY));

        } else if (_state === STATE.ZOOM && !_this.noZoom) {

            _zoomEnd.copy(getMouseOnScreen(event.pageX, event.pageY));

        } else if (_state === STATE.PAN && !_this.noPan) {

            _panEnd.copy(getMouseOnScreen(event.pageX, event.pageY));

        }

    }

    function mouseup(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        _state = STATE.NONE;

        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
        _this.dispatchEvent(endEvent);

    }

    function mousewheel(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.deltaMode) {

            case 2:
                // Zoom in pages
                _zoomStart.y -= event.deltaY * 0.025;
                break;

            case 1:
                // Zoom in lines
                _zoomStart.y -= event.deltaY * 0.01;
                break;

            default:
                // undefined, 0, assume pixels
                _zoomStart.y -= event.deltaY * 0.00025;
                break;

        }

        _this.dispatchEvent(startEvent);
        _this.dispatchEvent(endEvent);

    }

    function touchstart(event) {

        if (_this.enabled === false) return;

        switch (event.touches.length) {

            case 1:
                _state = STATE.TOUCH_ROTATE;
                _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                _movePrev.copy(_moveCurr);
                break;

            default: // 2 or more
                _state = STATE.TOUCH_ZOOM_PAN;
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

                var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                _panStart.copy(getMouseOnScreen(x, y));
                _panEnd.copy(_panStart);
                break;

        }

        _this.dispatchEvent(startEvent);

    }

    function touchmove(event) {

        if (_this.enabled === false) return;

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1:
                _movePrev.copy(_moveCurr);
                _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                break;

            default: // 2 or more
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

                var x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                var y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                _panEnd.copy(getMouseOnScreen(x, y));
                break;

        }

    }

    function touchend(event) {

        if (_this.enabled === false) return;

        switch (event.touches.length) {

            case 0:
                _state = STATE.NONE;
                break;

            case 1:
                _state = STATE.TOUCH_ROTATE;
                _moveCurr.copy(getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                _movePrev.copy(_moveCurr);
                break;

        }

        _this.dispatchEvent(endEvent);

    }

    function contextmenu(event) {

        event.preventDefault();

    }

    this.dispose = function () {

        this.domElement.removeEventListener('contextmenu', contextmenu, false);
        this.domElement.removeEventListener('mousedown', mousedown, false);
        this.domElement.removeEventListener('wheel', mousewheel, false);

        this.domElement.removeEventListener('touchstart', touchstart, false);
        this.domElement.removeEventListener('touchend', touchend, false);
        this.domElement.removeEventListener('touchmove', touchmove, false);

        document.removeEventListener('mousemove', mousemove, false);
        document.removeEventListener('mouseup', mouseup, false);

        window.removeEventListener('keydown', keydown, false);
        window.removeEventListener('keyup', keyup, false);

    };

    this.domElement.addEventListener('contextmenu', contextmenu, false);
    this.domElement.addEventListener('mousedown', mousedown, false);
    this.domElement.addEventListener('wheel', mousewheel, false);

    this.domElement.addEventListener('touchstart', touchstart, false);
    this.domElement.addEventListener('touchend', touchend, false);
    this.domElement.addEventListener('touchmove', touchmove, false);

    window.addEventListener('keydown', keydown, false);
    window.addEventListener('keyup', keyup, false);

    this.handleResize();

    // force an update at start
    this.update();

};

THREE.TrackballControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.TrackballControls.prototype.constructor = THREE.TrackballControls;

THREE.CSS3DObject = function (element) {

    THREE.Object3D.call(this);

    this.element = element;
    this.element.style.position = 'absolute';

    this.addEventListener('removed', function (event) {

        if (this.element.parentNode !== null) {

            this.element.parentNode.removeChild(this.element);

            for (var i = 0, l = this.children.length; i < l; i++) {

                this.children[i].dispatchEvent(event);

            }

        }

    });

};

THREE.CSS3DObject.prototype = Object.create(THREE.Object3D.prototype);

THREE.CSS3DSprite = function (element) {

    THREE.CSS3DObject.call(this, element);

};

THREE.CSS3DSprite.prototype = Object.create(THREE.CSS3DObject.prototype);

//

THREE.CSS3DRenderer = function () {

    console.log('THREE.CSS3DRenderer', THREE.REVISION);

    var _width, _height;
    var _widthHalf, _heightHalf;

    var matrix = new THREE.Matrix4();

    var domElement = document.createElement('div');
    domElement.style.overflow = 'hidden';

    domElement.style.WebkitTransformStyle = 'preserve-3d';
    domElement.style.MozTransformStyle = 'preserve-3d';
    domElement.style.oTransformStyle = 'preserve-3d';
    domElement.style.transformStyle = 'preserve-3d';

    this.domElement = domElement;

    var cameraElement = document.createElement('div');

    cameraElement.style.WebkitTransformStyle = 'preserve-3d';
    cameraElement.style.MozTransformStyle = 'preserve-3d';
    cameraElement.style.oTransformStyle = 'preserve-3d';
    cameraElement.style.transformStyle = 'preserve-3d';

    domElement.appendChild(cameraElement);

    this.setClearColor = function () {

    };

    this.setSize = function (width, height) {

        _width = width;
        _height = height;

        _widthHalf = _width / 2;
        _heightHalf = _height / 2;

        domElement.style.width = width + 'px';
        domElement.style.height = height + 'px';

        cameraElement.style.width = width + 'px';
        cameraElement.style.height = height + 'px';

    };

    var epsilon = function (value) {

        return Math.abs(value) < 0.000001 ? 0 : value;

    };

    var getCameraCSSMatrix = function (matrix) {

        var elements = matrix.elements;

        return 'matrix3d(' +
            epsilon(elements[0]) + ',' +
            epsilon(- elements[1]) + ',' +
            epsilon(elements[2]) + ',' +
            epsilon(elements[3]) + ',' +
            epsilon(elements[4]) + ',' +
            epsilon(- elements[5]) + ',' +
            epsilon(elements[6]) + ',' +
            epsilon(elements[7]) + ',' +
            epsilon(elements[8]) + ',' +
            epsilon(- elements[9]) + ',' +
            epsilon(elements[10]) + ',' +
            epsilon(elements[11]) + ',' +
            epsilon(elements[12]) + ',' +
            epsilon(- elements[13]) + ',' +
            epsilon(elements[14]) + ',' +
            epsilon(elements[15]) +
            ')';

    };

    var getObjectCSSMatrix = function (matrix) {

        var elements = matrix.elements;

        return 'translate3d(-50%,-50%,0) matrix3d(' +
            epsilon(elements[0]) + ',' +
            epsilon(elements[1]) + ',' +
            epsilon(elements[2]) + ',' +
            epsilon(elements[3]) + ',' +
            epsilon(- elements[4]) + ',' +
            epsilon(- elements[5]) + ',' +
            epsilon(- elements[6]) + ',' +
            epsilon(- elements[7]) + ',' +
            epsilon(elements[8]) + ',' +
            epsilon(elements[9]) + ',' +
            epsilon(elements[10]) + ',' +
            epsilon(elements[11]) + ',' +
            epsilon(elements[12]) + ',' +
            epsilon(elements[13]) + ',' +
            epsilon(elements[14]) + ',' +
            epsilon(elements[15]) +
            ')';

    };

    var renderObject = function (object, camera) {

        if (object instanceof THREE.CSS3DObject) {

            var style;

            if (object instanceof THREE.CSS3DSprite) {

                // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

                matrix.copy(camera.matrixWorldInverse);
                matrix.transpose();
                matrix.copyPosition(object.matrixWorld);
                matrix.scale(object.scale);

                matrix.elements[3] = 0;
                matrix.elements[7] = 0;
                matrix.elements[11] = 0;
                matrix.elements[15] = 1;

                style = getObjectCSSMatrix(matrix);

            } else {

                style = getObjectCSSMatrix(object.matrixWorld);

            }

            var element = object.element;

            element.style.WebkitTransform = style;
            element.style.MozTransform = style;
            element.style.oTransform = style;
            element.style.transform = style;

            if (element.parentNode !== cameraElement) {

                cameraElement.appendChild(element);

            }

        }

        for (var i = 0, l = object.children.length; i < l; i++) {

            renderObject(object.children[i], camera);

        }

    };

    this.render = function (scene, camera) {

        var fov = 0.5 / Math.tan(THREE.Math.degToRad(camera.fov * 0.5)) * _height;

        domElement.style.WebkitPerspective = fov + "px";
        domElement.style.MozPerspective = fov + "px";
        domElement.style.oPerspective = fov + "px";
        domElement.style.perspective = fov + "px";

        scene.updateMatrixWorld();

        if (camera.parent === undefined) camera.updateMatrixWorld();

        camera.matrixWorldInverse.getInverse(camera.matrixWorld);

        var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix(camera.matrixWorldInverse) +
            " translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

        cameraElement.style.WebkitTransform = style;
        cameraElement.style.MozTransform = style;
        cameraElement.style.oTransform = style;
        cameraElement.style.transform = style;

        renderObject(scene, camera);

    };

};

(function () {
    var VIZ = {};
    var camera, renderer, controls, scene = new THREE.Scene();
    var width = window.innerWidth, height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
    camera.position.z = 3000;
    camera.setLens(30);

    VIZ.drawElements = function (data) {

        VIZ.count = data.length;

        var margin = { top: 17, right: 0, bottom: 16, left: 20 },
            width = 225 - margin.left - margin.right,
            height = 140 - margin.top - margin.bottom;

        var legendArr = d3.keys(data[0].recs[0])
            .filter(function (key) { return key !== 'year'; });

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0, 0)
            .domain(d3.range(2004, 2014).map(function (d) { return d + ""; }))

        var y = d3.scale.linear().range([height, 0]).domain([0, 135]);

        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");

        var area = d3.svg.area()
            .interpolate("cardinal")
            .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
            .y0(function (d) { return y(d.y0); })
            .y1(function (d) { return y(d.y0 + d.y); });

        var color = d3.scale.ordinal()
            .range(['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)']);

        var elements = d3.selectAll('.element')
            .data(data).enter()
            .append('div')
            .attr('class', 'element')

        elements.append('div')
            .attr('class', 'chartTitle')
            .html(function (d) { return d.name; })

        elements.append('div')
            .attr('class', 'investData')
            .html(function (d, i) { return d.awards; })

        elements.append('div')
            .attr('class', 'investLabel')
            .html("Investments (10 Yrs)")

        elements.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "chartg")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        elements.select(".chartg")
            .append("g").attr("class", "seriesg")
            .selectAll("series")
            .data(function (d) { return prepData(d.recs); })
            .enter()
            .append("path")
            .attr("class", "series")
            .attr("d", function (d) { return area(d.values); })
            .style("fill", function (d) { return color(d.name); })

        elements.select(".chartg")
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(15, -15)")
            .selectAll(".legendItem")
            .data(setLegend(legendArr))
            .enter()
            .append("g")
            .attr("class", "legendItem")
            .each(function (d) {
                d3.select(this).append("rect")
                    .attr("x", function (d) { return d.x })
                    .attr("y", function (d) { return d.y })
                    .attr("width", 4)
                    .attr("height", 4)
                    .style("fill", function (d) { return color(d.name); })

                d3.select(this).append("text")
                    .attr("class", "legendText")
                    .attr("x", function (d) { return d.x + 5 })
                    .attr("y", function (d) { return d.y + 4 })
                    .text(function (d) { return d.name; });
            });

        elements.select(".chartg").append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        elements.select(".chartg").append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Investments");

        elements.each(setData);
        elements.each(objectify);

        function prepData(data) {
            var stack = d3.layout.stack()
                .offset("zero")
                .values(function (d) { return d.values; })
                .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
                .y(function (d) { return d.value; });

            var labelVar = 'year';
            var varNames = d3.keys(data[0])
                .filter(function (key) { return key !== labelVar; });

            var seriesArr = [], series = {};
            varNames.forEach(function (name) {
                series[name] = { name: name, values: [] };
                seriesArr.push(series[name]);
            });

            data.forEach(function (d) {
                varNames.map(function (name) {
                    series[name].values.push({
                        name: name,
                        label: d[labelVar],
                        value: +d[name]
                    });
                });
            });
            return stack(seriesArr);
        }
    }

    function setLegend(arr) {
        return arr.map(function (n, i) {
            return { name: n, x: (i % 4) * 48, y: Math.floor(i / 4) * 8 };
        });
    }

    function objectify(d) {
        var object = new THREE.CSS3DObject(this);
        object.position = d.random.position;
        scene.add(object);
    }

    function setData(d, i) {
        var vector, phi, theta;

        var random = new THREE.Object3D();
        random.position.x = Math.random() * 4000 - 2000;
        random.position.y = Math.random() * 4000 - 2000;
        random.position.z = Math.random() * 4000 - 2000;
        d['random'] = random;

        var sphere = new THREE.Object3D();
        vector = new THREE.Vector3();
        phi = Math.acos(-1 + (2 * i) / (VIZ.count - 1));
        theta = Math.sqrt((VIZ.count - 1) * Math.PI) * phi;
        sphere.position.x = 800 * Math.cos(theta) * Math.sin(phi);
        sphere.position.y = 800 * Math.sin(theta) * Math.sin(phi);
        sphere.position.z = 800 * Math.cos(phi);
        vector.copy(sphere.position).multiplyScalar(0.5);
        sphere.lookAt(vector);
        d['sphere'] = sphere;

        var helix = new THREE.Object3D();
        vector = new THREE.Vector3();
        phi = (i + 12) * 0.250 + Math.PI;
        helix.position.x = 1000 * Math.sin(phi);
        helix.position.y = - (i * 8) + 500;
        helix.position.z = 1000 * Math.cos(phi);
        vector.x = helix.position.x * 2;
        vector.y = helix.position.y;
        vector.z = helix.position.z * 2;
        helix.lookAt(vector);
        d['helix'] = helix;

        var grid = new THREE.Object3D();
        grid.position.x = ((i % 5) * 400) - 800;
        grid.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
        grid.position.z = (Math.floor(i / 25)) * 1000 - 2000;
        d['grid'] = grid;
    }

    VIZ.render = function () {
        renderer.render(scene, camera);
    }

    d3.select("#menu").selectAll('button')
        .data(['sphere', 'helix', 'grid']).enter()
        .append('button')
        .html(function (d) { return d; })
        .on('click', function (d) { VIZ.transform(d); })

    VIZ.transform = function (layout) {
        var duration = 1000;

        TWEEN.removeAll();

        scene.children.forEach(function (object) {
            var newPos = object.element.__data__[layout].position;
            var coords = new TWEEN.Tween(object.position)
                .to({ x: newPos.x, y: newPos.y, z: newPos.z }, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .start();

            var newRot = object.element.__data__[layout].rotation;
            var rotate = new TWEEN.Tween(object.rotation)
                .to({ x: newRot.x, y: newRot.y, z: newRot.z }, duration)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .start();
        });

        var update = new TWEEN.Tween(this)
            .to({}, duration)
            .onUpdate(VIZ.render)
            .start();
    }

    VIZ.animate = function () {
        requestAnimationFrame(VIZ.animate);
        TWEEN.update();
        controls.update();
    }

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(width, height);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 100;
    controls.maxDistance = 6000;
    controls.addEventListener('change', VIZ.render);

    VIZ.onWindowResize = function () {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        VIZ.render();
    }
    window.VIZ = VIZ;
}())

var recognition = new (webkitSpeechRecognition || mozSpeechRecognition || msSpeechRecognition)();
recognition.lang = 'en-UK';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
recognition.start();
recognition.onresult = function (event) {
    let tt = event.results[0][0].transcript;
    console.log('You said: ', tt);
    if (tt.indexOf("clothing" !== -1)) {
        tt = "clothing";
    }
    zalando.queryCategory(tt, undefined, (data) => {
        console.log(data);
        recognition.onresult = function (event) {
            let color = event.results[0][0].transcript;
            console.log('You said: ', color);
            zalando.queryCategory(tt, color, (data) => {
                console.log(data);
            });
        }
        recognition.start();
    });
};

d3.json("data/investments.json", function (error, data) {
    VIZ.drawElements(data);
    VIZ.transform('sphere');
    d3.select("#loading").remove();
    VIZ.render();
    VIZ.animate();
    window.addEventListener('resize', VIZ.onWindowResize, false);
});