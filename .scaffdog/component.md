---
name: 'component'
root: 'src/components'
output: '**/*'
ignore: []
questions:
  name: 'Please enter component name.'
---

# `{{ inputs.name }}/{{ inputs.name }}.tsx`

```tsx
import './{{ inputs.name }}.css';
import React from 'react';

export const {{ inputs.name | pascal }}: React.FC = () => {
  return (
    <section></section>
  );
};
```

# `{{ inputs.name }}/index.ts`

```ts
export * from './{{ inputs.name }}';
```

# `{{ inputs.name }}/{{ inputs.name }}.css`

```css
.{{ inputs.name }}_wrap {}
```

```markdown
Let's make a document! See more detail scaffdog repository.
https://github.com/cats-oss/scaffdog/#templates
```
