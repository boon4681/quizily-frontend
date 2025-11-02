<script lang="ts">
    import {
        createMutation,
        createQuery,
        useQueryClient,
    } from "@tanstack/svelte-query";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import BoldButton from "$lib/components/main/bold-button.svelte";
    import { BoldRadioGroup } from "$lib/components/main/bold-radio-group/index";
    import { Button } from "$lib/components/ui/button";
    import { cn } from "$lib/utils";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import CircleX from "@lucide/svelte/icons/circle-x";
    import RotateCCW from "@lucide/svelte/icons/rotate-ccw";
    import { page } from "$app/state";
    import type { QuizWithQuestions } from "$lib/components/main/quiz-layout";
    import {
        Avaaataaar,
        getAvaaataaar,
        SHAPE_COLORS,
    } from "$lib/components/main/avaaataaar";
    import { Spinner } from "$lib/components/ui/spinner";

    const quiz = createQuery<QuizWithQuestions>(() => ({
        queryKey: ["quiz", page.params.qid, "share"],
        retry: 0,
        queryFn: async () =>
            await fetch(`/api/quiz/${page.params.qid}/share`)
                .then((r) => r.json())
                .then((a) => {
                    if ("data" in a) {
                        return a["data"];
                    }
                    throw new Error(JSON.stringify(a));
                }),
    }));

    let questions = $derived(
        quiz.data?.questions?.map((a) => {
            return {
                id: a.id,
                type: a.type == "MULTIPLE_CHOICE" ? "multiple" : "binary",
                title: a.title,
                correct: a.options.find((a) => a.isCorrect)!.id,
                choices: a.options,
            };
        }) ?? [],
    );
    let index = $state(0);
    let points = $state(0);
    let answer = $state<string | undefined>();
    let current_question = $derived(questions[index]);
    let correct_status = $derived<undefined | "correct" | "incorrect">(
        answer == undefined
            ? undefined
            : answer == current_question.correct
              ? "correct"
              : "incorrect",
    );

    let not_finished = $derived(questions.length > index);
</script>

