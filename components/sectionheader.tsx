interface SectionHeaderProps {
  title: string;
}

export default function SectionHeader({ title }: SectionHeaderProps) {
  return <h2 className="text-[18px] font-semibold mt-8 mb-3">{title}</h2>;
}
