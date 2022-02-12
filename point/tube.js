var data = [
    
    { label: "Noida", LngLat: [77.04986572265625,28.43473251288398], value: 120.78, color: 0x0074D9 },
    { label: "Pole 2", LngLat: [77.07132339477539,28.458429348071338], value: 38.77, color: 0x85144B },
    { label: "Pole 3", LngLat: [77.05724716186523,28.468389489533372], value: 45.0, color: 0x39CCCC },
    { label: "Pole 4", LngLat: [77.0495867729187,28.45959895877523], value: 51.55, color: 0xB10DC9 },
    { label: "Pole 5", LngLat: [77.05707550048828,28.468540393548516], value: 16.01, color: 0x2ECC40 },
    { label: "Pole 6", LngLat: [77.07158088684082,28.458042619104564], value: 60.84, color: 0xFFDC00 },
    { label: "Pole 8", LngLat: [77.17158088684082,28.458042619104564], value: 60.84, color: 0xFFDC00 },
    { label: "Pole 9", LngLat: [77.09158088684082,28.458042619104564], value: 60.84, color: 0xFFDC00 },
    { label: "Pole 10", LngLat: [77.11158088684082,28.458042619104564], value: 60.84, color: 0xFFDC00 },
    { label: "Pole 11", LngLat: [77.15158088684082,28.458042619104564], value: 60.84, color: 0xFFDC00 }
];

var center = { LngLat : [77.05836296081543,28.443864724653075], altidute: 0, rotation : new THREE.Vector3(Math.PI / 2, 0, 0), scale: 0.000000001 };    

center.transform = {
    
    translateX: mapboxgl.MercatorCoordinate.fromLngLat(center.LngLat, center.altitude).x,
    translateY: mapboxgl.MercatorCoordinate.fromLngLat(center.LngLat, center.altitude).y,
    translateZ: mapboxgl.MercatorCoordinate.fromLngLat(center.LngLat, center.altitude).z,
    rotateX: center.rotation.x,
    rotateY: center.rotation.y,
    rotateZ: center.rotation.z,
    scale: center.scale
};

mapboxgl.accessToken = "pk.eyJ1IjoicmFqYW4wMjciLCJhIjoiY2s2b25oYTg1MDJtazNsbXZ4OTFqcnN2cSJ9.MGaLTVPvgOjQazj7ZTX1nQ";

var map = window.map = new mapboxgl.Map({
    
    container: "map",
    style: "mapbox://styles/mapbox/dark-v9",
    zoom: 15.4,
    center: center.LngLat,
    pitch: 60
    
});

map.getCanvasContainer().id ="mapbox"; canvas = document.createElement("canvas"); document.getElementById("mapbox").appendChild(canvas), ctx = canvas.getContext("2d");
window.addEventListener("resize", resizeWindow, false);
resizeWindow();

function resizeWindow(){ 
    
    var bbox = document.body.getBoundingClientRect();
    var width = bbox.width;
    var height = bbox.height
    var container = map.getCanvasContainer();

    canvas.width = width * 2;
    canvas.height = height * 2;
    
    map.resize();

}

var THREE = window.THREE;

