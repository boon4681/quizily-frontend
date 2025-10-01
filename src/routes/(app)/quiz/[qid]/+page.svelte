<script lang="ts">
    import type {
        Question,
        QuestionChoice,
    } from "$lib/components/main/quiz-layout";
    import QuizLayout from "$lib/components/main/quiz-layout/quiz-layout.svelte";
    import { Card } from "$lib/components/ui/card";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
    import { Label } from "$lib/components/ui/label";
    import { dnd, Dnd } from "$lib/components/main/dnd";
    import { createId } from "@paralleldrive/cuid2";
    import Trash2 from "@lucide/svelte/icons/trash-2";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { watch } from "runed";
    import Button, {
        buttonVariants,
    } from "$lib/components/ui/button/button.svelte";
    import Plus from "@lucide/svelte/icons/plus";
    import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input";
    import { getTypeName } from "$lib/utils/get-type-name";

    let questions = $state<Question[]>([
        {
            id: "0",
            type: "multiple",
            title: "What does UI stand for in the context of design?",
            choices: [
                {
                    id: "lxdl9kbrte2tjo4qudsyi4mv",
                    text: "Flat Design",
                },
                {
                    id: "rewvrj7pfo46cibkeeubfv56",
                    text: "Skeuomorphic Design",
                },
                {
                    id: "hzn32uv4cxphhbhu7d4ty1je",
                    text: "Minimalist Design",
                },
                {
                    id: "vwnlqv0ohk8m9si1cd9927t8",
                    text: "Material Design",
                },
            ],
            correct: "hzn32uv4cxphhbhu7d4ty1je",
        },
        {
            id: "1",
            type: "binary",
            title: "Provide Topic and Upload your document",
            choices: [],
            correct: "",
        },
    ]);

    let active = $state("0");

    let activeQuestionIndex = $derived(
        questions.findIndex((a) => a.id == active),
    );
    let activeQuestion = $derived(questions[activeQuestionIndex]);

    let dndOptions = $derived(
        dnd.createDnd({
            data: questions[activeQuestionIndex]!.choices,
            render: (item, l) => dnd.renderDndSnippet(choice, item),
        }),
    );

    let new_choice_text = $state<string>("");
    let new_choice_open = $state<boolean>(false);

    let edit_choice_open = $state<boolean>(false);
    let edit_choice_text = $state<string>("");
    let edit_choice_index = $state<number>();

    watch(
        () => dndOptions.data,
        () => {
            console.log(dndOptions.data);
        },
    );
    watch(
        () => activeQuestion.type,
        () => {
            if (
                activeQuestion.type == "binary" &&
                activeQuestion.choices.length == 0
            ) {
                questions[activeQuestionIndex].choices = [
                    {
                        id: createId(),
                        text: "True",
                    },
                    {
                        id: createId(),
                        text: "False",
                    },
                ];
            }
        },
    );
</script>

