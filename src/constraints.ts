// The meat of the problem solving logic is described in this file.

// A Position is a tuple representing two possible positions of an item. In
// almost all cases these values are identical, with the exception of values
// operated upon by the ± function. This data structure is required to
// represent that ambiguity.
type Position = [number, number];

// A PositionF is a function that takes a single value and returns it as a
// Position.
type PositionF = (n: number) => Position;

// Determines if either Position point equals n.
const eq = (n: number, p: Position): boolean => n === p[0] || n === p[1];

// Determines if n is greater than the lower bound of a Position.
const gt = (n: number, p: Position): boolean => n > p[0];

// Determines if n is greater than or equal to the lower bound of a Position.
const gtEq = (n: number, p: Position): boolean => n >= p[0];

// Determines if n is less than the upper bound of a Position.
const lt = (n: number, p: Position): boolean => n < p[1];

// Determines if n is less or equal to the upper bound of a Position.
const ltEq = (n: number, p: Position): boolean => n <= p[1];

// Randomly return 0 or 1. Used for scoring against Positions.
const randN = (): number => Math.round(Math.random());

// This function should not exist. It is a safeguard that is invoked when a
// Constraint is not satisfied. There is a possibility that some score
// calculations could mistakenly return 0 (indicating correctness), so this
// wrapper ensures that the Constraint is still marked unsatisfied by returning
// a 1. Once the score mathematics have been subjected to more rigor, this
// procedure can be removed.
const noZero = (n: number): number => n <= 0 ? 1 : n;

// A Constraint is a closure that accepts a Group as its parameter, but may
// contain internal references to other state, such as the Index. It
// returns a numerical value derived from its Group input, where the lower the
// integer, the more ideal the current problem state is for that Constraint. A
// perfectly statisfied Constraint returns 0.
type Constraint = (x: Group | Arrangement) => number;

// Returns 0 if true, 1 if false: the opposite of common convention due to the
// way the annealing scoring system works.
const boolNum = (b: boolean): number => b ? 0 : 1;

const rangeCheck = (min: number, max: number): [number, number] => {

// Ensures that the min and max values are in the correct order.
    
    return (min > max) ? [max, min] : [min, max];
}

const offBy = (x: number, min: number, max: number): number => {

// Returns 0 if x satsifies min/max range, or distance from range otherwise.    
    
    return (x >= min && x <= max)? 0 : (x < min) ? min - x : x - max;
}

const consSize = (min: number, max: number): Constraint => {

// Determines if the size of a Group is between [min, max].    

    const rc = rangeCheck(min, max);
    return (g: Group) => offBy(g.length, rc[0], rc[1]);
}

const consAttributes =
    (i: Index, a: symbol, min: number, max: number): Constraint => {

// Determines if the magnitude of all Attributes in a Group fits within [min,
// max].

    const rc = rangeCheck(min, max);
    return (g: Group) => offBy(attributeCount(g, i, a), rc[0], rc[1]);
}

const consAttributesEq =
    (i: Index, x: symbol, y: symbol, f: PositionF): Constraint => {

// Returns 0 if magnitudes of Attributes x and y are equal, distance between
// them otherwise. Optional numerical function f operates upon magnitude of
// y to allow for things like x = (y - 1) etc.

    return (g: Group) => {
        const nx = attributeCount(g, i, x);
        const ny = f(attributeCount(g, i, y));
        return eq(nx, ny) ? 0 : noZero(Math.abs(nx - ny[randN()]));
    }
}

const consAttributesNotEq =
    (i: Index, x: symbol, y: symbol, f: PositionF): Constraint => {

// Returns 1 if Attributes x and y are equal, 0 otherwise.

        return (g: Group) => {
            const nx = attributeCount(g, i, x);
            const ny = f(attributeCount(g, i, y));
            return !eq(nx, ny) ? 1 : 0;
        }
}

const consAttributesGt =
    (i: Index, x: symbol, y: symbol, f: PositionF): Constraint => {

// Returns 0 if Attribute magnitude of x is greater than that of y, distance
// from y+1 otherwise.

        return (g: Group) => {
            const nx = attributeCount(g, i, x);
            const ny = f(attributeCount(g, i, y));
            return gt(nx, ny) ? 0 : noZero(Math.abs((ny[0] + 1) - nx));
        }
}

const consAttributesGtEq =
    (i: Index, x: symbol, y: symbol, f: PositionF): Constraint => {

// Returns 0 if Attribute magnitude of x is greater or equal to that of y,
// distance from y otherwise.

        return (g: Group) => {
            const nx = attributeCount(g, i, x);
            const ny = f(attributeCount(g, i, y));
            return gtEq(nx, ny) ? 0 : noZero(Math.abs(ny[0] - nx));
        }
}

