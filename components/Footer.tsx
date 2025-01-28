import { cn } from "@/lib/utils";

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left mx-5">
            Built by{" "}
            <a
              href="https://github.com/Roenan12"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Roenan Halili
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/Roenan12/budget-buddy-app"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
