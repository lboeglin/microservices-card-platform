/**
 * A stylized button with variants.
 * @example
 * <Button href="/home">
 * 	Go back to Home Page
 * </Button>
 */
const Button = ({ href, children, variant = 'normal' }) => {
	return <a
		href={href}
		className={
			variant ==
				'golden' ?
				"inline-block bg-gradient-to-r from-orange-300 to-yellow-500 text-cyan-950 hover:from-amber-800 hover:to-yellow-700 hover:text-amber-50 transition-colors rounded-2xl w-fit self-center p-3 border border-amber-700/30 hover:border-orange-100/70 cursor-pointer" :
				"inline-block bg-gradient-to-r from-blue-300 to-fuchsia-300 text-cyan-950 hover:from-teal-700 hover:to-sky-800 hover:text-amber-50 transition-colors rounded-2xl w-fit self-center p-3 border border-emerald-700/30 hover:border-blue-300/70 cursor-pointer"
		}
	>
		{children}
	</a>
}

export default Button