const consAttributesLt =
    (i: Index, x: symbol, y: symbol, f: PositionF): Constraint => {

// Returns 0 if Attribute magnitude of x is less than that of y, distance
// from y+1 otherwise.

        return (g: Group) => {
            const nx = attributeCount(g, i, x);
            const ny = f(attributeCount(g, i, y));
            return lt(nx, ny) ? 0 : noZero(Math.abs((ny[1] + 1) - nx));
        }
}

const consAttributesLtEq =
    (i: Index, x: symbol, y: symbol, f: PositionF): Constraint => {

// Returns 0 if Attribute magnitude of x is lesser or equal to that of y,
// distance from y otherwise.

        return (g: Group) => {
            const nx = attributeCount(g, i, x);
            const ny = f(attributeCount(g, i, y));
            return ltEq(nx, ny) ? 0 : noZero(Math.abs(ny[1] - nx));
        }
}


const consContains = (v: number, g: number): Constraint => {

// Returns 0 if Atom value v is found within Group g.    

    return (a: Arrangement) => boolNum(a[v] === g);
}

const consExcludes = (v: number, g: number): Constraint => {

// Returns 0 if Atom value v is not found within Group g.    

    return (a: Arrangement) => boolNum(a[v] !== g);
}

// All Constraints that deal with positions (array indices) must have 1 added
// to their arguments to prevent any arithmetic from dealing with a zero index
// and returning false results.

const consPosition = (x: number, y: number, f: PositionF): Constraint => {

// Returns 0 if x and y share the same group, offset by f(y).

    return (a: Arrangement) => boolNum(eq(a[x] + 1, f(a[y] + 1)));
}

const consNotPosition = (x: number, y: number, f: PositionF): Constraint => {

// Returns 0 if x and y don't share the same group, offset by f(y).

    return (a: Arrangement) => boolNum(!eq(a[x] + 1, f(a[y] + 1)));
}

const consPositionGt = (x: number, y: number, f: PositionF): Constraint => {

// Returns 0 if x is in a group greater than y, offset by f(y).

    return (a: Arrangement) => {
        const gx = a[x] + 1;
        const gy = f(a[y] + 1);
        return gt(gx, gy) ? 0 : noZero(Math.abs((gy[0] + 1) - gx));
    }
}

const consPositionGtEq = (x: number, y: number, f: PositionF): Constraint => {

// Returns 0 if x is in a group greater or equal than y, offset by f(y).

    return (a: Arrangement) => {
        const gx = a[x] + 1;
        const gy = f(a[y] + 1);
        return gtEq(gx, gy) ? 0 : Math.abs(gy[0] - gx);
    }
}

const consPositionLt = (x: number, y: number, f: PositionF): Constraint => {

// Returns 0 if x is in a group lesser than y, offset by f(y).

    return (a: Arrangement) => {
        const gx = a[x] + 1;
        const gy = f(a[y] + 1);
        return lt(gx, gy) ? 0 : noZero(Math.abs((gy[1] + 1) - gx));
    }
}

const consPositionLtEq = (x: number, y: number, f: PositionF): Constraint => {

// Returns 0 if x is in a group lesser  or equal than y, offset by f(y).

    return (a: Arrangement) => {
        const gx = a[x] + 1;
        const gy = f(a[y] + 1);
        return ltEq(gx, gy) ? 0 : Math.abs(gy[1] - gx);
    }
}

const consExplicitModulo = (x: number, n: number, m: number): Constraint => {

// Returns 0 if x % m = n.

    return (a: Arrangement) => boolNum(a[x] % m === n);
}

const consExplicitNotModulo =(x: number, n: number, m: number): Constraint => {

// Returns 0 if x % m ≠ n.

    return (a: Arrangement) => boolNum(a[x] % m === n);
}

const consExplicitModuloGt = (x: number, n: number, m: number): Constraint => {

// Returns 0 if x % m > n.

    return (a: Arrangement) => boolNum(a[x] % m > n);
}

const consExplicitModuloGtEq=(x: number, n: number, m: number): Constraint => {
    
// Returns 0 if x % m ≥ n.

    return (a: Arrangement) => boolNum(a[x] % m >= n);
}

const consExplicitModuloLt = (x: number, n: number, m: number): Constraint => {

// Returns 0 if x % m < n.

    return (a: Arrangement) => boolNum(a[x] % m < n);
}

const consExplicitModuloLtEq=(x: number, n: number, m: number): Constraint => {

// Returns 0 if x % m ≤ n.

    return (a: Arrangement) => boolNum(a[x] % m <= n);
}

const consPositionModulo = (x: number, y: number, m: number): Constraint => {

// Returns 0 if x and y have the same modulo m value.

    return (a: Arrangement) => boolNum((a[x] % m) === (a[y] % m));
}

