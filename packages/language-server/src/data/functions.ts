import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupContent,
} from "vscode-languageserver/node";
import { md } from "./utils";

/**
 * Documentation for Twig functions
 */
export const FUNCTION_DOCS: Record<string, MarkupContent> = {
  attribute: md(`### attribute
Accesses a dynamic attribute of a variable.

**Syntax:** \`attribute(object, method, arguments)\`

**Parameters:**
- \`object\` - The object to access
- \`method\` - The attribute or method name
- \`arguments\` (optional) - Arguments for method calls

**Example:**
\`\`\`twig
{{ attribute(object, method) }}
{{ attribute(object, 'get' ~ name) }}
{{ attribute(array, key) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/attribute.html)`),

  block: md(`### block
Renders a named block.

**Syntax:** \`block(name, template)\`

**Parameters:**
- \`name\` - The block name
- \`template\` (optional) - Template to get block from

**Example:**
\`\`\`twig
{{ block('sidebar') }}
{{ block('footer', 'footer.twig') }}

{% if block('optional_section') is defined %}
  {{ block('optional_section') }}
{% endif %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/block.html)`),

  constant: md(`### constant
Returns the value of a constant.

**Syntax:** \`constant(name, object)\`

**Parameters:**
- \`name\` - The constant name
- \`object\` (optional) - Object to get class constant from

**Example:**
\`\`\`twig
{{ constant('DATE_W3C') }}
{{ constant('App\\\\Entity\\\\User::ROLE_ADMIN') }}
{{ constant('STATUS_ACTIVE', user) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/constant.html)`),

  country_names: md(`### country_names
Returns the names of all countries.

**Syntax:** \`country_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for country names

**Example:**
\`\`\`twig
{% for code, name in country_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/country_names.html)`),

  country_timezones: md(`### country_timezones
Returns the timezones for a country.

**Syntax:** \`country_timezones(country)\`

**Parameters:**
- \`country\` (optional) - ISO 3166-1 alpha-2 country code

**Example:**
\`\`\`twig
{% for tz in country_timezones('US') %}
  {{ tz }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/country_timezones.html)`),

  currency_names: md(`### currency_names
Returns the names of all currencies.

**Syntax:** \`currency_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for currency names

**Example:**
\`\`\`twig
{% for code, name in currency_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/currency_names.html)`),

  cycle: md(`### cycle
Cycles through values.

**Syntax:** \`cycle(values, position)\`

**Parameters:**
- \`values\` - An array of values to cycle through
- \`position\` - The current position

**Example:**
\`\`\`twig
{% for user in users %}
  <tr class="{{ cycle(['odd', 'even'], loop.index0) }}">
    <td>{{ user.name }}</td>
  </tr>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/cycle.html)`),

  date: md(`### date
Creates a date object.

**Syntax:** \`date(date, timezone)\`

**Parameters:**
- \`date\` (optional) - Date string or timestamp (default: now)
- \`timezone\` (optional) - The timezone

**Example:**
\`\`\`twig
{% set now = date() %}
{% set christmas = date('2024-12-25') %}
{% set event = date(timestamp) %}

{{ date('now')|date('Y-m-d') }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/date.html)`),

  dump: md(`### dump
Dumps variable information for debugging.

**Syntax:** \`dump(var, ...)\`

**Parameters:**
- \`var\` (optional) - Variables to dump (dumps all if none specified)

**Example:**
\`\`\`twig
{{ dump(user) }}
{{ dump(user, session) }}
{{ dump() }} {# dumps all variables #}
\`\`\`

**Note:** Only available when debug mode is enabled.

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/dump.html)`),

  html_classes: md(`### html_classes
Generates an HTML class attribute string.

**Syntax:** \`html_classes(classes)\`

**Parameters:**
- \`classes\` - Class names (string, array, or hash with conditions)

**Example:**
\`\`\`twig
<div class="{{ html_classes('base', {'active': isActive, 'error': hasError}) }}">

{# With array #}
<div class="{{ html_classes(['nav', 'nav-pills']) }}">
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/html_classes.html)`),

  include: md(`### include (function)
Includes and renders another template.

**Syntax:** \`include(template, variables, with_context, ignore_missing, sandboxed)\`

**Parameters:**
- \`template\` - The template to include
- \`variables\` (optional) - Variables to pass
- \`with_context\` (optional) - Include current context (default: true)
- \`ignore_missing\` (optional) - Ignore if template is missing
- \`sandboxed\` (optional) - Run in sandbox mode

**Example:**
\`\`\`twig
{{ include('header.twig') }}
{{ include('sidebar.twig', {items: menu}) }}
{{ include('widget.twig', ignore_missing=true) }}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/include.html)`),

  language_names: md(`### language_names
Returns the names of all languages.

**Syntax:** \`language_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for language names

**Example:**
\`\`\`twig
{% for code, name in language_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/language_names.html)`),

  locale_names: md(`### locale_names
Returns the names of all locales.

**Syntax:** \`locale_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for locale names

**Example:**
\`\`\`twig
{% for code, name in locale_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/locale_names.html)`),

  max: md(`### max
Returns the largest value.

**Syntax:** \`max(value1, value2, ...)\` or \`max(array)\`

**Parameters:**
- \`values\` - Values to compare (as arguments or array)

**Example:**
\`\`\`twig
{{ max(1, 3, 2) }}
{# outputs: 3 #}

{{ max([1, 3, 2]) }}
{# outputs: 3 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/max.html)`),

  min: md(`### min
Returns the smallest value.

**Syntax:** \`min(value1, value2, ...)\` or \`min(array)\`

**Parameters:**
- \`values\` - Values to compare (as arguments or array)

**Example:**
\`\`\`twig
{{ min(1, 3, 2) }}
{# outputs: 1 #}

{{ min([1, 3, 2]) }}
{# outputs: 1 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/min.html)`),

  parent: md(`### parent
Renders the parent block content.

**Syntax:** \`parent()\`

**Example:**
\`\`\`twig
{% block sidebar %}
  <h3>Table Of Contents</h3>
  {{ parent() }}
{% endblock %}
\`\`\`

Used inside a \`{% block %}\` to include the content from the parent template's block.

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/parent.html)`),

  random: md(`### random
Returns a random value.

**Syntax:** \`random(values, max)\`

**Parameters:**
- \`values\` (optional) - Array or string to pick from, or max integer
- \`max\` (optional) - Maximum value when \`values\` is min integer

**Example:**
\`\`\`twig
{{ random() }}
{# random integer #}

{{ random(['a', 'b', 'c']) }}
{# random array element #}

{{ random('hello') }}
{# random character #}

{{ random(1, 10) }}
{# random integer between 1 and 10 #}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/random.html)`),

  range: md(`### range
Returns a list of values in a range.

**Syntax:** \`range(low, high, step)\`

**Parameters:**
- \`low\` - Start value
- \`high\` - End value
- \`step\` (optional) - Increment (default: 1)

**Example:**
\`\`\`twig
{% for i in range(0, 10) %}
  {{ i }}
{% endfor %}

{% for letter in range('a', 'z') %}
  {{ letter }}
{% endfor %}

{% for i in range(0, 100, 10) %}
  {{ i }}
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/range.html)`),

  script_names: md(`### script_names
Returns the names of all scripts (writing systems).

**Syntax:** \`script_names(locale)\`

**Parameters:**
- \`locale\` (optional) - The locale for script names

**Example:**
\`\`\`twig
{% for code, name in script_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/script_names.html)`),

  source: md(`### source
Returns the content of a template without rendering.

**Syntax:** \`source(name, ignore_missing)\`

**Parameters:**
- \`name\` - The template name
- \`ignore_missing\` (optional) - Return empty if missing

**Example:**
\`\`\`twig
{{ source('template.twig') }}
{{ source('emails/base.html', ignore_missing=true) }}

{# Include raw CSS #}
<style>{{ source('styles.css') }}</style>
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/source.html)`),

  template_from_string: md(`### template_from_string
Loads a template from a string.

**Syntax:** \`template_from_string(template, name)\`

**Parameters:**
- \`template\` - The template content as string
- \`name\` (optional) - Template name for error messages

**Example:**
\`\`\`twig
{% set template = '{{ name }} is {{ age }} years old' %}
{{ include(template_from_string(template)) }}
\`\`\`

**Note:** Requires \`StringLoader\` extension to be enabled.

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/template_from_string.html)`),

  timezone_names: md(`### timezone_names
Returns the names of all timezones.

**Syntax:** \`timezone_names(locale, country)\`

**Parameters:**
- \`locale\` (optional) - The locale for timezone names
- \`country\` (optional) - Filter by country code

**Example:**
\`\`\`twig
{% for code, name in timezone_names() %}
  <option value="{{ code }}">{{ name }}</option>
{% endfor %}
\`\`\`

[Twig Documentation](https://twig.symfony.com/doc/3.x/functions/timezone_names.html)`),
};

