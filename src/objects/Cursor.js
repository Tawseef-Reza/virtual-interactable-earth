
import { useGLTF } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { animated } from '@react-spring/three'

const orbitSpeed = 0.5
function Cursor(props) {
    const model = useGLTF(props.path)
    const meshRef = useRef();
    const [theta, setTheta] = useState(0)
    useFrame((state, delta) => {

	})
    
    return (
        <animated.primitive
        ref = {meshRef}
        scale={props.scale}
        rotation = {props.rotation}
        position = {props.position}
        object={model.scene} />
        )

    
}

export default Cursor;