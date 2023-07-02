import { useRef } from 'react';
import { extend, useFrame} from '@react-three/fiber';
import {shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'


const PortalMaterial = shaderMaterial(
    {
		uTime: 0,
		uSpeedMult: 0.5
	},
	glsl`
		precision mediump float;
		varying vec2 vUv;
		uniform float uTime;
		varying float vZ;
		// #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

		void main() {
		
			vec3 pos = position;
			float extent = 1.0;
			vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
			// modelPosition.y += sin(modelPosition.x * 1.0 + uTime) * extent;
			// modelPosition.y += sin(modelPosition.z * 1.0 + uTime) * extent;
			
			// vZ = ((modelPosition.y - 100.0) / (1.0 * extent) - 0.9);
			vec4 viewPosition = viewMatrix * modelPosition;
			vec4 projectedPosition = projectionMatrix * viewPosition;
		  
			gl_Position = projectedPosition;
			
			vUv = uv;
		}
	`,
	glsl`
		varying vec2 vUv;
		uniform float uTime;
		uniform float uSpeedMult;
		void main() {
			vec2 fv_s = vUv * 100.0;
			vec2 fv = fract(vec2(fv_s.x + sin(uTime * .05) * 10.0, fv_s.y + cos(uTime * .05) * 10.0) * .5);
			
			vec3 circle = vec3(1.0 - smoothstep(length(fv - .25), .0, (sin(vUv.x * 90.0) * cos(vUv.y * 90.0)) * .01));
			vec3 col = vec3(fv, .0);
			float redSpeed = 1.0 * uSpeedMult;
			float greenSpeed = 2.0 * uSpeedMult;
			float blueSpeed = 4.0 * uSpeedMult;
			float red = (sin(uTime * redSpeed) + 1.0) * 0.5;
			float green = (sin(uTime * greenSpeed) + 1.0) * 0.5;
			float blue = (sin(uTime * blueSpeed) + 1.0) * 0.5;
			gl_FragColor = vec4(circle * vec3(red, green, blue), 1.0);
		}
	`
)

extend({ PortalMaterial })

const StarryNight = () => {
    return (
		<group>
			<Space />
			{/* <MainStars /> */}
			
		</group>
		
        
        );
    };
const Space = (props) => {
	const ref = useRef();
	useFrame(({clock}) => {
		ref.current.uTime = 1 * clock.getElapsedTime()
	})
	return (
		<mesh rotation={[0, 0, 0]} position = {[500, 0, 0]}>
			<sphereGeometry 
			
			attach="geometry" args={[4000, 40, 40]} />
			<portalMaterial 
			ref = {ref} 
			side={THREE.DoubleSide} 
			uColor = 'black'
			
			/>        

		</mesh>
	)
}

export default StarryNight;


/*
------------fragment shader space example-------------
		precision mediump float;
		uniform float uTime;
		varying vec2 vUv;

		float random(vec2 fv, float d1, float d2, float r) {
			return fract(sin(dot(fv, vec2(d1, d2))) * r);
		}
		
		void main() {
			vec2 uvExtra = vUv;
			vec2 sv = uvExtra + uTime * .0005;
			
			vec2 iv = floor(sv * 500.0);
			vec2 iv2 = floor(sv * 300.0);
			vec2 iv3 = floor(sv * 400.0);
			
			vec3 cell_noise1 = vec3(random(iv, 12.0, 80.0, 4000.0));
			vec3 cell_noise2 = vec3(random(iv2, 12.333, 13.0, 5000.0));
			vec3 cell_noise3 = vec3(random(iv3, 90.4325, 12.0, 2000.0));
			vec3 cell_noise = ((cell_noise1 + cell_noise2 + cell_noise3) * .3333 - .9) * 10.0;
			
			vec2 fv_s = uvExtra * 20.0;
			vec2 fv = fract(vec2(fv_s.x + sin(uTime * .005) * 10.0, fv_s.y + cos(uTime * .005) * 10.0) * .5);
			vec3 circle = vec3(1.0 - smoothstep(length(fv - .25), .0, (sin(uvExtra.x * 40.0) * cos(uvExtra.y * 50.0)) * .015));
			
		
			gl_FragColor = vec4(circle + clamp(cell_noise, .0, 1.0),1.0);
		}
----------fragment shader coding example-------------------
		precision mediump float;
		uniform float uTime;
		varying vec2 vUv;

		vec3 palette( float t ) {
			vec3 a = vec3(0.5, 0.5, 0.5);
			vec3 b = vec3(0.5, 0.5, 0.5);
			vec3 c = vec3(1.0, 1.0, 1.0);
			vec3 d = vec3(0.263,0.416,0.557);
		
			return a + b*cos( 6.28318*(c*t+d) );
		}		
		void main() {
			vec2 uvExtra = vUv;
			vec2 uv0 = vUv;
			
			vec3 finalColor = vec3(0.0);
			
			for (float i = 0.0; i < 4.0; i++) {
				uvExtra = fract(uvExtra * 1.5) - 0.5;

				float d = length(uvExtra) * exp(-length(uv0));

				vec3 col = palette(length(uv0) + i*.4 + uTime*.4);

				d = sin(d*8. + uTime)/8.;
				d = abs(d);

				d = pow(0.01 / d, 1.2);

				finalColor += col * d;
			}
				
			gl_FragColor = vec4(finalColor, 1.0);
		}
-------------- fragment shader night sky example ------------------
		precision mediump float;
		uniform float uTime;
		varying vec2 vUv;

		float rand(vec2 co)
		{
			return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
		}

		void main()
		{
			float size = 30.0;
			float prob = 0.95;
			
			vec2 pos = floor(1.0 / size * vUv.xy);
			
			float color = 0.0;
			float starValue = rand(pos);
			
			if (starValue > prob)
			{
				vec2 center = size * pos + vec2(size, size) * 0.5;
				
				float t = 0.9 + 0.2 * sin(uTime + (starValue - prob) / (1.0 - prob) * 45.0);
						
				color = 1.0 - distance(vUv.xy, center) / (0.5 * size);
				color = color * t / (abs(vUv.y - center.y)) * t / (abs(vUv.x - center.x));
			}
			else if (rand(vUv.xy) > 0.996)
			{
				float r = rand(vUv.xy);
				color = r * (0.25 * sin(uTime * (r * 5.0) + 720.0 * r) + 0.75);
			}
			
			gl_FragColor = vec4(vec3(color), 1.0);
		}
----------------fragment sparkly------------------
		varying vec2 vUv;	

		mat3 rotationMatrix(vec3 axis, float angle)
		{
			axis = normalize(axis);
			float s = sin(angle);
			float c = cos(angle);
			float oc = 1.0 - c;

			return mat3(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
				oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s,
				oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c);
		}


		float hash( float n ){
			return fract(sin(n)*758.5453);
		}

		float configurablenoise(vec3 x, float c1, float c2) {
			vec3 p = floor(x);
			vec3 f = fract(x);
			f       = f*f*(3.0-2.0*f);

			float h2 = c1;
			float h1 = c2;
			#define h3 (h2 + h1)

			float n = p.x + p.y*h1+ h2*p.z;
			return mix(mix(	mix( hash(n+0.0), hash(n+1.0),f.x),
					mix( hash(n+h1), hash(n+h1+1.0),f.x),f.y),
				mix(	mix( hash(n+h2), hash(n+h2+1.0),f.x),
					mix( hash(n+h3), hash(n+h3+1.0),f.x),f.y),f.z);

		}

		float supernoise3dX(vec3 p){

			float a =  configurablenoise(p, 883.0, 971.0);
			float b =  configurablenoise(p + 0.5, 113.0, 157.0);
			return (a * b);
		}

		float fbmHI2d(vec2 p, float dx){
		// p *= 0.1;
			p *= 1.2;
			//p += getWind(p * 0.2) * 6.0;
			float a = 0.0;
			float w = 1.0;
			float wc = 0.0;
			for(int i=0;i<5;i++){
				//p += noise(vec3(a));
				a += clamp(2.0 * abs(0.5 - (supernoise3dX(vec3(p, 1.0)))) * w, 0.0, 1.0);
				wc += w;
				w *= 0.5;
				p = p * dx;
			}
			return a / wc;// + noise(p * 100.0) * 11;
		}

		float stars(vec2 seed, float intensity){
			return smoothstep(1.0 - intensity*0.9, (1.0 - intensity *0.9)+0.1, supernoise3dX(vec3(seed * 500.0, 0.0)) * (0.8 + 0.2 * supernoise3dX(vec3(seed * 40.0, 0.0))));
		}
		vec3 stars(vec2 uv0){
			float intensityred = (1.0 / (1.0 + 30.0 * abs(uv0.y))) * fbmHI2d(uv0 * 30.0, 3.0) * (1.0 - abs(uv0.x ));	
			float intensitywhite = (1.0 / (1.0 + 20.0 * abs(uv0.y))) * fbmHI2d(uv0 * 30.0 + 120.0, 3.0) * (1.0 - abs(uv0.x ));	
			float intensityblue = (1.0 / (1.0 + 20.0 * abs(uv0.y))) * fbmHI2d(uv0 * 30.0 + 220.0, 3.0) * (1.0 - abs(uv0.x ));	
			float galaxydust = smoothstep(0.1, 0.5, (1.0 / (1.0 + 20.0 * abs(uv0.y))) * fbmHI2d(uv0 * 20.0 + 220.0, 3.0) * (1.0 - abs(uv0.x )));	
			float galaxydust2 = smoothstep(0.1, 0.5, (1.0 / (1.0 + 20.0 * abs(uv0.y))) * fbmHI2d(uv0 * 50.0 + 220.0, 3.0) * (1.0 - abs(uv0.x )));	
			intensityred = 1.0 - pow(1.0 - intensityred, 3.0) * 0.73;
			intensitywhite = 1.0 - pow(1.0 - intensitywhite, 3.0) * 0.73;
			intensityblue = 1.0 - pow(1.0 - intensityblue, 3.0) * 0.73;
			float redlights = stars(uv0, intensityred );
			float whitelights = stars(uv0, intensitywhite );
			float bluelights = stars(uv0, intensityblue );
			vec3 starscolor = vec3(1.0, 0.8, 0.5) * redlights + vec3(1.0) * whitelights + vec3(0.6, 0.7, 1.0) * bluelights;
			vec3 dustinner = vec3(0.9, 0.8, 0.8);
			vec3 dustouter = vec3(0.2, 0.1, 0.0);
			vec3 innermix = mix(dustinner, starscolor, 1.0 - galaxydust);
			vec3 allmix = mix(dustouter, innermix, 1.0 - galaxydust2);
			vec3 bloom = 1.6 * dustinner * (1.0 / (1.0 + 30.0 * abs(uv0.y))) * fbmHI2d(uv0 * 3.0, 3.0) * (1.0 - abs(uv0.x ));	
			return allmix + bloom;
		}

		vec3 milkyway(vec2 uv0){
			return stars(uv0);
		}

		void main()
		{
			vec2 uvExtra = vUv;
			uvExtra = uvExtra * 2.0 - 1.0;
			uvExtra *= 0.5;
			
			vec2 pos = (rotationMatrix(vec3(0.0, 0.0, 1.0), 0.2415) * vec3(uvExtra.x, uvExtra.y, 0.0)).xy;
			gl_FragColor = vec4(milkyway(pos),1.0);
		}
------- fragment night sky simple --------
varying vec2 vUv;
uniform float uTime;
void main() {
    vec2 uvExtra = vUv;
    vec2 fv_s = vUv * 20.0;
    vec2 fv = fract(vec2(fv_s.x + sin(uTime * .05) * 10.0, fv_s.y + cos(uTime * .05) * 10.0) * .5);
    
    vec3 circle = vec3(1.0 - smoothstep(length(fv - .25), .0, (sin(vUv.x * 40.0) * cos(vUv.y * 50.0)) * .015));
    vec3 col = vec3(fv, .0);

    gl_FragColor = vec4(circle,1.0);
}
*/