import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupContent,
} from "vscode-languageserver/node";
import { md } from "./utils";

/**
 * Documentation for Twig keywords (tags)
 */
export const KEYWORD_DOCS: Record<string, MarkupContent> = {
  if: md(`### if
Conditionally displays content.

**Syntax:**
\`\`\`twig
{% if condition %}
  ...
{% elseif other_condition %}
  ...
{% else %}
  ...
{% endif %}
\`\`\`

**Example:**
\`\`\`twig
{% if user.isAdmin %}
  <a href="/admin">Admin Panel</a>
{% elseif user.isModerator %}
  <a href="/moderate">Moderate</a>
{% else %}
  <a href="/profile">Profile</a>
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  elseif: md(`### elseif
Alternative condition in an if block.

**Syntax:** \`{% elseif condition %}\`

**Example:**
\`\`\`twig
{% if score >= 90 %}
  Grade: A
{% elseif score >= 80 %}
  Grade: B
{% elseif score >= 70 %}
  Grade: C
{% else %}
  Grade: F
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  else: md(`### else
Default branch in an if or for block.

**Syntax:** \`{% else %}\`

**Example:**
\`\`\`twig
{% if items %}
  {% for item in items %}
    {{ item }}
  {% endfor %}
{% else %}
  No items found.
{% endif %}

{% for item in items %}
  {{ item }}
{% else %}
  No items to display.
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  endif: md(`### endif
Closes an if block.

**Syntax:** \`{% endif %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/if.html)`),

  for: md(`### for
Loops over a sequence.

**Syntax:**
\`\`\`twig
{% for item in sequence %}
  ...
{% else %}
  ... {# shown if sequence is empty #}
{% endfor %}
\`\`\`

**Loop Variables:**
- \`loop.index\` - Current iteration (1-indexed)
- \`loop.index0\` - Current iteration (0-indexed)
- \`loop.revindex\` - Iterations from end (1-indexed)
- \`loop.revindex0\` - Iterations from end (0-indexed)
- \`loop.first\` - True if first iteration
- \`loop.last\` - True if last iteration
- \`loop.length\` - Total number of items
- \`loop.parent\` - Parent context

**Example:**
\`\`\`twig
{% for user in users %}
  {{ loop.index }}. {{ user.name }}
{% endfor %}

{% for key, value in items %}
  {{ key }}: {{ value }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html)`),

  endfor: md(`### endfor
Closes a for loop.

**Syntax:** \`{% endfor %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/for.html)`),

  block: md(`### block
Defines a block that can be overridden by child templates.

**Syntax:**
\`\`\`twig
{% block name %}
  content
{% endblock %}

{# Short syntax #}
{% block name %}content{% endblock name %}
\`\`\`

**Example:**
\`\`\`twig
{# base.twig #}
{% block title %}Default Title{% endblock %}

{# child.twig #}
{% extends 'base.twig' %}
{% block title %}Custom Title{% endblock %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/block.html)`),

  endblock: md(`### endblock
Closes a block definition.

**Syntax:** \`{% endblock %}\` or \`{% endblock name %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/block.html)`),

  extends: md(`### extends
Extends a parent template.

**Syntax:** \`{% extends "template" %}\`

**Example:**
\`\`\`twig
{% extends "base.twig" %}

{% block content %}
  This replaces the parent's content block.
{% endblock %}
\`\`\`

**Note:** Must be the first tag in the template.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/extends.html)`),

  include: md(`### include
Includes another template.

**Syntax:**
\`\`\`twig
{% include "template" %}
{% include "template" with {var: value} %}
{% include "template" only %}
{% include "template" ignore missing %}
\`\`\`

**Example:**
\`\`\`twig
{% include 'header.twig' %}
{% include 'sidebar.twig' with {items: menu} only %}
{% include 'widget.twig' ignore missing %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/include.html)`),

  set: md(`### set
Assigns a value to a variable.

**Syntax:**
\`\`\`twig
{% set name = value %}
{% set name %}captured content{% endset %}
\`\`\`

**Example:**
\`\`\`twig
{% set username = 'John' %}
{% set items = [1, 2, 3] %}
{% set config = {debug: true, theme: 'dark'} %}

{% set greeting %}
  Hello, {{ username }}!
{% endset %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/set.html)`),

  endset: md(`### endset
Closes a block-style set tag.

**Syntax:** \`{% endset %}\`

**Example:**
\`\`\`twig
{% set content %}
  <p>This is captured content</p>
{% endset %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/set.html)`),

  macro: md(`### macro
Defines a reusable piece of template.

**Syntax:**
\`\`\`twig
{% macro name(arg1, arg2, ...) %}
  content using {{ arg1 }}, {{ arg2 }}
{% endmacro %}
\`\`\`

**Example:**
\`\`\`twig
{% macro input(name, value, type = 'text') %}
  <input type="{{ type }}" name="{{ name }}" value="{{ value }}">
{% endmacro %}

{{ _self.input('username', '') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/macro.html)`),

  endmacro: md(`### endmacro
Closes a macro definition.

**Syntax:** \`{% endmacro %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/macro.html)`),

  import: md(`### import
Imports macros from a template.

**Syntax:** \`{% import "template" as alias %}\`

**Example:**
\`\`\`twig
{% import "forms.twig" as forms %}

{{ forms.input('username') }}
{{ forms.textarea('bio') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/import.html)`),

  from: md(`### from
Imports specific macros from a template.

**Syntax:** \`{% from "template" import macro1, macro2 as alias %}\`

**Example:**
\`\`\`twig
{% from "forms.twig" import input, textarea as text %}

{{ input('username') }}
{{ text('bio') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/from.html)`),

  with: md(`### with
Creates a new scope with additional variables.

**Syntax:**
\`\`\`twig
{% with {var: value} %}
  ...
{% endwith %}

{% with {var: value} only %}
  ...
{% endwith %}
\`\`\`

**Example:**
\`\`\`twig
{% with {title: 'Hello', count: 5} %}
  <h1>{{ title }}</h1>
  <p>Count: {{ count }}</p>
{% endwith %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/with.html)`),

  apply: md(`### apply
Applies a filter to a section of template.

**Syntax:**
\`\`\`twig
{% apply filter %}
  content
{% endapply %}
\`\`\`

**Example:**
\`\`\`twig
{% apply upper %}
  This text will be uppercase.
{% endapply %}

{% apply escape('html') %}
  <p>This will be escaped</p>
{% endapply %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/apply.html)`),

  endapply: md(`### endapply
Closes an apply block.

**Syntax:** \`{% endapply %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/apply.html)`),

  autoescape: md(`### autoescape
Controls automatic output escaping.

**Syntax:**
\`\`\`twig
{% autoescape %}
  ...
{% endautoescape %}

{% autoescape 'js' %}
  ...
{% endautoescape %}

{% autoescape false %}
  ...
{% endautoescape %}
\`\`\`

**Strategies:** \`html\`, \`js\`, \`css\`, \`url\`, \`html_attr\`, \`false\`

**Example:**
\`\`\`twig
{% autoescape 'js' %}
  var data = {{ json_data }};
{% endautoescape %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/autoescape.html)`),

  endautoescape: md(`### endautoescape
Closes an autoescape block.

**Syntax:** \`{% endautoescape %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/autoescape.html)`),

  embed: md(`### embed
Combines include and extends functionality.

**Syntax:**
\`\`\`twig
{% embed "template" %}
  {% block name %}
    override content
  {% endblock %}
{% endembed %}
\`\`\`

**Example:**
\`\`\`twig
{% embed "card.twig" %}
  {% block title %}Custom Title{% endblock %}
  {% block content %}
    <p>Custom content here</p>
  {% endblock %}
{% endembed %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/embed.html)`),

  endembed: md(`### endembed
Closes an embed block.

**Syntax:** \`{% endembed %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/embed.html)`),

  flush: md(`### flush
Flushes the output buffer.

**Syntax:** \`{% flush %}\`

**Example:**
\`\`\`twig
{% for item in items %}
  {{ item }}
  {% flush %}
{% endfor %}
\`\`\`

Useful for streaming long outputs to the browser.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/flush.html)`),

  sandbox: md(`### sandbox
Enables sandbox mode for a section.

**Syntax:**
\`\`\`twig
{% sandbox %}
  {% include user_template %}
{% endsandbox %}
\`\`\`

Restricts available tags, filters, and functions for security.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/sandbox.html)`),

  endsandbox: md(`### endsandbox
Closes a sandbox block.

**Syntax:** \`{% endsandbox %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/sandbox.html)`),

  use: md(`### use
Imports blocks from another template (horizontal reuse).

**Syntax:** \`{% use "template" %}\`

**Example:**
\`\`\`twig
{% use "blocks.twig" %}

{# Now blocks from blocks.twig are available #}
{{ block('sidebar') }}
\`\`\`

Different from \`extends\` - allows importing blocks without inheritance.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/use.html)`),

  verbatim: md(`### verbatim
Outputs content as raw text without parsing.

**Syntax:**
\`\`\`twig
{% verbatim %}
  {{ this.will.not.be.parsed }}
{% endverbatim %}
\`\`\`

**Example:**
\`\`\`twig
{% verbatim %}
  <script id="template">
    {{ item.name }}
  </script>
{% endverbatim %}
\`\`\`

Useful for outputting Twig/Mustache/Vue templates in browser.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/verbatim.html)`),

  endverbatim: md(`### endverbatim
Closes a verbatim block.

**Syntax:** \`{% endverbatim %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/verbatim.html)`),

  do: md(`### do
Executes an expression without printing output.

**Syntax:** \`{% do expression %}\`

**Example:**
\`\`\`twig
{% do items.append(newItem) %}
{% do collection.sort() %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/do.html)`),

  cache: md(`### cache
Caches a section of template.

**Syntax:**
\`\`\`twig
{% cache "key" [ttl(seconds)] %}
  expensive content
{% endcache %}
\`\`\`

**Example:**
\`\`\`twig
{% cache "sidebar" ttl(3600) %}
  {% include 'sidebar.twig' %}
{% endcache %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/cache.html)`),

  endcache: md(`### endcache
Closes a cache block.

**Syntax:** \`{% endcache %}\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/cache.html)`),

  deprecated: md(`### deprecated
Marks a template or block as deprecated.

**Syntax:** \`{% deprecated "message" %}\`

**Example:**
\`\`\`twig
{% deprecated 'The "old.twig" template is deprecated, use "new.twig" instead.' %}
\`\`\`

Triggers a deprecation warning when the template is used.

[Twig Documentation](https://twig.symfony.com/doc/3.x/tags/deprecated.html)`),
};

