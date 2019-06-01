// The toplevel of the Vue frontend. Renders all structs to DOM and manages
// state of user input.

interface Pane {

// Represents a single screen in the app. The id field is used to recognize
// which view to render.

    readonly id: number;
    readonly title: string;
}

class Panes {

// Contains all possible screen titles and tracks the currently active view.

    readonly titles: Pane[];
    active: number;
    constructor() {
        this.titles = ['Items', 'Groups', 'Solve', 'Save', 'Load'].
            map((x, i) => { return {id: i, title: x}; });
        this.active = 0;
    }
    switch(n: number): void {
        this.active = n;
    }
}

Vue.component('pane', {

// A clickable title that takes the user to a specific screen.

    props: ['pane', 'isActive'],
    template: `
        <li v-if="isActive" class="paneActive" @click="$emit('make-active')">
          <a href="#">{{ pane.title }}</a>
        </li>
        <li v-else class="pane" @click="$emit('make-active')">
          <a href="#">{{ pane.title }}</a>
        </li>
    `
});

Vue.component('navigation', {

// The master component. Contains all state and displays all screens.

    data: function() {
        return {
            navbar: new Panes(),
            tips: [new Tip(ItemsTip), new Tip(GroupsTip), new Tip(GlobalTip),
                   new Tip(SolveTip), new Tip(SaveTip), new Tip(LoadTip)],
            index: new ProtoIndex(),
            groups: new ProtoGroupIndex()
        };
    },
    methods: {
        makeActive(n: number) {
            this.navbar.switch(n);
        },
        addAtom() {
            this.index.addAtom();
        },
        deleteAtom(n: number) {
            this.index.deleteAtom(n);
        },
        copyAtom(n: number) {
            this.index.copyAtom(n);
        },
        addAttribute(n: number) {
            this.index.addAttribute(n);
        },
        deleteAttribute(n: number, m: number) {
            this.index.deleteAttribute(n, m);
        },
        updateGroups(pi: ProtoIndex): ProtoGroupIndex {
            this.groups.update(pi);
            return this.groups;
        },
        addGroup() {
            this.groups.addGroup();
        },
        deleteGroup(n: number) {
            this.groups.deleteGroup(n);
        },
        copyGroup(n: number) {
            this.groups.copyGroup(n);
        },
        upGroup(n: number) {
            this.groups.upGroup(n);
        },
        downGroup(n: number) {
            this.groups.downGroup(n);
        },
        addGroupConstraint(n: number) {
            this.groups.addConstraint(n);
        },
        deleteGroupConstraint(n: number, m: number) {
            this.groups.deleteConstraint(n, m);
        },
        addGlobalConstraint() {
            this.groups.addGlobalConstraint();
        },
        deleteGlobalConstraint(n: number) {
            this.groups.deleteGlobalConstraint(n);
        },
        prepareProblem(pi: ProtoIndex, pgi: ProtoGroupIndex): Problem {
            const i = new Index(pi);
            const ci = new ConsIndex(i, pgi);
            return {index: i, consIndex: ci};
        },
        loadData() {
            const txt = (<HTMLInputElement>document.getElementById('loadData'))
                .value;
            const x = JSON.parse(txt);
            this.index.all = x.items.all;
            this.groups.all = x.groups.all;
            this.groups.globalConstraints = x.groups.globalConstraints;
            this.navbar.active = 1;
        }
    },
    template: `
    <div id="appContents">
      <div id="panes">
      <ul>
        <pane v-for="(x, n) in navbar.titles"
              :pane="x" :isActive="n === navbar.active" :key="x.id"
              @make-active="makeActive(n)">
        </pane>
      </ul>
      </div>
      <items v-if="navbar.active === 0"
             :tip="tips[0]"
             :index="index"
             @add-atom="addAtom"
             @delete-atom="deleteAtom"
             @copy-atom="copyAtom"
             @add-attribute="addAttribute"
             @delete-attribute="deleteAttribute">
      </items>
      <groups v-else-if="navbar.active === 1"
              :tip="tips[1]"
              :index="updateGroups(index)"
              :globalTip="tips[2]"
              :groupIndex="groups"
              @add-group="addGroup"
              @delete-group="deleteGroup"
              @copy-group="copyGroup"
              @up-group="upGroup"
              @down-group="downGroup"
              @add-group-constraint="addGroupConstraint"
              @delete-group-constraint="deleteGroupConstraint"
              @add-global-constraint="addGlobalConstraint"
              @delete-global-constraint="deleteGlobalConstraint">
      </groups>
      <solve v-else-if="navbar.active === 2"
             :tip="tips[3]"
             :problem="prepareProblem(index, groups)">
      </solve>
      <save v-else-if="navbar.active === 3"
            :tip="tips[4]"
            :items="JSON.stringify(index)" :groups="JSON.stringify(groups)">
      </save>
      <load v-else-if="navbar.active === 4"
            :tip="tips[5]"
            @load-data="loadData">
      </load>
    </div>
    `
});

// A Vue instance that holds it all together.
let vm = new Vue({
    el: '#app'
});
