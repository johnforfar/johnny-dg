import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 px-4">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://github.com/johnforfar"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Johnny
            </Link>
            . Powered by{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Next.js
            </Link>{" "}
            and{" "}
            <Link
              href="https://farcaster.xyz"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Farcaster
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