/**
 * Twig keywords used in block statements ({% ... %})
 */
export const TWIG_KEYWORDS: CompletionItem[] = [
  {
    label: "if",
    kind: CompletionItemKind.Keyword,
    insertText: "if ${1:condition} %}\n\t$0\n{% endif",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Conditional statement",
    documentation: KEYWORD_DOCS["if"],
  },
  {
    label: "elseif",
    kind: CompletionItemKind.Keyword,
    insertText: "elseif ${1:condition}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Else-if branch",
    documentation: KEYWORD_DOCS["elseif"],
  },
  {
    label: "else",
    kind: CompletionItemKind.Keyword,
    detail: "Else branch",
    documentation: KEYWORD_DOCS["else"],
  },
  {
    label: "endif",
    kind: CompletionItemKind.Keyword,
    detail: "End if statement",
    documentation: KEYWORD_DOCS["endif"],
  },
  {
    label: "for",
    kind: CompletionItemKind.Keyword,
    insertText: "for ${1:item} in ${2:items} %}\n\t$0\n{% endfor",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "For loop",
    documentation: KEYWORD_DOCS["for"],
  },
  {
    label: "endfor",
    kind: CompletionItemKind.Keyword,
    detail: "End for loop",
    documentation: KEYWORD_DOCS["endfor"],
  },
  {
    label: "block",
    kind: CompletionItemKind.Keyword,
    insertText: "block ${1:name} %}\n\t$0\n{% endblock",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Define a block",
    documentation: KEYWORD_DOCS["block"],
  },
  {
    label: "endblock",
    kind: CompletionItemKind.Keyword,
    detail: "End block",
    documentation: KEYWORD_DOCS["endblock"],
  },
  {
    label: "extends",
    kind: CompletionItemKind.Keyword,
    insertText: "extends '${1:template}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Extend a template",
    documentation: KEYWORD_DOCS["extends"],
  },
  {
    label: "include",
    kind: CompletionItemKind.Keyword,
    insertText: "include '${1:template}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Include a template",
    documentation: KEYWORD_DOCS["include"],
  },
  {
    label: "set",
    kind: CompletionItemKind.Keyword,
    insertText: "set ${1:name} = ${2:value}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Set a variable",
    documentation: KEYWORD_DOCS["set"],
  },
  {
    label: "endset",
    kind: CompletionItemKind.Keyword,
    detail: "End set block",
    documentation: KEYWORD_DOCS["endset"],
  },
  {
    label: "macro",
    kind: CompletionItemKind.Keyword,
    insertText: "macro ${1:name}(${2:args}) %}\n\t$0\n{% endmacro",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Define a macro",
    documentation: KEYWORD_DOCS["macro"],
  },
  {
    label: "endmacro",
    kind: CompletionItemKind.Keyword,
    detail: "End macro",
    documentation: KEYWORD_DOCS["endmacro"],
  },
  {
    label: "import",
    kind: CompletionItemKind.Keyword,
    insertText: "import '${1:template}' as ${2:name}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Import macros",
    documentation: KEYWORD_DOCS["import"],
  },
  {
    label: "from",
    kind: CompletionItemKind.Keyword,
    insertText: "from '${1:template}' import ${2:macro}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Import specific macros",
    documentation: KEYWORD_DOCS["from"],
  },
  {
    label: "with",
    kind: CompletionItemKind.Keyword,
    insertText: "with { ${1:key}: ${2:value} }",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Pass variables",
    documentation: KEYWORD_DOCS["with"],
  },
  {
    label: "apply",
    kind: CompletionItemKind.Keyword,
    insertText: "apply ${1:filter} %}\n\t$0\n{% endapply",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Apply filter to block",
    documentation: KEYWORD_DOCS["apply"],
  },
  {
    label: "endapply",
    kind: CompletionItemKind.Keyword,
    detail: "End apply block",
    documentation: KEYWORD_DOCS["endapply"],
  },
  {
    label: "autoescape",
    kind: CompletionItemKind.Keyword,
    insertText: "autoescape '${1|html,js,css,url,html_attr|}' %}\n\t$0\n{% endautoescape",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Auto-escape block",
    documentation: KEYWORD_DOCS["autoescape"],
  },
  {
    label: "endautoescape",
    kind: CompletionItemKind.Keyword,
    detail: "End autoescape",
    documentation: KEYWORD_DOCS["endautoescape"],
  },
  {
    label: "embed",
    kind: CompletionItemKind.Keyword,
    insertText:
      "embed '${1:template}' %}\n\t{% block ${2:name} %}\n\t\t$0\n\t{% endblock %}\n{% endembed",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Embed a template",
    documentation: KEYWORD_DOCS["embed"],
  },
  {
    label: "endembed",
    kind: CompletionItemKind.Keyword,
    detail: "End embed",
    documentation: KEYWORD_DOCS["endembed"],
  },
  {
    label: "flush",
    kind: CompletionItemKind.Keyword,
    detail: "Flush output buffer",
    documentation: KEYWORD_DOCS["flush"],
  },
  {
    label: "sandbox",
    kind: CompletionItemKind.Keyword,
    insertText: "sandbox %}\n\t$0\n{% endsandbox",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Sandbox block",
    documentation: KEYWORD_DOCS["sandbox"],
  },
  {
    label: "endsandbox",
    kind: CompletionItemKind.Keyword,
    detail: "End sandbox",
    documentation: KEYWORD_DOCS["endsandbox"],
  },
  {
    label: "use",
    kind: CompletionItemKind.Keyword,
    insertText: "use '${1:template}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Use template traits",
    documentation: KEYWORD_DOCS["use"],
  },
  {
    label: "verbatim",
    kind: CompletionItemKind.Keyword,
    insertText: "verbatim %}\n\t$0\n{% endverbatim",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Raw output (no parsing)",
    documentation: KEYWORD_DOCS["verbatim"],
  },
  {
    label: "endverbatim",
    kind: CompletionItemKind.Keyword,
    detail: "End verbatim",
    documentation: KEYWORD_DOCS["endverbatim"],
  },
  {
    label: "do",
    kind: CompletionItemKind.Keyword,
    insertText: "do ${1:expression}",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Execute without output",
    documentation: KEYWORD_DOCS["do"],
  },
  {
    label: "cache",
    kind: CompletionItemKind.Keyword,
    insertText: "cache '${1:key}' %}\n\t$0\n{% endcache",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Cache block",
    documentation: KEYWORD_DOCS["cache"],
  },
  {
    label: "endcache",
    kind: CompletionItemKind.Keyword,
    detail: "End cache",
    documentation: KEYWORD_DOCS["endcache"],
  },
  {
    label: "deprecated",
    kind: CompletionItemKind.Keyword,
    insertText: "deprecated '${1:message}'",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Mark as deprecated",
    documentation: KEYWORD_DOCS["deprecated"],
  },
];
