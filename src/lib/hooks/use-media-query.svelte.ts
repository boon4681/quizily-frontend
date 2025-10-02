import type { Action } from 'svelte/action';
import { parseMediaQuery, type ConditionNode, type ConditionWithoutOrNode, type DimensionNode, type FeatureNode, type InParensNode, type QueryNode, type ValueNode } from "media-query-parser";
import { onDestroy, onMount } from 'svelte';

function rem_t_px(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function em_t_px(ele: HTMLElement, em: number) {
    return em * parseFloat(getComputedStyle(ele).fontSize);
}

function convert_dimension(ele: HTMLElement, value: DimensionNode): number {
    const num = value.value
    switch (value.unit) {
        case 'px':
            return num
        case 'em':
            return em_t_px(ele, num);
        case 'rem':
            return rem_t_px(num);
        case 'vh':
            return (num / 100) * window.innerHeight;
        case 'vw':
            return (num / 100) * window.innerWidth;
        case 'vmin':
            return (num / 100) * Math.min(window.innerWidth, window.innerHeight);
        case 'vmax':
            return (num / 100) * Math.max(window.innerWidth, window.innerHeight);
        case '%':
            return num;
        case 'in':
            return num * 96;
        case 'cm':
            return num * 37.8;
        case 'mm':
            return num * 3.78;
        case 'pt':
            return num * 1.33;
        case 'pc':
            return num * 16;
        case 'dpi':
            return num / 96;
        case 'dpcm':
            return num / 37.8;
        case 'dppx':
            return num;
        default:
            throw new Error("Unknown dimension unit")
    }
}

function compute_value_node(ele: HTMLElement, value: ValueNode): number {
    switch (value._t) {
        case "number":
            return value.value
        case "dimension":
            return convert_dimension(ele, value)
        case "ident":
            throw new Error("ident not supported")
        case "ratio":
            throw new Error("ratio not supported")
    }
}

function run_single_feature(ele: HTMLElement, feature: string, numericValue: number): boolean {
    const rect = ele.getBoundingClientRect()
    switch (feature.toLowerCase()) {
        case "min-width":
            return rect.width >= numericValue;

        case "max-width":
            return rect.width <= numericValue;

        case "width":
            return rect.width === numericValue;

        case "min-height":
            return rect.height >= numericValue;

        case "max-height":
            return rect.height <= numericValue;

        case "height":
            return rect.height === numericValue;

        default:
            console.warn("Unsupported feature:", feature);
            return false;
    }
}

function feature(ele: HTMLElement, featureNode: FeatureNode): boolean {
    if (featureNode.context == "boolean") {
        return Boolean(featureNode.feature)
    }
    if (featureNode.context == "value") {
        const { feature, value } = featureNode;
        const v = compute_value_node(ele, value)
        return run_single_feature(ele, feature, v)
    }
    if (featureNode.context == "range") {
        const { feature } = featureNode;
        if (feature in ['width', 'height']) { } else {
            throw new Error(`Unsupported feature ${JSON.stringify(feature)}`)
        }
        const rect = ele.getBoundingClientRect() as DOMRect & Record<string, number>

        if (featureNode.ops == 1) {
            const v = compute_value_node(ele, featureNode.value)

            switch (featureNode.op) {
                case "<":
                    return rect[feature] < v;
                case "<=":
                    return rect[feature] <= v;
                case ">":
                    return rect[feature] > v;
                case ">=":
                    return rect[feature] >= v;
                case "=":
                    return rect[feature] == v;
            }
        }
        if (featureNode.ops == 2) {
            const min = compute_value_node(ele, featureNode.minValue)
            const max = compute_value_node(ele, featureNode.maxValue)

            const min_result = featureNode.minOp == "<" ? rect[feature] > min : rect[feature] >= min
            const max_result = featureNode.maxOp == "<" ? rect[feature] < max : rect[feature] <= max

            return min_result && max_result
        }
    }
    return false
}

function eval_query(ele: HTMLElement, query: string): boolean {
    const node = parseMediaQuery(query)
    if ('_errid' in node) {
        throw new Error(node._errid)
    }
    function run(node: QueryNode | ConditionNode | ConditionWithoutOrNode | InParensNode | FeatureNode | undefined): boolean {
        if (!node) {
            return true
        }
        switch (node._t) {
            case "query":
                if (node.type && node.type.toLowerCase() !== "screen") {
                    return false;
                }
                return run(node.condition);
            case "condition":
                if (node.op === "and") {
                    return node.nodes.every(run);
                }
                if (node.op === "or") {
                    return node.nodes.some(run);
                }
                if (node.op === "not") {
                    return !run(node.nodes[0]);
                }
                return false;
            case "in-parens":
                if (node.node._t == "general-enclosed") {
                    return true
                }
                return run(node.node)
            case "feature":
                return feature(ele, node)
        }
    }
    return run(node)
}

export const useMediaQuery = (query: string) => {
    let current = $state<boolean>(false);

    const action: Action<HTMLElement, undefined> = (node) => {
        const run = () => {
            current = eval_query(node, `(${query})`)
        }
        const observer = new ResizeObserver(() => {
            run()
        })
        onMount(() => {
            observer.observe(node)
            run()
        })
        onDestroy(() => {
            observer.disconnect()
        })
    }

    Object.defineProperty(action, 'current', {
        get: () => current,
    });

    return action as typeof action & { current: boolean };
};