export function SiteFooter() {
    return (
        <footer className="mt-12 border-t border-border bg-neutral-50 py-8">
            <div className="mx-auto max-w-7xl px-4 text-center">
                <p className="mb-1 text-base font-bold text-neutral-700">euro furniture</p>
                <p className="text-sm text-muted-foreground">
                    Personal product directory · © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
