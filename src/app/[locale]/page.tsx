import { Container } from "@/components/shared/container";

export default function HomePage() {
  return (
    <Container
      as="section"
      className="flex min-h-[80vh] flex-col items-start justify-center py-24 md:py-32 lg:py-40"
    >
      <p className="font-mono text-caption uppercase text-stone">
        AW AB — Foundation
      </p>
      <h1 className="mt-6 max-w-4xl text-balance font-display text-display-xl text-ink">
        Premium förpackningar, svensk hantverkskvalitet.
      </h1>
      <p className="mt-8 max-w-xl text-body-lg text-stone">
        Scaffolding complete. Header, footer, and navigation layer wired up.
        Next steps will replace this with the real homepage.
      </p>
    </Container>
  );
}
