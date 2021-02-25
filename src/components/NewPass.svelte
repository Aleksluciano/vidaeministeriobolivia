<script>
  import Button from "../shared/Button.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let senha = "";
  $: checkFormFill = senha.match(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
  );
</script>

<style>
  .panel {
    height: 10em;
  }

  p {
    font-size: 13px;
    font-style: italic;
  }
</style>

<form
  class="panel"
  on:submit|preventDefault={() => dispatch('newPass', { senha })}>
  <p>
    A senha deve ter mais de 8 caracteres e conter pelo menos uma letra
    maiúscula, uma minúscula e um número
  </p>
  <input type="password" placeholder="Senha" bind:value={senha} required />
  <Button type="secondary" disabled={!checkFormFill}>Salvar</Button>
</form>
