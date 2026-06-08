// components/shared/ComponentGrid/ComponentGrid.jsx
// Drop-in wrapper — pass your mapped <ComponentCard /> list as children

const ComponentGrid = ({ children }) => (
  <div
    className="
      grid gap-2.5
      grid-cols-2
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-3
      xl:grid-cols-4
      2xl:grid-cols-5
    "
  >
    {children}
  </div>
);

export default ComponentGrid;
