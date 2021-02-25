<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../shared/Button.svelte";
  import Spinner from "../shared/Spinner.svelte";
  import { callFirebaseFnJw } from "../../firebase.js";
  import { fade } from "svelte/transition";
  import { DesignacaoPeriodo } from "./DesignacaoPeriodo";
  import ManualSelection from "./ManualSelection.svelte";
  import { nDate } from "../shared/date/nDate";
  import { db } from "../../firebase";
  import Modal  from "../shared/Modal.svelte";
  import PopupConfirm from "../shared/PopupConfirm.svelte";
  import { Arquivos } from './Arquivos';

 

  export let gruposNumero = [];
  export let irmaos = [];

  let partesjw = [];
  let linksitejw = "#";
  let imagemjw = "";
  let pronto = false;
  let showModalManualSelect = false;
  const irmaosRef = db.collection("irmaos");
  const dispatch = createEventDispatcher();

  let meses = [
    "",
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  let dataInicial = new Date();
  let dataFinal = new Date();
  let firstLoad = true;
  let designacaoPeriodo;
  let data = [];
  let timestamp = null;
 

  const periodoRef = db.collection("periodoRef");

  const embaralha = (data) => {
    for (let i = 0; i < data.length - 1; i++) {
      let j = i + Math.floor(Math.random() * (data.length - i));
      let temp = data[j];
      data[j] = data[i];
      data[i] = temp;
    }
  };

  const getDataUrlJw = async (params) => {
    try {
      // console.log(params)
      // const res = await fetch("http://localhost:3000/jw?data=" + params);
      // let dadosjs = await res.json();
      // dadosjs = dadosjs.data;
      // console.log(dadosjs);

      const res = await callFirebaseFnJw({ data: params });
      let dadosjs = res.data.dados; // get info layout from jw site
      dadosjs = dadosjs.filter(a => a !== null);
     
   
      if (dadosjs.length > 0) {
        let dados = dadosjs.splice(dadosjs.length -1, 1);
      
        let discurso10Index = dadosjs.findIndex(a => a.toLowerCase().match('<strong>“</strong>'));
        if(discurso10Index >= 0)dadosjs[discurso10Index] = '<strong>Discurso 10min</strong>';
        dadosjs = dadosjs.filter(a => !a.toLowerCase().match('cântico'));
      
        imagemjw = dados[0].figura;
        linksitejw = dados[0].url; // extract main image
        partesjw = [...dadosjs];
      
        const infJw = { imagemjw, linksitejw, partesjw };

        embaralha(irmaos);

        irmaos
          .sort((a, b) =>
            nDate(a.data).getTime() < nDate(b.data).getTime()
              ? -1
              : nDate(a.data).getTime() > nDate(b.data).getTime()
              ? 1
              : 0
          );

        designacaoPeriodo = new DesignacaoPeriodo(
          irmaos,
          infJw,
          gruposNumero,
          dataInicial
        );
        designacaoPeriodo.montar();
      }
    } catch (e) {
      console.log(e);
    }
  };
  const doPost = async (params) => {
    timestamp = null;
    designacaoPeriodo = null;
    pronto = false;

    const id = idRef();

    let periodoTake = db.collection("periodoRef").doc(id);
    const doc = await periodoTake.get();

    if (!doc.exists) {
      await getDataUrlJw(params);
      pronto = true;
    } else {
      designacaoPeriodo = new DesignacaoPeriodo(
        irmaos,
        doc.data().infJw,
        doc.data().gruposNumero,
        dataInicial
      );
      timestamp = doc.data().timestamp.toDate();
      designacaoPeriodo.setGrupos(doc.data().grupos);

      pronto = true;
    }
  };

  const copyArray = (array) => array.map((a) => ({ ...a }));

  const montaDataProxima = () => {
    if (!firstLoad) {
      if (
        dataInicial.getTime() <
        new Date().getTime() + 3600 * 24 * 150 * 1000
      ) {
        //avoid go forward more than 30 days
        dataInicial = new Date(dataInicial.getTime() + 3600 * 24 * 7 * 1000);
        dataFinal = new Date(dataInicial.getTime() + 3600 * 24 * 6 * 1000);
      }
    } else {
      dataInicial.setDate(
        dataInicial.getDate() + ((1 + 7 - dataInicial.getDay()) % 7)
      ); //find next monday
      dataFinal = new Date(dataInicial.getTime() + 3600 * 24 * 6 * 1000); //find next sunday
      firstLoad = false;
    }

    return `${dataInicial.toLocaleDateString(
      "pt-br"
    )}-${dataFinal.toLocaleDateString("pt-br")}`;
  };

  const montaDataAnterior = () => {
    if (dataInicial.getTime() > new Date().getTime() + 3600 * 24 * -50 * 1000) {
      //avoid go back more than 30 days
      dataInicial = new Date(dataInicial.getTime() + 3600 * 24 * -7 * 1000);
      dataFinal = new Date(dataInicial.getTime() + 3600 * 24 * 6 * 1000);
    }
    return `${dataInicial.toLocaleDateString(
      "pt-br"
    )}-${dataFinal.toLocaleDateString("pt-br")}`;
  };

  const toggleModalManualSelect = () => {
    showModalManualSelect = false;
  };

  const manualSelection = (item, position, gp, e) => {
    let siglaParte;
    let irmao;
    let irmao2;
    let titulo = item.titulo;

    if (position == 1) {
      siglaParte = item.siglaParte;
      irmao = item.vaga1;
      irmao2 = item.vaga2;
    }
    if (position == 2) {
      siglaParte = "A";
      irmao = item.vaga2;
      irmao2 = item.vaga1;
    }
    data = {
      siglaParte,
      nomeGrupo: gp.nomeGrupo,
      nomeSala: gp.nomeSala,
      irmao,
      irmao2,
      designacao: designacaoPeriodo,
      top: e.pageY,
      left: e.pageX,
      titulo,
      position,
    };

    designacaoPeriodo.irmaos = irmaos;
    designacaoPeriodo.irmaos
      .sort((a, b) =>
        parseInt(designacaoPeriodo.diasSemParte(a.data)) <
        parseInt(designacaoPeriodo.diasSemParte(b.data))
          ? -1
          : parseInt(designacaoPeriodo.diasSemParte(a.data)) >
            parseInt(designacaoPeriodo.diasSemParte(b.data))
          ? 1
          : 0
      )
      .reverse();
    showModalManualSelect = true;
  };

  const idRef = () => {
    const dataIniciallocal = dataInicial.toLocaleDateString("pt-BR");

    const id = dataIniciallocal.replace(/\//g, "-");
    return id;
  };

  const deletarPeriodo = () => {
    showModal = !showModal;
    let irmaosForUpdate = designacaoPeriodo.irmaosForUpdate();
    const id = idRef();
    if (id)
      periodoRef
        .doc(id)
        .delete()
        .then((_) => {
          dispatch("snack", { color: "green", text: "Período removido" });
          if (irmaosForUpdate.length >= 0) {
            irmaosForUpdate.forEach((t) => {
              dispatch("updatePerson", { irmao: t.irmaoEscalado, reverse: true });
            });
          }
          doPost(
            `${dataInicial.toLocaleDateString(
              "pt-br"
            )}-${dataFinal.toLocaleDateString("pt-br")}`
          );
        });
  };

  const salvarPeriodo = () => {
    const id = idRef();
    const timestamptemp = new Date();
    if (id)
      periodoRef
        .doc(id)
        .set({
          timestamp: timestamptemp,
          grupos: designacaoPeriodo.grupos,
          gruposNumero: designacaoPeriodo.gruposNumero,
          infJw: designacaoPeriodo.infJw,
        })
        .then((_) => {
          dispatch("snack", { color: "green", text: "Período Salvo" });
          let irmaosForUpdate = designacaoPeriodo.irmaosForUpdate();
          if (irmaosForUpdate.length >= 0) {
            //if (!timestamp)
              irmaosForUpdate.forEach((a) => {
                a.irmaoEscalado.data = designacaoPeriodo.dataInicial.toLocaleDateString(
                  "pt-BR"
                );
                dispatch("updatePerson", { irmao: a.irmaoEscalado, reverse: a.parteDiferente });
              });
            if (designacaoPeriodo.reverseIrmaos.length >= 0) {
              designacaoPeriodo.reverseIrmaos.forEach((t) => {
                if (!irmaosForUpdate.find((g) => g.irmaoEscalado.id == t.id)) {
                  dispatch("updatePerson", { irmao: t, reverse: true });
                }
              });
            }
          }
          timestamp = timestamptemp;
        })
        .catch((error) => {
          console.log(error);
          dispatch("snack", { color: "red", text: "Ocorreu algum erro" });
        });
  };

  let showModal = false;
  const toggleModal = () =>{
    showModal = !showModal
  }


  const montarArquivos = () => {

    new Arquivos(designacaoPeriodo.grupos,dataInicial,dataFinal);

 
  
}
  

  doPost(montaDataProxima());
</script>

<style>
  .pane {
    margin-top: 1%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-content: center;
    margin-bottom: 10em;
  }

  tr {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  img {
    height: 95%;
    width: 95%;
    margin: 8px;
  }

  .btnControlDate {
    display: flex;
    justify-content: space-between;
    height: 3em;
  }

  .periodo {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .person-input {
    border: solid lightgray 1px;
    display: flex; /* required for drag & drop to work when .item display is inline */
    height: 40px;
    padding: 8px;
    background-color: white;
    align-items: center;
    border: solid rgb(212, 210, 210) 1px;
    flex: 2;
  }

  .table-align {
    display: flex;
    justify-content: center;
  }

  .label-input {
    display: flex;
    padding: 10px;
    border: solid rgb(199, 197, 197) 1px;
    text-align: center;
    height: 36px;
    align-items: center;
    flex: 1;
  }
  .titulo {
    flex: flex;
    justify-content: left;
    color: whitesmoke;
    font-weight: 800;
    font-size: 18px;
    padding: 8px;
    background-color: rgb(60, 122, 81);
    flex: 1;
    border-top: solid black 2px;
    border-bottom: solid black 2px;
  }

  .titulo-input {
    flex: flex;
    justify-content: center;
    color: whitesmoke;
    font-weight: 800;
    font-size: 18px;
    padding: 8px;
    background-color: rgb(60, 122, 81);
    flex: 2;
    border-top: solid black 2px;
    border-bottom: solid black 2px;
  }

  .stick {
    position: relative;
    background-color: lightgray;
    cursor: pointer;
    display: flex;
    padding: 4px;
    width: 98%;
    text-align: center;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    height: 32px;
    font-size: 0.9em;
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 2);
    color: rgb(27, 69, 206);
    font-weight: 600;
  }

  .privilegio {
    position: absolute;
    left: 4px;
    padding: 1px;
    color: rgb(87, 85, 85);
  }

  .dias-diferenca {
    position: absolute;
    right: 4px;
    padding: 1px;
    color: rgb(87, 85, 85);
  }
  span:hover {
    background: orange;
    color: white;
  }

  table {
    width: 100%;
    border: 3px solid black;
  }
  td {
    display: flex;
    align-items: center;
    text-align: center;
    width: 50%;
  }

  tr {
    display: flex;
    flex-grow: 1;
  }

  .control-table {
    display: flex;
  }

  .figure {
    display: flex;
    padding: 8px;
    border: solid rgb(196, 193, 193) 1px;
    justify-content: center;
    align-items: center;
    height: 80px;
    flex: 1;
    background-color: whitesmoke;
  }

  .control {
    border: solid lightgray 1px;
    display: flex; /* required for drag & drop to work when .item display is inline */
    height: 80px;
    padding: 8px;
    background-color: white;
    justify-content: space-between;
    align-items: flex-start;
    border: solid rgb(197, 195, 195) 1px;
    flex: 4;
    background-color: whitesmoke;
  }
  .command-column {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    width: 100%;
  }
  .command-line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }

  .datasave {
    font-weight: 500;
    padding: 2px;
    border-radius: 10px;
    border: solid black 1px;
    width: 100%;
    background-color: yellow;
  }

  .btn-resfresh{
    position: absolute;
    margin-left: 5em;
  }
</style>

{#if showModalManualSelect}
  <ManualSelection
    {data}
    on:click={toggleModalManualSelect}
    on:substituicao={(e) => {
      if (designacaoPeriodo.troca(e.detail.subIrmao, data)) {
        designacaoPeriodo.grupos = [...designacaoPeriodo.grupos];
      }
      toggleModalManualSelect();
    }} />
{/if}

<Modal {showModal} on:click={toggleModal}>
    <PopupConfirm
      message={`Remover período ${dataInicial.toLocaleDateString("pt-br")}-${dataFinal.toLocaleDateString("pt-br")}`}
      on:action={(e) => {
        e.detail ? deletarPeriodo() : (showModal = !showModal);
      }} />
  <div slot="title">
    <h3>Confirmar</h3>
  </div>
</Modal>

<div class="pane" on:click|self={() => toggleModalManualSelect()}>
  <div class="btnControlDate">
    <Button
      type="secondary"
      inverse={true}
      on:click={() => {
        doPost(montaDataAnterior());
      }}>
      👈🏻
    </Button>
    <div class="btn-resfresh">
    <Button
      type="secondary"
      inverse={true}
      on:click={() => {
        doPost(`${dataInicial.toLocaleDateString('pt-br')}-${dataFinal.toLocaleDateString('pt-br')}`);
      }}>
      🔄
    </Button>
  </div>
    {#if dataFinal.getMonth() == dataInicial.getMonth()}
      <div class="periodo">
        <h2>
          <a
            target="_blank"
            href={designacaoPeriodo?.linksite}>{dataInicial.getDate()}-{dataFinal.getDate()}
            de
            {meses[dataInicial.getMonth() + 1]}</a>
        </h2>
      </div>
    {:else}
      <div class="periodo">
        <h2>
          <a
            target="_blank"
            href={designacaoPeriodo?.linksite}>{dataInicial.getDate()}
            de
            {meses[dataInicial.getMonth() + 1]}-{dataFinal.getDate()}
            de
            {meses[dataFinal.getMonth() + 1]}</a>
        </h2>
      </div>
    {/if}

    <Button
      type="secondary"
      inverse={true}
      on:click={() => {
        doPost(montaDataProxima());
      }}>
      👉🏻
    </Button>
  </div>

  {#if pronto && designacaoPeriodo?.grupos.length > 0}
    <div class="table-align" in:fade|local={{ duration: 1000 }}>
      <table>
        <tr class="control-table">
          <td class="figure">
            <img
              src={designacaoPeriodo.imagem}
              alt="Imagem"
              hidden={designacaoPeriodo.imagem == ''} />
          </td>
          <td class="control">
            <div class="command-column">
              <div class="command-line">
                <Button type="secondary" on:click={salvarPeriodo}>
                  Salvar
                </Button>

                <Button type="yellow" hidden={!timestamp} on:click={montarArquivos}>Arquivos</Button>

                <Button
                  type="primary"
                  hidden={!timestamp}
                  on:click={toggleModal}>
                  Deletar
                </Button>
              </div>
              {#if timestamp}
                <p class="datasave">
                  Salvo:
                  {timestamp?.toLocaleDateString('pt-BR')}
                  {timestamp?.toLocaleTimeString('pt-BR')}
                </p>
              {/if}
            </div>
          </td>
        </tr>
        {#each designacaoPeriodo.grupos as gp, i}
          {#if gp}
            <tr>
              <td
                class="titulo"
                style={timestamp ? 'background:yellow;color:black' : ''}>
                {gp.nomeGrupo}
                -
                {gp.nomeSala}
              </td>
              <td
                class="titulo-input"
                style={timestamp ? 'background:yellow;color:black' : ''}>
                Designado
              </td>
              <td
                class="titulo-input"
                style={timestamp ? 'background:yellow;color:black' : ''}>
                Ajudante
              </td>
            </tr>
            {#each gp.partes as item}
              <tr>
                <td class="label-input">
                  {@html item.titulo}
                </td>
                <td class="person-input">
                  {#if item.vaga1}
                    <span
                      class="stick"
                      on:click={(e) => {
                        manualSelection(item, 1, gp, e);
                      }}
                      style={item.vaga1.sexo == 'F' ? 'color:#d90166' : ''}>
                      {#if item.vaga1.privilegio}
                        <span class="privilegio">{item.vaga1?.privilegio}</span>
                      {/if}

                      {item.vaga1.nome}
                      {#if item.vaga1.data}
                        <span
                          class="dias-diferenca">{designacaoPeriodo.diasSemParte(item.vaga1.data)}</span>
                      {/if}
                    </span>
                  {/if}
                </td>
                <td class="person-input">
                  {#if item.vaga2}
                    <span
                      on:click={(e) => {
                        manualSelection(item, 2, gp, e);
                      }}
                      class="stick"
                      style={item.vaga2.sexo == 'F' ? 'color:#d90166' : ''}>
                      {#if item.vaga2.privilegio}
                        <span class="privilegio">{item.vaga2?.privilegio}</span>
                      {/if}
                      {item.vaga2.nome}
                      {#if item.vaga2.data}
                        <span
                          class="dias-diferenca">{designacaoPeriodo.diasSemParte(item.vaga2.data)}</span>
                      {/if}
                    </span>
                  {/if}
                </td>
              </tr>
            {/each}
          {/if}
        {/each}
      </table>
    </div>
  {:else if pronto && ( designacaoPeriodo?.grupos.length <= 0 || !designacaoPeriodo )}
    <p>Aconteceu algum erro!!!</p>
  {:else}
    <Spinner />
  {/if}
</div>
