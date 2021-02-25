<script>
  import { createEventDispatcher } from "svelte";
  import Calender from "./Calender.svelte";
  import { getMonthName } from "./date-time.js";

  const dispatch = createEventDispatcher();

  // props
  export let isAllowed = () => true;
  export let selected = new Date();

  // state
  let date, month, year, showDatePicker;

  // so that these change with props
  $: {
    date = selected.getDate();
    month = selected.getMonth();
    year = selected.getFullYear();
  }

  // handlers
  const onFocus = () => {
    showDatePicker = true;
  };

  const next = () => {
    if (month === 11) {
      month = 0;
      year = year + 1;
      return;
    }
    month = month + 1;
  };

  const prev = () => {
    if (month === 0) {
      month = 11;
      year -= 1;
      return;
    }
    month -= 1;
  };

  const onDateChange = d => {
    showDatePicker = false;
    dispatch("datechange", d.detail);
  };
</script>

<style>
  .relative {
    position: relative;
  }
  .box {
    position: absolute;
    top: -150px;
    left: 250px;
    border: 1px solid green;
    background: lemonchiffon;
    display: inline-block;
  }

  .month-name {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 6px 0;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input{
    width: 80px;
    font-size: .8em;
  }
</style>

<div class="relative">
  <input type="text" on:focus={onFocus} value={selected.toLocaleDateString('pt-br')} />
  {#if showDatePicker}
    <div class="box">
      <div class="month-name">
        <div class="center">
          <button type="button" on:click={prev}>◀</button>
        </div>
        <div class="center">{getMonthName(month)} {year}</div>
        <div class="center">
          <button type="button" on:click={next}>▶</button>
        </div>
      </div>
      <Calender
        {month}
        {year}
        date={selected}
        {isAllowed}
        on:datechange={onDateChange} />
    </div>
  {/if}
</div>
