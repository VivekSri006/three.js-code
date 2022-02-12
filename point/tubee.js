
var data=[];
axios.get('Hospital.geojson')
.then(function (response) {
var arr=response.data.features;
// console.log(arr)
for( var i=0;i<arr.length;i++){
// console.log(Object.keys(arr[i].properties))
// console.log(Object.values(arr[i].properties))
console.log(Object.entries(arr[i].properties));
var position =[arr[i].geometry.coordinates[0],arr[i].geometry.coordinates[1]];
var labell=[arr[i].properties.address]
var valuee=[arr[i].properties.phoneNumber]
var colorr=[arr[i].properties.color]


data.push ( { label: labell, LngLat: position, value:valuee , color:colorr })
}
})
.catch(function (error) {
  // handle error
  console.log(error);
})
.then(function () {
  // always executed 
});

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

        // this.pylons = [];
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        // console.log(data)
        for(var i = 0; i < data.length; i++){
            
            // var materials = [ new THREE.MeshBasicMaterial({ color: 0xA0A0A0 }) , new THREE.MeshBasicMaterial({ color: data[i].color }) ];
            
            var pos = getPositionFromLongLat(center, data[i])
            //side vs height ratio, semi-automatic
            var ratio = remapFloat(data[i].value, 6, 60, 2.8, 8.0);
            var ds = ratio;
            var dr = ds / 2.0 / Math.cos(Math.PI/6);
            var dh = data[i].value / (0.25 * dr * ds * 1.0 / Math.sqrt(3));
            
            data[i].labelPosition = new THREE.Vector3(pos.x, pos.y + dh+ 35+250, pos.z);
            
            // var texture = new THREE.TextureLoader().load('tube.jpg');
            // var geometry = new THREE.CircleGeometry( 8, 32 );
            // var geometry = new THREE.ConeGeometry( 90, 500, 3 );
            var geometry = new THREE.CylinderGeometry( 45, 45, 500, 50,50 );
            // var geometry = new THREE.SphereGeometry(250, 32, 32);
            // var geometry = new THREE.BoxGeometry( 500,500,500 );
            var material = new THREE.MeshBasicMaterial( { color:  0xC1C1C1, transparent: false, opacity: 0.2 } );
            // var material = new THREE.MeshBasicMaterial( {  map: texture } );
            var spot = new THREE.Mesh( geometry, material );
            //  spot.rotation.x = -Math.PI / 2;
            spot.position.set(pos.x, pos.y+250 , pos.z);
            this.scene.add( spot );
            // console.log(spot)
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
        var extra = ctx.measureText(" Address : "+ data[i].label).width;
        ctx.fillText(" Address : "+ data[i].label, screen.x - side * 256 - side * extra - side * 16, screen.y - 64 + 6);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "italic 20px Arial";
        var extra = ctx.measureText( " Contact no : "+ data[i].value ).width;
        ctx.fillText(" Contact no : "+  data[i].value, screen.x - side * 256 - side * extra - side * 16, screen.y - 64 + 28);
        
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