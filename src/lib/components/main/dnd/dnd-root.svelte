<script lang="ts" module>
    import type { Context } from "./dnd-item.svelte";
    import type { Renderable } from "./render-helpers";
</script>

<script lang="ts" generics="TData, TContext extends Context<TData>,TRender">
    import { DragDropManager } from "@dnd-kit/dom";
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    import { DndManagerContext } from "./context";
    import { createId } from "@paralleldrive/cuid2";
    import DndItem from "./dnd-item.svelte";
    import { crossfade } from "svelte/transition";
    import { arrayMove } from "./array-move";
    import { watch } from "runed";
    type UniqueIdentifier = string | number;
    interface Props<TContext, TRender> {
        id?: string;
        data: TContext[];
        render: TRender extends (
            data: TContext,
            index: number,
        ) => Renderable<any>
            ? TRender
            : never;
    }

    let {
        id = createId(),
        data = $bindable(),
        render,
    }: Props<TContext, TRender> = $props();
    let manager = writable<DragDropManager>();
    let [source, target]: [UniqueIdentifier | null, UniqueIdentifier | null] = [
        null,
        null,
    ];
    DndManagerContext.set(manager);
    onMount(() => {
        $manager = new DragDropManager();
        $manager.monitor.addEventListener("dragstart", () => {
            source = null;
            target = null;
        });
        $manager.monitor.addEventListener("dragover", (e) => {
            const { targetIdentifier, sourceIdentifier } =
                $manager.dragOperation;
            const { canceled } = e.operation;
            if (!canceled && targetIdentifier != sourceIdentifier) {
                source = sourceIdentifier;
                target = targetIdentifier;
            }
        });
        $manager.monitor.addEventListener("dragend", (e) => {
            const { canceled } = e.operation;
            if (canceled) return;
            if (source && target) {
                const oldIndex = data.findIndex((a) => a.id == source);
                const newIndex = data.findIndex((a) => a.id == target);
                data = arrayMove(data, oldIndex, newIndex);
                source = null;
                target = null;
            }
        });
    });

    onDestroy(() => {
        $manager.destroy();
    });

    const [send, recieve] = crossfade({ duration: 100 });
</script>

{#if data.length}
    <div class="grid grid-flow-row gap-2 w-full auto-rows-auto">
        {#each data as data, i (data.id)}
            <DndItem index={i} {data} {render} />
        {/each}
    </div>
{/if}
