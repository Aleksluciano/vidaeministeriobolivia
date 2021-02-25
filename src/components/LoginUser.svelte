<script>
  import { createEventDispatcher } from "svelte";
  import Button from '../shared/Button.svelte';

  const dispatch = createEventDispatcher();

  let user;
  let senha;
  let form = "logar";
  let message = "";
</script>

<style>
  .panel {
    display: grid;
    justify-content: center;
    margin-top: 2em;
    position: relative;
 
  }
  input {
    min-width: 20em;
  }
  p{
    color: orange;
    font-weight: 600;
  }

  section {
 text-align: center;
  }
  img {
   width: 18em;
   margin-top: 15px;
   color: yellow;
  }

  .creditos1{
   position: absolute;
   bottom: 40px;
   left: 20px;
   font-size: .8em;
  }

  .creditos2{
   position: absolute;
   bottom: 20px;
   left: 20px;
   font-size: .8em;
  }

  .creditos3{
   position: absolute;
   bottom: 60px;
   left: 20px;
   font-size: .8em;
  }

  a{
    cursor: pointer;
  }
</style>
<section>

{#if form == 'logar'}
  <form
    class="panel"
    on:submit|preventDefault={() => dispatch('logUser', { user, senha })}>
    <input type="text" placeholder="Usuário" bind:value={user} required />
    <input type="password" placeholder="Senha" bind:value={senha} required />
    <Button type="neutral">Logar</Button>
    <br><br>
    <a href="/#" on:click={() => (form = 'esqueceu')}>Esqueceu a senha ?</a>
  </form>
{:else}

  <form
  
    class="panel"
    on:submit|preventDefault={() => {
      message = 'Olhe sua caixa de email !!!';
      setTimeout((_) => {
        message = '';
      }, 10000);
      dispatch('resetPass', { user });
    }}>
    {#if message}
    <p>{message}</p>
    {/if}
    <input type="text" placeholder="Usuário" bind:value={user} required />
    <Button type="neutral">Solicitar Reset</Button>
    <br><br>
    <a href="/#" on:click={() => { form = 'logar'; message = ''}}>Logar ?</a>
  </form>
{/if}
<img src="/img/talk.svg" alt="pupito">
<a class="creditos1" target="_blank" href="https://icons8.com/icons/set/reading-ebook">Read Online icon</a>
<a class="creditos2" target="_blank" href="https://icons8.com"> icon by Icons8</a>

<a class="creditos3" href="https://www.vecteezy.com/free-vector/meeting">Meeting Vectors by Vecteezy</a>

</section>
<!-- 123 -->
