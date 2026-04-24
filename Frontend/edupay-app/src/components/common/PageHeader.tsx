interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-2">
      <h1 className="text-[18px] font-bold">
        {title}
      </h1>

    <p className="text-sm text-gray-500 font-medium">
        {subtitle}
    </p>
    </div>
  );
}