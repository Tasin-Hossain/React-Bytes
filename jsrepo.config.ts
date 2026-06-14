import { defineConfig, type RegistryItem } from 'jsrepo';
import { output } from '@jsrepo/shadcn';
import { componentMetadata } from './src/constants/Information';

export default defineConfig({
  registry: {
    name: '@react-bytes',
    description:
      'React Bytes is a free and open source collection of high quality, animated, interactive & fully customizable React components for building stunning, memorable user interfaces.',
    homepage: 'http://localhost:5173',
    authors: ['Mohammad Tasin'],
    bugs: 'https://github.com/Tasin-Hossain/React-Bytes/issues',
    repository: 'https://github.com/Tasin-Hossain/React-Bytes',
    tags: [
      'React',
      'ReactJS',
      'React Components',
      'Free React Components',
      'React UI Components',
      'React Component Library',
      'React Animations',
      'React Hooks',
      'React Tutorials',
      ' React Development',
      'React Best Practices',
      'JavaScript',
      'TypeScript',
      'Frontend Development',
      'Web Development',
      'UI Design',
      'Modern UI',
      'Tailwind CSS',
      'Framer Motion',
      'Next.js',
      'Responsive Design',
      'Interactive Components',
      'Animation Library',
      'Dashboard Components',
      'Landing Page Components',
      'Reusable Components',
      'Open Source Components',
      'CSS Animations',
      'Frontend Tools',
      'Developer Resources',
      'Coding Tutorials'
    ],
    excludeDeps: ['react', 'react-dom'],
    outputs: [output({ dir: 'public/r', format: true })],
    items: [
      ...Object.values(componentMetadata).map(component =>
        defineComponent({
          title: component.name,
          description: component.description,
          category: component.category,
          categories: [component.category],
          dependencies: component.dependencies ?? [],
          variants: component.variants ?? ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW']
        })
      )
    ].flat()
  },
  paths: {
    component: './src/components'
  }
});


function folderForVariant(variant: string): string {
  switch (variant) {
    case 'JS-CSS':
      return 'JS-CSS';
    case 'JS-TW':
      return 'JS-TW';
    case 'TS-CSS':
      return 'TS-CSS';
    case 'TS-TW':
      return 'TS-TW';
    default:
      return variant;
  }
}


function extForVariant(variant: string): string {
  return variant.startsWith('TS') ? 'tsx' : 'jsx';
}


function defineComponent({
  title,
  description,
  category,
  categories,
  meta,
  dependencies = [],
  variants = ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW']
}: {
  title: string;
  description: string;
  category: string;
  categories?: string[];
  meta?: Record<string, string>;
  dependencies?: string[];
  variants?: string[];
}): RegistryItem[] {
  return variants.map(variant => ({
    name: `${title}-${variant}`,
    title,
    description,
    type: 'registry:component' as const,
    categories: [category, ...(categories ?? [])],
    meta,
    dependencies,
    files: [
      {
        path: `public/${folderForVariant(variant)}/${category}/${title}/${title}.${extForVariant(variant)}`
      }
    ]
  }));
}
