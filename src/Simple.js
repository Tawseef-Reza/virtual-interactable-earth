import './Simple.css';
import Model from './objects/Model'
import Earth from './objects/Earth';
import EarthExtra from './objects/EarthExtra';
import Cursor from './objects/Cursor';
import StarryNight from './objects/StarryNight';
import Sun from './objects/Sun'
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls} from "@react-three/drei";
import { useEffect, useState } from "react";
import { TextField, Button } from '@mui/material';
import PolarToCartesian from './util/PolarToCartesian';
import { PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
var RAD2DEG = 180 / Math.PI
var DEG2RAD = Math.PI / 180
const EARTH_SCALE = 1;
const CURSOR_SCALE = 1.2;
function Simple() {
	
	const [lonInput, setLonInput] = useState('')
	const [latInput, setLatInput] = useState('')

	const [lonLatSub, setLonLatSub] = useState([0, 0])
	const [isFree, setIsFree] = useState(true)
	const cameraSpring = useSpring({
		position: Object.values(PolarToCartesian(lonLatSub[0], lonLatSub[1], 100 * EARTH_SCALE))
	})
	const cursorSpringPos = useSpring({
		position: (() => {
			let arr = Object.values(PolarToCartesian(lonLatSub[0], lonLatSub[1], 26 * EARTH_SCALE))
			const offset = 3
			if (lonLatSub[1] > 0) {
				arr[1] += offset
			}
			else {
				arr[1] -= offset
			}
			return arr
		})(),
	})
	const lightSpringPos = useSpring({
		position: (() => {
			let arr = Object.values(PolarToCartesian(lonLatSub[0], lonLatSub[1], 30 * EARTH_SCALE))
			const offset = 3
			if (lonLatSub[1] > 0) {
				arr[1] += offset
			}
			else {
				arr[1] -= offset
			}
			return arr
		})(),
	})

	const cursorSpringRot = useSpring({
		rotation: [lonLatSub[1] > 0 ? 0 : Math.PI, 0, 0],
		config: {
			friction: 30
		}
	})

	
	return (
		<div className="App">
		<div className='input-field'>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-md-12 p-0'>
					<ul className="list-group">
						<li className="list-group-item">{`Longitude: ${-lonLatSub[0]}`}</li>
						<li className="list-group-item">{`Latitude: ${lonLatSub[1]}`}</li>
					</ul>
					</div>
				</div>
				
				<div className='row'>
					<div className='col-md-12 p-0'>
						<TextField 
						value={lonInput}
						className='lon'  
						placeholder='Enter Longitude'
						onChange={(e) => {
							setLonInput(e.target.value)
						}}>
						</TextField>
						
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12 p-0'>
						<TextField 
						value={latInput}
						className='lat' 
						placeholder='Enter Lat'
						onChange={(e) => {
							setLatInput(e.target.value)
						}}>
						</TextField>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12 p-0'>
						<Button
						onClick={() => {
							if (lonInput !== '' && latInput !== '') {
								setLonLatSub([-parseInt(lonInput), parseInt(latInput)])
								setLonInput('')
								setLatInput('')
							}
							
						}}
						>
							Submit
						</Button>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12 p-0'>
						<Button
						onClick={() => {
							setIsFree(val => !val)
						}}
						>
							{`Toggle FreeMove: ${isFree}`}
						</Button>
					</div>
				</div>
			</div>
		</div>
		
		
		

		<Canvas >
			<StarryNight />
			{
			isFree ? 
				<PerspectiveCamera
				makeDefault
				position={[0, 0 , -100 * EARTH_SCALE]}
				fov={60}
				zoom={1.0}
				far = {8000}
				/>
				:
				<animated.group position={cameraSpring.position}>
					<PerspectiveCamera
					makeDefault
					fov={60}
					zoom={1.0}
					far = {8000}
					/>
				</animated.group>
			}
			<OrbitControls target={[0, 0, 0]}/>
			<Cursor path = 'models/cursor.gltf' 
			position = {cursorSpringPos.position}
			scale = {CURSOR_SCALE}
			rotation = {cursorSpringRot.rotation}/>

			{<animated.pointLight 
			position={lightSpringPos.position}
			intensity={1.0} 
			/> 
			}
			
			<EarthExtra
			rotating = {false}
			setLonLatSub = {setLonLatSub} 
			path = 'models/earth.gltf' 
			position = {[0, 0, 0]} 
			
			rotation = {[0, Math.PI * 3 / 2, 0]}
			scale={EARTH_SCALE}/>
			
			<axesHelper scale={100} /> 
			<ambientLight color={'#a0f2a5'} intensity={0.3} />
			
			
		</Canvas>
    	</div>
	);
}

export default Simple;

  
