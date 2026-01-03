import { describe, it, expect, beforeAll } from "vitest";
import * as path from "path";
import Parser, { Tree } from "web-tree-sitter";
import {
  analyzeDocument,
  extractSetVariables,
  extractForLoops,
  extractMacros,
  extractBlocks,
  getScopeAtPosition,
  getAvailableVariables,
} from "../document-analyzer";

let parser: Parser;

async function initTestParser(): Promise<void> {
  const wasmPath = path.join(__dirname, "../../dist/tree-sitter.wasm");
  await Parser.init({
    locateFile: () => wasmPath,
  });

  parser = new Parser();
  const langWasmPath = path.join(__dirname, "../../dist/tree-sitter-twig.wasm");
  const TwigLang = await Parser.Language.load(langWasmPath);
  parser.setLanguage(TwigLang);
}

beforeAll(async () => {
  await initTestParser();
});

function parse(content: string): Tree {
  const tree = parser.parse(content);
  if (!tree) throw new Error("Failed to parse document");
  return tree;
}

describe("extractSetVariables", () => {
  it("extracts simple set variable", () => {
    const tree = parse("{% set username = 'john' %}");
    const variables = extractSetVariables(tree);

    expect(variables).toHaveLength(1);
    expect(variables[0]!.name).toBe("username");
    expect(variables[0]!.line).toBe(0);
  });

  it("extracts multiple set variables", () => {
    const tree = parse(`{% set name = 'Alice' %}
{% set age = 30 %}
{% set city = 'NYC' %}`);
    const variables = extractSetVariables(tree);

    expect(variables).toHaveLength(3);
    expect(variables.map((v) => v.name)).toEqual(["name", "age", "city"]);
  });

  it("extracts set with complex expression", () => {
    const tree = parse("{% set items = [1, 2, 3]|map(x => x * 2) %}");
    const variables = extractSetVariables(tree);

    expect(variables).toHaveLength(1);
    expect(variables[0]!.name).toBe("items");
  });

  it("returns empty for document without set", () => {
    const tree = parse("{{ variable }}");
    const variables = extractSetVariables(tree);

    expect(variables).toHaveLength(0);
  });
});

describe("extractForLoops", () => {
  it("extracts simple for loop variable", () => {
    const tree = parse(`{% for item in items %}
  {{ item }}
{% endfor %}`);
    const forLoops = extractForLoops(tree);

    expect(forLoops).toHaveLength(1);
    expect(forLoops[0]!.variable).toBe("item");
    expect(forLoops[0]!.keyVariable).toBeUndefined();
  });

  it("extracts for loop with key, value", () => {
    const tree = parse(`{% for key, value in items %}
  {{ key }}: {{ value }}
{% endfor %}`);
    const forLoops = extractForLoops(tree);

    expect(forLoops).toHaveLength(1);
    expect(forLoops[0]!.variable).toBe("value");
    expect(forLoops[0]!.keyVariable).toBe("key");
  });

  it("extracts nested for loops", () => {
    const tree = parse(`{% for category in categories %}
  {% for item in category.items %}
    {{ item }}
  {% endfor %}
{% endfor %}`);
    const forLoops = extractForLoops(tree);

    expect(forLoops).toHaveLength(2);
    expect(forLoops.map((f) => f.variable)).toContain("category");
    expect(forLoops.map((f) => f.variable)).toContain("item");
  });

  it("returns empty for document without for loops", () => {
    const tree = parse("{{ variable }}");
    const forLoops = extractForLoops(tree);

    expect(forLoops).toHaveLength(0);
  });
});

describe("extractMacros", () => {
  it("extracts macro without parameters", () => {
    const tree = parse(`{% macro separator() %}
  <hr />
{% endmacro %}`);
    const macros = extractMacros(tree);

    expect(macros).toHaveLength(1);
    expect(macros[0]!.name).toBe("separator");
    expect(macros[0]!.parameters).toEqual([]);
  });

  it("extracts macro with parameters", () => {
    const tree = parse(`{% macro input(name, value, type) %}
  <input type="{{ type }}" name="{{ name }}" value="{{ value }}">
{% endmacro %}`);
    const macros = extractMacros(tree);

    expect(macros).toHaveLength(1);
    expect(macros[0]!.name).toBe("input");
    expect(macros[0]!.parameters).toEqual(["name", "value", "type"]);
  });

  it("extracts multiple macros", () => {
    const tree = parse(`{% macro button(text) %}
  <button>{{ text }}</button>
{% endmacro %}

{% macro link(url, title) %}
  <a href="{{ url }}">{{ title }}</a>
{% endmacro %}`);
    const macros = extractMacros(tree);

    expect(macros).toHaveLength(2);
    expect(macros[0]!.name).toBe("button");
    expect(macros[1]!.name).toBe("link");
  });

  it("returns empty for document without macros", () => {
    const tree = parse("{{ variable }}");
    const macros = extractMacros(tree);

    expect(macros).toHaveLength(0);
  });
});

