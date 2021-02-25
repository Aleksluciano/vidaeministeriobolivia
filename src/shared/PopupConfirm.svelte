<script>
import Button from './Button.svelte'
import {createEventDispatcher} from 'svelte';

export let message = '';
const dispatch = createEventDispatcher();

</script>
<p>{message}</p>
<br><br>
<div class="classButtons">
<Button type="primary" on:click={() => dispatch('action', true)} >Confirmar</Button>
<Button type="secondary" on:click={() => dispatch('action', false)} >Cancelar</Button>
</div>
<style>
.classButtons{
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 15px;
}
</style>