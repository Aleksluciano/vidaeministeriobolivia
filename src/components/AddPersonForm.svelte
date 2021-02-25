<script>
  import Button from "../shared/Button.svelte";
  import DatePicker from "../shared/date/DatePicker.svelte";
  import { createEventDispatcher } from "svelte";

  export let irmao = {
    nome: "",
    sexo: "",
    privilegio: null,
    grupo: "",
    parte: "",
    indiceProximaParte: "",
    indiceParte: "",
    proximaParte: "",
    data: "",
    situacao: true,
    salaB: false,
  };
  export let partesPrivilegios = [];

  const dispatch = createEventDispatcher();
  let currentDate = new Date();
  if(irmao.data)currentDate = new Date(irmao.data.substring(6)+'/'+irmao.data.substring(3,5)+'/'+irmao.data.substring(0,2));
  currentDate.setHours(0);
  currentDate.setMinutes(0);
  currentDate.setSeconds(0);

  //update date field when datepicker change
  const onDateChange = (d) => {
    currentDate = d.detail;
  };

  //send data to the father
  const handleSubmit = () => {
    irmao.data = currentDate.toLocaleDateString("pt-br");
    irmao.nome = irmao.nome.charAt(0).toUpperCase() + irmao.nome.slice(1);
    dispatch("addPerson", irmao);
  };

  const encontraIndice = (i) =>{
      if (irmao.indiceParteAnterior == i) return i;
  }

  //check if all fields were filed before enable button
  $: checkFormFill =
    irmao?.nome?.length > 2 &&
    irmao.sexo &&
    validaIndiceParte &&
    irmao.grupo &&
    currentDate;
  $: if (
    irmao.sexo == "F" &&
    (irmao.privilegio == "A" || irmao.privilegio == "S")
  ) {
    irmao.privilegio = "";
  }

  $: validaIndiceParte =
    irmao.privilegio == "A" ||
    irmao.privilegio == "S" ||
    irmao.parte
      ? true
      : false;

  let antigoValorPrivilegio = "";
  let antigoSexo = "";
  $: if (
    irmao.privilegio != antigoValorPrivilegio ||
    irmao.sexo != antigoSexo
  ) {
    if(antigoSexo !== '')
    irmao.parte = null;
    antigoValorPrivilegio = irmao.privilegio;
    antigoSexo = irmao.sexo;
  }

</script>

<style>
  form {
    display: flex;
    flex-direction: column;
    align-items: initial;
    margin-left: 10%;
    margin-right: 10%;
  }

  p {
    font-weight: 700;
    margin-bottom: 4px;
    background: lightgray;
    
    color: rgb(10, 8, 8);
    padding: 5px;
    margin-bottom: 5px;
    font-size: .8em;
    margin: 3px;
  }

  label {
    display: inline;
    margin-right: 10px;
    font-weight: 400;
    font-size: .8em;
  }

  .input-name {
    font-weight: 400;
    text-align: center;
    font-size: .8em;
  }

  .btnPosition {
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 2%;
  }

  span {
    color: black;
  }
  .green {
    background-color: greenyellow;
  }
</style>

<form on:submit|preventDefault={handleSubmit}>
  <p class:green={irmao?.nome?.length > 2}>
    Nome
    <span>{irmao.nome ? '✔' : ''}</span>
  </p>
  <input class="input-name" type="text" bind:value={irmao.nome} maxlength=40/>
  <p class:green={irmao.sexo}>Sexo <span>{irmao.sexo ? '✔' : ''}</span></p>
  <div>
    <label>
      <input class="radio" type="radio" bind:group={irmao.sexo} value={'M'} />
      Masculino
    </label>
    <label>
      <input class="radio" type="radio" bind:group={irmao.sexo} value={'F'} />
      Feminino
    </label>
  </div>
  <p class:green={irmao.privilegio}>
    Privilégio
    <span>{irmao.privilegio ? '✔' : ''}</span>
  </p>
  <div>
    <label>
      <input type="radio" bind:group={irmao.privilegio} value={'E'} />
      Estudante
    </label>
    <label>
      <input type="radio" bind:group={irmao.privilegio} value={'P'} />
      Publicador
    </label>
    {#if irmao.sexo != 'F'}
      <div>
        <label>
          <input type="radio" bind:group={irmao.privilegio} value={'S'} />
          Servo Ministerial
        </label>
        <label>
          <input type="radio" bind:group={irmao.privilegio} value={'A'} />
          Ancião
        </label>
      </div>
    {/if}
  </div>
  <p class:green={irmao.grupo}>Grupo <span>{irmao.grupo ? '✔' : ''}</span></p>
  <div>
    <label>
      <input type="radio" bind:group={irmao.grupo} value={'Betel'} />
      Betel
    </label>
    <label>
      <input type="radio" bind:group={irmao.grupo} value={'Beréia'} />
      Beréia
    </label>

    <label>
      <input type="radio" bind:group={irmao.grupo} value={'Gileade'} />
      Gileade
    </label>
    <div>
      <label>
        <input type="radio" bind:group={irmao.grupo} value={'Hébron'} />
        Hébron
      </label>
      <label>
        <input type="radio" bind:group={irmao.grupo} value={'Jerusalém'} />
        Jerusalém
      </label>
      <label>
        <input type="radio" bind:group={irmao.grupo} value={'Nazaré'} />
        Nazaré
      </label>
      <div>
        <label>
          <input type="radio" bind:group={irmao.grupo} value={'Promissão'} />
          Promissão
        </label>
      </div>
    </div>
    {#if irmao.privilegio != 'A' && irmao.privilegio != 'S'}
    <p class:green={validaIndiceParte}>
      Última parte
      <span>{irmao.parte ? '✔' : ''}</span>
    </p>
    {/if}
    <div>
      {#if irmao.sexo && irmao.privilegio}
        {#each partesPrivilegios as parte}
          {#if irmao.sexo == parte.sexo && irmao.privilegio == parte.privilegio}
            <!-- {@debug parte} -->
            {#each parte.items as item, i (item)}
            
              <label>
                <input
                  type="radio"
                  value={irmao.parte}
                  on:change={() => irmao.parte = item}
                  checked={irmao.parte == item}
                  />
                {item.substring(2)}
              </label>
            {/each}
          {/if}
        {/each}
        
      {/if}
    </div>
  </div>

  {#if irmao.privilegio != 'A' && irmao.privilegio != 'S'}
  <DatePicker
    on:datechange={onDateChange}
    selected={currentDate}
    isAllowed={(date) => {
      const millisecs = date.getTime();
      //if (millisecs + 25 * 3600 * 1000 < Date.now()) return false;
      if (millisecs > Date.now() + 3600 * 24 * 45 * 1000) return false;
      return true;
    }} />
      <p class:green={true}>Sala Exclusiva <span>{'✔'}</span></p>
      <label>
        <input type="checkbox" bind:checked={irmao.salaB} />
        Sala B
      </label>
  <p class:green={true}>Situação <span>{'✔'}</span></p>
  <label>
    <input type="checkbox" bind:checked={irmao.situacao} />
    Escalar
  </label>
 
{/if}
  <div class="btnPosition">
    <Button type="secondary" disabled={!checkFormFill}>Salvar</Button>
  </div>
</form>
