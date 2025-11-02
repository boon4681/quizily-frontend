<script lang="ts">
    import type {
        Question,
        QuestionChoice,
        Quiz,
        QuizWithQuestions,
    } from "$lib/components/main/quiz-layout";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import { UseClipboard } from "$lib/hooks/use-clipboard.svelte.js";
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
    import Save from "@lucide/svelte/icons/save";
    import SaveOff from "@lucide/svelte/icons/save-off";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input";
    import { getTypeName } from "$lib/utils/get-type-name";
    import Play from "@lucide/svelte/icons/play";
    import CheckIcon from "@lucide/svelte/icons/check";
    import CopyIcon from "@lucide/svelte/icons/copy";
    import Share2Icon from "@lucide/svelte/icons/share-2";
    import { cn } from "$lib/utils";
    import { page } from "$app/state";
    import {
        createMutation,
        createQuery,
        useQueryClient,
    } from "@tanstack/svelte-query";
    import { debounce } from "@tanstack/pacer";
    import { Spinner } from "$lib/components/ui/spinner";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import BoldButton from "$lib/components/main/bold-button.svelte";
    const client = useQueryClient();
    const clipboard = new UseClipboard();
    const quiz = createQuery<QuizWithQuestions>(() => ({
        queryKey: ["quiz", page.params.qid],
        queryFn: async () =>
            await fetch("/api/quiz/" + page.params.qid)
                .then((r) => r.json())
                .then((a) => {
                    if ("data" in a) {
                        return a["data"];
                    }
                    throw new Error(JSON.stringify(a));
                }),
        retry: 0,
    }));

    let saved = $state(false);

    const saveMutation = createMutation(() => ({
        mutationFn: async (value: Question[]) => {
            const result = await fetch(`/api/quiz/${page.params.qid}/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    questions: value,
                }),
            });
            saved = true;
            return result;
        },
    }));
    const shareMutation = createMutation(() => ({
        mutationFn: async (share: boolean) => {
            const result = await fetch(`/api/quiz/${page.params.qid}/share`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    share: share,
                }),
            });
            return result;
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: ["quiz", page.params.qid] });
        },
        retry: 0,
    }));

    const saveDebounced = debounce(
        () => {
            saveMutation.mutate(questions);
        },
        { wait: 3000 },
    );

    const save = () => {
        saved = false;
        saveDebounced();
    };

    let questions = $state<Question[]>([]);
    let active = $state("");
    watch(
        () => quiz.isSuccess,
        () => {
            questions =
                quiz.data?.questions?.map((a) => {
                    return {
                        id: a.id,
                        type:
                            a.type == "MULTIPLE_CHOICE" ? "multiple" : "binary",
                        title: a.title,
                        correct: a.options.find((a) => a.isCorrect)!.id,
                        choices: a.options,
                    };
                }) ?? [];
            if (questions.length) {
                active = questions[0].id;
            }
        },
    );

    let activeQuestionIndex = $derived(
        questions.findIndex((a) => a.id == active),
    );
    let activeQuestion = $derived(questions[activeQuestionIndex]);

    let dndOptions = $derived(
        dnd.createDnd({
            data: questions[activeQuestionIndex]?.choices ?? [],
            render: (item, l) => dnd.renderDndSnippet(choice, item),
        }),
    );

    let new_choice_text = $state<string>("");
    let new_choice_open = $state<boolean>(false);

    let edit_choice_open = $state<boolean>(false);
    let edit_choice_text = $state<string>("");
    let edit_choice_index = $state<number>();

    // Save
    watch(
        () => JSON.stringify(questions),
        () => {
            save();
        },
    );
    watch(
        () => activeQuestion?.type,
        () => {
            if (!activeQuestion) return;
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

<QuizLayout bind:active title={quiz.data?.title} {questions}>
    {#snippet header()}
        {#if quiz.isSuccess}
            <Dialog.Root>
                <Dialog.Trigger
                    class={buttonVariants({ variant: "default", size: "icon" })}
                >
                    <Share2Icon></Share2Icon>
                </Dialog.Trigger>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>Share "{quiz.data?.title}"</Dialog.Title>
                    </Dialog.Header>
                    <div class="hidden">
                        {quiz.isLoading}
                        {quiz.isFetching}
                    </div>
                    {#if !quiz.data?.share}
                        {#if shareMutation.isPending || quiz.isFetching}
                            <div
                                class="w-full flex items-center justify-center my-10"
                            >
                                <Spinner class="size-12"></Spinner>
                            </div>
                        {:else if !shareMutation.isPending && !quiz.isLoading}
                            <Button
                                disabled={shareMutation.isPending}
                                onclick={() => shareMutation.mutate(true)}
                            >
                                Enable Share
                            </Button>
                        {/if}
                    {/if}
                    {#if quiz.data?.share}
                        {#if shareMutation.isPending || quiz.isFetching}
                            <div
                                class="w-full flex items-center justify-center my-10"
                            >
                                <Spinner class="size-12"></Spinner>
                            </div>
                        {:else if !shareMutation.isPending && !quiz.isLoading}
                            <InputGroup.Root>
                                <InputGroup.Input
                                    value="{page.url.origin}/quiz/{quiz.data
                                        ?.shareId}/share"
                                    readonly
                                />
                                <InputGroup.Addon align="inline-end">
                                    <InputGroup.Button
                                        aria-label="Copy"
                                        title="Copy"
                                        size="icon-xs"
                                        onclick={() =>
                                            clipboard.copy(
                                                `${page.url.origin}/quiz/${
                                                    quiz.data?.shareId
                                                }/share`,
                                            )}
                                    >
                                        {#if clipboard.copied}
                                            <CheckIcon />
                                        {:else}
                                            <CopyIcon />
                                        {/if}
                                    </InputGroup.Button>
                                </InputGroup.Addon>
                            </InputGroup.Root>
                            <Button
                                disabled={shareMutation.isPending}
                                onclick={() => shareMutation.mutate(false)}
                            >
                                Disable Share
                            </Button>
                        {/if}
                    {/if}
                </Dialog.Content>
            </Dialog.Root>
            <Button href="/quiz/{page.params.qid}/preview">
                <Play></Play>
                Preview
            </Button>
        {:else}
            <Skeleton class="h-9 w-[120px]"></Skeleton>
        {/if}
    {/snippet}
    {#snippet sidebar()}
        <!-- {@render add_question()} -->
    {/snippet}
    <div class="text-sm">
        {#if quiz.isSuccess}
            {#if saveMutation.isPending}
                <div class="flex gap-2">
                    <Save class="size-5"></Save>
                    Saving...
                </div>
            {:else if saved}
                <div class="flex gap-2">
                    <Save class="size-5"></Save>
                    Saved
                </div>
            {:else if !saved}
                <div class="flex gap-2">
                    <SaveOff class="size-5"></SaveOff>
                    Unsaved
                </div>
            {/if}
        {/if}
    </div>
    <div class="mx-auto max-w-5xl w-full">
        {#if quiz.isSuccess}
            {#if questions[activeQuestionIndex]}
                <Card class="gap-2 rounded-none -mx-4 md:mx-0 p-4 md:p-6">
                    <div class="flex items-center">
                        <div
                            class="size-4 bg-black text-white text-xs rounded flex items-center justify-center"
                        >
                            ?
                        </div>
                        <div class="ml-1">
                            Question {activeQuestionIndex + 1}
                        </div>
                    </div>
                    <Textarea
                        bind:value={questions[activeQuestionIndex]!.title}
                        class="p-4 bg-neutral-200 rounded-md h-20"
                    ></Textarea>
                    <div class="flex items-center pt-3">
                        <div class="mr-auto">
                            <div
                                class="border rounded-md px-4 py-1 cursor-not-allowed text-sm h-9 items-center flex"
                            >
                                <span class="text-neutral-500">
                                    {getTypeName(activeQuestion.type)}
                                </span>
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
                        {#key activeQuestion.id}
                            <Dnd
                                {...dndOptions}
                                bind:data={
                                    questions[activeQuestionIndex]!.choices
                                }
                            ></Dnd>
                        {/key}
                        {#if activeQuestion.choices.length == 0}
                            <div class="text-neutral-400 text-sm text-center">
                                This question has no choices
                            </div>
                        {/if}
                    </RadioGroup.Root>
                </Card>
            {/if}
        {/if}
        {#if quiz.isError}
            {@const error = JSON.parse(quiz.error.message)}
            <div class="mx-auto max-w-5xl w-full">
                <div class="relative max-w-[440px] w-full mx-auto pt-4 px-4">
                    <div class="p-4 text-white rounded my-4">
                        <span class="text-7xl font-bold text-indigo-600"
                            >{error.code}</span
                        >
                        <div class="flex text-4xl font-light text-gray-400">
                            <div>/</div>
                            <div class="first-letter:uppercase">
                                {error.message}
                            </div>
                        </div>
                        <BoldButton variant="dark" class="my-4" href="/"
                            >Back to Home</BoldButton
                        >
                    </div>
                </div>
            </div>
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
            disabled={id == activeQuestion.correct ||
                activeQuestion.type == "binary"}
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
                onSelect={() => {
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
            closeOnSelect
            disabled={id == activeQuestion.correct}
            onSelect={() => {
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

{#snippet add_question()}
    <Dialog.Root>
        <Dialog.Trigger
            class={cn(
                buttonVariants({ variant: "default" }),
                "w-full group-data-[collapsible=icon]:size-8",
            )}
        >
            <Plus></Plus>
            <div class="group-data-[collapsible=icon]:hidden">Add Question</div>
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>Edit profile</Dialog.Title>
                <Dialog.Description>
                    Make changes to your profile here. Click save when you're
                    done.
                </Dialog.Description>
            </Dialog.Header>
            <div class="grid gap-4 py-4"></div>
            <Dialog.Footer>
                <Button type="submit">Save changes</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/snippet}
