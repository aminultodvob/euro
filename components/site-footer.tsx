import React from "react";

export function SiteFooter() {
    return (
        <footer className="mt-12 border-t border-border bg-neutral-50 py-8">
            <div className="mx-auto max-w-7xl px-4 text-center">
                <p className="mb-1 text-base font-bold text-neutral-700">Euro Furniture</p>
                <p className="text-sm text-muted-foreground">
                    Personal product directory · © {new Date().getFullYear()}
                </p>
                <div className="mt-4 text-xs text-muted-foreground/80 space-y-1">
                    <p className="font-medium text-neutral-600">China Warehouse Address:</p>
                    <p>Jianxiang Warehouse Address-no.1 Yangijao Beisha Industrial Zone,</p>
                    <p>LeCong, ShunDe, FoShan, GuangDong, China</p>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 text-center">

                <div className="mt-4 text-xs text-muted-foreground/80 space-y-1">
                    <p className="font-medium text-neutral-600">Bangladesh Warehouse Address:</p>
                    <p>Sheba Filling Station, Pakkar Matha</p>
                    <p>Salimpur 4317,Chittagong, Dhaka-Chittagong Hwy, Bangladesh </p>
                </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 text-center">

                <div className="mt-4 text-xs text-muted-foreground/80 space-y-1">
                    <p className="font-medium text-neutral-600">Australia Warehouse Address:</p>
                    <p>Perth</p>
                    <p>Australia</p>
                </div>
            </div>

        </footer>
    );
}
