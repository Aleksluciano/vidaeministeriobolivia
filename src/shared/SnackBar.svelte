<script>
  import { fly } from "svelte/transition";

  export let text = "";
  export let color = "red";
  export let showSnack = false;
</script>

<style>
  .panel {
    color: white;
    position: absolute;
    margin-top: 5%;
    width: 100%;
  }

  .snack {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 10px;
    margin: 0% auto;
    width: 350px;
    height: 50px;
  }

  .red {
    background-color: red;
  }

  .green {
    background-color: rgb(144, 230, 144);
  }
</style>

{#if showSnack}
  <div class="panel">
    <div in:fly={{ y: 600, duration: 2000 }} class={'snack' + ' ' + color}>
      {text}
    </div>
  </div>
{/if}
