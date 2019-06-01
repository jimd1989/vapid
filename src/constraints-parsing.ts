// Procedures and data types that collect user input that will be parsed into
// Constraint types. Some of the program's most complex and ugliest code is
// found in this file due to the pain of converting plaintext to relevant
// data. The actual Constraint logic is handled in the file "constraints.ts".

// A ProtoConstraint is a row of integers and enums gathered from user input
// in the Vue frontend, parsed into a proper Constraint.
type ProtoConstraint = number[];

const enum ConstraintType {

// Possible Constraint types.    

    CONTAINS_ITEM,
    EXCLUDES_ITEM,
    IS_SIZE,
    HAS_ATTRIBUTE,
    HAS_ATTRIBUTE_RELATIONSHIP,
    POSITION,
    VERTICAL_POSITION,
    ALIGNMENT,
    GLOBAL_ATTRIBUTE_RELATIONSHIP,
    ATTRIBUTE_BALANCE
}

// The <select> element models global Constraints to a ProtoConstraint using
// the typical indices of a list (0 ... n), but the enum values for these
// global Constraints is (5 ... n). This offset is added during parsing to
// align the value with the ConstraintType enum.
const GLOBAL_CONSTRAINT_OFFSET: number = 5;

const enum Relationship {

// Possible relationships between values.

    EQ,
    NE,
    GT,
    GTE,
    LT,
    LTE
}

const enum MathSymbol {

// Possible arithmetic that can be performed upon values.

    PLUS,
    MINUS,
    TIMES,
    DIVIDE,
    PLUS_MINUS
}

const makeMathF = (s: MathSymbol, x: number): PositionF => {

// Make an arithmetic function that returns a Position type.

    switch(s) {
        case MathSymbol.PLUS:
            return n => [n + x, n + x];
        case MathSymbol.MINUS:
            return n => [n - x, n - x];
        case MathSymbol.TIMES:
            return n => [n * x, n * x];
        case MathSymbol.DIVIDE:
            return x === 0 ? n => [n , n] : n => [n / x, n / x];
        case MathSymbol.PLUS_MINUS:
            return n => [n - x, n + x];
        default:
            return n => [n , n];
    }
}

const makeAttributeRelationshipConstraint = 
    (i: Index, x: symbol, r: Relationship, y: symbol,
        s: MathSymbol, n: number): Constraint => {

// Create an attribute relationship Constraint from user input. Invalid input
// defaults to a Constraint that is always true.

        const f = makeMathF(s, n);
        switch (r) {
            case Relationship.EQ:
                return consAttributesEq(i, x, y, f);
            case Relationship.NE:
                return consAttributesNotEq(i, x, y, f);
            case Relationship.GT:
                return consAttributesGt(i, x, y, f);
            case Relationship.GTE:
                return consAttributesGtEq(i, x, y, f);
            case Relationship.LT:
                return consAttributesLt(i, x, y, f);
            case Relationship.LTE:
                return consAttributesLtEq(i, x, y, f);
            default:
                return (g: Group) => 0;
        }
}

const makePositionConstraint =
    (x: number, r: Relationship, y: number,
        s: MathSymbol, n: number): Constraint => {

// Create a position Constraint from user input. Ivalid input defaults to a
// Constraint that is always true.

        const f = makeMathF(s, n);
        switch (r) {
            case Relationship.EQ:
                return consPosition(x, y, f);
            case Relationship.NE:
                return consNotPosition(x, y, f);
            case Relationship.GT:
                return consPositionGt(x, y, f);
            case Relationship.GTE:
                return consPositionGtEq(x, y, f);
            case Relationship.LT:
                return consPositionLt(x, y, f);
            case Relationship.LTE:
                return consPositionLtEq(x, y, f);
            default:
                return (g: Group) => 0;
        }
}

const makeVerticalConstraint =
    (x: number, r: Relationship, n: number, m: number): Constraint => {

// Create a vertical position Constraint from user input. Ivalid input defaults
// to a Constraint that is always true.

        const nm = m === 0 ? 1 : m;
        switch (r) {
            case Relationship.EQ:
                return consExplicitModulo(x, n, nm);
            case Relationship.NE:
                return consExplicitNotModulo(x, n, nm);
            case Relationship.GT:
                return consExplicitModuloGt(x, n, nm);
            case Relationship.GTE:
                return consExplicitModuloGtEq(x, n, nm);
            case Relationship.LT:
                return consExplicitModuloLt(x, n, nm);
            case Relationship.LTE:
                return consExplicitModuloLtEq(x, n, nm);
            default:
                return (g: Group) => 0;
        }
}

const makeAlignmentConstraint =
    (x: number, r: Relationship, y: number, m: number): Constraint => {

// Create an alignment Constraint from user input. Ivalid input defaults to a
// Constraint that is always true.

        const nm = m === 0 ? 1 : m;
        switch (r) {
            case Relationship.EQ:
                return consPositionModulo(x, y, nm);
            case Relationship.NE:
                return consPositionNotModulo(x, y, nm);
            case Relationship.GT:
                return consPositionModuloGt(x, y, nm);
            case Relationship.GTE:
                return consPositionModuloGtEq(x, y, nm);
            case Relationship.LT:
                return consPositionModuloGt(y, x, nm);
            case Relationship.LTE:
                return consPositionModuloGtEq(y, x, nm);
            default:
                return (g: Group) => 0;
        }
}

