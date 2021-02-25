import { PDFDocument, font } from "pdf-lib";

export class Arquivos {
  constructor(grupos, dataini, datafim) {
    this.oReq = new XMLHttpRequest();
    this.oReq2 = new XMLHttpRequest();
    this.dataini = dataini.toLocaleDateString("pt-BR").substring(0, 5);
    this.datafim = datafim.toLocaleDateString("pt-BR").substring(0, 5);
    this.oReq.responseType = "blob";
    this.oReq2.responseType = "blob";
    this.grupos = grupos;
    this.oReq.onload = this.load;
    this.oReq2.onload = this.load2;
    this.formulario = [];
    this.pdfBytes2;
    this.pdfBytes;
    this.send();
  }
  send() {
    this.oReq.open("GET", "/files/model.pdf", true);
    this.oReq.send();
    this.oReq2.open("GET", "/files/model8.pdf", true);
    this.oReq2.send();
  }
  async montar(parte, nome, sala, nomeArquivo, ajudante) {
    try {
      const existingPdfBytes = await this.oReq.response.arrayBuffer();
      const buffer = new Uint8Array(existingPdfBytes);
      const pdfDoc = await PDFDocument.load(buffer);

      const form = pdfDoc.getForm();
      //const fields = form.getFields();

      let field = form.getField("Nome");
      field.setText(nome);
      field = form.getField("Data");
      field.setText(`${this.dataini} - ${this.datafim}`);
      if (ajudante) {
        field = form.getField("Ajudante");
        field.setText(ajudante);
      }

      let check = form.getCheckBox(parte);
      check.check();
      check = form.getCheckBox(sala);
      check.check();

      this.pdfBytes = await await pdfDoc.save();

      var a = document.createElement("a");
      a.download = `${nomeArquivo}-${this.dataini}-${nome}.pdf`;
      a.style = "display:none";
      a.href = window.URL.createObjectURL(new Blob([this.getPdf()]));
      a.click();
      a.remove();
    } catch (e) {
      console.log(e);
    }
  }
  load = async () => {
    this.grupos.forEach((x) => {
      let sala = x.nomeSala;
      let nomeArquivo;

      if (x.nomeGrupo == "Grupo 1") nomeArquivo = "G1-P";
      if (x.nomeGrupo == "Grupo 2") nomeArquivo = "G2-P";
      if (x.nomeGrupo == "Grupo 2") nomeArquivo = "G3-P";
      if (sala == "Sala B") {
        sala = "SalaB";
        nomeArquivo = nomeArquivo.substr(0, 3) + "B";
      }
      if (sala == "Sala C") {
        sala = "SalaC";
        nomeArquivo = nomeArquivo.substr(0, 3) + "C";
      }
      x.partes.forEach((a) => {
        if (a.siglaParte == "L" && a.vaga1.nome != "⚡") {
          nomeArquivo = nomeArquivo.substr(0, 4) + "L";
          this.montar("Leitura", a.vaga1.nome, sala, nomeArquivo);
        }
        if (a.siglaParte == "D" && a.vaga1.nome != "⚡") {
          nomeArquivo = nomeArquivo.substr(0, 4) + "D";
          this.montar("Discurso", a.vaga1.nome, sala, nomeArquivo);
        }
        if (
          a.siglaParte == "R" &&
          a.vaga1.nome != "⚡" &&
          a.vaga2.nome != "⚡"
        ) {
          nomeArquivo = nomeArquivo.substr(0, 4) + "R";
          this.montar(
            "Revisita",
            a.vaga1.nome,
            sala,
            nomeArquivo,
            a.vaga2.nome
          );
        }
        if (
          a.siglaParte == "E" &&
          a.vaga1.nome != "⚡" &&
          a.vaga2.nome != "⚡"
        ) {
          nomeArquivo = nomeArquivo.substr(0, 4) + "E";
          this.montar("Estudo", a.vaga1.nome, sala, nomeArquivo, a.vaga2.nome);
        }
        if (
          a.siglaParte == "C" &&
          a.vaga1.nome != "⚡" &&
          a.vaga2.nome != "⚡"
        ) {
          nomeArquivo = nomeArquivo.substr(0, 4) + "C";
          this.montar(
            "Conversa",
            a.vaga1.nome,
            sala,
            nomeArquivo,
            a.vaga2.nome
          );
        }
      });
    });
  };