{#if quiz.isSuccess}
    {@const a = getAvaaataaar(quiz.data.title + index)}
    {@const b = getAvaaataaar(quiz.data.title + index + 1)}
    {@const c = getAvaaataaar(quiz.data.title + index + 2)}
    {@const d = getAvaaataaar(quiz.data.title + index + 3)}
    <div
        class="fixed top-0 left-0 w-full h-screen pointer-events-none opacity-15"
    >
        <Avaaataaar
            style="
opacity: 0.2;
position: absolute;
transition: 0.25s;
top:{a.y}%;
left:{c.x}%;
transform: scale({c.scale * 12})"
            shape={c.shape}
        ></Avaaataaar>
        <Avaaataaar
            style="
color: #{a.shape_color};
position: absolute;
transition: 0.25s;
top:{a.y - 10}%;
left:{Math.abs(b.x)}%;
transform: scale({a.scale * 8})"
            shape={a.shape}
        ></Avaaataaar>
        <Avaaataaar
            style="
color: #{b.shape_color};
opacity:0.8;
position: absolute;
transition: 0.25s;
top:{a.x}%;
left:{a.y}%;
transform: scale({b.scale * 5})"
            shape={b.shape}
        ></Avaaataaar>
        <Avaaataaar
            style="
color: #{d.shape_color};
position: absolute;
transition: 0.25s;
top:{d.y}%;
left:{Math.abs(d.y)}%;
transform: scale({d.scale * 8})"
            shape={d.shape}
        ></Avaaataaar>
    </div>
    <div class="p-4 flex justify-between">
        <div class="flex items-center gap-2">
            <div>
                Score: {points}/{questions.length}
            </div>
        </div>
        <div>
            <Button
                class="group"
                onclick={() => {
                    points = 0;
                    index = 0;
                    answer = undefined;
                }}
            >
                <RotateCCW class="rotate-0 group-hover:-rotate-90 transition"
                ></RotateCCW>
                restart
            </Button>
        </div>
    </div>
    <div class="mx-auto max-w-5xl w-full">
        <div class="relative max-w-[440px] w-full mx-auto pt-4 px-4">
            {#if not_finished}
                <div class="flex items-center gap-4">
                    <div
                        class="size-9 rounded-[50%] text-white flex items-center justify-center"
                        style="background-color: #{SHAPE_COLORS[
                            index % SHAPE_COLORS.length
                        ]};"
                    >
                        {index + 1}
                    </div>
                    <div class="text-xl">Question</div>
                </div>
                <div class="py-6 relative">
                    {current_question.title}
                </div>
                <div class="group">
                    <BoldRadioGroup.Root
                        disabled={correct_status != undefined}
                        onValueChange={(e) => (answer = e)}
                    >
                        {#each current_question.choices as choice (choice.id)}
                            <BoldRadioGroup.Item value={choice.id}>
                                <div
                                    data-ans={choice.id ==
                                        current_question.correct}
                                    class={cn(
                                        "absolute pointer-events-none rounded-md h-full w-0 top-0 left-0",
                                        "data-[ans=true]:ring-2 data-[ans=true]:ring-green-600! data-[ans=true]:bg-green-200/50",
                                        "data-[ans=false]:ring-2 data-[ans=false]:ring-red-600! data-[ans=false]:bg-red-200/50",
                                        "transition-all duration-300 ease-in-out",
                                        correct_status == undefined
                                            ? "opacity-0"
                                            : "",
                                        "w-full",
                                    )}
                                >
                                    {#if answer == choice.id && correct_status == "correct"}
                                        <div
                                            class="absolute flex items-center -left-2 -top-2 justify-center rounded size-7 p-1 bg-green-600 text-white"
                                        >
                                            <CircleCheck></CircleCheck>
                                        </div>
                                    {/if}
                                    {#if answer == choice.id && correct_status == "incorrect"}
                                        <div
                                            class="absolute flex items-center -left-2 -top-2 justify-center rounded size-7 p-1 bg-red-600 text-white"
                                        >
                                            <CircleX></CircleX>
                                        </div>
                                    {/if}
                                </div>
                                <div class="pl-4 relative">{choice.text}</div>
                            </BoldRadioGroup.Item>
                        {/each}
                    </BoldRadioGroup.Root>
                </div>
            {:else}
                <div class="text-6xl">
                    <div>Your score is</div>
                    <div class="p-4 bg-black text-white rounded my-4">
                        <span class="text-7xl font-bold text-indigo-600"
                            >{points}</span
                        >
                        <span class="text-4xl font-light text-gray-400"
                            >/ {questions.length}</span
                        >
                    </div>
                </div>
                <div class="text-4xl">
                    {#if points > Math.round(questions.length * 0.7)}
                        <h3 class="text-xl font-semibold text-gray-800 mb-3">
                            Excellent Work!
                        </h3>
                        <p class="text-gray-600 text-base leading-relaxed">
                            This is a fantastic result and a testament to your
                            hard work. You should be proud of what you've
                            achieved. Keep up the momentum!
                        </p>
                    {:else if points > Math.round(questions.length * 0.5)}
                        <h3 class="text-xl font-semibold text-gray-800 mb-3">
                            You are so close!
                        </h3>
                        <p class="text-gray-600 text-base leading-relaxed">
                            You've built a solid foundation. This score means
                            you're just a few steps away. Pinpoint those tricky
                            areas and you'll master this!
                        </p>
                    {:else}
                        <h3 class="text-xl font-semibold text-gray-800 mb-3">
                            This is your starting point.
                        </h3>
                        <p class="text-gray-600 text-base leading-relaxed">
                            This score doesn't define you—it just shows where to
                            focus next. Every mistake is a lesson. Take a
                            breath, review the feedback, and let's build from
                            here!
                        </p>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
    <div class="h-20 mt-10"></div>
    <div
        class="border-t-2 flex items-center justify-center px-4 border-neutral-300 h-20 fixed bg-background bottom-0 w-full"
    >
        {#if not_finished}
            {#if correct_status == undefined}
                <BoldButton
                    variant="dark"
                    class="min-w-[200px]"
                    onclick={() => {
                        index++;
                        answer = undefined;
                    }}
                >
                    Skip
                </BoldButton>
            {:else}
                <BoldButton
                    variant="dark"
                    class="min-w-[200px]"
                    onclick={() => {
                        if (correct_status == "correct") points++;
                        index++;
                        answer = undefined;
                    }}
                >
                    Next
                </BoldButton>
            {/if}
        {:else}
            <!-- <BoldButton variant="dark" class="min-w-[200px]">Finished</BoldButton> -->
        {/if}
    </div>
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
                    <div class="first-letter:uppercase">{error.message}</div>
                </div>
                <BoldButton variant="dark" class="my-4" href="/">
                    Back to Home
                </BoldButton>
            </div>
        </div>
    </div>
{/if}
<AlertDialog.Root open={quiz.isPending}>
    <AlertDialog.Content
        class="bg-transparent border-none shadow-none items-center justify-center"
    >
        <Spinner class="size-12"></Spinner>
    </AlertDialog.Content>
</AlertDialog.Root>
