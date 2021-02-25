// funcao criada internamente para criar datas em formato adequado:

export const nDate = (date) =>
new Date(
  date.substring(6) +
    "/" +
    date.substring(3, 5) +
    "/" +
    date.substring(0, 2)
);