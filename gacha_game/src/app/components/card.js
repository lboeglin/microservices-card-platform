"use client"
import Image from "next/image"
import { useState } from "react"

/**
 * 
 * @param {MouseEvent} event 
 * @param {Function} callable 
 */
const hoverEffect = (event, originalTilt, callable) => {
	console.log(event)
	let x = event.clientX - window.innerWidth / 2
	let y = event.clientY - window.innerHeight / 2
	callable({ x: x, y: y })
}

export default ({ rarity, artwork }) => {
	const [tilt, setTilt] = useState({ x: 0, y: 0 })
	const card = (
		<div
			style={{
				transform: `rotate3D(${-tilt.y}, ${tilt.x}, 0, 17deg)`,
			}}
			onMouseMove={(e) => { hoverEffect(e, tilt, setTilt) }}
			onMouseLeave={(e) => { setTilt({ x: 0, y: 0 }) }}
			className={"w-34 h-52 border-4 border-gray-600 bg-gray-600 rounded grid grid-cols-1 grid-rows-2 shadow hover:z-10 card"}>
			<Image className="object-cover w-full h-full rounded" src={artwork} />
			<div className="m-1">
				<h1 className="font-bold">
					Ichika
				</h1>
				<p>
					The best character in the
					world
				</p>
			</div>
		</div>
	)
	return card
}