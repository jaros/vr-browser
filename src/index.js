import * as THREE from "three";
import * as d3 from "d3";
import * as TWEEN from "tween.js";
import * as zalando from "./zalando";

//import * as FlyC from "three-fly-controls"

// THREE.FlyControls = function ( object, domElement, opts ) {

//         var changeEvent = { type: 'change' };

//         this.object = object;

//         opts = opts || {};

//         this.domElement = ( domElement !== undefined ) ? domElement : document;
//         if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );

//         // API

//         this.movementSpeed = (opts.movementSpeed === undefined) ? 1.0 : opts.movementSpeed;
//         this.rollSpeed = (opts.rollSpeed === undefined) ? 0.005 : opts.rollSpeed;

//         this.dragToLook = true;
//         this.autoForward = false;

//         // disable default target object behavior

//         // internals

//         this.tmpQuaternion = new THREE.Quaternion();

//         this.mouseStatus = 0;

//         this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
//         this.moveVector = new THREE.Vector3( 0, 0, 0 );
//         this.rotationVector = new THREE.Vector3( 0, 0, 0 );

//         var prevTime = Date.now();


//         this.handleEvent = function ( event ) {

//             if ( typeof this[ event.type ] == 'function' ) {

//                 this[ event.type ]( event );

//             }

//         };

//         this.keydown = function( event ) {

//             if ( event.altKey ) {

//                 return;

//             }



//             switch ( event.keyCode ) {

//                 case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

//                 case 87: /*W*/ this.moveState.forward = 1; break;
//                 case 83: /*S*/ this.moveState.back = 1; break;

//                 case 65: /*A*/ this.moveState.left = 1; break;
//                 case 68: /*D*/ this.moveState.right = 1; break;

//                 case 82: /*R*/ this.moveState.up = 1; break;
//                 case 70: /*F*/ this.moveState.down = 1; break;

//                 case 38: /*up*/ this.moveState.pitchUp = 1; break;
//                 case 40: /*down*/ this.moveState.pitchDown = 1; break;

//                 case 37: /*left*/ this.moveState.yawLeft = 1; break;
//                 case 39: /*right*/ this.moveState.yawRight = 1; break;

//                 case 81: /*Q*/ this.moveState.rollLeft = 1; break;
//                 case 69: /*E*/ this.moveState.rollRight = 1; break;

//             }

//             var surpress = [38, 40, 37, 39];

//             if(surpress.indexOf(event.keyCode) > -1) {
//                 event.preventDefault();
//             }

//             this.updateMovementVector();
//             this.updateRotationVector();
//             this.update();
//             this.dispatchEvent(changeEvent);
//         };

//         this.keyup = function( event ) {

//             switch( event.keyCode ) {

//                 case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

//                 case 87: /*W*/ this.moveState.forward = 0; break;
//                 case 83: /*S*/ this.moveState.back = 0; break;

//                 case 65: /*A*/ this.moveState.left = 0; break;
//                 case 68: /*D*/ this.moveState.right = 0; break;

//                 case 82: /*R*/ this.moveState.up = 0; break;
//                 case 70: /*F*/ this.moveState.down = 0; break;

//                 case 38: /*up*/ this.moveState.pitchUp = 0; break;
//                 case 40: /*down*/ this.moveState.pitchDown = 0; break;

//                 case 37: /*left*/ this.moveState.yawLeft = 0; break;
//                 case 39: /*right*/ this.moveState.yawRight = 0; break;

//                 case 81: /*Q*/ this.moveState.rollLeft = 0; break;
//                 case 69: /*E*/ this.moveState.rollRight = 0; break;

//             }

//             this.updateMovementVector();
//             this.updateRotationVector();

//         };

//         this.mousedown = function( event ) {

//             if ( this.domElement !== document ) {

//                 this.domElement.focus();

//             }

//             event.preventDefault();
//             event.stopPropagation();

//             if ( this.dragToLook ) {

//                 this.mouseStatus ++;

//             } else {

//                 switch ( event.button ) {

//                     case 0: this.moveState.forward = 1; break;
//                     case 2: this.moveState.back = 1; break;

//                 }

//                 this.updateMovementVector();

//             }

//         };

//         this.mousemove = function( event ) {

//             if ( !this.dragToLook || this.mouseStatus > 0 ) {

//                 var container = this.getContainerDimensions();
//                 var halfWidth  = container.size[ 0 ] / 2;
//                 var halfHeight = container.size[ 1 ] / 2;

//                 this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
//                 this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

//                 this.updateRotationVector();

//             }

//         };


//         this.mouseout = function( event ) {

//             event.preventDefault();
//             event.stopPropagation();
//             this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
//             this.updateRotationVector();
//             this.updateMovementVector();
//         };

//         this.mouseup = function( event ) {

//             event.preventDefault();
//             event.stopPropagation();

//             if ( this.dragToLook ) {

//                 this.mouseStatus --;

