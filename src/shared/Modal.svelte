<script>
  export let showModal = false;
</script>

{#if showModal}
  <div class="backdrop" on:click|self >
    <div class="modal"  >
      <br>
      <slot name="title" >
        <h3>Adicionar Irmão</h3>
      </slot>
      <slot ></slot>
    </div>
  </div>
{/if}

<style>
  .backdrop{
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    position: absolute;
    background: rgba(0,0,0,0.8);
    z-index: 50;
  }
  .modal{
    padding: 5px;
    border-radius: 10px;
    width: 400px;
    margin: 0% auto;
    text-align: center;
    background: white;
    position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
 
    z-index: 99;
  }

</style>