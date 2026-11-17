import { Reveal } from "./Reveal";

export function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <h2
        id={id}
        className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl md:text-7xl"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">{description}</p>
      ) : null}
    </Reveal>
  );
}
