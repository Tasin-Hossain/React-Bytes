import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ComponentPropsContext = createContext(null);

/**
 * ComponentPropsProvider
 * Wraps a demo page and provides shared state:
 *   - props: current customize values
 *   - setProps: update one or more props
 *   - animKey: replay trigger
 *   - replay: increment animKey
 *   - langTab / setLangTab
 *   - styleTab / setStyleTab
 *   - mainTab / setMainTab
 */
export const ComponentPropsProvider = ({ children, initialProps = {} }) => {
  const [props, setPropsState] = useState(initialProps);
  const [animKey, setAnimKey]   = useState(0);
  const [langTab, setLangTab]   = useState('js');
  const [styleTab, setStyleTab] = useState('tailwind');
  const [mainTab, setMainTab]   = useState('preview');

  const setProps = (updater) => {
    setPropsState((prev) =>
      typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
    );
  };

  const replay = () => setAnimKey((k) => k + 1);

  return (
    <ComponentPropsContext.Provider
      value={{
        props,
        setProps,
        animKey,
        replay,
        langTab,
        setLangTab,
        styleTab,
        setStyleTab,
        mainTab,
        setMainTab,
      }}
    >
      {children}
    </ComponentPropsContext.Provider>
  );
};


export default ComponentPropsProvider;
