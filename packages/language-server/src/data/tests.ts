import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupContent,
} from "vscode-languageserver/node";
import { md } from "./utils";

/**
 * Documentation for Twig tests
 */
export const TEST_DOCS: Record<string, MarkupContent> = {
  constant: md(`### is constant
Tests if a value equals a constant.

**Syntax:** \`value is constant(name)\`

**Example:**
\`\`\`twig
{% if status is constant('STATUS_ACTIVE') %}
  Active
{% endif %}

{% if role is constant('User::ADMIN', user) %}
  Admin user
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/constant.html)`),

  defined: md(`### is defined
Tests if a variable is defined.

**Syntax:** \`value is defined\`

**Example:**
\`\`\`twig
{% if user is defined %}
  Hello, {{ user.name }}
{% endif %}

{% if attribute is defined and attribute %}
  {{ attribute }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/defined.html)`),

  "divisible by": md(`### is divisible by
Tests if a number is divisible by another number.

**Syntax:** \`value is divisible by(number)\`

**Example:**
\`\`\`twig
{% if loop.index is divisible by(3) %}
  {# Every third item #}
{% endif %}

{% if count is divisible by(2) %}
  Even count
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/divisibleby.html)`),

  empty: md(`### is empty
Tests if a value is empty.

**Syntax:** \`value is empty\`

Empty values: \`false\`, \`null\`, \`''\`, \`[]\`, \`0\`

**Example:**
\`\`\`twig
{% if items is empty %}
  No items found.
{% endif %}

{% if not user.name is empty %}
  {{ user.name }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/empty.html)`),

  even: md(`### is even
Tests if a number is even.

**Syntax:** \`value is even\`

**Example:**
\`\`\`twig
{% for item in items %}
  <tr class="{{ loop.index is even ? 'even' : 'odd' }}">
    {{ item }}
  </tr>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/even.html)`),

  iterable: md(`### is iterable
Tests if a value can be iterated over.

**Syntax:** \`value is iterable\`

**Example:**
\`\`\`twig
{% if items is iterable %}
  {% for item in items %}
    {{ item }}
  {% endfor %}
{% else %}
  {{ items }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/iterable.html)`),

  null: md(`### is null
Tests if a value is null.

**Syntax:** \`value is null\`

**Example:**
\`\`\`twig
{% if user is null %}
  Guest user
{% endif %}

{% if value is not null %}
  {{ value }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/null.html)`),

  odd: md(`### is odd
Tests if a number is odd.

**Syntax:** \`value is odd\`

**Example:**
\`\`\`twig
{% if loop.index is odd %}
  <tr class="odd">
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/odd.html)`),

  "same as": md(`### is same as
Tests if two values are the same (strict comparison).

**Syntax:** \`value is same as(other)\`

**Example:**
\`\`\`twig
{% if status is same as(true) %}
  {# Strictly true, not just truthy #}
{% endif %}

{% if type is same as('admin') %}
  Admin type
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tests/sameas.html)`),
};

/**
 * Twig tests (used with 'is' operator)
 */
export const TWIG_TESTS: CompletionItem[] = [
  {
    label: "constant",
    kind: CompletionItemKind.Keyword,
    insertText: "constant('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Test against constant",
    documentation: TEST_DOCS["constant"],
  },
  {
    label: "defined",
    kind: CompletionItemKind.Keyword,
    detail: "Is defined",
    documentation: TEST_DOCS["defined"],
  },
  {
    label: "divisible by",
    kind: CompletionItemKind.Keyword,
    insertText: "divisible by(${1:number})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Divisibility test",
    documentation: TEST_DOCS["divisible by"],
  },
  {
    label: "empty",
    kind: CompletionItemKind.Keyword,
    detail: "Is empty",
    documentation: TEST_DOCS["empty"],
  },
  {
    label: "even",
    kind: CompletionItemKind.Keyword,
    detail: "Is even",
    documentation: TEST_DOCS["even"],
  },
  {
    label: "iterable",
    kind: CompletionItemKind.Keyword,
    detail: "Is iterable",
    documentation: TEST_DOCS["iterable"],
  },
  {
    label: "null",
    kind: CompletionItemKind.Keyword,
    detail: "Is null",
    documentation: TEST_DOCS["null"],
  },
  {
    label: "odd",
    kind: CompletionItemKind.Keyword,
    detail: "Is odd",
    documentation: TEST_DOCS["odd"],
  },
  {
    label: "same as",
    kind: CompletionItemKind.Keyword,
    insertText: "same as(${1:value})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Strict equality",
    documentation: TEST_DOCS["same as"],
  },
];
