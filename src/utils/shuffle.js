export function shuffle(array) {
	return array.sort(() => (Math.random() > Math.random() ? 1 : -1));
}
