import { SideMovingShuffle } from "./Shuffles/SideMovingShuffle";
import { replaceShuffle } from "./Shuffles/replaceShuffle";
import { SpringShuffle } from "./Shuffles/SpringShuffle";
import { CubeShuffle } from "./Shuffles/CubeShuffle";
import { VoidShuffle } from "./Shuffles/VoidShuffle";

export type ShuffleFunction = (
	element1: HTMLElement,
	element2: HTMLElement,
) => Promise<void | number>;

interface ShuffleEntry {
	name: string;
	_function: ShuffleFunction;
}

const shuffleMap = new Map<string, ShuffleFunction>();
const shuffleArray: ShuffleEntry[] = [
	{
		name: "Spring",
		_function: SpringShuffle,
	},
	{
		name: "Void",
		_function: VoidShuffle,
	},
	{
		name: "Moving",
		_function: SideMovingShuffle,
	},
	{
		name: "Cube",
		_function: CubeShuffle,
	},
	{
		name: "Replace",
		_function: replaceShuffle,
	},
];

shuffleArray.forEach((item) => shuffleMap.set(item.name, item._function));

function getShuffleNames(): string[] {
	return shuffleArray.map((item) => item.name);
}

export { shuffleMap, getShuffleNames };
