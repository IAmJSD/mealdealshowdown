import { StackHandler, StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export default function Handler(props: unknown) {
    return (
        <StackProvider app={stackServerApp}>
            <StackTheme>
                <StackHandler
                    fullPage
                    app={stackServerApp}
                    routeProps={props}
                />
            </StackTheme>
        </StackProvider>
    );
}
