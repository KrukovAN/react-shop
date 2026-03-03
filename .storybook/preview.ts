import React from 'react'
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import type { Preview } from '@storybook/react-vite'
import { themes } from 'storybook/theming'
import '../src/index.css'

const applyThemeToDocument = (isDark: boolean) => {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.toggle('dark', isDark)
  document.body.classList.toggle('dark', isDark)
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === 'dark'

      applyThemeToDocument(isDark)

      return Story()
    },
  ],
  parameters: {
    docs: {
      container: ({ children, context }: React.PropsWithChildren<DocsContainerProps>) => {
        const storyContext = context.getStoryContext(context.storyById())
        const isDark = storyContext.globals.theme === 'dark'

        applyThemeToDocument(isDark)

        return React.createElement(
          DocsContainer,
          {
            context,
            theme: isDark ? themes.dark : themes.light,
          },
          children,
        )
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