//                 this.moveState.yawLeft = this.moveState.pitchDown = 0;

//             } else {

//                 switch ( event.button ) {

//                     case 0: this.moveState.forward = 0; break;
//                     case 2: this.moveState.back = 0; break;

//                 }

//                 this.updateMovementVector();

//             }

//             this.updateRotationVector();

//         };

//         this.update = function( delta ) {

//             var time = Date.now();
//             var delta = ( time - prevTime ) / 10;

//             var moveMult = delta * this.movementSpeed;
//             var rotMult = delta * this.rollSpeed;

//             this.object.translateX( this.moveVector.x * moveMult );
//             this.object.translateY( this.moveVector.y * moveMult );
//             this.object.translateZ( this.moveVector.z * moveMult );

//             this.tmpQuaternion.set( this.rotationVector.x * rotMult, this.rotationVector.y * rotMult, this.rotationVector.z * rotMult, 1 ).normalize();
//             this.object.quaternion.multiply( this.tmpQuaternion );

//             // expose the rotation vector for convenience
//             this.object.rotation.setFromQuaternion( this.object.quaternion, this.object.rotation.order );

//             prevTime = time;
//         };

//         this.updateMovementVector = function() {

//             var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

//             this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
//             this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
//             this.moveVector.z = ( -forward + this.moveState.back );

//             //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );

//         };

//         this.updateRotationVector = function() {

//             this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
//             this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
//             this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

//             //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );

//         };

//         this.getContainerDimensions = function() {

//             if ( this.domElement != document ) {

//                 return {
//                     size    : [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
//                     offset  : [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
//                 };

//             } else {

//                 return {
//                     size    : [ window.innerWidth, window.innerHeight ],
//                     offset  : [ 0, 0 ]
//                 };

//             }

//         };



//         function bind( scope, fn ) {

//             return function () {

//                 fn.apply( scope, arguments );

//             };

//         };

//         this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

//         this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
//         this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
//         this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );
//         this.domElement.addEventListener( 'mouseout',   bind( this, this.mouseout ), false );

//         this.domElement.addEventListener( 'keydown', bind( this, this.keydown ), false );
//         this.domElement.addEventListener( 'keyup',   bind( this, this.keyup ), false );

//         this.updateMovementVector();
//         this.updateRotationVector();
//     };

// THREE.FlyControls.prototype = Object.create(THREE.EventDispatcher.prototype);
// THREE.FlyControls.prototype.constructor = THREE.FlyControls;

import * as utils from './utils';

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

    this.keys = [];//65 /*A*/, 83 /*S*/, 68 /*D*/];

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

        } else if (event.keyCode === 87) {
            var prevPov = new THREE.Vector3();
            var pan = new THREE.Vector3();
            prevPov.copy(_this.object.position)
            _this.object.translateZ( -30);
            pan.subVectors(_this.object.position,prevPov)
            _this.target.add(pan);
            _this.update();
        } else if (event.keyCode === 83) {
            var prevPov = new THREE.Vector3();
            var pan = new THREE.Vector3();
            prevPov.copy(_this.object.position)
            _this.object.translateZ( 30);
            pan.subVectors(_this.object.position,prevPov)
            _this.target.add(pan);
            _this.update();
        } else if (event.keyCode === 65) {
            var prevPov = new THREE.Vector3();
            var pan = new THREE.Vector3();
            prevPov.copy(_this.object.position)
            _this.object.translateX( -30);
            pan.subVectors(_this.object.position,prevPov)
            _this.target.add(pan);
            _this.update();
        } else if (event.keyCode === 68) {
            var prevPov = new THREE.Vector3();
            var pan = new THREE.Vector3();
            prevPov.copy(_this.object.position)
            _this.object.translateX( 30);
            pan.subVectors(_this.object.position,prevPov)
            _this.target.add(pan);
            _this.update();
    }

    //                 case 65: /*A*/ this.moveState.left = 1; break;
//                 case 68: /*D*/ this.moveState.right = 1; break;


        //                 case 82: /*R*/ this.moveState.up = 1; break;
//                 case 70: /*F*/ this.moveState.down = 1; break;

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

