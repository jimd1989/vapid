// Structs and functions that turn user input into Atoms and Attributes,
// defined in "items.ts".

interface ProtoAttribute {

// Primitive data that will become an Attribute object.

    readonly name: string;
    readonly magnitude: number;
}

interface ProtoAtom {

// Primitive data that will become an Atom object.

    readonly name: string;
    attributes: ProtoAttribute[];
}

class ProtoIndex {

// An object pointed to by the Vue frontend that statefully collects user
// input and maintains an array of ProtoAtom objects. These will be used to
// initialize an actual Index object when the user begins the solving process.

    all: ProtoAtom[];
    constructor() {
        this.all = [];
    }
    addAtom() {
        this.all.push({name: '', attributes: []});
    }
    deleteAtom(n: number) {
        this.all.splice(n, 1);
    }
    copyAtom(n: number) {
        const x = JSON.parse(JSON.stringify(this.all[n]));
        this.all.splice(n, 0, x);
    }
    addAttribute(n: number) {
        let e = (<HTMLInputElement>document.
            getElementsByClassName('enterAttributeText')[n]);
        const xs = e.value.split(' ');
        const txt = xs[0].replace(/\s/g, '');
        const m = (xs.length != 2 || isNaN(parseInt(xs[1]))) ?
            1 : parseInt(xs[1]);
        e.value = '';
        if (txt.length === 0) {
            return;
        }
        this.all[n].attributes.push({name: txt, magnitude: m});
    }
    deleteAttribute(n: number, m: number) {
        this.all[n].attributes.splice(m, 1);
    }
}

Vue.component('item', {

// A frontend to an Atom.

    props: ['item'],
    template: `
    <li class="makeAtom">
      <div class="makeAtomButtons">
        <button @click="$emit('delete-atom')">x</button>
        <button @click="$emit('copy-atom')">Copy</button>
      </div>
      <div class="atomForm">
        <label>Name:</label>
        <input type="text" class="makeAtomName" v-model="item.name"></input>
      </div>
      <div class="atomForm">
        <label>Attribute:</label>
        <input type="text" class="enterAttributeText"
                @keydown.enter="$emit('add-attribute')">
         </input>
      </div>
      <div class="makeAttributes">
        <span class="madeAttributes">
          <span class="makeAttribute" v-for="(x, n) in item.attributes">
            <p class="makeAttributeName"> {{ x.name }}</p>
            <input type="text" class="makeAttributeMagnitude"
                   v-model="x.magnitude">
            </input>
            <button @click="$emit('delete-attribute', n)">x</button>
          </span>
        </span>
      </div>
    </li>
    `
});

Vue.component('items', {

// A frontend to the Index of Atoms.

    props: ['tip', 'index'],
    template: `
    <div id="paneContents">
      <tip :tip="tip"></tip>
      <ul id="makeIndex">
        <item v-for="(x, n) in index.all"
            :item="x" :key="n"
            @delete-atom="$emit('delete-atom', n)"
            @copy-atom="$emit('copy-atom', n)"
            @add-attribute="$emit('add-attribute', n)"
            @delete-attribute="$emit('delete-attribute', n, ...arguments)">
        </item>
      </ul>
      <button class="bigButton" @click="$emit('add-atom')">+ Item</button>
    </div>
    `
});
