// The frontend to the solving process. Allows the user to start/stop the
// main annealing loop. The actual solving loop takes place statefully here
// as well; it was tied too tightly to the user frontend to justify placing
// it elsewhere. See "solving.js" for supplementary solving functions.

interface Problem {

// The full problem state, passed as a single struct for convenience.

    readonly index: Index;
    readonly consIndex: ConsIndex;
}

// The amount of milliseconds that take place between annealing cycles, giving
// the user a chance to click the stop button.
const TIMEOUT: number = 5;

class Annealer {

// The class that performs the simulated annealing loop and tracks the best
// score/arrangement of atoms possible. This setup allows the user to break
// the loop whenever he or she wishes, and accept optimal incomplete solutions.

    active: boolean;
    arrangement: Arrangement;
    iteration: number;
    temperature: number;
    score: number;
    constructor() {
        this.active = false;
        this.arrangement = []
        this.iteration = 0;
        this.temperature = 1.0;
        this.score = -1;
    }
    iterate(ci: ConsIndex, a: Arrangement, c: number,
            bestA: Arrangement, bestC: number) {
        let newA: Arrangement = [];
        let newC: number = 0;
        let d: number = 0;
        let t: number = this.temperature;
        for (let x = 0 ; x < 500 ; x++) {
            newA = swap(a, ci.all.length);
            newC = ci.score(newA);
            d = newC - c;
            if (newC === 0) {
                this.score = 0;
                this.iteration += x;
                this.arrangement = newA;
                this.active = false;
                return;
            } else if (d <= 0) {
                bestA = newA;
                bestC = newC;
                a = newA;
                c = newC;
            } else if (Math.random() < Math.exp(-d/t)) {
                a = newA;
                c = newC;
            }
        }
        this.score = bestC;
        this.iteration += 500;
        this.temperature -= (t > 0.2) ? 0.05 : 0.0;
        if (this.active) {
            setTimeout(() => this.iterate(ci, a, c, bestA, bestC), TIMEOUT);
        } else {
            this.arrangement = bestA;
        }
    }
    stop() {
        this.active = false;
    }
    start(p: Problem) {
        const i = p.index;
        const ci = p.consIndex;
        const a = shuffle(i.values.length, ci.all.length);
        const c = ci.score(a);
        this.active = true;
        this.iterate(ci, a, c, a, c);
    }
}

Vue.component('solved', {

// Where the accepted solution is displayed.

    props: ['solvedMatrix', 'rows'],
    template: `
    <div id="solved">
      <div class="solvedGroup" v-for="(x, n) in solvedMatrix">
        <h2>{{ x[0] }}</h2>
        <ul>
          <li v-for="y in x.slice(1)">
            {{ y }}
          </li>
        </ul>
      </div>
    </div>
    `
});

Vue.component('solve', {

// The frontend to the solver.

    props: ['tip', 'problem'],
    data: function() {
        return {
            solver: new Annealer(),
            rows: 1 // Rows count does nothing for now. Might be used later.
        };
    },
    methods: {
        start(a: Annealer, p: Problem) {
            a.start(p);
        },
        stop(a: Annealer) {
            a.stop();
        },
        sort(p: Problem, a: Arrangement): string[][] {
            const xs = new Array(p.consIndex.all.length).fill([]);
            const ys = xs.map((x, i) => {
                return a.reduce((acc, y, j) => {
                    return y === i ? acc.concat([j]) : acc;
                }, []).map(z => p.index.values[z].value.name);
            });
            return ys.map((x, i) => [p.consIndex.all[i].name.name].concat(x));
        },
        progress(a: Annealer): number {
            return 1.0 - (a.score / 100);
        }
    },
    template: `
    <div id="paneContents">
      <tip :tip="tip"></tip>
      <div id="solverStatus">
        <div class="solverRow">
          <label>Cycle:</label> {{ solver.iteration }}
        </div>
        <div class="solverRow">
          <label>Temp:</label>
          <input class="numField" type="text" v-model="solver.temperature">
          </input>
        </div>
        <div class="solverRow">
          <label>Score:</label> {{ solver.score }}
        </div>
        <br>
          <progress id="solverProgress" :value="progress(solver)">
          </progress>
      </div>
      <button class="bigButton" v-if="solver.active" @click="stop(solver)">
        ■
      </button>
      <button class="bigButton" v-else @click="start(solver, problem)">
        ▶
      </button>
      <solved :solvedMatrix="sort(problem, solver.arrangement)" :rows="rows">
      </solved>
    </div>
    `
});