describe("extractBlocks", () => {
  it("extracts simple block", () => {
    const tree = parse(`{% block header %}
  <header>Header content</header>
{% endblock %}`);
    const blocks = extractBlocks(tree);

    expect(blocks).toHaveLength(1);
    expect(blocks[0]!.name).toBe("header");
  });

  it("extracts multiple blocks", () => {
    const tree = parse(`{% block header %}
  Header
{% endblock %}

{% block content %}
  Content
{% endblock %}

{% block footer %}
  Footer
{% endblock %}`);
    const blocks = extractBlocks(tree);

    expect(blocks).toHaveLength(3);
    expect(blocks.map((b) => b.name)).toEqual(["header", "content", "footer"]);
  });

  it("extracts nested blocks", () => {
    const tree = parse(`{% block content %}
  {% block sidebar %}
    Sidebar
  {% endblock %}
{% endblock %}`);
    const blocks = extractBlocks(tree);

    expect(blocks).toHaveLength(2);
    expect(blocks.map((b) => b.name)).toContain("content");
    expect(blocks.map((b) => b.name)).toContain("sidebar");
  });

  it("returns empty for document without blocks", () => {
    const tree = parse("{{ variable }}");
    const blocks = extractBlocks(tree);

    expect(blocks).toHaveLength(0);
  });
});

describe("getScopeAtPosition", () => {
  it("detects position inside for loop", () => {
    const tree = parse(`{% for item in items %}
  {{ item }}
{% endfor %}`);
    const scope = getScopeAtPosition(tree, 1, 5);

    expect(scope.insideForLoop).toBe(true);
    expect(scope.currentForLoop).toBeDefined();
    expect(scope.currentForLoop?.variable).toBe("item");
  });

  it("detects position outside for loop", () => {
    const tree = parse(`{% for item in items %}
{% endfor %}
{{ variable }}`);
    const scope = getScopeAtPosition(tree, 2, 5);

    expect(scope.insideForLoop).toBe(false);
    expect(scope.currentForLoop).toBeUndefined();
  });

  it("detects position inside block", () => {
    const tree = parse(`{% block content %}
  {{ data }}
{% endblock %}`);
    const scope = getScopeAtPosition(tree, 1, 5);

    expect(scope.insideBlock).toBe(true);
  });

  it("detects position outside block", () => {
    const tree = parse(`{% block content %}
{% endblock %}
{{ variable }}`);
    const scope = getScopeAtPosition(tree, 2, 5);

    expect(scope.insideBlock).toBe(false);
  });
});

describe("getAvailableVariables", () => {
  it("returns set variables defined before position", () => {
    const tree = parse(`{% set name = 'Alice' %}
{% set age = 30 %}
{{ name }}`);
    const variables = getAvailableVariables(tree, 2, 5);

    expect(variables.map((v) => v.name)).toContain("name");
    expect(variables.map((v) => v.name)).toContain("age");
  });

  it("does not return variables defined after position", () => {
    const tree = parse(`{{ name }}
{% set name = 'Alice' %}`);
    const variables = getAvailableVariables(tree, 0, 5);

    expect(variables.map((v) => v.name)).not.toContain("name");
  });

  it("includes for loop variable when inside loop", () => {
    const tree = parse(`{% for item in items %}
  {{ item }}
{% endfor %}`);
    const variables = getAvailableVariables(tree, 1, 5);

    expect(variables.map((v) => v.name)).toContain("item");
  });

  it("does not include for loop variable when outside loop", () => {
    const tree = parse(`{% for item in items %}
{% endfor %}
{{ item }}`);
    const variables = getAvailableVariables(tree, 2, 5);

    expect(variables.map((v) => v.name)).not.toContain("item");
  });
});

describe("analyzeDocument", () => {
  it("returns complete analysis of document", () => {
    const tree = parse(`{% set title = 'Hello' %}
{% macro greeting(name) %}
  Hello, {{ name }}!
{% endmacro %}
{% block content %}
  {% for item in items %}
    {{ item }}
  {% endfor %}
{% endblock %}`);
    const analysis = analyzeDocument(tree);

    expect(analysis.variables).toHaveLength(1);
    expect(analysis.variables[0]!.name).toBe("title");

    expect(analysis.macros).toHaveLength(1);
    expect(analysis.macros[0]!.name).toBe("greeting");
    expect(analysis.macros[0]!.parameters).toEqual(["name"]);

    expect(analysis.blocks).toHaveLength(1);
    expect(analysis.blocks[0]!.name).toBe("content");

    expect(analysis.forLoops).toHaveLength(1);
    expect(analysis.forLoops[0]!.variable).toBe("item");
  });
});
