The Visual Annealing Problem Interface Deployment (VAPID) is a single page web app that allows users to sort tagged items into groups using a [Simulated Annealing](https://en.wikipedia.org/wiki/Simulated_annealing) algorithm. This items→groups metaphor is surprisingly extensible, and can be used to create physical spatial arrangements, timetables, or whatever else you can imagine.

## Requirements

vapid is written in [Typescript](https://www.typescriptlang.org/), which will have to be installed before building the project. Its interface is managed through [Vue](https://vuejs.org/): a minified version of which is included directly with the code. A browser that supports ES6 Javascript is required to run the app.

## Installation

vapid compiles to a single file: `annealing.js`. No fancy build tooling or packaging is used beyond the Typescript compiler. All one has to do to build the file is run:

    chmod +x build.sh
    ./build.sh

## Usage

vapid's interface contains tool tips that should make the process self-explanatory, but I'll run through the gist of it.

### Items

Users add items to be sorted on the "items" screen. These items can be tagged with arbitrary attributes, such as "man", "woman", "dog", "cat", etc. In many cases, these attributes are binary in nature, and are associated with a numerical value of 1. An animal is either a cat or it isn't. Attributes with magnitudes are also possible though; you can have one item tagged with "age 32" and another with "age 8", which will be valued at 32 and 8 respectively. These magnitudes allow you to perform more interesting sorting.

### Groups

All specified items are sorted into groups. A group can be given constraints that filter which specific items it will accept. It is possible to specify a group that requires a specific cat named "Fred", or a group where the combined ages of its members is between 40 and 50. Global constraints can also be used to enforce spatial logic. You can demand that Fred the cat is in a group next to Lola the dog, or that Group A contains twice as many penguins as Group B. The arithmetic that governs these relations should be easy to visualize.

### Solving

Solving is non-deterministic. You could get lucky and have a solution that satisfies your constraints instantly, or it could take millions of iterations to arrive at. If your problem set is ambiguous or contradictory, you may never arrive at a perfect solution, but you can stop the process and be presented with the current optimal arrangement. Try not to provide redundant information.

### Saving / Loading

You can save or load your problem by copying and pasting JSON data. [Here](https://dalrym.pl/media/code/js/vapid/zebra.json) is the [Zebra Puzzle](https://en.wikipedia.org/wiki/Zebra_puzzle), for example.

## Demo

You can try vapid [here](https://dalrym.pl/media/code/js/vapid/index.html).
