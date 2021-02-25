import { nDate } from "../shared/date/nDate";

class GrupoDesignacao {
  constructor(nomeGrupo, nomeSala, partes) {
    this.nomeSala = nomeSala;
    this.nomeGrupo = nomeGrupo;
    this.partes = [];
    partes.forEach((a) => {
      this.partes.push({
        siglaParte: "",
        titulo: a.replace(":", ""),
        vaga1: null,
        vaga2: null,
      });
    });
    //this.preencheVaga();
  }
}
export class DesignacaoPeriodo {
  constructor(irmaos, infJw, gruposNumero, dataInicial) {
    this.irmaos = irmaos;
    this.infJw = infJw;
    this.imagem = infJw.imagemjw;
    this.linksite = infJw.linksitejw;
    this.partes = infJw.partesjw;
    this.grupos = [];
    this.reverseIrmaos = [];
    this.irmaosUp = [];
    this.gruposNumero = gruposNumero;
    this.dataInicial = dataInicial;
  }
  montar() {
    this.geraSalasParaGrupos();
    this.designaPartes();
  }
  geraSalasParaGrupos() {
    this.gruposNumero.forEach((a) => {
      if (a.items?.length > 0) {
        this.adicionaNovoGrupo(
          new GrupoDesignacao(a.name, "Principal", [...this.partes])
        );
        if (a.salaB)
          this.adicionaNovoGrupo(
            new GrupoDesignacao(a.name, "Sala B", [...this.partes])
          );
        if (a.salaC)
          this.adicionaNovoGrupo(
            new GrupoDesignacao(a.name, "Sala C", [...this.partes])
          );
      }
    });
  }
  adicionaNovoGrupo(grupoDesignacao) {
    this.grupos.push({ ...grupoDesignacao });
  }
  designaPartes() {
    this.grupos.forEach((x) => {
      x.partes.forEach((a) => {
        if (!a.titulo.toLowerCase().match("vídeo")) {
          if (a.titulo.toLowerCase().match("leitura")) {
            a.siglaParte = "L";
            a.vaga1 = this.procuraIrmao(x.nomeSala, "L", x.nomeGrupo, "M");
          }
          if (a.titulo.toLowerCase().match("discurso")) {
            a.siglaParte = "D";
            a.vaga1 = this.procuraIrmao(x.nomeSala, "D", x.nomeGrupo, "M");
          }
          if (
            a.titulo.toLowerCase().match("conversa") ||
            a.titulo.toLowerCase().match("convite")
          ) {
            a.siglaParte = "C";
            a.vaga2 = { nome: "⚡" };

            a.vaga1 = this.procuraIrmao(x.nomeSala, "C", x.nomeGrupo);
            if (a.vaga1.nome !== "⚡")
              a.vaga2 = this.procuraIrmao(
                x.nomeSala,
                "A",
                x.nomeGrupo,
                a.vaga1.sexo,
                a.vaga1.privilegio
              );
            if (
              a.vaga1.nome !== "⚡" &&
              a.vaga2.nome == "⚡" &&
              a.vaga1.privilegio == "E"
            )
              a.vaga2 = this.procuraIrmao(
                x.nomeSala,
                "A",
                x.nomeGrupo,
                a.vaga1.sexo,
                "E"
              );

            if (a.vaga2.nome == "⚡") {
              a.vaga1 = this.procuraIrmao(
                x.nomeSala,
                "C",
                x.nomeGrupo,
                this.inverteSexo(a.vaga1.sexo)
              );
              if (a.vaga1.nome !== "⚡")
                a.vaga2 = this.procuraIrmao(
                  x.nomeSala,
                  "A",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  a.vaga1.privilegio
                );

              if (
                a.vaga1.nome !== "⚡" &&
                a.vaga2.nome == "⚡" &&
                a.vaga1.privilegio == "E"
              )
                a.vaga1 = this.procuraIrmao(
                  x.nomeSala,
                  "C",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  "E"
                );
              if (a.vaga1.nome !== "⚡")
                a.vaga2 = this.procuraIrmao(
                  x.nomeSala,
                  "A",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  a.vaga1.privilegio
                );
            }
            if (a.vaga1.nome == "⚡") {
              a.vaga1 = { nome: "⚡" };
              a.vaga2 = { nome: "⚡" };
            }
          }
          if (a.titulo.toLowerCase().match("estudo")) {
            a.siglaParte = "E";
            a.vaga2 = { nome: "⚡" };

            a.vaga1 = this.procuraIrmao(x.nomeSala, "E", x.nomeGrupo);
            if (a.vaga1.nome !== "⚡")
              a.vaga2 = this.procuraIrmao(
                x.nomeSala,
                "A",
                x.nomeGrupo,
                a.vaga1.sexo,
                a.vaga1.privilegio
              );
            if (
              a.vaga1.nome !== "⚡" &&
              a.vaga2.nome == "⚡" &&
              a.vaga1.privilegio == "E"
            )
              a.vaga2 = this.procuraIrmao(
                x.nomeSala,
                "A",
                x.nomeGrupo,
                a.vaga1.sexo,
                "E"
              );

            if (a.vaga2.nome == "⚡") {
              a.vaga1 = this.procuraIrmao(
                x.nomeSala,
                "E",
                x.nomeGrupo,
                this.inverteSexo(a.vaga1.sexo)
              );
              if (a.vaga1.nome !== "⚡")
                a.vaga2 = this.procuraIrmao(
                  x.nomeSala,
                  "A",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  a.vaga1.privilegio
                );

              if (
                a.vaga1.nome !== "⚡" &&
                a.vaga2.nome == "⚡" &&
                a.vaga1.privilegio == "E"
              )
                a.vaga1 = this.procuraIrmao(
                  x.nomeSala,
                  "E",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  "E"
                );
              if (a.vaga1.nome !== "⚡")
                a.vaga2 = this.procuraIrmao(
                  x.nomeSala,
                  "A",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  a.vaga1.privilegio
                );
            }
            if (a.vaga1.nome == "⚡") {
              a.vaga1 = { nome: "⚡" };
              a.vaga2 = { nome: "⚡" };
            }
          }
          if (a.titulo.toLowerCase().match("revisita")) {
            a.siglaParte = "R";
            a.vaga2 = { nome: "⚡" };

            a.vaga1 = this.procuraIrmao("R", x.nomeGrupo);
            if (a.vaga1.nome !== "⚡")
              a.vaga2 = this.procuraIrmao(
                x.nomeSala,
                "A",
                x.nomeGrupo,
                a.vaga1.sexo,
                a.vaga1.privilegio
              );
            if (
              a.vaga1.nome !== "⚡" &&
              a.vaga2.nome == "⚡" &&
              a.vaga1.privilegio == "E"
            )
              a.vaga2 = this.procuraIrmao(
                x.nomeSala,
                "A",
                x.nomeGrupo,
                a.vaga1.sexo,
                "E"
              );

            if (a.vaga2.nome == "⚡") {
              a.vaga1 = this.procuraIrmao(
                x.nomeSala,
                "R",
                x.nomeGrupo,
                this.inverteSexo(a.vaga1.sexo)
              );
              if (a.vaga1.nome !== "⚡")
                a.vaga2 = this.procuraIrmao(
                  x.nomeSala,
                  "A",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  a.vaga1.privilegio
                );

              if (
                a.vaga1.nome !== "⚡" &&
                a.vaga2.nome == "⚡" &&
                a.vaga1.privilegio == "E"
              )
                a.vaga1 = this.procuraIrmao(
                  x.nomeSala,
                  "R",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  "E"
                );
              if (a.vaga1.nome !== "⚡")
                a.vaga2 = this.procuraIrmao(
                  x.nomeSala,
                  "A",
                  x.nomeGrupo,
                  a.vaga1.sexo,
                  a.vaga1.privilegio
                );
            }
            if (a.vaga1.nome == "⚡") {
              a.vaga1 = { nome: "⚡" };
              a.vaga2 = { nome: "⚡" };
            }
          }
        }
        //if (!a.vaga1)a.vaga1 = { nome: "⚡" };

        //if(a.vaga1.nome && !a.vaga2)a.vaga1 = { nome: "⚡" };
      });
    });
  }
  procuraIrmao(nomeSala, parte, nomeGrupo, sexo, privilegio) {
    let pessoas;
    let pessoa;

    if (this.notEmpty(this.irmaos))
      pessoas = this.filtraAtivadasParaEscalar(this.irmaos);

    if (nomeSala == "Principal") {
      if (this.notEmpty(pessoas))
        pessoas = this.filtraSemSalaExclusiva(this.irmaos);
    }

    if (this.notEmpty(pessoas))
      pessoas = this.filtraNaoDesignadasParaOutrasSalas(pessoas);
    // if (this.notEmpty(pessoas))
    //   pessoas = this.filtraNaoDesignadasParaEstaSala(pessoas,x);
    if (this.notEmpty(pessoas))
      pessoas = this.filtraDoMesmoGrupo(pessoas, nomeGrupo);
    if (this.notEmpty(pessoas))
      pessoas = this.filtraComProximaParteRelacionada(pessoas, parte);
    if (this.notEmpty(pessoas) && sexo)
      pessoas = this.filtraDoMesmoSexo(pessoas, sexo);
    if (this.notEmpty(pessoas) && privilegio == "E")
      pessoas = this.filtraApenasPublicadores(pessoas);
    if (this.notEmpty(pessoas))
      pessoa = this.filtraPrimeiraPessoaAdequada(pessoas);

    if (!pessoa) pessoa = { nome: "⚡" };
    return { ...pessoa };
  }

