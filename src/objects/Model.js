
import { useGLTF } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'


const sunPos = [500, 0, 0]
const orbitSpeed = 0.5
const rotationSpeed = orbitSpeed * 365
function Model(props) {
    const model = useGLTF(props.path)
    const meshRef = useRef();
    const [theta, setTheta] = useState(0)
    useFrame((state, delta) => {
	})
    return (
        <primitive
        ref = {meshRef}
        scale={props.scale}
        rotation = {props.rotation}
        position = {props.position}
        object={model.scene} />
    )
        

    
}

export default Model;