<QuizLayout bind:active {questions}>
    {#snippet sidebar()}
        <Button class="w-full group-data-[collapsible=icon]:size-8">
            <Plus></Plus>
            <div class="group-data-[collapsible=icon]:hidden">Add Question</div>
        </Button>
    {/snippet}
    <div class="mx-auto max-w-5xl w-full">
        {#if questions[activeQuestionIndex]}
            <Card class="p-6 gap-2">
                <div class="flex items-center">
                    <div
                        class="size-4 bg-black text-white text-xs rounded flex items-center justify-center"
                    >
                        ?
                    </div>
                    <div class="ml-1">Question {activeQuestionIndex + 1}</div>
                </div>
                <Textarea
                    bind:value={questions[activeQuestionIndex]!.title}
                    class="p-4 bg-neutral-200 rounded-md h-20"
                ></Textarea>
                <div class="flex items-center pt-3">
                    <div class="mr-auto">
                        <div
                            class="border rounded-md px-4 py-1 cursor-not-allowed text-neutral-400 text-sm h-9 items-center flex"
                        >
                            {getTypeName(activeQuestion.type)}
                        </div>
                    </div>
                    {#if activeQuestion.type == "multiple"}
                        {@render add_choice_snippet()}
                    {/if}
                </div>
                <RadioGroup.Root
                    bind:value={questions[activeQuestionIndex]!.correct}
                    disabled
                >
                    <Dnd
                        {...dndOptions}
                        bind:data={questions[activeQuestionIndex]!.choices}
                    ></Dnd>
                    {#if activeQuestion.choices.length == 0}
                        <div class="text-neutral-400 text-sm text-center">
                            This question has no choices
                        </div>
                    {/if}
                </RadioGroup.Root>
            </Card>
        {/if}
    </div>
</QuizLayout>
{@render edit_choice()}

{#snippet choice({ id, text }: QuestionChoice)}
    <div class="flex w-full items-center">
        <label
            for="{activeQuestion.id}-{id}"
            class="flex items-center space-x-2 bg-neutral-100 p-3 rounded-md"
        >
            <RadioGroup.Item value={id} id="{activeQuestion.id}-{id}" />
            <Label for="{activeQuestion.id}-{id}">
                {text}
            </Label>
        </label>
        <div class="ml-auto"></div>
        <Button
            size="icon"
            variant="ghost"
            class="text-red-500"
            disabled={id == activeQuestion.correct}
            onclick={() => {
                questions[activeQuestionIndex].choices = [
                    ...questions[activeQuestionIndex].choices.filter(
                        (a) => a.id != id,
                    ),
                ];
            }}
        >
            <Trash2></Trash2>
        </Button>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger
                class={buttonVariants({ variant: "ghost", size: "icon" })}
            >
                <EllipsisVertical></EllipsisVertical>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {@render choice_menu({ id, text })}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
{/snippet}

{#snippet choice_menu({ id, text }: QuestionChoice)}
    <DropdownMenu.Group>
        {#if activeQuestion.type == "multiple"}
            <DropdownMenu.Item
                onclick={() => {
                    edit_choice_index = activeQuestion.choices.findIndex(
                        (a) => a.id == id,
                    );
                    edit_choice_text =
                        activeQuestion.choices[edit_choice_index].text;
                    edit_choice_open = true;
                }}
            >
                Edit
            </DropdownMenu.Item>
        {/if}
        <DropdownMenu.Item
            disabled={id == activeQuestion.correct}
            onclick={() => {
                questions[activeQuestionIndex]!.correct = id;
            }}
        >
            Mark as Answer
        </DropdownMenu.Item>
    </DropdownMenu.Group>
{/snippet}

{#snippet add_choice_snippet()}
    <Dialog.Root bind:open={new_choice_open}>
        <Dialog.Trigger
            class={buttonVariants({ variant: "default" })}
            onclick={() => {
                new_choice_text = "";
            }}
        >
            Add choice
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>New choice</Dialog.Title>
                <Dialog.Description>
                    Add new choice to the question.
                </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="choice.text" class="text-right">Choice</Label>
                    <Input
                        id="choice.text"
                        bind:value={new_choice_text}
                        class="col-span-3"
                    />
                </div>
            </div>
            <Dialog.Footer>
                <Button
                    disabled={new_choice_text?.trim().length == 0}
                    onclick={() => {
                        questions[activeQuestionIndex].choices.push({
                            id: createId(),
                            text: new_choice_text,
                        });
                        new_choice_open = false;
                    }}
                >
                    Add
                </Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/snippet}

{#snippet edit_choice()}
    <Dialog.Root
        bind:open={edit_choice_open}
        onOpenChange={(e) => {
            if (!e) {
                edit_choice_text = "";
                edit_choice_index = undefined;
            }
        }}
    >
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>Edit choice</Dialog.Title>
                <Dialog.Description>
                    Editing current choice of the question.
                </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="choice.text" class="text-right">Choice</Label>
                    <Input
                        id="choice.text"
                        bind:value={edit_choice_text}
                        class="col-span-3"
                    />
                </div>
            </div>
            <Dialog.Footer>
                <Button
                    disabled={edit_choice_text?.trim().length == 0 ||
                        edit_choice_text ==
                            activeQuestion.choices[edit_choice_index!].text}
                    onclick={() => {
                        questions[activeQuestionIndex].choices[
                            edit_choice_index!
                        ].text = edit_choice_text;
                        edit_choice_open = false;
                    }}
                >
                    Save
                </Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/snippet}