  filtraSemSalaExclusiva() {
    return this.irmaos.filter((a) => !a?.salaB);
  }

  filtraAtivadasParaEscalar() {
    return this.irmaos.filter((a) => a.situacao);
  }

  filtraNaoDesignadasParaOutrasSalas(pessoas) {
    return pessoas.filter(
      (a) =>
        !this.grupos.some((b) =>
          b.partes.some((c) => c.vaga1?.id == a.id || c.vaga2?.id == a.id)
        )
    );
  }
  filtraNaoDesignadasParaEstaSala(pessoas, x) {
    return pessoas.filter(
      (a) => !x.partes.some((c) => c.vaga1?.id == a.id || c.vaga2?.id == a.id)
    );
  }
  filtraDoMesmoGrupo(pessoas, nomeGrupo) {
    return pessoas.filter((a) =>
      this.gruposNumero
        .find((x) => x.name == nomeGrupo)
        ?.items.includes(a.grupo)
    );
  }
  filtraComProximaParteRelacionada(pessoas, parte) {
    return pessoas.filter((a) => a.proximaParte.substring(2) == parte);
  }
  filtraDoMesmoSexo(pessoas, sexo) {
    return pessoas.filter((a) => a.sexo == sexo);
  }
  filtraApenasPublicadores(pessoas) {
    return pessoas.filter((a) => a.privilegio == "P");
  }
  filtraPrimeiraPessoaAdequada(pessoas) {
    return pessoas.splice(0, 1)[0];
  }
  notEmpty(array) {
    return array.length > 0;
  }

