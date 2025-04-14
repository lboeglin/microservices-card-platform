/**
 * A stylized button with variants.
 * @example
 * <Button action="/home">
 * 	Go back to Home Page
 * </Button>
 */
const Button = ({ action = "#", children, variant = 'normal', title = "" }) => {
	return <form action={action}>
		<button title={title} type="submit"
			className={
				variant == 'golden' ?
					"inline-block bg-gradient-to-r from-orange-300 to-yellow-500 text-cyan-950 hover:from-amber-800 hover:to-yellow-700 hover:text-amber-50 transition-colors rounded-2xl w-fit self-center p-3 border border-amber-700/30 hover:border-orange-100/70 cursor-pointer hover:shadow-xl shadow-amber-300/40" :
					variant == 'dangerous' ?
						"inline-block bg-gradient-to-r from-blue-300 to-fuchsia-300 text-cyan-950 hover:from-rose-700 hover:to-red-700 hover:text-amber-50 transition-colors rounded-2xl w-fit self-center p-3 border border-emerald-700/30 hover:border-blue-300/70 cursor-pointer" :
						"inline-block bg-gradient-to-r from-blue-300 to-fuchsia-300 text-cyan-950 hover:from-teal-700 hover:to-sky-800 hover:text-amber-50 transition-colors rounded-2xl w-fit self-center p-3 border border-emerald-700/30 hover:border-blue-300/70 cursor-pointer"
			}
		>
			{children}
		</button></form>
}

export default Button