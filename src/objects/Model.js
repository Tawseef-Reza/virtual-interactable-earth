
import { useGLTF } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { animated } from '@react-spring/three'
import CartesianToPolar from '../util/CartesianToPolar'
import { Vector3 } from 'three'

const sunPos = [500, 0, 0]
const orbitSpeed = 0.5
const rotationSpeed = orbitSpeed * 365
function Model(props) {
    const model = useGLTF(props.path)
    const meshRef = useRef();
    const [theta, setTheta] = useState(0)
    useFrame((state, delta) => {
        if (props.path === 'models/earth.gltf' && props.rotating) {
            meshRef.current.rotation.y += delta * rotationSpeed
            setTheta((val) => {
                return val + delta * orbitSpeed
            })
            const xPos = sunPos[0] * Math.cos(theta)
            const yPos = sunPos[0] * Math.sin(theta)
            meshRef.current.position.z = yPos
            meshRef.current.position.x = sunPos[0] - xPos
        }
        else if (props.path === 'models/earth.gltf' && !props.rotating) { 
            meshRef.current.rotation.y = Math.PI * 3 / 2
            meshRef.current.position.x = meshRef.current.position.y =
            meshRef.current.position.z = 0;
        }
	})
    if (props.path === 'models/cursor.gltf') {
        return (
            <animated.primitive
            ref = {meshRef}
            scale={props.scale}
            rotation = {props.rotation}
            position = {props.position}
            object={model.scene} />
            )
    }
    else {
        return (
            <primitive
            onClick= {(e) => {
                    props.setLonLatSub(CartesianToPolar(e.point, 28))
                }
            }
            ref = {meshRef}
            scale={props.scale}
            rotation = {props.rotation}
            position = {props.position}
            object={model.scene} />   
        )
    }
    
}

export default Model;