  diasSemParte(data) {
    let hoje = this.dataInicial;

    let Difference_In_Time = hoje.getTime() - nDate(data).getTime();
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    let result = Difference_In_Days.toFixed(0);
    if (result < 0) result = result * -1;
    return result;
  }

  filtraServos(pessoas) {
    return pessoas.filter((a) => a.privilegio == "S");
  }

  filtraAnciaos(pessoas) {
    return pessoas.filter((a) => a.privilegio == "A");
  }

  filtraPublicadoresEEstudantes(pessoas) {
    return pessoas.filter((a) => a.privilegio == "P" || a.privilegio == "E");
  }

  organizaPorOrdemAlfabetica(pessoas) {
    pessoas.sort((a, b) => (a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0));
  }

  substituicao(data) {
    let pessoas = [...this.irmaos];
    let servos = [];
    let anciaos = [];
    if (this.notEmpty(pessoas)) anciaos = this.filtraAnciaos(pessoas);
    if (this.notEmpty(pessoas)) servos = this.filtraServos(pessoas);

    if (this.notEmpty(pessoas))
      pessoas = this.filtraAtivadasParaEscalar(pessoas);
    if (this.notEmpty(pessoas))
      pessoas = this.filtraNaoDesignadasParaOutrasSalas(pessoas);
    if (this.notEmpty(pessoas))
      pessoas = this.filtraDoMesmoGrupo(pessoas, data.nomeGrupo);
    if (this.notEmpty(pessoas))
      pessoas = this.filtraPublicadoresEEstudantes(pessoas);

    if (this.notEmpty(pessoas) && this.notEmpty(servos)) {
      this.organizaPorOrdemAlfabetica(servos);
      pessoas.push(...servos);
    }

    if (data.siglaParte == "E" || data.siglaParte == "D") {
      if (this.notEmpty(pessoas) && this.notEmpty(anciaos)) {
        this.organizaPorOrdemAlfabetica(anciaos);
        pessoas.push(...anciaos);
      }
    }

    if (data.siglaParte == "L" || data.siglaParte == "D")
      if (this.notEmpty(pessoas))
        pessoas = this.filtraDoMesmoSexo(pessoas, "M");

    // if (this.notEmpty(pessoas)) {
    //   let sexo = null;
    //   if (data.siglaParte == "L" || data.siglaParte == "D") {
    //     sexo = "M";
    //   } else {

    //     if (data.irmao2.nome !== "⚡") sexo = data.irmao2.sexo;

    //   }
    //   if (sexo) pessoas = this.filtraDoMesmoSexo(pessoas, sexo);
    // }
    // if (this.notEmpty(pessoas))
    //   pessoas = this.filtraComProximaParteRelacionada(pessoas, data.siglaParte);

    if (pessoas.length >= 0) pessoas.unshift({ nome: "⚡" });

    return pessoas;
  }

