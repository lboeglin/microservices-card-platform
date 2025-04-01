"use client"
import Image from "next/image"
import { useState } from "react"

export default ({ rarity, artwork }) => {
	const [tilt, setTilt] = useState({ x: 0, y: 0 })
	const card = (
		<div
			style={{
				transform: `rotate3D(${-tilt.y
					}, ${tilt.x}, 0, 17deg)`,
			}}
			onMouseMove={(e) => {
				const x = e.clientX - e.currentTarget.offsetLeft - e.currentTarget.offsetWidth / 2
				const y = e.clientY - e.currentTarget.offsetTop - e.currentTarget.offsetHeight / 2
				setTilt({ x: x, y: y })
			}}
			onMouseLeave={(e) => { setTilt({ x: 0, y: 0 }) }}
			className={"w-34 h-52 border-4 border-gray-600 bg-gray-600 rounded grid grid-cols-1 grid-rows-2 shadow hover:z-10 ease-out duration-400 transition-all hover:scale-[1.10] card"}>
			<Image className="object-cover w-full h-full rounded" src={artwork} />
			<div className="m-1">
				<h1 className="font-bold">
					Ichika {"⭐".repeat(rarity + 1 || 1)}
				</h1>
			</div>
		</div>
	)
	return card
}