/**
 * Twig built-in functions
 */
export const TWIG_FUNCTIONS: CompletionItem[] = [
  {
    label: "attribute",
    kind: CompletionItemKind.Function,
    insertText: "attribute(${1:object}, ${2:method})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Dynamic attribute access",
    documentation: FUNCTION_DOCS["attribute"],
  },
  {
    label: "block",
    kind: CompletionItemKind.Function,
    insertText: "block('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Render a block",
    documentation: FUNCTION_DOCS["block"],
  },
  {
    label: "constant",
    kind: CompletionItemKind.Function,
    insertText: "constant('${1:name}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Get constant value",
    documentation: FUNCTION_DOCS["constant"],
  },
  {
    label: "country_names",
    kind: CompletionItemKind.Function,
    detail: "List country names",
    documentation: FUNCTION_DOCS["country_names"],
  },
  {
    label: "country_timezones",
    kind: CompletionItemKind.Function,
    detail: "List country timezones",
    documentation: FUNCTION_DOCS["country_timezones"],
  },
  {
    label: "currency_names",
    kind: CompletionItemKind.Function,
    detail: "List currency names",
    documentation: FUNCTION_DOCS["currency_names"],
  },
  {
    label: "cycle",
    kind: CompletionItemKind.Function,
    insertText: "cycle(${1:array}, ${2:position})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Cycle through values",
    documentation: FUNCTION_DOCS["cycle"],
  },
  {
    label: "date",
    kind: CompletionItemKind.Function,
    insertText: "date('${1:date}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Create date object",
    documentation: FUNCTION_DOCS["date"],
  },
  {
    label: "dump",
    kind: CompletionItemKind.Function,
    insertText: "dump(${1:variable})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Debug dump",
    documentation: FUNCTION_DOCS["dump"],
  },
  {
    label: "html_classes",
    kind: CompletionItemKind.Function,
    insertText: "html_classes(${1:classes})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Generate class list",
    documentation: FUNCTION_DOCS["html_classes"],
  },
  {
    label: "include",
    kind: CompletionItemKind.Function,
    insertText: "include('${1:template}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Include template",
    documentation: FUNCTION_DOCS["include"],
  },
  {
    label: "language_names",
    kind: CompletionItemKind.Function,
    detail: "List language names",
    documentation: FUNCTION_DOCS["language_names"],
  },
  {
    label: "locale_names",
    kind: CompletionItemKind.Function,
    detail: "List locale names",
    documentation: FUNCTION_DOCS["locale_names"],
  },
  {
    label: "max",
    kind: CompletionItemKind.Function,
    insertText: "max(${1:values})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Maximum value",
    documentation: FUNCTION_DOCS["max"],
  },
  {
    label: "min",
    kind: CompletionItemKind.Function,
    insertText: "min(${1:values})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Minimum value",
    documentation: FUNCTION_DOCS["min"],
  },
  {
    label: "parent",
    kind: CompletionItemKind.Function,
    detail: "Parent block content",
    documentation: FUNCTION_DOCS["parent"],
  },
  {
    label: "random",
    kind: CompletionItemKind.Function,
    insertText: "random(${1:values})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Random value",
    documentation: FUNCTION_DOCS["random"],
  },
  {
    label: "range",
    kind: CompletionItemKind.Function,
    insertText: "range(${1:low}, ${2:high})",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Generate range",
    documentation: FUNCTION_DOCS["range"],
  },
  {
    label: "script_names",
    kind: CompletionItemKind.Function,
    detail: "List script names",
    documentation: FUNCTION_DOCS["script_names"],
  },
  {
    label: "source",
    kind: CompletionItemKind.Function,
    insertText: "source('${1:template}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Template source",
    documentation: FUNCTION_DOCS["source"],
  },
  {
    label: "template_from_string",
    kind: CompletionItemKind.Function,
    insertText: "template_from_string('${1:template}')",
    insertTextFormat: InsertTextFormat.Snippet,
    detail: "Template from string",
    documentation: FUNCTION_DOCS["template_from_string"],
  },
  {
    label: "timezone_names",
    kind: CompletionItemKind.Function,
    detail: "List timezone names",
    documentation: FUNCTION_DOCS["timezone_names"],
  },
];
