import { useState } from "react"
import Card from "./Card"
import Button from "./Button"

const Inventory = ({ cards }) => {
	const [currentPage, setPage] = useState(0)
	const pagesAmount = Math.floor(cards.length / 40)

	const shownCards = cards.slice(currentPage * 40, currentPage * 40 + 40)

	return (
		<div>
			<div class="flex flex-wrap w-full gap-2 justify-center">
				{
					shownCards.map((card) => {
						return <Card name={card.name} artwork={card.image} rarity={card.rarity} />
					})
				}
			</div>
			<div className="flex flex-row flex-wrap justify-center mt-4">
				{
					Array.from(Array(pagesAmount).keys()).map((page) => {
						return <Button className="w-20" action={() => { setPage(page) }}>{page}</Button>
					})
				}
			</div>
		</div>
	)
}

export default Inventory