<script lang="ts">
    import {
        RadioGroup as RadioGroupPrimitive,
        type WithChildren,
    } from "bits-ui";
    import CircleIcon from "@lucide/svelte/icons/circle";
    import {
        cn,
        type WithoutChild,
        type WithoutChildrenOrChild,
    } from "$lib/utils.js";
    import Label from "$lib/components/ui/label/label.svelte";
    import { BOLD_RADIO_CHECKED_CONTEXT } from "./context";
    import { watch } from "runed";
    import type { Snippet } from "svelte";
    let {
        ref = $bindable(null),
        class: className,
        children,
        ...restProps
    }: WithoutChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<Label
    class={cn(
        "border-2 cursor-pointer hover:border-neutral-500 transition-all min-h-20 text-lg flex items-center hover:ring-blue-400 border-neutral-400 shadow-sm gap-3 rounded-lg p-3 has-[[aria-checked=true]]:border-[#7A90F7] has-[[aria-checked=true]]:bg-[#EDF0FE]",
        className,
    )}
>
    <RadioGroupPrimitive.Item
        bind:ref
        data-slot="radio-group-item"
        class="flex items-center"
        {...restProps}
    >
        {#snippet children(props)}
            {@render children?.(props)}
        {/snippet}
    </RadioGroupPrimitive.Item>
</Label>
