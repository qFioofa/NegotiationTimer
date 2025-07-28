import { SideMovingShuffle } from "./Shuffles/SideMovingShuffle";
import { replaceShuffle } from "./Shuffles/replaceShuffle";
import { SpringShuffle } from "./Shuffles/SpringShuffle";
import { CubeShuffle } from "./Shuffles/CubeShuffle";
import { VoidShuffle } from "./Shuffles/VoidShuffle";

const shuffleMap = new Map();
const shuffleArray = [
    {
        name: "Spring",
        _function: SpringShuffle
    },
    {
        name: "Void",
        _function: VoidShuffle
    },
    {
        name: "Moving",
        _function: SideMovingShuffle
    },
    {
        name: "Cube",
        _function: CubeShuffle
    },
    {
        name: "Replace",
        _function: replaceShuffle
    },
]

shuffleArray.forEach(item => shuffleMap.set(item.name, item._function))

function getShuffleNames() {
    return shuffleArray.map(item => item.name);
}

export { shuffleMap, getShuffleNames }