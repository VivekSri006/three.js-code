            var data=[
              {
                "type": "FeatureCollection",
                "features": [
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.0263910293579,
                        28.456448526233523
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.02572584152222,
                        28.45567505239237
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.0235800743103,
                        28.45707107423914
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.02362835407257,
                        28.457163041247355
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.0235425233841,
                        28.45729273817424
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.02278345823288,
                        28.457155966864942
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.02244013547897,
                        28.457818598629125
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.02239990234375,
                        28.45796244341
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.02251255512238,
                        28.45826899720802
                      ]
                    }
                  },
                  {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                      "type": "Point",
                      "coordinates": [
                        77.02271908521652,
                        28.45856375963699
                      ]
                    }
                  }
                ]
              }
            ]
          
            mapboxgl.accessToken ='pk.eyJ1IjoicmFqYW4wMjciLCJhIjoiY2s2b25oYTg1MDJtazNsbXZ4OTFqcnN2cSJ9.MGaLTVPvgOjQazj7ZTX1nQ';
            var map = (window.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/dark-v9',
                // zoom: 18,
                center: [ 77.0263910293579,
                  28.456448526233523],
                // pitch: 60,
                zoom: 16,
                pitch: 60,
                bearing: 120,
                maxZoom: 18,
                minZoom: 7,
                antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
            }));
            console.log(data[0])
            var arr=data[0].features
            var geometry = new THREE.BufferGeometry();
            const pointArr = [];
            for(var i=0;i<arr.length;i++){
           
            var position=[data[0].features[i].geometry.coordinates[0],data[0].features[i].geometry.coordinates[1]]
            // console.log(position)
            
            var positionAltitude=0.5;
            var positionCoordinates = mapboxgl.MercatorCoordinate.fromLngLat(position, positionAltitude)
            // console.log(positionCoordinates)
           
            
            pointArr.push(positionCoordinates.x,positionCoordinates.y,positionCoordinates.z)
            }

            // console.log(pointArr)
            var vertices = new Float32Array(pointArr);
            // console.log(vertices)
          
            // console.log(pointArr)
            var attribue = new THREE.BufferAttribute(vertices, 3)
            
            console.log(attribue)
            
            geometry.attributes.position = attribue;
            
            // var curveQuad = new THREE.QuadraticBezierCurve3(pointArr);

            // var tube = new THREE.TubeGeometry(curveQuad, 100, 0.5, 20, false);
            // var mesh = new THREE.Mesh(tube, new THREE.MeshNormalMaterial({
            //     opacity: 0.9,
            //     transparent: true
            // }));

            // console.log(mesh)
            var texture = new THREE.TextureLoader().load('tube.jpg');
            // var material = new THREE.MeshBasicMaterial( { map:texture } );
            var material = new THREE.LineBasicMaterial({
                color: 0xC0C0C0, 
                linewidth:1,
                linecap: 'round', //ignored by WebGLRenderer
                linejoin:  'round' //ignored by WebGLRenderer
            }); 
            var THREE = window.THREE;
            var line = new THREE.Line(geometry, material);

       

            // var pos1 = [77.04943656921385,
            //   28.48136644705929];
            // var pos1Altitude = 0;
            // var pos1Coordinate = mapboxgl.MercatorCoordinate.fromLngLat(pos1, pos1Altitude);
            // var pos2 = [ 77.05244064331055,
            //   28.476990674415823];
            // var pos2Altitude = 0;
            // var pos2Coordinate = mapboxgl.MercatorCoordinate.fromLngLat(pos2, pos2Altitude);
            // var pos3 = [ 77.0514965057373,
            //   28.476387105341445];
            // var pos3Altitude = 0;
            // var pos3Coordinate = mapboxgl.MercatorCoordinate.fromLngLat(pos3, pos3Altitude);
            // var pos4 = [  77.05020904541016,
            //   28.47661344414851];
            // var pos4Altitude = 0;
            // var pos4Coordinate = mapboxgl.MercatorCoordinate.fromLngLat(pos4, pos4Altitude);
            // var pos5 = [  77.04746246337889,
            //   28.474878167566974];
            // var pos5Altitude = 0;
            // var pos5Coordinate = mapboxgl.MercatorCoordinate.fromLngLat(pos5, pos5Altitude);
            // var pos6 = [   77.04514503479002,
            //   28.47721701192957];
            // var pos6Altitude = 0;
            // var pos6Coordinate = mapboxgl.MercatorCoordinate.fromLngLat(pos6, pos6Altitude);


        
            // var geometry = new THREE.BufferGeometry();
            // let pointArr = [];
            // // console.log(pos1Coordinate.x, pos1Coordinate.y, pos1Coordinate.z,
            // // pos2Coordinate.x,pos2Coordinate.y,pos2Coordinate.z)
            // // pointArr.push(pos1);
            // // pointArr.push(pos2)
            // pointArr.push(pos1Coordinate.x, pos1Coordinate.y, pos1Coordinate.z);
            // pointArr.push(pos2Coordinate.x,pos2Coordinate.y,pos2Coordinate.z)
            // pointArr.push(pos3Coordinate.x, pos3Coordinate.y, pos3Coordinate.z);
            // pointArr.push(pos4Coordinate.x, pos4Coordinate.y, pos4Coordinate.z);
            // pointArr.push(pos5Coordinate.x, pos5Coordinate.y, pos5Coordinate.z);
            // pointArr.push(pos6Coordinate.x, pos6Coordinate.y, pos6Coordinate.z);
            // var vertices = new Float32Array(pointArr);
            // console.log(vertices)
            // var attribue = new THREE.BufferAttribute(vertices, 3)
            // geometry.attributes.position = attribue;
            // console.log(attribue)

            // var material = new THREE.LineBasicMaterial({
            //     color: 0x000000, 
            //     linewidth: 2,  
            // }); 
            var THREE = window.THREE;
            var line = new THREE.Line(geometry, material);
             var customLayer = {
                id: '3d-model',
                type: 'custom',
                renderingMode: '3d',
                onAdd: function (map, gl) {
                    this.camera = new THREE.Camera();
                    this.scene = new THREE.Scene();

                    
                    var directionalLight = new THREE.DirectionalLight(0xffffff);
                    directionalLight.position.set(0, -70, 100).normalize();
                    this.scene.add(directionalLight);
                    this.scene.add(line);
                    // this.scene.add(mesh);
                    this.map = map;
                    // use the Mapbox GL JS map canvas for three.js
                    this.renderer = new THREE.WebGLRenderer({
                        canvas: map.getCanvas(),
                        context: gl,
                        antialias: true,
                    });

                    this.renderer.autoClear = false;
                },
                render: function (gl, matrix) {
                    var m = new THREE.Matrix4().fromArray(matrix);
                    this.camera.projectionMatrix = m;
                    this.renderer.state.reset();
                    this.renderer.render(this.scene, this.camera);
                    this.map.triggerRepaint();
                },
            };

            map.on('style.load', function () {
                map.addLayer(customLayer, 'waterway-label');
            });

            // var start = [77.04641103744507,
            //     28.476245643340768];
            // var startAltitude = 0;
            // var startCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(start, startAltitude);
            // console.log(startCoordinate);
            // var end = [ 77.04753756523132,
            //     28.4748310129142];
            // var endAltitude = 10;
            // var endCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(end, endAltitude);
            // console.log('end is ');
            // console.log(endCoordinate);
            // /* Since our 3D model is in real world meters, a scale transform needs to be
            //  * applied since the CustomLayerInterface expects units in MercatorCoordinates.
            //  */
            // var scale = modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()


           
            // var geometry = new THREE.BufferGeometry(); 
            // // let pointArr = [];
            // pointArr.push(startCoordinate.x, startCoordinate.y, startCoordinate.z);
            // pointArr.push(endCoordinate.x, endCoordinate.y, endCoordinate.z);
            // var vertices = new Float32Array(pointArr);
          
            // var attribue = new THREE.BufferAttribute(vertices, 3); 
          
            // geometry.attributes.position = attribue;
       
            // var material = new THREE.LineBasicMaterial({
            //     color: 0x0000ff, 
            //     linewidth: 120,
            //     // linecap: 'round', //ignored by WebGLRenderer
            //     // linejoin: 'round', //ignored by WebGLRenderer
                
            // });