const consPositionNotModulo =(x: number, y: number, m: number): Constraint => {

// Returns 0 if x and y don't have the same modulo m value.

    return (a: Arrangement) => boolNum((a[x] % m) !== (a[y] % m));
}

const consPositionModuloGt =(x: number, y: number, m: number): Constraint => {

// Returns 0 if x % m > y % m.

    return (a: Arrangement) => boolNum((a[x] % m) > (a[y] % m));
}

const consPositionModuloGtEq=(x: number, y: number, m: number): Constraint =>{

// Returns 0 if x % m >= y % m.

    return (a: Arrangement) => boolNum((a[x] % m) >= (a[y] % m));
}

const consGlobalAttributesEq =
    (i: Index, gx: number, ax: symbol, gy: number, ay: symbol,
        f: PositionF): Constraint => {

// Returns 0 if the magnitudes of group gx's Attribute count ax is equal to
// group gy's Attribute count ay, the distance between them otherwise. These
// functions are slower than they should be because they create new groups
// every time they are evaluated: an O(n) operation. Look to fix this somehow.

    return (a: Arrangement) => {
        const nx = attributeCount(group(a, gx), i, ax);
        const ny = f(attributeCount(group(a, gy), i, ay));
        return eq(nx, ny) ? 0 : noZero(Math.abs(nx - ny[randN()]));
    }
}

const consGlobalAttributesNotEq =
    (i: Index, gx: number, ax: symbol, gy: number, ay: symbol,
        f: PositionF): Constraint => {

// Returns 0 if magnitudes of groups gx and gy's respective Attributes don't
// match. 1 otherwise. 

    return (a: Arrangement) => {
        const nx = attributeCount(group(a, gx), i, ax);
        const ny = f(attributeCount(group(a, gy), i, ay));
        return !eq(nx, ny) ? 1 : 0;
    }
}

const consGlobalAttributesGt =
    (i: Index, gx: number, ax: symbol, gy: number, ay: symbol,
        f: PositionF): Constraint => {

// Returns 0 if magnitude of group gx's Attribute > gy's Attribute.    

    return (a: Arrangement) => {
        const nx = attributeCount(group(a, gx), i, ax);
        const ny = f(attributeCount(group(a, gy), i, ay));
        return gt(nx, ny) ? 0 : noZero(Math.abs((ny[1]) - nx));
    }
}

const consGlobalAttributesGtEq =
    (i: Index, gx: number, ax: symbol, gy: number, ay: symbol,
        f: PositionF): Constraint => {

// Returns 0 if magnitude of group gx's Attribute >= gy's Attribute.    

    return (a: Arrangement) => {
        const nx = attributeCount(group(a, gx), i, ax);
        const ny = f(attributeCount(group(a, gy), i, ay));
        return gtEq(nx, ny) ? 0 : noZero(Math.abs(ny[1] - nx));
    }
}

class ConsGroup {

// An array of Constraints tagged with a Value. These types remain constant
// throughout the annealing process; only the Group parameters provided to
// them change. The problem is considered solved when every ConsGroup has all
// of its Constraints satisfied.

    readonly name: Value;
    readonly constraints: Constraint[]
    constructor(s: string, n: number, cs: Constraint[]) {
        this.name = value(s, n);
        this.constraints = cs;
    }
    score(g: Group): number {
        return this.constraints.reduce((acc, x) => acc + x(g), 0);
    }
}

class ConsIndex {

// A read-only singleton type containing every ConsGroup in the problem, as
// well as a set of global constraints.

    readonly all: ConsGroup[];
    readonly global: Constraint[];
    constructor(ii: Index, pgi: ProtoGroupIndex) {
        const fcgs = pgi.all.map((x, i) => {
            return new FilteredConsGroup(ii, pgi.attributeNames, x, i);
        });
        const gxs = pgi.globalConstraints.reduce((acc, x) => {
            const c = this.applyGlobalOffset(x);
            const as = pgi.attributeNames;
            return c[0]  === ConstraintType.ATTRIBUTE_BALANCE ?
                acc.concat(makeBalanceConstraint(ii, Symbol.for(as[c[1]]),
                    pgi.all)) :
                acc.concat(makeConstraint(ii, as, c, 0));
        }, <TaggedConstraint[]>[]).map(y => y.constraint);
        this.all = fcgs.reduce((acc, x) => acc.concat([x.group]), []);
        this.global = gxs.concat(fcgs.reduce((acc, x) => acc.concat(x.global),
                                 []));
    }
    applyGlobalOffset(pc: ProtoConstraint): ProtoConstraint {
        return [pc[0] + GLOBAL_CONSTRAINT_OFFSET].concat(pc.slice(1));
    }
    score(a: Arrangement): number {
        return this.all.reduce((acc, x, i) => acc + x.score(group(a, i)), 0) +
            this.global.reduce((acc, x) => acc + x(a), 0);
    }
}
