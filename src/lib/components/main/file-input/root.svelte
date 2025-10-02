<script lang="ts">
    import UploadIcon from "@lucide/svelte/icons/upload";
    import FileTextIcon from "@lucide/svelte/icons/file-text";
    import XIcon from "@lucide/svelte/icons/x";
    import { watch } from "runed";
    import { onMount } from "svelte";

    let file_list = $state<FileList>();
    let {
        file = $bindable(),
        onchange,
        onremove,
    }: {
        file?: File;
        onremove?: () => void;
        onchange?: (file?: File) => void;
    } = $props();

    watch(
        () => file_list,
        () => {
            file = file_list?.[0];
            if (file) {
                onchange?.(file);
            }
        },
    );
</script>
{#if !file}
    <div
        class="relative w-full border-2 border-dashed border-input rounded-md py-6 px-8 flex gap-6 items-center"
    >
        <input
            type="file"
            bind:files={file_list}
            class="absolute top-0 left-0 w-full h-full opacity-0"
            multiple={false}
        />
        <UploadIcon class="size-10 shrink-0" strokeWidth={1.5} />
        <div>
            <div class="">Drag & drop files here, or click to select</div>
            <div class="text-xs">
                Up to 10 MB each Supported: image/*, application/pdf, .txt
            </div>
        </div>
    </div>
{:else}
    <div
        class="relative whitespace-nowrap overflow-hidden w-full border-2 border-input rounded-md py-2 px-3 flex gap-2 items-center"
    >
        <FileTextIcon class="size-5"></FileTextIcon>
        <div class="w-full text-ellipsis overflow-hidden">
            {file?.name}
        </div>
        <button
            class="flex items-center justify-center size-5 hover:bg-neutral-300 rounded-[50%] shrink-0"
            onclick={() => {
                file_list = undefined;
                onremove?.();
            }}
        >
            <XIcon class="size-4"></XIcon>
        </button>
    </div>
{/if}