const makeGlobalAttributeRelationshipConstraint =
    (i: Index, gx: number, ax: symbol, r: Relationship, gy: number, ay: symbol, 
        s: MathSymbol, n: number): Constraint => {

// Create a global Attribute relation Constraint from user input. Invalid
// input defaults to a Constraint that is always true.

        const f = makeMathF(s, n);
        switch (r) {
            case Relationship.EQ:
                return consGlobalAttributesEq(i, gx, ax, gy, ay, f);
            case Relationship.NE:
                return consGlobalAttributesNotEq(i, gx, ax, gy, ay, f);
            case Relationship.GT:
                return consGlobalAttributesGt(i, gx, ax, gy, ay, f);
            case Relationship.GTE:
                return consGlobalAttributesGtEq(i, gx, ax, gy, ay, f);
            case Relationship.LT:
                return consGlobalAttributesGt(i, gy, ay, gx, ax, f);
            case Relationship.LTE:
                return consGlobalAttributesGtEq(i, gy, ay, gx, ax, f);
            default:
                return (g: Group) => 0;
        }
}

const checkInput = (pc: ProtoConstraint, limit: number): ProtoConstraint => {

// A ProtoConstraint is supposed to consist entirely of integer values, but
// HTML text input boxes in the Vue frontend model themselves as strings. This
// function iterates over a ProtoConstraint before it is parsed and turns any
// errant strings back into ints. Invalid input defaults to zero.

    return pc.map(x => {
        const n = parseInt(<string>(<unknown>x));
        return isNaN(n) ? 0 : n;
    });
}

interface TaggedConstraint {

// Due to the way the frontend is set up, some Constraints that are considered
// global are presented as local in ProtoGroups. When deriving an actual
// Constraint from a ProtoConstraint, the resulting closure is wrapped in this
// interface, accompanied by a boolean value indicating whether or not it is
// intended for global or local usage. This tag allows the Constraint to be
// sorted accordingly.

    readonly global: boolean;
    readonly constraint: Constraint;
}

const tag = (global: boolean, c: Constraint): TaggedConstraint => {

// Make a Constraint into a TaggedConstraint.

    return {global: global, constraint: c};
}

const makeConstraint =
    (i: Index, as: string[], pc: ProtoConstraint,
        groupN: number): TaggedConstraint => {

// Create a TaggedConstraint from a ProtoConstraint. Invalid input is a
// Constraint that is always true.

        const npc = checkInput(pc, as.length);
        switch (npc[0]) {
            case ConstraintType.CONTAINS_ITEM:
                return tag(true, consContains(npc[1], groupN));
            case ConstraintType.EXCLUDES_ITEM:
                return tag(true, consExcludes(npc[1], groupN));
            case ConstraintType.IS_SIZE:
                return tag(false, consSize(npc[1], npc[2]));
            case ConstraintType.HAS_ATTRIBUTE:
                return tag(false, consAttributes(i, Symbol.for(as[npc[1]]),
                    npc[2], npc[3]));
            case ConstraintType.HAS_ATTRIBUTE_RELATIONSHIP:
                return tag(false, makeAttributeRelationshipConstraint(i,
                    Symbol.for(as[npc[1]]), npc[2], Symbol.for(as[npc[3]]),
                    npc[4],npc[5]));
            case ConstraintType.POSITION:
                return tag(true, makePositionConstraint(npc[1], npc[2], npc[3],
                    npc[4], npc[5]));
            case ConstraintType.VERTICAL_POSITION:
                return tag(true, makeVerticalConstraint(npc[1], npc[2], npc[3],
                    npc[4]));
            case ConstraintType.ALIGNMENT:
                return tag(true, makeAlignmentConstraint(npc[1], npc[2],
                    npc[3], npc[4]));
            case ConstraintType.GLOBAL_ATTRIBUTE_RELATIONSHIP:
                return tag(true, makeGlobalAttributeRelationshipConstraint(
                    i, npc[1], Symbol.for(as[npc[2]]), npc[3], npc[4],
                    Symbol.for(as[npc[5]]), npc[6], npc[7]));
            default:
                return tag(false, (g: Group) => 0);
        }
}

const makeBalanceConstraint =
    (ii: Index, a: symbol, pgs: ProtoGroup[]): TaggedConstraint[] => {

// A macro Constraint that applies global relation Constraints to every
// group in the problem and ensures that the magnitude of Attribute a is equal
// in all of them.

        return pgs.slice(1).map((x, i) => tag(true,
            makeGlobalAttributeRelationshipConstraint(ii, i, a,
                Relationship.EQ, i+1, a, MathSymbol.PLUS, 0)));
}

class ConstraintFilter {

// Runs against a ProtoGroup, creates Constraints, and sorts accordingly.

    readonly global: Constraint[];
    readonly local: Constraint[];
    constructor(g: Constraint[], l: Constraint[]) {
        this.global = g;
        this.local = l;
    }
    private addGlobal(c: Constraint): ConstraintFilter {
        return new ConstraintFilter(this.global.concat([c]), this.local);
    }
    private addLocal(c: Constraint): ConstraintFilter {
        return new ConstraintFilter(this.global, this.local.concat([c]));
    }
    add(tc: TaggedConstraint): ConstraintFilter {
        return tc.global ?
            this.addGlobal(tc.constraint) :
            this.addLocal(tc.constraint);
    }
}

class FilteredConsGroup {

// A struct containing an initialized ConsGroup with leftover global
// Constraints.    

    readonly group: ConsGroup;
    readonly global: Constraint[];
    constructor(i: Index, as: string[], pg: ProtoGroup, n: number) {
        const cf = pg.constraints.reduce((acc, x) => {
            return acc.add(makeConstraint(i, as, x, n));
        }, new ConstraintFilter([], []));
        this.group = new ConsGroup(pg.name, n, cf.local);
        this.global = cf.global;
    }
}

// The ConsIndex constructor function does the final business of initializing
// all Constraints. Read it in "constraints.ts".
