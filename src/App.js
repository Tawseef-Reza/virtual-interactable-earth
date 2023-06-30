import './App.css';
import CustomCamera from './objects/CustomCamera';
import Model from './objects/Model'
import StarryNight from './objects/StarryNight';
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls} from "@react-three/drei";
import { useState } from "react";
import { TextField, Button } from '@mui/material';
import PolarToCartesian from './util/PolarToCartesian';
import { PerspectiveCamera } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
var RAD2DEG = 180 / Math.PI
var DEG2RAD = Math.PI / 180
const EARTH_SCALE = 1;
const CURSOR_SCALE = 1.2;
function App() {
	
	const [lonInput, setLonInput] = useState('')
	const [latInput, setLatInput] = useState('')

	const [currentRot, setCurrentRot] = useState(0)
	const [lonLatSub, setLonLatSub] = useState([0, 0])
	const [isFree, setIsFree] = useState(true)
	const [sun, setSun] = useState(true);
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
						<li className="list-group-item">{`Longitude: ${lonLatSub[0]}`}</li>
						<li className="list-group-item">{`Latitude: ${lonLatSub[1]}`}</li>
					</ul>
					</div>
				</div>
				
				<div className='row'>
					<div className='col-md-12 p-0'>
						<TextField 
						value={lonInput}
						className='lon'  
						placeholder='Enter Longitude (positive west, negative east'
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
						placeholder='Enter Lat (positive north, negative south)'
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
								setLonLatSub([parseInt(lonInput), parseInt(latInput)])
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
							if (!sun)
							setIsFree(val => !val)
						}}
						>
							{`Toggle FreeMove: ${isFree}`}
						</Button>
					</div>
				</div>
				<div className='row'>
					<div className='col-md-12 p-0'>
						<Button
						onClick={() => {
							setSun(val => !val)
							setIsFree(true)
						}}
						>
							{`Toggle Sun: ${sun}`}
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
				position={sun ? [0,500,-500 ] : [0, 0 , -100 * EARTH_SCALE]}
				fov={60}
				zoom={1.0}
				far = {6000}
				/>
				:
				<animated.group position={cameraSpring.position}>
					<PerspectiveCamera
					makeDefault
					fov={60}
					zoom={1.0}
					far = {6000}
					/>
				</animated.group>
			}
			{/* : [0, 0, -100 * EARTH_SCALE]} */ }
			<OrbitControls target={sun ? [500, 0, 0] : [0, 0, 0]}/>
			<Model path = 'models/cursor.gltf' 
			position = {cursorSpringPos.position}
			scale = {CURSOR_SCALE}
			rotation = {cursorSpringRot.rotation}/>

			{sun ? 
			null 
			:
			<animated.pointLight 
			position={lightSpringPos.position}
			intensity={1.0} 
			/> 
			}
			
			<Model 
			rotating = {sun}
			setLonLatSub = {setLonLatSub} 
			path = 'models/earth.gltf' 
			position = {[0, 0, 0]} 
			currentRot = {currentRot}
			rotation = {[0, Math.PI * 3 / 2, 0]}
			scale={EARTH_SCALE}/>
			
			<axesHelper scale={100} /> 
			{sun ? 
			<mesh scale={EARTH_SCALE * 40} position={[500, 0, 0]}>
				<pointLight intensity={0.8}/>

				<sphereGeometry attach={'geometry'}/>
				<meshBasicMaterial color={'#d9b541'} attach={'material'}/>
			</mesh>
			:
			<ambientLight color={'#a0f2a5'} intensity={0.3} />
			}
			
			{/*  */}
			
		</Canvas>
    	</div>
	);
}

export default App;

  
