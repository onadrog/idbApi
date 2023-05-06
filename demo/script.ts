import { IdbApi } from "../src/idbClass";

const idb = new IdbApi();

type data = {
	["value"]: string;
};

const DATA_DISPLAYER_ID = "data";
const ADD_BTN_ID = "add";
const GET_BTN_ID = "get";
const UPD_BTN_ID = "upd";
const DEL_BTN_ID = "del";

function FindElOrThrow<T>(selector: string): T {
	const el = document.getElementById(selector) as T;
	if (!el) {
		throw new Error(`could not find div with id: ${selector}`);
	}
	return el;
}

const dataDisplayer = FindElOrThrow<HTMLDivElement>(DATA_DISPLAYER_ID);
const addBtn = FindElOrThrow<HTMLButtonElement>(ADD_BTN_ID);
const getBtn = FindElOrThrow<HTMLButtonElement>(GET_BTN_ID);
const updBtn = FindElOrThrow<HTMLButtonElement>(UPD_BTN_ID);
const delBtn = FindElOrThrow<HTMLButtonElement>(DEL_BTN_ID);

addBtn.addEventListener(
	"click",
	function ({ target }: Event, payload?: string) {
		let data = (target as HTMLButtonElement).getAttribute("data-payload");
		if (payload) {
			data = payload;
		}
		idb.addData({ value: data });
	},
);

getBtn.addEventListener(
	"click",
	async function ({ target }: Event, payload?: number) {
		let key = parseInt(
			(target as HTMLButtonElement).getAttribute("data-key") || "1",
			10,
		);
		if (payload) {
			key = payload;
		}
		const data = await idb.getData<data>(key);
		dataDisplayer.innerText = data.value;
	},
);

updBtn.addEventListener(
	"click",
	async function ({ target }: Event, key?: number, payload?: string) {
		const targetBtn = target as HTMLButtonElement;
		const dataKey = parseInt(targetBtn.getAttribute("data-key") || "1", 10);
		const dataPayload = targetBtn.getAttribute("data-payload") as string;
		idb.updateData<data>((oldData) => {
			oldData.value = payload || dataPayload;
			return oldData;
		}, key || dataKey);
		const data = await idb.getData<data>(key || dataKey);
		dataDisplayer.innerText = data.value;
	},
);
delBtn.addEventListener(
	"click",
	async function ({ target }: Event, key?: number) {
		const targetBtn = target as HTMLButtonElement;
		const dataKey = parseInt(targetBtn.getAttribute("data-key") || "1", 10);
		idb.deleteData(key || dataKey);
		dataDisplayer.innerText = "data deleted";
	},
);
