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
    import { watch } from "runed";
    import Button, {
        buttonVariants,
    } from "$lib/components/ui/button/button.svelte";
    import Plus from "@lucide/svelte/icons/plus";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input";

    let questions = $state<Question[]>([
        {
            id: "0",
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

    watch(
        () => dndOptions.data,
        () => {
            console.log(dndOptions.data);
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
                <div class="flex justify-end pt-3">
                    {@render add_choice_snippet()}
                </div>
                <RadioGroup.Root
                    bind:value={questions[activeQuestionIndex]!.correct}
                >
                    <Dnd
                        {...dndOptions}
                        bind:data={questions[activeQuestionIndex]!.choices}
                    ></Dnd>
                </RadioGroup.Root>
            </Card>
        {/if}
    </div>
</QuizLayout>

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
            onclick={() => {
                questions[activeQuestionIndex].choices = [...questions[
                    activeQuestionIndex
                ].choices.filter((a) => a.id != id)];
            }}
        >
            <Trash2></Trash2>
        </Button>
    </div>
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
