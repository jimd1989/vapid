// Structs and functions that manage the frontend of Constraint groups. This
// data is later parsed into actual Constraints by "constraints-parsing.ts"

// The available constraints on a local group level.
const GroupMenu = ['contains', 'excludes', 'is size',
                   'has attribute', 'has attribute relationship'];

// The available mathematical relations between Atoms and Attributes.
const RelationMenu = ['=', '≠', '>', '≥', '<', '≤'];

// The available constraints on a global level.
const GlobalMenu =['position', 'vertical position', 'vertical alignment', 
                   'attribute relationship', 'attribute balance'];

// The available arthimetic operations to perform on values.
const MathMenu = ['+', '-', '×', '÷', '±'];

interface ProtoGroup {

// A primitive type that will eventually be parsed into a full ConsGroup object

    readonly name: string;
    readonly constraints: ProtoConstraint[];
}

class ProtoGroupIndex {

// An object that statefully stores/updates ProtoConstraint objects derived
// from user input. The actual ConsIndex type is initialized from this data
// when the user places the program into solving mode.

    all: ProtoGroup[];
    globalConstraints: ProtoConstraint[];
    atomNames: string[];
    attributeNames: string[];
    constraintConstants: [string[], string[], string[], string[]];
    constructor() {
        this.all = [];
        this.globalConstraints = [];
        this.atomNames = [];
        this.attributeNames = [];
        this.constraintConstants =
            [GroupMenu, RelationMenu, GlobalMenu, MathMenu];
    }
    names(): string[] {
        return this.all.map(x => x.name);
    }
    update(pi: ProtoIndex) {
        this.atomNames = pi.all.map(x => x.name);
        const xs = pi.all.reduce((acc,x)=> acc.concat(x.attributes.map(y => {
            return y.name.toLowerCase();
        })), []);
        this.attributeNames = Array.from(new Set(xs)).sort();
    }
    addGroup() {
        this.all.push({name: 'Group ' + this.all.length.toString(),
                       constraints: []});
    }
    deleteGroup(n: number) {
        this.all.splice(n, 1);
    }
    copyGroup(n: number) {
        const x = JSON.parse(JSON.stringify(this.all[n]));
        this.all.splice(n, 0, x);
    }
    upGroup(n: number) {
        if (n == 0 || this.all.length <= 1) {
            return;
        }
        this.all.splice(n-1, 2, this.all[n], this.all[n-1]);
    }
    downGroup(n: number) {
        if (n == (this.all.length - 1) || this.all.length <= 1) {
            return;
        }
        this.all.splice(n, 2, this.all[n+1], this.all[n]);
    }
    addConstraint(n: number) {
        this.all[n].constraints.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    deleteConstraint(n: number, m: number) {
        this.all[n].constraints.splice(m, 1);
    }
    addGlobalConstraint() {
        this.globalConstraints.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    deleteGlobalConstraint(n: number) {
        this.globalConstraints.splice(n, 1);
    }
}

Vue.component('consContains', {

// Frontend to a "contains item" Constraint.

    props: ['constraint', 'items', 'constants'],
    template: `
    <span class="constraint">
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[0]" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in items" :value="n">{{ x }}</option>
      </select>
    </span>
    `
});

Vue.component('consSize', {

// Frontend to an "is size" Constraint.

    props: ['constraint', 'constants'],
    template: `
    <span class="constraint">
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[0]" :value="n">{{ x }}</option>
      </select>
      between
      <input class="numField" type="number" v-model="constraint[1]"></input>
      and
      <input class="numField" type="number" v-model="constraint[2]"></input>
    </span>
    `
});

Vue.component('consAttribute', {

// Frontend to a "has attribute" Constraint.    

    props: ['constraint', 'attributes', 'constants'],
    template: `
    <span class="constraint">
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[0]" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in attributes" :value="n">{{ x }}</option>
      </select>
      between
      <input class="numField" type="number" v-model="constraint[2]"></input>
      and
      <input class="numField" type="number" v-model="constraint[3]"></input>
    </span>
    `
});

Vue.component('consAttributeRelation', {

// Frontend to a "has attribute relationship" Constraint.

    props: ['constraint', 'attributes', 'constants'],
    template: `
    <span class="constraint">
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[0]" :value="n">{{ x }}</option>
      </select>
      where
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in attributes" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[2]">
        <option v-for="(x, n) in constants[1]" :value="n">{{ x }}</option>
      </select>
      (
      <select class="dropdown" v-model="constraint[3]">
        <option v-for="(x, n) in attributes" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[4]">
        <option v-for="(x, n) in constants[3]" :value="n">{{ x }}</option>
      </select>
      <input class="numField" type="number" v-model="constraint[5]"></input>
      )
    </span>
    `
});

Vue.component('group', {

// Frontend to a local Constraint group.

    props: ['group', 'attributes', 'items', 'constants'],
    template: `
    <li class="group">
      <span class="groupButtons">
        <button @click="$emit('delete-group')">x</button>
        <button @click="$emit('copy-group')">Copy</button>
        <button @click="$emit('up-group')">↑</button>
        <button @click="$emit('down-group')">↓</button>
      </span>
      <div class="atomForm">
        <label>Name:</label>
        <input type="text" class="makeAtomName" v-model="group.name"></input>
      </div>
      <ul class="groupConstraints">
        <li v-for="(x, n) in group.constraints">
          <button @click="$emit('delete-group-constraint', n)">x</button>
          <consContains v-if="x[0] === 0"
                        :constraint="x" :items="items"
                        :constants="constants" :key="n">
          </consContains>
          <consContains v-else-if="x[0] === 1"
                        :constraint="x" :items="items"
                        :constants="constants" :key="n">
          </consContains>
          <consSize v-else-if="x[0] === 2"
                    :constraint="x" :constants="constants">
          </consSize>
          <consAttribute v-else-if="x[0] === 3"
                         :constraint="x" :attributes="attributes"
                         :constants="constants" key="n">
          </consAttribute>
          <consAttributeRelation v-else
                         :constraint="x" :attributes="attributes"
                         :constants="constants" key="n">
          </consAttributeRelation>
        </li>
      </ul>
      <button class="groupAddButton"
              @click="$emit('add-group-constraint')">
        + Constraint
      </button>
    </li>
    `
});

Vue.component('consPosition', {
   
// Frontend to a global Atom position Constraint.

    props: ['constraint', 'items', 'constants'],
    template: `
    <span class="constraint">
      <button @click="$emit('delete-global-constraint')">x</button>
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[2]" :value="n">{{ x }}</option>
      </select>
      where
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in items" :value="n">{{ x }}</option>
      </select>
      <select v-if="constraint[4] !== 4" class="dropdown"
              v-model="constraint[2]">
        <option v-for="(x, n) in constants[1]" :value="n">
          {{ x }}
        </option>
      </select>
      <select v-else class="dropdown" v-model="constraint[2]">
        <option v-for="(x, n) in constants[1]" :value="n">
          {{ x }}
        </option>
      </select>
      (
      <select class="dropdown" v-model="constraint[3]">
        <option v-for="(x, n) in items" :value="n">{{ x }}</option>
      </select>
      <select v-if="constraint[2]>1" class="dropdown" v-model="constraint[4]">
        <option v-for="(x, n) in constants[3]" :value="n">
          {{ x }}
        </option>
      </select>
      <select v-else class="dropdown" v-model="constraint[4]">
        <option v-for="(x, n) in constants[3]" :value="n">
          {{ x }}
        </option>
      </select>
      <input class="numField" type="text" v-model="constraint[5]"></input>
      )
    </span>
    `
});

Vue.component('consVerticalPosition', {
   
// Frontend to a global Atom alignment Constraint.

    props: ['constraint', 'items', 'constants'],
    template: `
    <span class="constraint">
      <button @click="$emit('delete-global-constraint')">x</button>
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[2]" :value="n">{{ x }}</option>
      </select>
      where
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in items" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[2]">
        <option v-for="(x, n) in constants[1]" :value="n">{{ x }}</option>
      </select>
      column number
      <input class="numField" type="text" v-model="constraint[3]"></input>
      in rows of
      <input class="numField" type="text" v-model="constraint[4]"></input>
    </span>
    `
});

Vue.component('consAlignment', {
   
// Frontend to a global Atom alignment Constraint.

    props: ['constraint', 'items', 'constants'],
    template: `
    <span class="constraint">
      <button @click="$emit('delete-global-constraint')">x</button>
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[2]" :value="n">{{ x }}</option>
      </select>
      where
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in items" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[2]">
        <option v-for="(x, n) in constants[1]" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[3]">
        <option v-for="(x, n) in items" :value="n">{{ x }}</option>
      </select>
      in rows of
      <input class="numField" type="text" v-model="constraint[4]"></input>
    </span>
    `
});

Vue.component('consGlobalAttributeRelation', {
   
// Frontend to a global attribute relation Constraint.

    props: ['constraint', 'attributes', 'groups', 'constants'],
    template: `
    <span class="constraint">
      <button @click="$emit('delete-global-constraint')">x</button>
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[2]" :value="n">{{ x }}</option>
      </select>
      where
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in groups" :value="n">{{ x }}</option>
      </select>
      's
      <select class="dropdown" v-model="constraint[2]">
        <option v-for="(x, n) in attributes" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[3]">
        <option v-for="(x, n) in constants[1]" :value="n">{{ x }}</option>
      </select>
      (
      <select class="dropdown" v-model="constraint[4]">
        <option v-for="(x, n) in groups" :value="n">{{ x }}</option>
      </select>
      's
      <select class="dropdown" v-model="constraint[5]">
        <option v-for="(x, n) in attributes" :value="n">{{ x }}</option>
      </select>
      <select class="dropdown" v-model="constraint[6]">
        <option v-for="(x, n) in constants[3]" :value="n">{{ x }}</option>
      </select>
      <input class="numField" type="text" v-model="constraint[7]"></input>
      )
    </span>
    `
});

Vue.component('consAttributeBalance', {
   
// Frontend to a global attribute balance Constraint.

    props: ['constraint', 'attributes', 'constants'],
    template: `
    <span class="constraint">
      <button @click="$emit('delete-global-constraint')">x</button>
      <select class="dropdown" v-model="constraint[0]">
        <option v-for="(x, n) in constants[2]" :value="n">{{ x }}</option>
      </select>
      of
      <select class="dropdown" v-model="constraint[1]">
        <option v-for="(x, n) in attributes" :value="n">{{ x }}</option>
      </select>
    </span>
    `
});
Vue.component('globalGroup', {

// Frontend to collection of global Constraints.

    props: ['constraints', 'attributes', 'items', 'groups', 'constants'],
    template: `
    <div id="dummyDiv">
    <div id="globalConstraints">
      <ul>
        <li v-for="(x, n) in constraints">
          <consPosition v-if="x[0] === 0"
                        :constraint="x" :items="items"
                        :constants="constants" :key="n"
              @delete-global-constraint="$emit('delete-global-constraint', n)">
          </consPosition>
          <consVerticalPosition v-else-if="x[0] === 1"
                        :constraint="x" :items="items"
                        :constants="constants" :key="n"
              @delete-global-constraint="$emit('delete-global-constraint', n)">
          </consVerticalPosition>
          <consAlignment v-else-if="x[0] === 2"
                        :constraint="x" :items="items"
                        :constants="constants" :key="n"
              @delete-global-constraint="$emit('delete-global-constraint', n)">
          </consAlignment>
          <consGlobalAttributeRelation v-else-if="x[0] === 3"
                        :constraint="x" :attributes="attributes"
                        :groups="groups" :constants="constants" :key="n"
              @delete-global-constraint="$emit('delete-global-constraint', n)">
          </consGlobalAttributeRelation>
          <consAttributeBalance v-else-if="x[0] === 4"
                        :constraint="x" :attributes="attributes"
                        :constants="constants" :key="n"
              @delete-global-constraint="$emit('delete-global-constraint', n)">
          </consAttributeBalance>
        </li>
      </ul>
    </div>
      <button class="bigButton" @click="$emit('add-global-constraint')">
        + Global Constraint
      </button>
    </div>
    `
});

Vue.component('groups', {

// Frontend to index of all Constraint groups.

    props: ['tip', 'index', 'globalTip', 'groupIndex'],
    methods: {
        groupNames(pgi: ProtoGroupIndex) {
            return pgi.all.map(x => x.name);
        }
    },
    template: `
    <div id="paneContents">
      <tip :tip="tip"></tip>
      <ul id="groups">
        <group v-for="(x, n) in index.all"
  :group="x" :items="index.atomNames"
  :attributes="index.attributeNames"
  :constants="index.constraintConstants" :key="n"
  @delete-group="$emit('delete-group', n)"
  @copy-group="$emit('copy-group', n)"
  @up-group="$emit('up-group', n)"
  @down-group="$emit('down-group', n)"
  @add-group-constraint="$emit('add-group-constraint', n)"
  @delete-group-constraint="$emit('delete-group-constraint', n, ...arguments)">
        </group>
      </ul>
      <button class="bigButton" @click="$emit('add-group')">+ Group</button>
      <tip :tip="globalTip"></tip>
      <globalGroup :constraints="index.globalConstraints"
   :attributes="index.attributeNames"
   :items="index.atomNames"
   :groups="groupNames(groupIndex)"
   :constants="index.constraintConstants"
   @add-global-constraint="$emit('add-global-constraint')"
   @delete-global-constraint="$emit('delete-global-constraint', ...arguments)">
      </globalGroup>
    </div>
    `
});
