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
				transform: `perspective(500px) rotate3D(${-tilt.y
					}, ${tilt.x}, 0, ${Math.sqrt(tilt.x ** 2 + tilt.y ** 2) / 10}deg)`,
				transformStyle: 'preserve-3d',
				boxShadow: `${(tilt.x * 20) / width / 2}px ${(tilt.y * 20) / height / 2}px 8px #00000042`
			}}
			onMouseMove={(e) => {
				const rect = e.currentTarget.getBoundingClientRect()
				let x = e.clientX - rect.left - e.currentTarget.offsetWidth / 2
				let y = e.clientY - rect.top - e.currentTarget.offsetHeight / 2
				setTilt({ x: x, y: y })
			}}
			onMouseLeave={(e) => { setTilt({ x: 0, y: 0 }) }}
			className={"relative bg-blue-400 text-white text-center rounded flex flex-col hover:z-10 ease-out duration-400 transition-all hover:scale-[1.10]"}>
			<img className="object-cover object-top w-full h-full rounded" src={artwork} />
			<div className="absolute left-0 bottom-0 backdrop-blur-lg rounded-b bg-slate-800/75 text-center w-full p-2">
				<h1 className="font-bold">
					{name}
					<br />
					{"⭐".repeat(rarity + 1 || 1)}
				</h1>
			</div>
			<div
				style={{
					//background: '#ffffffa0',
					opacity: Math.max(Math.abs(tilt.x) / (width / 2), Math.abs(tilt.y) / (height / 2)),
					background: `radial-gradient(circle at ${(tilt.x + width / 2) / width * 100}% ${(tilt.y + height / 2) / height * 100}%, #ffffff2a 0%, #ffffff12 100%)`,
					mixBlendMode: 'lighten'
				}}
				className="absolute top-0 left-0 w-full h-full ease-out transition-opacity">
			</div>
		</div >
	)
	return card
}