  troca(newirmao, data) {
    let achou = false;
    this.grupos.forEach((x) => {
      x.partes.forEach((a) => {
        if (
          x.nomeGrupo == data.nomeGrupo &&
          x.nomeSala == data.nomeSala &&
          a.titulo == data.titulo
        ) {
          if (data.position == 1) {
            if (
              a.vaga1.id &&
              a.vaga1.data == this.dataInicial.toLocaleDateString("pt-br") &&
              !this.reverseIrmaos.find((z) => z.id == a.vaga1.id)
            )
              this.reverseIrmaos.push({ ...a.vaga1 });
            a.vaga1 = { ...newirmao };
            achou = true;
          }
          if (data.position == 2) {
            if (
              a.vaga2.id &&
              a.vaga2.data == this.dataInicial.toLocaleDateString("pt-br") &&
              !this.reverseIrmaos.find((z) => z.id == a.vaga2.id)
            )
              this.reverseIrmaos.push({ ...a.vaga2 });
            a.vaga2 = { ...newirmao };
            achou = true;
          }
        }
      });
    });
    return achou;
  }

  irmaosForUpdate() {
    let irmaosUp = [];
    this.grupos.forEach((x) => {
      x.partes.forEach((a) => {
        let parteDiferente = false;
        if (a.vaga1 && a.vaga1.nome != "⚡") {
          if (
            a.vaga1.proximaParte &&
            a.vaga1.proximaParte.substring(2) !== a.siglaParte
          )
            parteDiferente = true;
          irmaosUp.push({ irmaoEscalado: { ...a.vaga1 }, parteDiferente });
        }
        if (a.vaga2 && a.vaga2.nome != "⚡") {
          if (
            a.vaga2.proximaParte &&
            a.vaga2.proximaParte.substring(2) !== a.siglaParte
          )
            parteDiferente = true;
          irmaosUp.push({ irmaoEscalado: { ...a.vaga2 }, parteDiferente });
        }
      });
    });
    this.irmaosUp = [...irmaosUp];
    return irmaosUp;
  }

  setGrupos(grupos) {
    this.grupos = grupos;
  }
  setDataInicial(dataInicial) {
    this.dataInicial = dataInicial;
  }
  inverteSexo(sexo) {
    if (sexo == "F") return "M";
    if (sexo == "M") return "F";
  }
}