  load2 = async () => {
    this.grupos.forEach((x) => {
      let sala = x.nomeSala;
      let nomeArquivo;

      if (x.nomeGrupo == "Grupo 1") nomeArquivo = "G1-semana-";
      if (x.nomeGrupo == "Grupo 2") nomeArquivo = "G2-semana-";
      if (x.nomeGrupo == "Grupo 2") nomeArquivo = "G3-semana-";

      nomeArquivo = nomeArquivo + this.dataini;
      if (sala == "Sala B") {
        sala = "SalaB";
      }
      x.partes.forEach((a) => {
        let linha = {
          grupo: x.nomeGrupo,
          nomearquivo: nomeArquivo,
          parte: "",
          sala: sala,
          irmao: "",
          irmao2: "",
        };

        if (a.siglaParte == "L" && a.vaga1.nome != "⚡") {
          linha.parte = "Leitura";
          linha.irmao = a.vaga1.nome;
          this.formulario.push(linha);
        }
        if (a.siglaParte == "D" && a.vaga1.nome != "⚡") {
          linha.parte = "Discurso";
          linha.irmao = a.vaga1.nome;
          this.formulario.push(linha);
        }
        if (
          a.siglaParte == "R" &&
          a.vaga1.nome != "⚡" &&
          a.vaga2.nome != "⚡"
        ) {
          linha.parte = "Revisita";
          linha.irmao = a.vaga1.nome;
          linha.irmao2 = a.vaga2.nome;
          this.formulario.push(linha);
        }
        if (
          a.siglaParte == "E" &&
          a.vaga1.nome != "⚡" &&
          a.vaga2.nome != "⚡"
        ) {
          linha.parte = "Estudo";
          linha.irmao = a.vaga1.nome;
          linha.irmao2 = a.vaga2.nome;
          this.formulario.push(linha);
        }
        if (
          a.siglaParte == "C" &&
          a.vaga1.nome != "⚡" &&
          a.vaga2.nome != "⚡"
        ) {
          linha.parte = "Primeira Conversa";
          linha.irmao = a.vaga1.nome;
          linha.irmao2 = a.vaga2.nome;
          this.formulario.push(linha);
        }
      });
    });

    this.montar2();
  };
  async montar2() {
    try {
      const existingPdfBytes = await this.oReq2.response.arrayBuffer();
      const buffer = new Uint8Array(existingPdfBytes);
      let grupo;
      for (let i = 0; i < 3; i++) {
        const pdfDoc = await PDFDocument.load(buffer);

        const form = pdfDoc.getForm();
        //const fields = form.getFields();
        if (i == 0) grupo = this.formulario.filter((b) => b.grupo == "Grupo 1");
        if (i == 1) grupo = this.formulario.filter((b) => b.grupo == "Grupo 2");
        if (i == 2) grupo = this.formulario.filter((b) => b.grupo == "Grupo 3");
        if (grupo.length <= 0) continue;
        let arqnome = grupo[0].nomearquivo;

        let val;
        let valindex;
        let field;

        valindex = grupo.findIndex(
          (b) => b.parte == "Leitura" && b.sala == "Principal"
        );
        if (valindex >= 0) {
          val = grupo.splice(valindex, 1)[0];
          field = form.getField("P1");
          field.setText(val.irmao);
        }
        valindex = grupo.findIndex(
          (b) => b.parte == "Leitura" && b.sala == "SalaB"
        );
        if (valindex >= 0) {
          val = grupo.splice(valindex, 1)[0];
          field = form.getField("B1");
          field.setText(val.irmao);
        }
        valindex = grupo.findIndex((b) => b.sala == "Principal");
        if (valindex >= 0) {
          val = grupo.splice(valindex, 1)[0];
          field = form.getField("P2");
          if (val.parte == "Discurso") field.setText(val.irmao);
          else field.setText(val.irmao + "/" + val.irmao2);
          field = form.getField("T2");
          field.setText(val.parte + ' (XX min)');
          valindex = grupo.findIndex(
            (b) => b.parte == val.parte && b.sala == "SalaB"
          );
          if (valindex >= 0) {
            val = grupo.splice(valindex, 1)[0];
            field = form.getField("B2");
            if (val.parte == "Discurso") field.setText(val.irmao);
            else field.setText(val.irmao + "/" + val.irmao2);
          }
        }
        valindex = grupo.findIndex((b) => b.sala == "Principal");
        if (valindex >= 0) {
          val = grupo.splice(valindex, 1)[0];
          field = form.getField("P3");
          if (val.parte == "Discurso") field.setText(val.irmao);
          else field.setText(val.irmao + "/" + val.irmao2);
          field = form.getField("T3");
          field.setText(val.parte + ' (XX min)');
          valindex = grupo.findIndex(
            (b) => b.parte == val.parte && b.sala == "SalaB"
          );
          if (valindex >= 0) {
            val = grupo.splice(valindex, 1)[0];
            field = form.getField("B3");
            if (val.parte == "Discurso") field.setText(val.irmao);
            else field.setText(val.irmao + "/" + val.irmao2);
          }
        }
        valindex = grupo.findIndex((b) => b.sala == "Principal");
        if (valindex >= 0) {
          val = grupo.splice(valindex, 1)[0];
          field = form.getField("P4");
          if (val.parte == "Discurso") field.setText(val.irmao);
          else field.setText(val.irmao + "/" + val.irmao2);
          field = form.getField("T4");
          field.setText(val.parte + ' (XX min)');
          valindex = grupo.findIndex(
            (b) => b.parte == val.parte && b.sala == "SalaB"
          );
          if (valindex >= 0) {
            val = grupo.splice(valindex, 1)[0];
            field = form.getField("B4");
            if (val.parte == "Discurso") field.setText(val.irmao);
            else field.setText(val.irmao + "/" + val.irmao2);
          }
        }
        valindex = grupo.findIndex((b) => b.sala == "Principal");
        if (valindex >= 0) {
          val = grupo.splice(valindex, 1)[0];
          field = form.getField("P5");
          if (val.parte == "Discurso") field.setText(val.irmao);
          else field.setText(val.irmao + "/" + val.irmao2);
          field = form.getField("T5");
          field.setText(val.parte + ' (XX min)');
          valindex = grupo.findIndex(
            (b) => b.parte == val.parte && b.sala == "SalaB"
          );
          if (valindex >= 0) {
            val = grupo.splice(valindex, 1)[0];
            field = form.getField("B5");
            if (val.parte == "Discurso") field.setText(val.irmao);
            else field.setText(val.irmao + "/" + val.irmao2);
          }
        }

        this.pdfBytes2 = await pdfDoc.save();

        let a = document.createElement("a");
        a.download = `${arqnome}.pdf`;
        a.style = "display:none";
        a.href = window.URL.createObjectURL(new Blob([this.getPdf2()]));
        a.click();
        a.remove();
      }
    } catch (e) {
      console.log(e);
    }
  }
  getPdf() {
    return this.pdfBytes;
  }
  getPdf2() {
    return this.pdfBytes2;
  }
}