Array.prototype.flatMap = function (lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

(function () {
    var VIZ = {};
    var camera, renderer, controls, scene = new THREE.Scene();
    var width = window.innerWidth, height = window.innerHeight;

    camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
    camera.position.z = 3000;
    camera.setLens(30);

    VIZ.drawElements = function (data1, data2, onClick) {
        VIZ.count1 = data1.length;
        VIZ.count2 = data2.length;

        let elements1 = d3.selectAll('.element')
            .data(data1).enter()
            .append('div')
            .on('click', function (d) { onClick(d); })
            .on('mouseover', function (d, i) { 
                const currentTransform = d3.select(d3.selectAll('.element')[0][i]).attr("style");
                d3.select(d3.selectAll('.element')[0][i]).attr("style", currentTransform.replace("position: absolute; transform:", "position: absolute; transform: scale(1.1) "));
            })
            .on('mouseout', function (d, i) { 
                const currentTransform = d3.select(d3.selectAll('.element')[0][i]).attr("style");
                d3.select(d3.selectAll('.element')[0][i]).attr("style", currentTransform.replace("position: absolute; transform: scale(1.1) ", "position: absolute; transform:"));
            })
            .attr('class', 'element');

        let items = elements1.filter(function (d) { return d.type === "item" });
        utils.renderItem(items);

        let labels = elements1.filter(function (d) { return d.type === "label" });
        utils.renderLabel(labels);

        let images = elements1.filter(function (d) { return d.type === "image" });
        utils.renderImage(images);

        let buttons = elements1.filter(function (d) { return d.type === "button" });
        utils.renderButton(buttons);

        let attributes = elements1.filter(function (d) { return d.type === "attributes" });
        utils.renderAttributes(attributes);

        elements1.each(function (d, i) { setData(d, i, VIZ.count1, 800) });


        var elements2 = d3.selectAll('.element2')
            .data(data2).enter()
            .append('div')
            .on('click', function (d) { onClick(d) })
            .attr('class', 'element2');

        items = elements2.filter(function (d) { return d.type === "item" });
        utils.renderItem(items);

        labels = elements2.filter(function (d) { return d.type === "label" });
        utils.renderLabel(labels);

        images = elements2.filter(function (d) { return d.type === "image" });
        utils.renderImage(images);

        buttons = elements2.filter(function (d) { return d.type === "button" });
        utils.renderButton(buttons);

        attributes = elements2.filter(function (d) { return d.type === "attributes" });
        utils.renderAttributes(attributes);


        elements2.each(function (d, i) { setData(d, i, VIZ.count2, 1200) });

        elements1.each(objectify);
        elements2.each(objectify);
    };

    function objectify(d) {
        var object = new THREE.CSS3DObject(this);
        object.position = d.random.position;
        scene.add(object);
    }

    VIZ.removeAll = function () {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }

    function setData(d, i, count, size) {
        var vector, phi, theta;

        var random = new THREE.Object3D();
        random.position.x = Math.random() * 4000 - 2000;
        random.position.y = Math.random() * 4000 - 2000;
        random.position.z = Math.random() * 4000 - 2000;
        d['random'] = random;

        var sphere = new THREE.Object3D();
        vector = new THREE.Vector3();
        phi = Math.acos(-1 + (2 * i) / (count - 1));
        theta = Math.sqrt((count - 1) * Math.PI) * phi;
        sphere.position.x = size * Math.cos(theta) * Math.sin(phi);
        sphere.position.y = size * Math.sin(theta) * Math.sin(phi);
        sphere.position.z = size * Math.cos(phi);
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
    }

    VIZ.render = function () {
        renderer.render(scene, camera);
    };

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
    };

    VIZ.animate = function () {
        requestAnimationFrame(VIZ.animate);
        TWEEN.update();
        controls.update();
    };

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
    };
    window.VIZ = VIZ;
}());

var recognition = new (webkitSpeechRecognition || mozSpeechRecognition || msSpeechRecognition)();
recognition.lang = 'en-UK';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
// recognition.start();
// recognition.onresult = function (event) {
// let tt = event.results[0][0].transcript;
let tt = "shoes";
console.log('You said: ', tt);
if (tt.indexOf("clothing") !== -1) {
    tt = "clothing";
}
if (tt.indexOf("shows") !== -1) {
    tt = "shoes";
}

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

zalando.queryCategory(tt, "blue", (data) => {
    VIZ.drawElements(data, data.flatMap(zalando.transformArticle), function (a) {
        VIZ.removeAll();
        VIZ.render();
        VIZ.animate();
        VIZ.drawElements(data.content.flatMap(zalando.transformArticle), [], function (d) { });
        VIZ.transform('sphere');
        VIZ.render();
        VIZ.animate();
    });
    VIZ.transform('sphere');
    d3.select("#loading").remove();
    VIZ.render();
    VIZ.animate();
    window.addEventListener('resize', VIZ.onWindowResize, false);
    // recognition.onresult = function (event) {
    // let color = event.results[0][0].transcript;
    zalando.queryCategory(tt, "green", (dd) => {
        VIZ.removeAll();
        VIZ.render();
        VIZ.animate();
        VIZ.drawElements(dd, dd.flatMap(zalando.transformArticle), function (a) {
            // zalando.queryArticle(a.id, function (d) {
            VIZ.removeAll();
            VIZ.render();
            VIZ.animate();
            VIZ.drawElements(dd.flatMap(zalando.transformArticle), [], function (d) { });
            VIZ.transform('sphere');
            VIZ.render();
            VIZ.animate();
            // });
        });
        VIZ.transform('sphere');
        VIZ.render();
        VIZ.animate();
        window.addEventListener('resize', VIZ.onWindowResize, false);
    });
    // }
    // recognition.start();
});

// };
