'use client';

export function Features() {
  const items = ['Bilingual', 'Real-Time', 'Verified', 'Intellectual', 'Cited'];

  return (
    <section className="py-20 w-full overflow-hidden">
      <div className="section-container flex flex-wrap items-center justify-center gap-8 md:gap-16 lg:gap-24">
        {items.map((item) => (
          <span
            key={item}
            className="font-display font-black text-2xl md:text-3xl tracking-wide text-[#34415C]"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
