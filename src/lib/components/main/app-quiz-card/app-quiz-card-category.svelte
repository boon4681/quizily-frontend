<script lang="ts">
    import type { QuizCardCategory } from "./types";

    let { background, name, emoji }: QuizCardCategory = $props();
</script>

<div class="flex gap-2">
    <div class="size-10 rounded-md overflow-hidden bg-stone-800">
        <div
            class="size-10 flex items-center justify-center"
            style="background: {background};"
        >
            {emoji}
        </div>
    </div>
    <div>
        <div class="text-neutral-500 text-sm">Category</div>
        <div class="text-sm text-foreground first-letter:uppercase">{name}</div>
    </div>
</div>
