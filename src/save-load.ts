// Frontends that expose program state as copy/paste JSON data, allowing
// saving and loading of problems.

Vue.component('save', {

// Frontend to the save screen.

    props: ['tip', 'items', 'groups'],
    template: `
    <div id="paneContents">
      <tip :tip="tip"></tip>
      <textarea class="textBox">
{"items":{{ items }},"groups":{{ groups }}}
      </textarea>
    </div>
    `
});

Vue.component('load', {

// Frontend to the load screen.

    props: ['tip'],
    template: `
    <div id="paneContents">
      <tip :tip="tip"></tip>
      <textarea id="loadData" class="textBox"></textarea>
      <button class="bigButton" @click="$emit('load-data')">Load</button>
    </div>
    `
});
