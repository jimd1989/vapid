// Suplementary solving functions. This file used to contain a referentially-
// transparent simulated annealing loop, but that logic has been moved to a
// stateful method in "solving-parsing.js" for interactivity's sake.

// Return a random integer between [0, n).
const randInt = (n: number): number => Math.floor(Math.random() * n);

const newRandInt = (max: number, old: number): number => {

// Return a random int between [0, max) that's guaranteed not to be old.    

    const r = randInt(max);
    return r === old ? newRandInt(max, old) : r;
}

const shuffle = (n: number, m: number): Arrangement => {

// Return a random Arrangement from Index length n and ConsIndex length m.

    return Array(n).fill(0).map(() => randInt(m));
}

const swap = (a: Arrangement, n: number): Arrangement => {

// Assign a new ConsGroup index to a random Atom in an Arrangement.

    const r = randInt(a.length);
    return a.map((x, i) => i === r ? newRandInt(n, x) : x);
}
