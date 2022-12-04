<script>
	import { onMount } from 'svelte';

	import { getImages } from '@services/images';
	import { shuffle } from '@utils/shuffle';
	import { doubleDigit } from '@utils/digit';

	const tiles = (() => {
		const images = getImages().map((image, index) => ({
			image,
			id: index
		}));

		return shuffle([...images, ...images]);
	})();

	let visibleTiles = [];
	let faceUpTiles = [];

	let onCooldown = false;

	const startDate = new Date();
	let date = new Date();
	let updateDateAnimation = null;

	function isReversed(index, visibleTiles, faceUpTiles) {
		return !(visibleTiles.includes(index) || faceUpTiles.includes(tiles[index].id));
	}

	$: showTile = (index) => {
		if (!isReversed(index, visibleTiles, faceUpTiles) || onCooldown) {
			return;
		}

		visibleTiles.push(index);
		visibleTiles = visibleTiles;

		if (visibleTiles.length === 2) {
			if (tiles[visibleTiles[0]].id === tiles[index].id) {
				faceUpTiles.push(tiles[index].id);
				faceUpTiles = faceUpTiles;

				visibleTiles = [];
			} else {
				onCooldown = true;

				setTimeout(() => {
					onCooldown = false;
					visibleTiles = [];
				}, 1000);
			}
		}

		if (faceUpTiles.length === tiles.length / 2) {
			cancelAnimationFrame(updateDateAnimation);
		}
	};

	function updateDate() {
		date = new Date();

		updateDateAnimation = requestAnimationFrame(updateDate);
	}

	function getTime(date) {
		const time = new Date(date.getTime() - startDate.getTime());

		const minutes = doubleDigit(time.getMinutes());
		const seconds = doubleDigit(time.getSeconds());

		return `${minutes}:${seconds}`;
	}

	onMount(() => {
		updateDateAnimation = requestAnimationFrame(updateDate);
	});
</script>

<div class="page">
	<hr />
	<header>Memory Game</header>
	<main>
		<div class="tiles">
			{#each tiles as tile, index}
				<button
					class="tile"
					class:reversed={isReversed(index, visibleTiles, faceUpTiles)}
					on:click={() => showTile(index)}
				>
					<div class="front">
						<img src={tile.image} alt="Obverse" />
					</div>
					<div class="back">
						<img src="/icons/question-mark.svg" alt="Reverse" />
					</div>
				</button>
			{/each}
		</div>
	</main>
	<div class="time">{getTime(date)}</div>
	<hr class="bottom" />
</div>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		hr {
			width: 100%;
			height: 12px;
			background-color: var(--primary-color);
			margin: 0;
			border: 0;

			&.bottom {
				margin-top: auto;
			}
		}

		header {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 36px 0px 24px;
			text-align: center;
			font-family: var(--primary-font);
			font-weight: 700;
			font-size: 36px;
			color: var(--font-color);
		}

		main {
			display: flex;
			justify-content: center;
			padding: 24px 0px;

			.tiles {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				gap: 12px;

				.tile {
					width: 96px;
					height: 96px;
					transform-style: preserve-3d;
					transition: 0.4s;
					position: relative;

					&.reversed {
						transform: rotateY(180deg);
						cursor: pointer;
					}

					.front,
					.back {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 100%;
						height: 100%;
						backface-visibility: hidden;
						border-radius: 4px;
						overflow: hidden;

						&.front > img {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}

						&.back {
							position: absolute;
							top: 0;
							left: 0;
							transform: rotateY(180deg);
							background-color: var(--primary-color);
						}
					}
				}
			}
		}

		.time {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 12px 0px;
			font-size: 24px;
			font-family: var(--primary-font);
			color: var(--font-color);
		}
	}
</style>
