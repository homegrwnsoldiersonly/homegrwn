import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import { Icon } from "./Icon";
import { TOOLS, type Tool } from "./content";

export interface ToolsSectionProps {
  id?: string;
  tools?: Tool[];
}

/** The tools behind the promise — responder, landing pages, tracking. */
export function ToolsSection({ id = "tools", tools = TOOLS }: ToolsSectionProps) {
  return (
    <Section variant="dark" id={id}>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow flag>The tools</Eyebrow>
          <Heading as="h2" className="mt-4">
            A system that runs while you&apos;re out in the field.
          </Heading>
        </div>

        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {tools.map((tool) => (
            <article
              key={tool.title}
              className="grid gap-5 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lime-500">
                    <Icon name={tool.icon} size={20} />
                  </span>
                  <Heading as="h3" size="title">
                    {tool.title}
                  </Heading>
                </div>
                <p className="mt-4 text-md text-white/70">{tool.body}</p>
              </div>
              <ul className="space-y-3 self-center">
                {tool.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/80">
                    <Icon
                      name="Check"
                      size={16}
                      className="mt-0.5 text-lime-500"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
