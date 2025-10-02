import type { Component, ComponentProps, Snippet } from "svelte";

export class RenderComponentConfig<TComponent extends Component> {
	component: TComponent;
	props: ComponentProps<TComponent> | Record<string, never>;
	constructor(
		component: TComponent,
		props: ComponentProps<TComponent> | Record<string, never> = {}
	) {
		this.component = component;
		this.props = props;
	}
}

export class RenderSnippetConfig<TProps> {
	snippet: Snippet<[TProps]>;
	params: TProps;
	constructor(snippet: Snippet<[TProps]>, params: TProps) {
		this.snippet = snippet;
		this.params = params;
	}
}

export function renderDndComponent<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Component<any>,
	Props extends ComponentProps<T>,
>(component: T, props: Props) {
	return new RenderComponentConfig(component, props);
}

export function renderDndSnippet<TProps>(snippet: Snippet<[TProps]>, params: TProps) {
	return new RenderSnippetConfig(snippet, params);
}

export type Renderable<Renderer> = Renderer extends Component
	? RenderComponentConfig<Renderer>
	: Renderer extends Snippet
	? RenderSnippetConfig<any>
	: never;

interface DndConfig<D> {
	id?: string
	render: (item: D, i: number) => Renderable<any>
	data: D[]
}

export function createDnd<D extends { id: string } & Record<string, any>>(options: DndConfig<D>) {
	return options as Required<DndConfig<D>>
}