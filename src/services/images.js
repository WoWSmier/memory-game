export function getImages() {
	return [...new Array(8)].map((image, index) => `/images/${index}.png`);
}
