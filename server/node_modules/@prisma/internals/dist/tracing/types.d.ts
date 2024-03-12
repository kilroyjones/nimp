import type { Context, Span, SpanOptions } from '@opentelemetry/api';
export type SpanCallback<R> = (span?: Span, context?: Context) => R;
export type ExtendedSpanOptions = SpanOptions & {
    /** The name of the span */
    name: string;
    internal?: boolean;
    middleware?: boolean;
    /** Whether it propagates context (?=true) */
    active?: boolean;
    /** The context to append the span to */
    context?: Context;
};
export type EngineSpanEvent = {
    span: boolean;
    spans: EngineSpan[];
};
export type EngineSpan = {
    span: boolean;
    name: string;
    trace_id: string;
    span_id: string;
    parent_span_id: string;
    start_time: [number, number];
    end_time: [number, number];
    attributes?: Record<string, string>;
    links?: {
        trace_id: string;
        span_id: string;
    }[];
};
export interface TracingHelper {
    isEnabled(): boolean;
    getTraceParent(context?: Context): string;
    createEngineSpan(engineSpanEvent: EngineSpanEvent): void;
    getActiveContext(): Context | undefined;
    runInChildSpan<R>(nameOrOptions: string | ExtendedSpanOptions, callback: SpanCallback<R>): R;
}
export type PrismaInstrumentationGlobalValue = {
    helper?: TracingHelper;
};
declare global {
    var PRISMA_INSTRUMENTATION: PrismaInstrumentationGlobalValue | undefined;
}
