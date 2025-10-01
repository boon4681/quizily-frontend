<script lang="ts">
    import BoldButton from "$lib/components/main/bold-button.svelte";
    import { BoldRadioGroup } from "$lib/components/main/bold-radio-group";
    import Cat from "$lib/components/main/cat.svelte";
    import { FileInput } from "$lib/components/main/file-input";
    import { FileListInput } from "$lib/components/main/file-list-input";
    import { TriSlider } from "$lib/components/main/tri-slider";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { Label } from "$lib/components/ui/label";
    import { Progress } from "$lib/components/ui/progress";
    import { Textarea } from "$lib/components/ui/textarea";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import Upload from "@lucide/svelte/icons/upload";

    let step = $state(2);

    let type = $state("");
    let count = $state("");
    let resource_type = $state("document");
    let content = $state("");

    function is_disable(step: number) {
        switch (step) {
            case 0:
                return type.length == 0;
            case 1:
                return +count == 0;
        }
        return true;
    }
</script>

<header
    class="relative max-w-5xl w-full mx-auto flex items-center justify-center pt-4 px-4"
>
    <Button class="absolute left-0" variant="link" href="/">
        <ChevronLeft class="size-6"></ChevronLeft>
    </Button>
    <div class="flex gap-1 flex-col w-full items-center px-8 sm:px-0">
        <div>Create your quiz</div>
        <Progress value={step + 0.2} max={4} class="w-full max-w-[440px]" />
    </div>
</header>
<div
    class="relative max-w-[440px] px-4 w-full mx-auto flex items-center justify-center pt-4"
>
    <Cat class="size-32 -ml-8 [--cat-outline:#f5f3ef] [--cat:#4F69E6]"></Cat>
    <div class="relative w-full">
        <div
            class="relative border-2 border-emerald-500/60 bg-green-50 w-full p-4 rounded-md"
        >
            {#if step == 0}
                What’s your prefer type of questions?
            {/if}
            {#if step == 1}
                What’s amount of question do you prefer?
            {/if}
            {#if step == 2}
                Provide Topic and Upload your document
            {/if}
        </div>
        <div class="absolute w-2 h-4 overflow-hidden -left-1.5 top-4">
            <div
                class="absolute left-1 size-4 rotate-45 border-2 border-emerald-500/60 bg-green-50"
            ></div>
        </div>
    </div>
</div>
{#if step == 0}
    <BoldRadioGroup.Root
        bind:value={type}
        class="relative max-w-[440px] w-full mx-auto pt-4 px-4"
    >
        <BoldRadioGroup.Item value="binary">
            <div>True / False</div>
        </BoldRadioGroup.Item>
        <BoldRadioGroup.Item value="multiple">
            <div>Multiple choice</div>
        </BoldRadioGroup.Item>
    </BoldRadioGroup.Root>
{/if}
{#if step == 1}
    <BoldRadioGroup.Root
        bind:value={count}
        class="relative max-w-[440px] w-full mx-auto pt-4 px-4"
    >
        <BoldRadioGroup.Item value="10">
            <div>10</div>
        </BoldRadioGroup.Item>
        <BoldRadioGroup.Item value="20">
            <div>20</div>
        </BoldRadioGroup.Item>
        <BoldRadioGroup.Item value="30">
            <div>30</div>
        </BoldRadioGroup.Item>
    </BoldRadioGroup.Root>
{/if}
{#if step == 2}
    <div class="relative max-w-[440px] w-full mx-auto pt-4 px-4 space-y-4">
        <!-- <div class="grid w-full gap-1.5">
            <Label for="topic">Topic</Label>
            <Textarea
                id="topic"
                class="border-2"
                placeholder="Write your topics....."
            />
        </div> -->
        <BoldRadioGroup.Root bind:value={resource_type} class="flex">
            <BoldRadioGroup.Item class="text-sm min-h-12" value="text">
                {#snippet children(props)}
                    <BoldRadioGroup.Dot {...props}></BoldRadioGroup.Dot>
                    <div>Generate From Text</div>
                {/snippet}
            </BoldRadioGroup.Item>
            <BoldRadioGroup.Item class="text-sm min-h-12" value="document">
                {#snippet children(props)}
                    <BoldRadioGroup.Dot {...props}></BoldRadioGroup.Dot>
                    <div>Generate From Document</div>
                {/snippet}
            </BoldRadioGroup.Item>
        </BoldRadioGroup.Root>
        {#if resource_type == "text"}
            <div class="grid w-full gap-1.5">
                <Label for="content">Content</Label>
                <Textarea
                    id="content"
                    bind:value={content}
                    class="border-2"
                    placeholder="Write content that you want to emphasize...."
                />
            </div>
        {/if}
        {#if resource_type == "document"}
            <div class="grid w-full gap-1.5">
                <Label for="content">Documents</Label>
                <FileListInput></FileListInput>
            </div>
        {/if}
    </div>
{/if}

<div class="h-20 mt-10"></div>
<div
    class="border-t-2 flex items-center justify-center px-4 border-neutral-300 h-20 fixed bg-background bottom-0 w-full"
>
    <BoldButton
        variant="dark"
        disabled={is_disable(step)}
        class="min-w-[200px]"
        onclick={() => step++}
    >
        Continue
    </BoldButton>
</div>
