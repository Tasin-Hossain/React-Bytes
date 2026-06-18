const Dependencies = ({ dependencies = [] }) => {
  return (
    <section>

        <h2 className="title-two mb-4">Dependencies</h2>
      <div className="flex flex-wrap gap-2">
        {dependencies.map((dep) => (
          <>
            <span
            key={dep.name}
            className="text-sm px-3 py-1 rounded-md bg-(--bg-button)
                       border border-(--border-button)
                       text-(--text-muted)"
          >
            {dep.name} <span className="opacity-70">{dep.version}</span>
          </span>
          </>
        ))}
      </div>
    </section>
  );
};

export default Dependencies;