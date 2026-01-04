import { CompletionItem, CompletionItemKind, MarkupContent } from "vscode-languageserver/node";
import { md } from "./utils";

/**
 * Documentation for loop variable properties
 */
export const LOOP_VARIABLE_DOCS: Record<string, MarkupContent> = {
  index: md(`### loop.index
The current iteration of the loop (1-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.index }}. {{ item }}
{% endfor %}
{# outputs: 1. first, 2. second, etc. #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  index0: md(`### loop.index0
The current iteration of the loop (0-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.index0 }}. {{ item }}
{% endfor %}
{# outputs: 0. first, 1. second, etc. #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  revindex: md(`### loop.revindex
The number of iterations from the end (1-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.revindex }} items remaining
{% endfor %}
{# Last item shows "1 items remaining" #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  revindex0: md(`### loop.revindex0
The number of iterations from the end (0-indexed).

**Example:**
\`\`\`twig
{% for item in items %}
  {{ loop.revindex0 }} items after this
{% endfor %}
{# Last item shows "0 items after this" #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  first: md(`### loop.first
True if this is the first iteration.

**Example:**
\`\`\`twig
{% for item in items %}
  {% if loop.first %}<ul>{% endif %}
  <li>{{ item }}</li>
  {% if loop.last %}</ul>{% endif %}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  last: md(`### loop.last
True if this is the last iteration.

**Example:**
\`\`\`twig
{% for item in items %}
  {{ item }}{% if not loop.last %}, {% endif %}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  length: md(`### loop.length
The total number of items in the sequence.

**Example:**
\`\`\`twig
{% for item in items %}
  Item {{ loop.index }} of {{ loop.length }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),

  parent: md(`### loop.parent
The parent context in nested loops.

**Example:**
\`\`\`twig
{% for category in categories %}
  {% for item in category.items %}
    Category {{ loop.parent.loop.index }}, Item {{ loop.index }}
  {% endfor %}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html#the-loop-variable)`),
};

/**
 * Loop variable completions (available inside for loops after "loop.")
 */
export const LOOP_VARIABLE_COMPLETIONS: CompletionItem[] = [
  {
    label: "index",
    kind: CompletionItemKind.Property,
    detail: "Current iteration (1-indexed)",
    documentation: LOOP_VARIABLE_DOCS["index"],
  },
  {
    label: "index0",
    kind: CompletionItemKind.Property,
    detail: "Current iteration (0-indexed)",
    documentation: LOOP_VARIABLE_DOCS["index0"],
  },
  {
    label: "revindex",
    kind: CompletionItemKind.Property,
    detail: "Iterations from end (1-indexed)",
    documentation: LOOP_VARIABLE_DOCS["revindex"],
  },
  {
    label: "revindex0",
    kind: CompletionItemKind.Property,
    detail: "Iterations from end (0-indexed)",
    documentation: LOOP_VARIABLE_DOCS["revindex0"],
  },
  {
    label: "first",
    kind: CompletionItemKind.Property,
    detail: "True if first iteration",
    documentation: LOOP_VARIABLE_DOCS["first"],
  },
  {
    label: "last",
    kind: CompletionItemKind.Property,
    detail: "True if last iteration",
    documentation: LOOP_VARIABLE_DOCS["last"],
  },
  {
    label: "length",
    kind: CompletionItemKind.Property,
    detail: "Total number of items",
    documentation: LOOP_VARIABLE_DOCS["length"],
  },
  {
    label: "parent",
    kind: CompletionItemKind.Property,
    detail: "Parent context in nested loops",
    documentation: LOOP_VARIABLE_DOCS["parent"],
  },
];
