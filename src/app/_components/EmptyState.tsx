export const EmptyState: React.FC<{
  title: string;
  text: string;
}> = (props) => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col justify-center gap-4 rounded-box bg-base-200 px-4 py-12 text-center">
      <h3 className="text-2xl font-bold">{props.title}</h3>
      <p className="text- text-sm">{props.text}</p>
    </div>
  );
};
