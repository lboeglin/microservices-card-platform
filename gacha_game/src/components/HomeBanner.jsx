'use strict'

const HomeBanner = ({ image, title, description }) => {
	return (
		<div class="relative w-full h-64 my-2 p-8 rounded-4xl overflow-clip flex flex-col justify-center items-center text-center hover:*:scale-120 *:transition-transform">
			<h1 class="text-4xl font-black drop-shadow-md">{title}</h1>
			<b>{description}</b>
			<img src={image} alt="" class="absolute top-0 left-0 w-full h-full object-cover blur brightness-50 -z-10" />
		</div>
	)
}
export default HomeBanner;