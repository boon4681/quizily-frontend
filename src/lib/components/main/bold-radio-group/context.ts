import { Context } from "runed";
import type { Writable } from "svelte/store";


export const BOLD_RADIO_CHECKED_CONTEXT = new Context<Writable<boolean>>("bold-radio-checked")