/**
 * Customize
 * Section wrapper for preview controls (sliders, selects, toggles).
 *
 * Usage:
 *   <Customize>
 *     <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
 *       <PreviewSelect ... />
 *       <PreviewSlider ... />
 *     </div>
 *   </Customize>
 */
const Customize = ({ children, title = 'Customize' }) => (
  <div className="mb-8">
    <h2 className="title-two mb-5">{title}</h2>
    {children}
  </div>
);

export default Customize;
