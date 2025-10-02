import { Context } from "runed";
import type { DragDropManager } from "@dnd-kit/dom";
import type { Writable } from "svelte/store";

export const DndManagerContext = new Context<Writable<DragDropManager>>("dnd-manager.context");