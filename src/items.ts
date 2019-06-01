import Vue from '/Users/jim/prog/javashit/annealing/src/vue.js';

// Data types representing user-provided data to be sorted by the annealing
// algorithm. The hierarchy of data is as follows:
// (Index ((Atom ((Attribute Magnitude) ...)) ...))
class Attribute {

// A global symbol that serves as a tag for an Atom problem set element.
// Intended to be used across multiple Atoms: ie all boys in a problem set
// would be tagged with the 'boy' symbol. Some Constraints filter Atoms based
// upon these Attributes. Also includes a numerical value, which is 1 by
// default, but can be an arbitrary positive value to represent the magnitude
// of an Attribute. While something like 'boy' might be a binary value, an
// Attribute like loudness could be scaled between 1 and 10, allowing one to
// construct a Constraint for loud boys, where the 'boy' tag simply exists on
// an Atom, and the 'loudness' tag is valued at > 5.

    readonly name: symbol;
    readonly magnitude: number;
    constructor(pa: ProtoAttribute) {
        this.name = Symbol.for(pa.name);
        this.magnitude = pa.magnitude;
    }
    match(x: symbol): number {
        return this.name === x ? this.magnitude : 0;
    }
}

// A value is a string tagged with a unique number, which identifies a Atom's
// index in its master array.
interface Value {
    readonly name: string;
    readonly n: number;
}

// Return a new Value.
const value = (s: string, x: number): Value => { return {name: s, n: x} };

class Atom {

// Represents a single element, with a unique Value, and arbitrary list
// of Attributes, in the problem set. This Atom is passed around various
// Groups during the annealing process, and has its Value and Attributes run
// against its host Group's Constraints. The problem is considered solved when
// no Atom's values run afoul of these Constraints.

    readonly value: Value;
    readonly attributes: Attribute[];
    constructor(pa: ProtoAtom, n: number) {
        this.value = value(pa.name, n);
        this.attributes = pa.attributes.map(x => new Attribute(x));
    }
    hasAttribute(a: symbol): number {
        return this.attributes.reduce((acc, x) => acc + x.match(a), 0);
    }
}

class Index {

// An index is a read-only singleton Array of Atoms, referenced during the
// annealing process, but never actually mutated.

    readonly values: Atom[]
    constructor(pi: ProtoIndex) {
        this.values = pi.all.map((x, i) => new Atom(x, i));
    }
    ref(n: number): Atom {
        return this.values[n];
    }
}

// A Group is an array of Index indicies representing the members of a single
// ConsGroup. Groups are queried from a master array of all Index values and
// passed as the argument to the ConsGroup's closures.
type Group = number[];

const attributeCount = (g: Group, i: Index, a: symbol): number => {

// Return the sum of all Attribute a magnitudes in a Group.    

    return g.reduce((acc, x) => acc + i.ref(x).hasAttribute(a), 0);
}

// An Arrangement is an array as large as an Index, where the nth Arrangement
// index corresponds to the nth Index index. The actual values of these
// indicies are indicies from the ConsIndex, specifying which ConsGroup each
// Atom is currently associated with. The annealing process shuffles these
// values around to simulate the rearrangement of Atoms in the problem space.
type Arrangement = number[];

const group = (a: Arrangement, n: number): Group => {

// Return all Atoms in an Arrangement that belong to ConsGroup n.

    return <number[]>a.map((x,i)=> x === n ? i:false).filter(x => x !== false);
}