var threejsLayer = {
    
    id: "threejs",
    type: "custom",
    renderingMode: "3d",

    onAdd: function(map_, gl_) {

        this.pylons = [];
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        //1:0.8660254
        // var v1 = 0.25 * 1.0 * Math.pow(0.8660254, 2) * 1.0 / Math.sqrt(3) * 100;
        // console.log(v1);

        for(var i = 0; i < data.length; i++){
            
            // var materials = [ new THREE.MeshBasicMaterial({ color: 0xA0A0A0 }) , new THREE.MeshBasicMaterial({ color: data[i].color }) ];
            
            var pos = getPositionFromLongLat(center, data[i])
            console.log(data[i])
            //side vs height ratio, semi-automatic
            var ratio = remapFloat(data[i].value, 6, 60, 2.8, 8.0);
            var ds = ratio;
            var dr = ds / 2.0 / Math.cos(Math.PI/6);
            var dh = data[i].value / (0.25 * ds * ds * 1.0 / Math.sqrt(3));
            
            data[i].labelPosition = new THREE.Vector3(pos.x, pos.y + dh * 15 + 35+250, pos.z);
            
            var texture = new THREE.TextureLoader().load('tube.jpg');
            // var geometry = new THREE.CircleGeometry( 8, 32 );
            // var geometry = new THREE.ConeGeometry( 90, 500, 3 );
            // var geometry = new THREE.CylinderGeometry( 45, 45, 500, 50,50 );
            // var geometry = new THREE.SphereGeometry(250, 32, 32);
            var geometry = new THREE.BoxGeometry( 500,500,500 );
            var material = new THREE.MeshBasicMaterial( { color:  0xC1C1C1, transparent: false, opacity: 0.2 } );
            // var material = new THREE.MeshBasicMaterial( {  map: texture } );
            var spot = new THREE.Mesh( geometry, material );
            //  spot.rotation.x = -Math.PI / 2;
            spot.position.set(pos.x, pos.y+250 , pos.z);
            this.scene.add( spot );
        }

        this.map = map_;
        
        this.renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl_ });
        this.renderer.autoClear = false;
    
    },
    
    render: function(gl_, matrix_) {

        var rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), center.rotation.x);
        var rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), center.rotation.y);
        var rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), center.rotation.z);

        var m = new THREE.Matrix4().fromArray(matrix_);
        
        var l = new THREE.Matrix4().makeTranslation(center.transform.translateX, center.transform.translateY, center.transform.translateZ)
        .scale(new THREE.Vector3(center.scale, -center.scale, center.scale))
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

        this.camera.projectionMatrix.elements = matrix_;
        this.camera.projectionMatrix = m.multiply(l);
            
        renderHUD(this.camera);
        
        this.renderer.state.reset();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();

        
    }
    
};

function renderHUD(camera_) {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for(var i = 0; i < data.length; i++){
    
        var screen = worldToScreen(data[i].labelPosition, camera_);
        var side = 1;
        if(screen.x > canvas.width / 2) { side = -1; }
        ctx.strokeStyle = "#FFFFFF";

        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y);
        ctx.lineTo(screen.x - side * 64, screen.y - 64);
        ctx.lineTo(screen.x - side * 256, screen.y - 64);
        ctx.stroke();

        ctx.textAlign = "start"; 
        if(side == -1) { ctx.textAlign = "end"; }
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "24px Arial";
        var extra = ctx.measureText(data[i].label).width;
        ctx.fillText(data[i].label, screen.x - side * 256 - side * extra - side * 16, screen.y - 64 + 6);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "italic 20px Arial";
        var extra = ctx.measureText(data[i].value + " Feets").width;
        ctx.fillText(data[i].value + " Feets", screen.x - side * 256 - side * extra - side * 16, screen.y - 64 + 28);
        
    }

}

function worldToScreen(vec3_, camera_){

    var pos = new THREE.Vector3(vec3_.x, vec3_.y, vec3_.z);
    pos.project(camera_);

    pos.x = (pos.x * canvas.width / 2) + canvas.width / 2;
    pos.y = -(pos.y * canvas.height / 2) + canvas.height / 2;
    pos.z = 0;

    return { x: pos.x , y: pos.y };
    
}

function getPositionFromLongLat(center_, object_){
    
    var centerCoords = mapboxgl.MercatorCoordinate.fromLngLat(center_.LngLat, 0);
    var objectCoords = mapboxgl.MercatorCoordinate.fromLngLat(object_.LngLat, 0);
    
    var dx = centerCoords.x - objectCoords.x;
    var dy = centerCoords.y - objectCoords.y;
    
    dx /= center_.scale;
    dy /= center_.scale;

    return new THREE.Vector3(-dx,0, -dy);
}


map.on("style.load", function() { map.addLayer(threejsLayer, map.getStyle().layers[map.getStyle().layers.length -1].id); });

function remapFloat(v_, min0_, max0_, min1_, max1_) { return min1_ + (v_ - min0_) / (max0_ - min0_) * (max1_ - min1_); }