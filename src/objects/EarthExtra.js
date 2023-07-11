
import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import CartesianToPolar from '../util/CartesianToPolar'

const sunPos = [500, 0, 0]
const orbitSpeed = 0.5
const rotationSpeed = orbitSpeed * 365
function EarthExtra(props) {
    const { nodes, materials } = useGLTF(props.path);
    const meshRef = useRef();
    useEffect(() => {
        console.log(nodes);
        console.log('----------------');
        console.log(materials);
    }, [])
    const [theta, setTheta] = useState(0)
    useFrame((state, delta) => {
        if (props.rotating) {
            meshRef.current.rotation.y += delta * rotationSpeed
            setTheta((val) => {
                return val + delta * orbitSpeed
            })
            const xPos = sunPos[0] * Math.cos(theta)
            const yPos = sunPos[0] * Math.sin(theta)
            meshRef.current.position.z = yPos
            meshRef.current.position.x = sunPos[0] - xPos
        }
        else  { 
            meshRef.current.rotation.y = Math.PI * 3 / 2
            meshRef.current.position.x = meshRef.current.position.y =
            meshRef.current.position.z = 0;
        }
	})
    
    return (
         
        <group 
        onClick= {(e) => {
            props.setLonLatSub(CartesianToPolar(e.point, 28))
            }
        }
        ref = {meshRef}
        scale={props.scale}
        rotation = {props.rotation}
        position = {props.position}dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Earth.geometry}
                material={materials.Mat}
            />
        </group>
    )

    
}

export default EarthExtra;