/**
 * Contains general configuration values.
 */
const Config = {
	/**
	 * Contains all the endpoints from which we are going to fetch data.
	 */
	sources: {
		images: [
			{
				single_image_src: "https://api.thecatapi.com/v1/images/search", // Path to the image fetching endpoint.
				multiple_images_src: "https://api.thecatapi.com/v1/images/search",
				multiple_images_param: "limit",
				api_param: "api_key",
				api_key: "",
				src_path: "url",
				cdn_root: "", // The root path to where the images are stored in case we are given a relative path.
				source_type: "cat"
			}
		],
		names: [
			{
				single_name_src: "https://randommer.io/api/Name?nameType=firstname&quantity=1", // Path to the name fetching endpoint.
				multiple_names_src: "https://randommer.io/api/Name?nameType=firstname",
				multiple_names_param: "quantity",
				api_param: "",
				api_key: "",
				src_path: "url",
			}
		]
	},
	maxAmountOfStoredCards: 10000
}

export default Config;