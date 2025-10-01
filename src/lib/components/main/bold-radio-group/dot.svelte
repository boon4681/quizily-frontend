<script lang="ts">
    import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
    import CircleIcon from "@lucide/svelte/icons/circle";
    import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

    let props: { checked?: boolean } = $props();
</script>

<div
    class={cn(
        "mr-2 border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 shadow-xs aspect-square size-4 shrink-0 rounded-full border outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
    )}
>
    <div
        data-slot="radio-group-indicator"
        class="relative size-full flex items-center justify-center"
    >
        {#if props.checked}
            <CircleIcon
                class="fill-primary absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
            />
        {/if}
    </div>
</div>
