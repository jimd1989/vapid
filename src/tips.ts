class Tip {

// Represents a tip box that appears in a pane to offer info.

    active: boolean;
    readonly txt: string[];
    constructor(xs: string[]) {
        this.active = true;
        this.txt = xs;
    }
    deleteTip() {
        this.active = false;
    }
}

const ItemsTip = [
    `List items to sort here. Their creation order is not important.`,
    `Items should be named. The name does not have to be unique.`,
    `Give an item an attribute tag by adding text to "Attribute" ` +
    `and hitting enter.`,
    `Attributes can have non-binary magnitudes too. Enter "Age 32" ` + 
    `to make an attribute valued at 32.`
];

const GroupsTip = [
    `Create groups to contain sorted items here. Their order is significant, `+
    `so you can use the arrow buttons to move them accordingly.`,
    `Every group can be given an arbitrary number of constraints that ` +
    `govern which items can be placed inside.`,
    `The more constraints you make, the harder the sorting process becomes. ` +
    `Try not to provide redundant information.`
];

const GlobalTip = [
    `Create global constraints that apply to all items and groups here.`,
    `This is where spatial logic, such as "x is right of y" or `+
    `"x is in the same group as y" can be implemented. Try to visualize ` +
    `these positions in arithmetic terms.`,
    `Groups are zero-indexed, but arithmetic operations upon them treat ` +
    `them as one-indexed. The first group (index 0) x 2 will yield the ` +
    `second group (index 1), but a vertical alignment with the first group ` +
    `(index 0) should specify "column number 0" rather than 1.`
];

const SolveTip = [
    `Assuming all your items and groups have been set, press the play ` +
    `button to receive your solution.`,
    `It could be possible that your problem has no ideal solution. In that `+
    `case, hit the stop button when you are tired of waiting.`,
    `Since the solving algorithm relies of randomness, you may get better ` +
    `results by resetting the temperature to 1.0 and trying again.`
];

const SaveTip = [
    `Copy this data to save the problem state.`,
    `Paste it in the "Load" tab's box to load it.`
];

const LoadTip = [
    `Copy JSON data from the "Save" tab into this box and hit "Load".`
];

Vue.component('tip', {

// Box where a tip is displayed.

    props: ['tip'],
    template:`
    <div class="paneDescription" v-if="tip.active">
      <button class="paneDescriptionExit"
              @click="tip.deleteTip()">
        x
      </button>
      <ul>
        <li v-for="x in tip.txt">{{ x }}</li>
      </ul>
    </div>
    `
});
