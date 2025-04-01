import { useState } from "react"

export const Rarity = {
	COMMON: 0,
	UNCOMMON: 1,
	RARE: 2,
	SUPER_RARE: 3
}

export default ({ name = 'Unnamed', rarity = Rarity.COMMON, artwork = '', goofy = false }) => {
	const [tilt, setTilt] = useState({ x: 0, y: 0 })
	const height = 290
	const width = 180
	const light = { x: -1, y: -1 }
	const card = (
		<div
			style={goofy ? {
				width: `${width}px`,
				height: `${height}px`,
				transform: `rotate3D(${-tilt.y
					}, ${tilt.x}, 0, ${17 * (Math.sqrt(tilt.x ** 2 + tilt.y ** 2))}deg)`,
			} : {
				width: `${width}px`,
				height: `${height}px`,
				transform: `perspective(120rem) rotate3D(${-tilt.y
					}, ${tilt.x}, 0, ${Math.sqrt(tilt.x ** 2 + tilt.y ** 2) / 7}deg)`,
				transformStyle: 'preserve-3d',
				boxShadow: `${(tilt.x * 10) / width / 2}px ${(tilt.y * 10) / height / 2}px 10px #000000a2`
			}}
			onMouseMove={(e) => {
				const rect = e.currentTarget.getBoundingClientRect()
				let x = e.clientX - rect.left - e.currentTarget.offsetWidth / 2
				let y = e.clientY - rect.top - e.currentTarget.offsetHeight / 2
				setTilt({ x: x, y: y })
			}}
			onMouseLeave={(e) => { setTilt({ x: 0, y: 0 }) }}
			className={"relative bg-blue-400 text-white text-center rounded flex flex-col hover:z-10 ease-out duration-400 transition-all hover:scale-[1.10]"}>
			<img className="object-cover w-full h-full rounded flex-grow" src={artwork} />
			<div className="m-1">
				<h1 className="font-bold">
					{name}
					<br />
					{"⭐".repeat(rarity + 1 || 1)}
				</h1>
				<div
					style={{
						background: '#ffffffa0',
						opacity: Math.max(light.x * tilt.x / width / 2 + light.y * tilt.y / height / 2, 0),
						//background: `radial-gradient(circle at ${(tilt.x + width / 2) / width * 100}% ${(tilt.y + height / 2) / height * 100}%, #ffffff2a 0%, #ffffff02 100%)`,
						mixBlendMode: 'color-dodge'
					}}
					className="absolute top-0 left-0 w-full h-full ease-out transition-opacity">
				</div>
			</div>
		</div >
	)
	return card
}