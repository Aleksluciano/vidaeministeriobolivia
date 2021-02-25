<script>
	// Inspired by https://svelte.dev/repl/810b0f1e16ac4bbd8af8ba25d5e0deff?version=3.4.2.
	import { flip } from "svelte/animate";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let gruposNumero = [];

	let hoveringOverGrupo;

	function dragStart(event, grupoIndex, itemIndex) {
		// The data we want to make available when the element is dropped
		// is the index of the item being dragged and
		// the index of the grupo from which it is leaving.
		const data = { grupoIndex, itemIndex };
		event.dataTransfer.setData("text/plain", JSON.stringify(data));
	}

	function drop(event, grupoIndex) {
		event.preventDefault();
		const json = event.dataTransfer.getData("text/plain");
		const data = JSON.parse(json);

		// Remove the item from one grupo.
		// Splice returns an array of the deleted elements, just one in this case.
		const [item] = gruposNumero[data.grupoIndex].items.splice(
			data.itemIndex,
			1
		);

		// Add the item to the drop target grupo.
		gruposNumero[grupoIndex].items.push(item);
	
    updateGrupoNumero()
		hoveringOverGrupo = null;
		
	}

	const updateGrupoNumero = () => {
		dispatch("updateGrupos");
	};
</script>

<style>
	.hovering {
		border-color: orange;
	}
	.item {
		display: inline; /* required for flip to work */
	}
	li {
		background-color: lightgray;
		cursor: pointer;
		display: inline-block;
		margin-right: 10px;
		padding: 10px;
		width: 80px;
		text-align: center;
		box-shadow: 1px 2px 3px rgba(0, 0, 0, 2);
	}
	li:hover {
		background: orange;
		color: white;
	}
	ul {
		border: solid lightgray 1px;
		display: flex; /* required for drag & drop to work when .item display is inline */
		height: 40px; /* needed when empty */
		padding: 10px;
	}
	input {
		margin-left: 10px;
	}
</style>


{#if gruposNumero.length}
	{#each gruposNumero as grupo, grupoIndex (grupo)}
		<div animate:flip>
			<b>{grupo.name} - </b>
			<input
				type="checkbox"
				bind:checked={grupo.salaB}
				on:change={updateGrupoNumero} />
			Sala B
			<input
				type="checkbox"
				bind:checked={grupo.salaC}
				on:change={updateGrupoNumero} />
			Sala C

			<ul
				class:hovering={hoveringOverGrupo === grupo.name}
				on:dragenter={() => (hoveringOverGrupo = grupo.name)}
				on:dragleave={() => (hoveringOverGrupo = null)}
				on:drop={(event) => drop(event, grupoIndex)}
				ondragover="return false">
				{#if grupo.items}
					{#each grupo.items as item, itemIndex (item)}
						<div class="item" animate:flip>
							<li
								draggable={true}
								on:dragstart={(event) => dragStart(event, grupoIndex, itemIndex)}>
								{item}
							</li>
						</div>
					{/each}
				{/if}
			</ul>
		</div>
	{/each}
{/if}
